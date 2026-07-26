import React, { useState } from 'react';
import { ForeignCaregiver, NotificationItem } from '../types';
import { Bell, Plus, ShieldCheck, HeartPulse, User, CheckCircle2, Volume2, AlertTriangle } from 'lucide-react';
import { requestNotificationPermission, sendWebPushNotification } from '../utils/pushNotification';
import { TypewriterButton } from './TypewriterButton';
import { MouseInteractiveNotification } from './MouseInteractiveNotification';

interface HeaderProps {
  caregivers: ForeignCaregiver[];
  activeCaregiver: ForeignCaregiver;
  onSelectCaregiver: (caregiver: ForeignCaregiver) => void;
  notifications: NotificationItem[];
  onOpenNotifications: () => void;
  onOpenNewCaregiverModal: () => void;
  onOpenProfileModal: () => void;
  pushEnabled: boolean;
  setPushEnabled: (enabled: boolean) => void;
  onSelectTab?: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  caregivers,
  activeCaregiver,
  onSelectCaregiver,
  notifications,
  onOpenNotifications,
  onOpenNewCaregiverModal,
  onOpenProfileModal,
  pushEnabled,
  setPushEnabled,
  onSelectTab,
}) => {
  const [showPushToast, setShowPushToast] = useState(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleTogglePush = async () => {
    if (!pushEnabled) {
      const granted = await requestNotificationPermission();
      if (granted) {
        setPushEnabled(true);
        sendWebPushNotification('✅ 推播通知服務已成功啟用', {
          body: '您將可即時接收看護工健檢倒數、合約簽署與政府審核進度通知。',
        });
      } else {
        setShowPushToast(true);
        setTimeout(() => setShowPushToast(false), 4000);
      }
    } else {
      setPushEnabled(false);
    }
  };

  // Find urgent health check if any
  const pendingHc = activeCaregiver.healthChecks.find((h) => h.status === 'pending');

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-md shadow-teal-500/20 ring-2 ring-teal-400/30">
                <HeartPulse className="w-6 h-6 text-slate-950 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-lg text-slate-100 tracking-tight">外籍看護雇主管理平台</span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2 py-0.5 rounded-full font-medium border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> 勞工局/衛福部規範
                  </span>
                </div>
                <p className="text-xs text-slate-400">健檢定期通知 ‧ 合約流程追蹤 ‧ 線上電子簽章</p>
              </div>
            </div>

            {/* Mobile notification bell button with mouse interactive effect */}
            <div className="flex md:hidden items-center space-x-2">
              <MouseInteractiveNotification
                onClick={onOpenNotifications}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
                title="即時推播通知中心"
                glowColor="rgba(244, 63, 94, 0.4)"
              >
                <div className="relative p-1">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </MouseInteractiveNotification>
            </div>
          </div>

          {/* Center: Caregiver Selector & Red Bold Typewriter Health Check Warning Button */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Caregiver Switcher Dropdown */}
            <div className="relative flex items-center bg-slate-800/90 border border-slate-700/80 rounded-xl p-1.5 shadow-inner">
              <span className="text-xs font-medium text-slate-400 px-2 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-teal-400" /> 看護工:
              </span>
              <select
                value={activeCaregiver.id}
                onChange={(e) => {
                  const found = caregivers.find((c) => c.id === e.target.value);
                  if (found) onSelectCaregiver(found);
                }}
                className="bg-slate-900 text-slate-100 font-semibold text-sm rounded-lg px-2.5 py-1 pr-6 focus:outline-none focus:ring-1 focus:ring-teal-400 border border-slate-700 cursor-pointer"
              >
                {caregivers.map((cg) => (
                  <option key={cg.id} value={cg.id}>
                    {cg.name} ({cg.nationalityCode}) - {cg.patientName}
                  </option>
                ))}
              </select>

              <button
                onClick={onOpenNewCaregiverModal}
                className="ml-2 text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 px-2 py-1 rounded-lg flex items-center gap-1 transition"
                title="登記新看護工"
              >
                <Plus className="w-3.5 h-3.5" /> 新增
              </button>
            </div>

            {/* Red Bold Typewriter Dynamic Button for Health Check Warnings */}
            {pendingHc && (
              <TypewriterButton
                isRedBoldAlert={true}
                badgeText="健檢警示"
                icon={<AlertTriangle className="w-4 h-4 text-red-600 animate-pulse" />}
                sequences={[
                  `⚠️ 健檢警示：${pendingHc.stageName} (倒數21天內到期！)`,
                  `⚠️ 健檢警示：未依限辦理外籍看護體檢，最高可處 30 萬元罰鍰！`,
                  `⚠️ 健檢警示：點擊立即預約衛福部特約醫院體檢`
                ]}
                onClick={() => onSelectTab && onSelectTab('health_checks')}
                className="hidden lg:inline-flex"
              />
            )}
          </div>

          {/* Right Actions: Push Toggle & Notification Bell with Mouse Interactive Effects */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Push Notification Toggle Button with Mouse Interactive Dynamic Effect */}
            <MouseInteractiveNotification
              onClick={handleTogglePush}
              className={`rounded-xl border shadow-sm ${
                pushEnabled
                  ? 'bg-teal-500/20 text-teal-300 border-teal-500/50'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
              title={pushEnabled ? '推播通知已啟用（點擊切換）' : '點擊開啟即時網頁與手機推播通知'}
              glowColor={pushEnabled ? 'rgba(20, 184, 166, 0.45)' : 'rgba(99, 102, 241, 0.35)'}
            >
              <div className="flex items-center space-x-2 text-xs font-semibold px-3 py-2">
                <Volume2 className={`w-3.5 h-3.5 ${pushEnabled ? 'text-teal-400 animate-bounce' : 'text-slate-400'}`} />
                <span>{pushEnabled ? '推播服務已啟用' : '開啟推播通知'}</span>
                <span className={`w-2.5 h-2.5 rounded-full ${pushEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></span>
              </div>
            </MouseInteractiveNotification>

            {/* Notification Bell Center with Mouse Interactive Dynamic Effect */}
            <MouseInteractiveNotification
              onClick={onOpenNotifications}
              className="rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700/90 shadow-sm"
              title="即時推播通知中心"
              glowColor="rgba(244, 63, 94, 0.45)"
            >
              <div className="relative p-2.5 flex items-center justify-center">
                <Bell className="w-5 h-5 text-slate-200" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900 shadow">
                    {unreadCount}
                  </span>
                )}
              </div>
            </MouseInteractiveNotification>

            {/* Employer Profile Pill */}
            <button
              onClick={onOpenProfileModal}
              className="flex items-center space-x-2.5 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-xl transition text-xs font-medium"
            >
              <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-teal-400 font-bold border border-slate-600">
                張
              </div>
              <div className="text-left">
                <div className="text-slate-100 font-semibold leading-tight">張志明 雇主</div>
                <div className="text-[10px] text-teal-400 flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5" /> 身份已認證
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Permission Denied Toast Alert */}
        {showPushToast && (
          <div className="mt-2 bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs p-2.5 rounded-xl flex items-center justify-between">
            <span>瀏覽器推播權限尚未允許。請點擊網址左側鎖頭開啟「通知」權限，或使用網頁內即時通知中心。</span>
            <button onClick={() => setShowPushToast(false)} className="text-rose-300 hover:text-white font-bold ml-2">✕</button>
          </div>
        )}
      </div>
    </header>
  );
};
