import React, { useState } from 'react';
import { NotificationItem, NotificationCategory } from '../types';
import { Bell, Check, Trash2, X, Send, HeartPulse, FileText, Clock, DollarSign, ExternalLink, Volume2 } from 'lucide-react';
import { sendWebPushNotification } from '../utils/pushNotification';
import { MouseInteractiveNotification } from './MouseInteractiveNotification';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearNotification: (id: string) => void;
  onSelectAction: (category: NotificationCategory, actionUrl?: string) => void;
  pushEnabled: boolean;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearNotification,
  onSelectAction,
  pushEnabled,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [testSuccessMessage, setTestSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const filtered = notifications.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case 'health_check':
        return <HeartPulse className="w-4 h-4 text-rose-500" />;
      case 'contract_signing':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'workflow_progress':
        return <Clock className="w-4 h-4 text-emerald-500" />;
      case 'payment_reminder':
        return <DollarSign className="w-4 h-4 text-amber-500" />;
      default:
        return <Bell className="w-4 h-4 text-indigo-500" />;
    }
  };

  const handleTestPushNotification = () => {
    const title = '🔔 模擬推播：Siti Rahma 18個月健康檢查與合約簽署提醒';
    const body = '您有 1 項待辦體檢項目與 1 份待簽署之勞動合約續約意願協議書，請即時處置。';

    // Trigger browser Web Push
    sendWebPushNotification(title, { body });

    setTestSuccessMessage('推播通知已發送！請查看電腦或手機視窗角落推播訊息。');
    setTimeout(() => setTestSuccessMessage(null), 5000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-teal-500/20 text-teal-400 rounded-lg">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base">即時推播與通知中心</h2>
              <p className="text-xs text-slate-400">健檢提醒 ‧ 文件簽署 ‧ 流程進度通知</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Test Push Button Ribbon */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-xs text-slate-700 font-medium">
              <Volume2 className="w-4 h-4 text-teal-600" />
              <span>網頁推播功能：{pushEnabled ? '已啟用 🟢' : '關閉中 ⚪'}</span>
            </div>
            <MouseInteractiveNotification
              onClick={handleTestPushNotification}
              className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition"
              title="滑鼠互動：點擊測試即時推播"
              glowColor="rgba(20, 184, 166, 0.45)"
            >
              <Send className="w-3 h-3" /> 測試發送推播
            </MouseInteractiveNotification>
          </div>

          {testSuccessMessage && (
            <div className="text-[11px] bg-teal-50 text-teal-800 border border-teal-200 p-2 rounded-lg font-medium animate-fade-in">
              {testSuccessMessage}
            </div>
          )}
        </div>

        {/* Category Tabs */}
        <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 flex space-x-1 overflow-x-auto text-xs">
          {[
            { id: 'all', label: '全部' },
            { id: 'health_check', label: '健檢提醒' },
            { id: 'contract_signing', label: '合約簽署' },
            { id: 'workflow_progress', label: '申請進度' },
            { id: 'payment_reminder', label: '繳費提醒' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition ${
                selectedCategory === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Action Toolbar */}
        <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>共 {filtered.length} 則通知</span>
          {notifications.some((n) => !n.isRead) && (
            <button
              onClick={onMarkAllAsRead}
              className="text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" /> 全部標示為已讀
            </button>
          )}
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Bell className="w-12 h-12 mx-auto mb-3 stroke-1 text-slate-300" />
              <p className="text-sm font-medium">目前無相關通知紀錄</p>
            </div>
          ) : (
            filtered.map((item) => (
              <MouseInteractiveNotification
                key={item.id}
                onClick={() => onMarkAsRead(item.id)}
                className={`p-3.5 rounded-xl border transition relative group cursor-pointer block text-left ${
                  !item.isRead
                    ? 'bg-teal-50/60 border-teal-200/90 shadow-sm'
                    : 'bg-white border-slate-200/80 hover:border-slate-300'
                }`}
                glowColor={!item.isRead ? "rgba(13, 148, 136, 0.25)" : "rgba(99, 102, 241, 0.15)"}
              >
                {!item.isRead && (
                  <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping"></span>
                )}

                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-slate-100 flex-shrink-0 mt-0.5">
                    {getCategoryIcon(item.category)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between pr-4">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{item.title}</h4>
                    </div>

                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.message}</p>

                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100/80">
                      <span className="text-[11px] text-slate-400">{item.timestamp}</span>

                      {item.actionLabel && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onMarkAsRead(item.id);
                            onSelectAction(item.category, item.actionUrl);
                            onClose();
                          }}
                          className="text-xs font-bold text-teal-700 hover:text-teal-800 bg-teal-100/70 hover:bg-teal-200/80 px-2.5 py-1 rounded-lg flex items-center gap-1 transition"
                        >
                          {item.actionLabel} <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onClearNotification(item.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition"
                    title="刪除這則通知"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </MouseInteractiveNotification>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 text-center text-xs text-slate-500">
          系統定期與衛生福利部疾病管制署及勞動部勞動力發展署同步資料
        </div>
      </div>
    </div>
  );
};
