import React, { useState } from 'react';
import { ForeignCaregiver, NotificationItem } from '../types';
import { Bell, Plus, ShieldCheck, HeartPulse, User, CheckCircle2, Volume2, AlertTriangle, ClipboardList, Sun, Moon } from 'lucide-react';
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
  onOpenNewCaseFormModal: () => void;
  onOpenProfileModal: () => void;
  pushEnabled: boolean;
  setPushEnabled: (enabled: boolean) => void;
  onSelectTab?: (tab: string) => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  caregivers,
  activeCaregiver,
  onSelectCaregiver,
  notifications,
  onOpenNotifications,
  onOpenNewCaregiverModal,
  onOpenNewCaseFormModal,
  onOpenProfileModal,
  pushEnabled,
  setPushEnabled,
  onSelectTab,
  theme = 'dark',
  onToggleTheme,
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
  const isLight = theme === 'light';

  return (
    <header className={`sticky top-0 z-30 transition-colors duration-300 border-b ${
      isLight
        ? 'bg-white text-slate-800 border-slate-200/80 shadow-sm'
        : 'bg-slate-900 text-white border-slate-800 shadow-lg'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2">
        <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-2 sm:gap-3">
          
          {/* Brand & Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-md shadow-teal-500/20 ring-2 ring-teal-400/30 flex-shrink-0">
              <HeartPulse className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5">
                <span className={`font-bold text-sm sm:text-base tracking-tight truncate ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                  外籍看護雇主管理平台
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md border font-normal flex items-center gap-0.5 flex-shrink-0 whitespace-nowrap ${
                  isLight ? 'bg-teal-50 text-teal-800 border-teal-200' : 'bg-slate-800 text-teal-300 border-slate-700'
                }`}>
                  <ShieldCheck className="w-3 h-3 text-teal-500" />
                  <span>核備</span>
                </span>
              </div>
              <p className={`text-[10px] sm:text-xs truncate ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                健檢通知 ‧ 申辦追蹤 ‧ 線上簽章
              </p>
            </div>
          </div>

          {/* Middle Controls (Caregiver Selector + Form Button) */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap min-w-0">
            {/* Caregiver Switcher Dropdown */}
            <div className={`flex items-center border rounded-xl px-2 py-1 transition-colors text-xs gap-1.5 min-w-0 ${
              isLight ? 'bg-slate-100/90 border-slate-200' : 'bg-slate-800/90 border-slate-700/80 shadow-inner'
            }`}>
              <span className={`font-medium flex items-center gap-1 flex-shrink-0 whitespace-nowrap ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                <User className="w-3.5 h-3.5 text-teal-500" />
                <span className="hidden sm:inline">看護:</span>
              </span>
              <select
                value={activeCaregiver.id}
                onChange={(e) => {
                  const found = caregivers.find((c) => c.id === e.target.value);
                  if (found) onSelectCaregiver(found);
                }}
                className={`font-semibold rounded-lg px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-teal-400 border cursor-pointer max-w-[120px] sm:max-w-[150px] truncate ${
                  isLight ? 'bg-white text-slate-800 border-slate-300' : 'bg-slate-900 text-slate-100 border-slate-700'
                }`}
              >
                {caregivers.map((cg) => (
                  <option key={cg.id} value={cg.id}>
                    {cg.name} ({cg.nationalityCode})
                  </option>
                ))}
              </select>

              <button
                onClick={onOpenNewCaregiverModal}
                className={`p-1 sm:px-2 sm:py-1 rounded-lg flex items-center gap-0.5 transition flex-shrink-0 font-medium whitespace-nowrap cursor-pointer ${
                  isLight ? 'bg-slate-200 hover:bg-slate-300 text-slate-800' : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                }`}
                title="新增看護工名單"
              >
                <Plus className="w-3.5 h-3.5 text-teal-400" />
                <span className="hidden sm:inline">新增</span>
              </button>
            </div>

            {/* New Case Employer Form Button */}
            <button
              onClick={onOpenNewCaseFormModal}
              className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl flex items-center gap-1 sm:gap-1.5 transition cursor-pointer shadow-md shadow-teal-500/20 active:scale-95 flex-shrink-0 whitespace-nowrap"
              title="點擊開啟新案件雇主需求登記表單"
            >
              <ClipboardList className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950 stroke-[2.5] flex-shrink-0" />
              <span>新案件填單</span>
            </button>

            {/* Urgent Health Check Warning Tag */}
            {pendingHc && (
              <button
                onClick={() => onSelectTab && onSelectTab('health_checks')}
                className={`hidden xl:flex items-center gap-1.5 border-l-2 border-red-500 border-y border-r px-2 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer shadow-sm flex-shrink-0 whitespace-nowrap ${
                  isLight ? 'bg-rose-50 text-slate-800 border-rose-200' : 'bg-slate-800/90 text-slate-200 border-slate-700/80'
                }`}
                title="點擊查看健康檢查處置"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                <span className="text-red-500 font-bold">健檢提醒:</span>
                <span className={`truncate max-w-[120px] ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                  {pendingHc.stageName}
                </span>
              </button>
            )}
          </div>

          {/* Right Toolbar Controls (Theme, Push, Bell, Profile) */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0 justify-end">
            {/* Theme Toggle Button */}
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border text-xs font-medium transition cursor-pointer flex items-center gap-1 ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700/80'
                }`}
                title={isLight ? '切換為深色模式' : '切換為淺色模式'}
              >
                {isLight ? <Moon className="w-3.5 h-3.5 text-indigo-600" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
                <span className="hidden xl:inline">{isLight ? '深色' : '淺色'}</span>
              </button>
            )}

            {/* Push Notification Toggle */}
            <button
              onClick={handleTogglePush}
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border text-xs font-medium transition cursor-pointer flex items-center gap-1 ${
                pushEnabled
                  ? 'bg-slate-800 text-teal-300 border-teal-500/40'
                  : isLight ? 'bg-slate-100 text-slate-600 border-slate-300' : 'bg-slate-800 text-slate-300 border-slate-700/80'
              }`}
              title={pushEnabled ? '推播已開啟' : '點擊開啟即時推播'}
            >
              <Volume2 className={`w-3.5 h-3.5 ${pushEnabled ? 'text-teal-400' : ''}`} />
              <span className="hidden xl:inline">{pushEnabled ? '推播中' : '推播'}</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className={`p-1.5 sm:p-2 rounded-xl border transition cursor-pointer relative ${
                isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title="即時推播通知中心"
            >
              <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Employer Profile Button */}
            <button
              onClick={onOpenProfileModal}
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl transition text-xs font-medium cursor-pointer"
              title="雇主個案檔案"
            >
              <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-teal-300 text-[10px] font-bold flex-shrink-0">
                張
              </div>
              <span className="hidden sm:inline text-slate-200 font-medium">張志明</span>
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
