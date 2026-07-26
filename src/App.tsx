import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ForeignCaregiver, NotificationItem, NotificationCategory } from './types';
import { INITIAL_CAREGIVERS, INITIAL_NOTIFICATIONS } from './data/mockData';
import { Header } from './components/Header';
import { NotificationCenter } from './components/NotificationCenter';
import { HealthCheckModule } from './components/HealthCheckModule';
import { ContractWorkflowModule } from './components/ContractWorkflowModule';
import { DocumentSigningModule } from './components/DocumentSigningModule';
import { AiAssistantModule } from './components/AiAssistantModule';
import { CaregiverProfileModal } from './components/CaregiverProfileModal';
import { NewCaregiverModal } from './components/NewCaregiverModal';
import { NewCaseGoogleFormModal } from './components/NewCaseGoogleFormModal';
import { HeartPulse, Clock, FileSignature, Bot, ShieldCheck, CheckCircle2, AlertTriangle, Calendar, FileText, Send, ClipboardList } from 'lucide-react';
import { sendWebPushNotification } from './utils/pushNotification';

export default function App() {
  // Main State
  const [caregivers, setCaregivers] = useState<ForeignCaregiver[]>(() => {
    const saved = localStorage.getItem('caregiver_app_caregivers');
    return saved ? JSON.parse(saved) : INITIAL_CAREGIVERS;
  });

  const [activeCaregiverId, setActiveCaregiverId] = useState<string>(caregivers[0]?.id || 'cg-001');

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('caregiver_app_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Active Main Tab
  const [activeTab, setActiveTab] = useState<'health_checks' | 'workflow' | 'documents' | 'ai_assistant'>('health_checks');

  // UI Modals & Drawers
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isNewCaregiverModalOpen, setIsNewCaregiverModalOpen] = useState(false);
  const [isNewCaseFormOpen, setIsNewCaseFormOpen] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [docToSignId, setDocToSignId] = useState<string | null>(null);

  // Theme state: dark / light
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('caregiver_app_theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  useEffect(() => {
    localStorage.setItem('caregiver_app_theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light-mode');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.remove('light-mode');
      document.documentElement.classList.add('dark');
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('caregiver_app_caregivers', JSON.stringify(caregivers));
  }, [caregivers]);

  useEffect(() => {
    localStorage.setItem('caregiver_app_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const activeCaregiver = caregivers.find((c) => c.id === activeCaregiverId) || caregivers[0];

  // Notification handlers
  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleClearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleSelectNotificationAction = (category: NotificationCategory, actionUrl?: string) => {
    if (actionUrl === 'health_checks') setActiveTab('health_checks');
    else if (actionUrl === 'workflow') setActiveTab('workflow');
    else if (actionUrl === 'documents') setActiveTab('documents');
    else setActiveTab('health_checks');
  };

  // Health Check Status Update Handler
  const handleUpdateHealthCheckStatus = (
    recordId: string,
    status: 'completed' | 'pending',
    hospital?: string,
    note?: string
  ) => {
    setCaregivers((prev) =>
      prev.map((cg) => {
        if (cg.id !== activeCaregiver.id) return cg;
        const updatedHc = cg.healthChecks.map((hc) => {
          if (hc.id === recordId) {
            return {
              ...hc,
              status,
              hospitalName: hospital || hc.hospitalName,
              completedDate: status === 'completed' ? new Date().toISOString().split('T')[0] : undefined,
              note: note || hc.note,
            };
          }
          return hc;
        });

        return { ...cg, healthChecks: updatedHc };
      })
    );

    // Create Notification Log
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `✅ 體檢狀態更新：${activeCaregiver.name}`,
      message: `體檢合格紀錄已登錄備查。特約醫療院所：${hospital || '公立醫療院所'}。`,
      category: 'health_check',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      isRead: false,
      caregiverId: activeCaregiver.id,
      priority: 'normal',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    if (pushEnabled) {
      sendWebPushNotification(newNotif.title, { body: newNotif.message });
    }
  };

  // Document Signing Handler
  const handleSignDocument = (documentId: string, signatureImageBase64: string) => {
    const today = new Date().toISOString().split('T')[0];

    setCaregivers((prev) =>
      prev.map((cg) => {
        if (cg.id !== activeCaregiver.id) return cg;
        
        // Update Document status
        const updatedDocs = cg.documents.map((doc) => {
          if (doc.id === documentId) {
            return {
              ...doc,
              status: 'signed' as const,
              signatureImage: signatureImageBase64,
              signedAt: today,
            };
          }
          return doc;
        });

        // Also update corresponding workflow step to completed
        const updatedWorkflow = cg.workflowSteps.map((wf) => {
          if (wf.linkedDocumentId === documentId || wf.stepNumber === 8) {
            return {
              ...wf,
              status: 'completed' as const,
              updatedAt: today,
              requiredAction: undefined,
            };
          }
          return wf;
        });

        return { ...cg, documents: updatedDocs, workflowSteps: updatedWorkflow };
      })
    );

    // Add signed notification
    const signedNotif: NotificationItem = {
      id: `notif-signed-${Date.now()}`,
      title: `📝 電子簽章完成：續聘協議書與授權書`,
      message: `雇主已完成線上手寫電子簽章，合約證明憑證檔已加蓋加密戳記並備查。`,
      category: 'contract_signing',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      isRead: false,
      caregiverId: activeCaregiver.id,
      priority: 'normal',
    };

    setNotifications((prev) => [signedNotif, ...prev]);

    if (pushEnabled) {
      sendWebPushNotification(signedNotif.title, { body: signedNotif.message });
    }
  };

  // Handle open document signing modal from workflow
  const handleOpenDocSigningFromWorkflow = (docId?: string) => {
    if (docId) setDocToSignId(docId);
    setActiveTab('documents');
  };

  const pendingHealthChecksCount = activeCaregiver.healthChecks.filter((h) => h.status === 'pending').length;
  const pendingDocsCount = activeCaregiver.documents.filter((d) => d.status === 'pending_signature').length;

  const isLight = theme === 'light';

  return (
    <div className={`min-h-screen flex flex-col font-sans antialiased transition-colors duration-300 ${
      isLight ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'
    }`}>
      
      {/* App Header Bar */}
      <Header
        caregivers={caregivers}
        activeCaregiver={activeCaregiver}
        onSelectCaregiver={(cg) => setActiveCaregiverId(cg.id)}
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        onOpenNewCaregiverModal={() => setIsNewCaregiverModalOpen(true)}
        onOpenNewCaseFormModal={() => setIsNewCaseFormOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        pushEnabled={pushEnabled}
        setPushEnabled={setPushEnabled}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Caregiver Quick Status Banner */}
        <div className={`border rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
          isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-100 shadow-lg'
        }`}>
          <div className="flex items-center space-x-3.5">
            <img
              src={activeCaregiver.avatarUrl}
              alt={activeCaregiver.name}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-teal-500/40 shadow-sm"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{activeCaregiver.name}</h1>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                  isLight ? 'bg-slate-100 text-teal-800 border-slate-300' : 'bg-slate-800 text-teal-300 border-slate-700'
                }`}>
                  {activeCaregiver.nationality}
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                居留證 (ARC): <span className={`font-mono font-medium ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{activeCaregiver.arcNumber}</span> (效期至 {activeCaregiver.arcExpiryDate})
              </p>
            </div>
          </div>

          {/* Subdued Status Indicators */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {pendingHealthChecksCount > 0 && (
              <button
                onClick={() => setActiveTab('health_checks')}
                className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5 transition cursor-pointer border ${
                  isLight ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100' : 'bg-slate-800 hover:bg-slate-750 text-amber-300 border-amber-500/30'
                }`}
                title="點擊切換至定期健檢頁面"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-breathing" />
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span>待辦體檢：{pendingHealthChecksCount} 項</span>
              </button>
            )}

            {pendingDocsCount > 0 && (
              <button
                onClick={() => setActiveTab('documents')}
                className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5 transition cursor-pointer border ${
                  isLight ? 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100' : 'bg-slate-800 hover:bg-slate-750 text-rose-300 border-rose-500/30'
                }`}
                title="點擊切換至線上簽章頁面"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-breathing" />
                <FileSignature className="w-3.5 h-3.5 text-rose-500" />
                <span>待簽文件：{pendingDocsCount} 份</span>
              </button>
            )}

            <button
              onClick={() => setIsProfileModalOpen(true)}
              className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer text-xs border ${
                isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300' : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border-slate-700/80'
              }`}
            >
              個案檔案
            </button>

            <button
              onClick={() => setIsNewCaseFormOpen(true)}
              className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5 transition cursor-pointer text-xs border ${
                isLight ? 'bg-teal-50 hover:bg-teal-100 text-teal-800 border-teal-300' : 'bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border-teal-500/30'
              }`}
              title="點擊開啟新案件雇主需求登記表單"
            >
              <ClipboardList className="w-3.5 h-3.5 text-teal-500" />
              <span>新案件雇主填單</span>
            </button>
          </div>
        </div>

        {/* Primary Tab Navigation - Clean Standard SaaS Tab Styling */}
        <div className={`p-1 rounded-xl flex space-x-1 overflow-x-auto text-xs font-medium border shadow-sm relative transition-colors ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800/90'
        }`}>
          {[
            {
              id: 'health_checks',
              label: '🩺 定期健檢通知提醒',
              badge: pendingHealthChecksCount > 0 ? `${pendingHealthChecksCount}項到期` : null,
            },
            {
              id: 'workflow',
              label: '📋 合約申辦流程追蹤',
              badge: '進行中',
            },
            {
              id: 'documents',
              label: '📝 必要文件線上簽章',
              badge: pendingDocsCount > 0 ? `${pendingDocsCount}份待簽` : '已簽署',
            },
            {
              id: 'ai_assistant',
              label: '🤖 AI 雇主智囊與翻譯',
              badge: 'AI 服務',
            }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative flex-1 min-w-[140px] py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition cursor-pointer z-10 ${
                  isActive
                    ? isLight ? 'text-teal-700 font-bold' : 'text-teal-300 font-bold'
                    : isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {isActive && (
                  <>
                    <motion.div
                      layoutId="activeTabBg"
                      className={`absolute inset-0 rounded-lg border z-[-1] ${
                        isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-800 border-slate-700/80'
                      }`}
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                    <motion.div
                      layoutId="activeTabIndicatorLine"
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-teal-500 rounded-full z-10"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  </>
                )}
                <span className="relative z-10">{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`relative z-10 text-[10px] px-1.5 py-0.2 rounded border ${
                      isActive
                        ? isLight ? 'bg-white text-teal-800 border-teal-300' : 'bg-slate-900 text-teal-300 border-teal-500/40'
                        : isLight ? 'bg-slate-100 text-slate-600 border-slate-300' : 'bg-slate-800/80 text-slate-400 border-slate-700/60'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <div className="transition-all duration-200">
          {activeTab === 'health_checks' && (
            <HealthCheckModule
              caregiver={activeCaregiver}
              onUpdateHealthCheckStatus={handleUpdateHealthCheckStatus}
            />
          )}

          {activeTab === 'workflow' && (
            <ContractWorkflowModule
              caregiver={activeCaregiver}
              onOpenDocumentSigningModal={handleOpenDocSigningFromWorkflow}
            />
          )}

          {activeTab === 'documents' && (
            <DocumentSigningModule
              caregiver={activeCaregiver}
              onSignDocument={handleSignDocument}
              activeDocIdToSign={docToSignId}
            />
          )}

          {activeTab === 'ai_assistant' && (
            <AiAssistantModule caregiver={activeCaregiver} />
          )}
        </div>

      </main>

      {/* Slide-over Notification Center Drawer */}
      <NotificationCenter
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onClearNotification={handleClearNotification}
        onSelectAction={handleSelectNotificationAction}
        pushEnabled={pushEnabled}
      />

      {/* Caregiver Profile View/Edit Modal */}
      <CaregiverProfileModal
        caregiver={activeCaregiver}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSaveProfile={(updated) => {
          setCaregivers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        }}
      />

      {/* New Caregiver Registration Modal */}
      <NewCaregiverModal
        isOpen={isNewCaregiverModalOpen}
        onClose={() => setIsNewCaregiverModalOpen(false)}
        onAddCaregiver={(newCg) => {
          setCaregivers((prev) => [...prev, newCg]);
          setActiveCaregiverId(newCg.id);
        }}
      />

      {/* New Case Employer Google Form Modal */}
      <NewCaseGoogleFormModal
        isOpen={isNewCaseFormOpen}
        onClose={() => setIsNewCaseFormOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900 py-6 text-center text-xs text-slate-500 mt-auto">
        <p>外籍家庭看護工雇主管理平台 ‧ 遵照衛生福利部疾病管制署、勞動部勞動力發展署及移民署法規規定辦理</p>
        <p className="text-[11px] text-slate-600 mt-1">即時推播通知 ‧ 電子簽章憑證保護 ‧ 雙語照護溝通卡片</p>
      </footer>

    </div>
  );
}
