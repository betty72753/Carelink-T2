import React, { useState } from 'react';
import { ClipboardList, ExternalLink, X, RefreshCw, Sparkles, CheckCircle2, Maximize2, Minimize2 } from 'lucide-react';

interface NewCaseGoogleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewCaseGoogleFormModal: React.FC<NewCaseGoogleFormModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);

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
        <div className="bg-slate-800/90 border-b border-slate-700/80 px-4 py-3 sm:px-6 flex items-center justify-between gap-4 flex-shrink-0">
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

          {/* Action Buttons: Fullscreen toggle, Open in New Tab & Close */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl border border-slate-700 transition cursor-pointer"
              title={isFullScreen ? '縮小視窗' : '全螢幕放大填寫'}
            >
              {isFullScreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>復原大小</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>全螢幕放大</span>
                </>
              )}
            </button>

            <a
              href={rawFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 hover:text-teal-200 px-3 py-1.5 rounded-xl border border-teal-500/30 transition"
              title="在大視窗或新分頁開啟 Google 表單"
            >
              <span>新分頁開啟</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              title="關閉"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Embedded Google Form Frame Area - Expanded height & full width */}
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

        {/* Footer info bar */}
        <div className="bg-slate-900 border-t border-slate-800 px-4 py-2.5 flex items-center justify-between text-xs text-slate-400 flex-shrink-0">
          <div className="flex items-center gap-1.5 text-teal-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>表單直接連線勞動部與特約仲介核備系統</span>
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

