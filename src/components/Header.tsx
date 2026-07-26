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
                  <span className="bg-slate-800 text-slate-400 text-[11px] px-2 py-0.5 rounded-md border border-slate-700 font-normal flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-teal-400" /> 合規核備
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

            {/* Subtle Alert Tag for Health Check Warning */}
            {pendingHc && (
              <button
                onClick={() => onSelectTab && onSelectTab('health_checks')}
                className="hidden lg:flex items-center gap-2 bg-slate-800/90 hover:bg-slate-800 text-slate-200 border-l-2 border-red-500 border-y border-r border-slate-700/80 px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer shadow-sm"
                title="點擊查看健康檢查處置"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                <span className="text-red-400 font-bold">健檢提醒:</span>
                <span className="text-slate-200 truncate max-w-[200px]">{pendingHc.stageName} (21天內到期)</span>
              </button>
            )}
          </div>

          {/* Right Actions: Standardized Navbar Area */}
          <div className="hidden md:flex items-center space-x-2.5">
            {/* Push Notification Toggle */}
            <button
              onClick={handleTogglePush}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer ${
                pushEnabled
                  ? 'bg-slate-800/90 hover:bg-slate-800 text-teal-300 border-teal-500/40'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700/80'
              }`}
              title={pushEnabled ? '推播通知已啟用（點擊切換）' : '點擊開啟即時網頁與手機推播通知'}
            >
              <Volume2 className={`w-3.5 h-3.5 ${pushEnabled ? 'text-teal-400' : 'text-slate-400'}`} />
              <span>{pushEnabled ? '推播已開啟' : '開啟推播'}</span>
              <span className={`w-2 h-2 rounded-full ${pushEnabled ? 'bg-teal-400' : 'bg-slate-500'}`} />
            </button>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition cursor-pointer"
              title="即時推播通知中心"
            >
              <Bell className="w-4 h-4 text-slate-200" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-slate-900">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Employer Profile Button */}
            <button
              onClick={onOpenProfileModal}
              className="flex items-center space-x-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 px-3 py-1.5 rounded-xl transition text-xs font-medium cursor-pointer"
            >
              <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-teal-300 text-[11px] font-bold">
                張
              </div>
              <span className="text-slate-200 font-medium">張志明 雇主</span>
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
