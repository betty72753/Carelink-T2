import React, { useState } from 'react';
import { ClipboardList, ExternalLink, X, RefreshCw, Sparkles, CheckCircle2, Maximize2, Minimize2, Send, Mail } from 'lucide-react';
import { useForm, ValidationError } from '@formspree/react';

interface NewCaseGoogleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewCaseGoogleFormModal: React.FC<NewCaseGoogleFormModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeMode, setActiveMode] = useState<'google' | 'formspree'>('google');
  const [isLoading, setIsLoading] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Formspree Hook Integration for formId: mnjeoyqp
  const [formspreeState, handleFormspreeSubmit] = useForm('mnjeoyqp');

  if (!isOpen) return null;

  const rawFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdR0M7t3BOZljfY4GBBFTwXJQLyrQE-Q9o-Ap8MJobziq2FSg/viewform?usp=publish-editor';
  const embedFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdR0M7t3BOZljfY4GBBFTwXJQLyrQE-Q9o-Ap8MJobziq2FSg/viewform?embedded=true';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200">
      <div
        className={`bg-slate-900 border border-slate-700/80 rounded-2xl w-full flex flex-col shadow-2xl overflow-hidden transition-all duration-300 ${
          isFullScreen
            ? 'w-full h-full max-w-none max-h-none rounded-none'
            : 'max-w-6xl w-[96vw] h-[92vh] sm:h-[94vh]'
        }`}
      >
        {/* Header Bar */}
        <div className="bg-slate-800/90 border-b border-slate-700/80 px-4 py-3 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30 flex-shrink-0">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  新案件雇主需求登記表單
                </h3>
                <span className="bg-teal-500/20 text-teal-300 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-teal-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-teal-400" /> 線上申辦
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">請填寫看護需求與雇主基本資料，送出後專員將第一時間聯繫協助辦理。</p>
            </div>
          </div>

          {/* Form Switcher Tabs & Actions */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Mode Switcher */}
            <div className="bg-slate-950 p-1 rounded-xl border border-slate-700/80 flex items-center gap-1 text-xs">
              <button
                onClick={() => setActiveMode('google')}
                className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                  activeMode === 'google'
                    ? 'bg-teal-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Google 表單內嵌
              </button>
              <button
                onClick={() => setActiveMode('formspree')}
                className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1 ${
                  activeMode === 'formspree'
                    ? 'bg-teal-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Formspree 直送</span>
              </button>
            </div>

            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-xl border border-slate-700 transition cursor-pointer"
              title={isFullScreen ? '縮小視窗' : '全螢幕放大填寫'}
            >
              {isFullScreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

            {activeMode === 'google' && (
              <a
                href={rawFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 hover:text-teal-200 px-2.5 py-1.5 rounded-xl border border-teal-500/30 transition"
                title="在大視窗或新分頁開啟 Google 表單"
              >
                <span>新分頁開啟</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              title="關閉"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {activeMode === 'google' ? (
          /* Embedded Google Form Frame Area - Expanded height & full width */
          <div className="relative flex-1 bg-white w-full h-full min-h-[550px] overflow-hidden">
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 text-slate-300 z-10 space-y-3">
                <RefreshCw className="w-8 h-8 text-teal-400 animate-spin" />
                <p className="text-sm font-medium">正在載入 Google 需求登記表單...</p>
              </div>
            )}

            <iframe
              src={embedFormUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
              title="新案件雇主需求登記表單"
              onLoad={() => setIsLoading(false)}
              className="w-full h-full border-0 bg-white"
              style={{ minHeight: '100%', height: '100%' }}
            >
              載入中...
            </iframe>
          </div>
        ) : (
          /* Formspree React Native Form Submission */
          <div className="flex-1 bg-slate-900 overflow-y-auto p-4 sm:p-8 flex flex-col justify-center max-w-3xl mx-auto w-full">
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700">
                <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Formspree 快速線上需求提交</h4>
                  <p className="text-xs text-slate-400">系統將透過 Formspree (mnjeoyqp) 即時傳遞您的雇主看護需求至專員信箱。</p>
                </div>
              </div>

              {formspreeState.succeeded ? (
                <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-6 text-center space-y-3 animate-in zoom-in-95 duration-200">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h5 className="text-lg font-bold text-white">需求登記表單已成功送出！</h5>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
                    感謝您的填寫！我們的外籍看護服務團隊已收到您的資料，將於 24 小時內與您聯繫確認詳細看護需求與辦理流程。
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition cursor-pointer"
                  >
                    完成並關閉視窗
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormspreeSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">雇主/聯絡人姓名 <span className="text-rose-400">*</span></label>
                      <input
                        type="text"
                        name="employer_name"
                        required
                        placeholder="請輸入您的姓名"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">電子郵件 (Email) <span className="text-rose-400">*</span></label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="example@gmail.com"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                      />
                      <ValidationError prefix="Email" field="email" errors={formspreeState.errors} className="text-rose-400 text-[11px] mt-1" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">聯絡電話 <span className="text-rose-400">*</span></label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="0912-345-678"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">看護預計需求國籍</label>
                      <select
                        name="nationality_preference"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                      >
                        <option value="印尼">印尼 (Indonesia)</option>
                        <option value="菲律賓">菲律賓 (Philippines)</option>
                        <option value="越南">越南 (Vietnam)</option>
                        <option value="泰國">泰國 (Thailand)</option>
                        <option value="不限/聽從專員建議">不限 / 聽從專員建議</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">被照顧者狀況與照護需求說明 <span className="text-rose-400">*</span></label>
                    <textarea
                      name="message"
                      rows={4}
                      required
                      placeholder="請說明被照顧者年齡、主要疾病或症狀（如巴氏量表分數、肢體關節活動狀況、備餐與扶持需求等）..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                    <ValidationError prefix="Message" field="message" errors={formspreeState.errors} className="text-rose-400 text-[11px] mt-1" />
                  </div>

                  <button
                    type="submit"
                    disabled={formspreeState.submitting}
                    className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-lg disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{formspreeState.submitting ? '表單傳送中...' : '送出需求登記表單 (Formspree)'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Footer info bar */}
        <div className="bg-slate-900 border-t border-slate-800 px-4 py-2.5 flex items-center justify-between text-xs text-slate-400 flex-shrink-0">
          <div className="flex items-center gap-1.5 text-teal-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>表單直接連線勞動部與特約仲介核備系統 (Formspree 端點: mnjeoyqp)</span>
          </div>

          <a
            href={rawFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="sm:hidden text-teal-400 underline font-medium"
          >
            新分頁開啟表單
          </a>
        </div>

      </div>
    </div>
  );
};

