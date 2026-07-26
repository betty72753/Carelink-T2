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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3">
          
          {/* Top Row / Logo & Mobile Actions */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 w-full xl:w-auto justify-between">
            <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-md shadow-teal-500/20 ring-2 ring-teal-400/30 flex-shrink-0">
                <HeartPulse className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950 stroke-[2.5]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <span className={`font-bold text-base sm:text-lg tracking-tight truncate ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                    外籍看護雇主管理平台
                  </span>
                  <span className={`text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded-md border font-normal flex items-center gap-1 flex-shrink-0 ${
                    isLight ? 'bg-teal-50 text-teal-800 border-teal-200' : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    <ShieldCheck className="w-3 h-3 text-teal-500" /> 合規核備
                  </span>
                </div>
                <p className={`text-[11px] sm:text-xs truncate ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  健檢定期通知 ‧ 合約流程追蹤 ‧ 線上電子簽章
                </p>
              </div>
            </div>

            {/* Mobile Actions: Theme toggle, notification bell & profile modal */}
            <div className="flex md:hidden items-center space-x-1.5 flex-shrink-0">
              {onToggleTheme && (
                <button
                  onClick={onToggleTheme}
                  className={`p-2 rounded-xl border text-xs font-medium transition cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center ${
                    isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200' : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                  title={isLight ? '切換為深色模式' : '切換為淺色模式'}
                >
                  {isLight ? <Moon className="w-4 h-4 text-indigo-500" /> : <Sun className="w-4 h-4 text-amber-400" />}
                </button>
              )}

              <button
                onClick={onOpenNotifications}
                className={`p-2 rounded-xl border transition cursor-pointer relative min-h-[38px] min-w-[38px] flex items-center justify-center ${
                  isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200' : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
                title="即時推播通知中心"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              <button
                onClick={onOpenProfileModal}
                className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-teal-300 text-xs font-bold shadow-sm"
                title="查看雇主基本資料"
              >
                張
              </button>
            </div>
          </div>

          {/* Center: Caregiver Selector & Quick Action */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full xl:w-auto">
            {/* Caregiver Switcher Dropdown */}
            <div className={`relative flex items-center border rounded-xl p-1.5 transition-colors w-full sm:w-auto justify-between ${
              isLight ? 'bg-slate-100/90 border-slate-200' : 'bg-slate-800/90 border-slate-700/80 shadow-inner'
            }`}>
              <span className={`text-xs font-medium px-1.5 flex items-center gap-1 flex-shrink-0 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                <User className="w-3.5 h-3.5 text-teal-500" /> 看護工:
              </span>
              <select
                value={activeCaregiver.id}
                onChange={(e) => {
                  const found = caregivers.find((c) => c.id === e.target.value);
                  if (found) onSelectCaregiver(found);
                }}
                className={`font-semibold text-xs sm:text-sm rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-teal-400 border cursor-pointer flex-1 min-w-0 ${
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
                className={`ml-1.5 text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition flex-shrink-0 font-medium ${
                  isLight ? 'bg-slate-200 hover:bg-slate-300 text-slate-800' : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                }`}
                title="快速新增看護工名單"
              >
                <Plus className="w-3.5 h-3.5" /> 新增
              </button>
            </div>

            {/* New Case Employer Form Button */}
            <button
              onClick={onOpenNewCaseFormModal}
              className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs px-3 py-2 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md shadow-teal-500/20 active:scale-95 w-full sm:w-auto flex-shrink-0"
              title="點擊開啟新案件雇主需求登記表單"
            >
              <ClipboardList className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              <span>新案件雇主填單</span>
            </button>

            {/* Subtle Alert Tag for Health Check Warning */}
            {pendingHc && (
              <button
                onClick={() => onSelectTab && onSelectTab('health_checks')}
                className={`hidden md:flex items-center gap-2 border-l-2 border-red-500 border-y border-r px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer shadow-sm ${
                  isLight ? 'bg-rose-50 text-slate-800 border-rose-200' : 'bg-slate-800/90 text-slate-200 border-slate-700/80'
                }`}
                title="點擊查看健康檢查處置"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                <span className="text-red-500 font-bold">健檢提醒:</span>
                <span className={`truncate max-w-[180px] lg:max-w-[220px] ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                  {pendingHc.stageName}
                </span>
              </button>
            )}
          </div>

          {/* Right Actions: Standardized Navbar Area for Tablet & Desktop */}
          <div className="hidden md:flex items-center space-x-2 sm:space-x-2.5 flex-shrink-0 justify-end">
            {/* Theme Switcher Toggle Button */}
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer shadow-sm ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700/80'
                }`}
                title={isLight ? '切換為深色模式' : '切換為淺色模式'}
              >
                {isLight ? (
                  <>
                    <Moon className="w-3.5 h-3.5 text-indigo-600" />
                    <span>深色模式</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>淺色模式</span>
                  </>
                )}
              </button>
            )}

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
