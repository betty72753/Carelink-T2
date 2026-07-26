import React, { useState } from 'react';
import { ForeignCaregiver, NotificationItem } from '../types';
import { Bell, Plus, ShieldCheck, HeartPulse, User, CheckCircle2, Volume2 } from 'lucide-react';
import { requestNotificationPermission, sendWebPushNotification } from '../utils/pushNotification';

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

            {/* Mobile notification bell button */}
            <div className="flex md:hidden items-center space-x-2">
              <button
                onClick={onOpenNotifications}
                className="relative p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
                title="通知中心"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Center: Caregiver Selector & Status Ribbon */}
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

            {/* Urgent Health Check Warning Tag */}
            {pendingHc && (
              <div className="hidden lg:flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs px-3 py-1.5 rounded-xl animate-pulse">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span className="font-medium">健檢警示：{pendingHc.stageName} (21天內到期)</span>
              </div>
            )}
          </div>

          {/* Right Actions: Push Toggle & Notification Bell & Employer Info */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Push Notification Toggle Button */}
            <button
              onClick={handleTogglePush}
              className={`flex items-center space-x-2 text-xs font-medium px-3 py-1.5 rounded-xl border transition ${
                pushEnabled
                  ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 hover:bg-teal-500/30'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
              }`}
              title={pushEnabled ? '推播通知已啟用' : '點擊開啟即時推播通知'}
            >
              <Volume2 className={`w-3.5 h-3.5 ${pushEnabled ? 'text-teal-400 animate-bounce' : 'text-slate-400'}`} />
              <span>{pushEnabled ? '推播服務已開' : '開啟推播通知'}</span>
              <span className={`w-2 h-2 rounded-full ${pushEnabled ? 'bg-emerald-400' : 'bg-slate-500'}`}></span>
            </button>

            {/* Notification Bell Center */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700/80 transition border border-slate-700/80 shadow-sm"
              title="即時通知中心"
            >
              <Bell className="w-5 h-5 text-slate-200" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900 shadow">
                  {unreadCount}
                </span>
              )}
            </button>

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
