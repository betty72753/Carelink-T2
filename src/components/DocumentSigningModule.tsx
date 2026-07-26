import React, { useState, useRef, useEffect } from 'react';
import { ForeignCaregiver, DocumentContract } from '../types';
import { FileSignature, CheckCircle2, Clock, AlertTriangle, FileText, Download, Eraser, ShieldCheck, Check, Sparkles, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DocumentSigningModuleProps {
  caregiver: ForeignCaregiver;
  onSignDocument: (documentId: string, signatureImageBase64: string) => void;
  activeDocIdToSign?: string | null;
}

export const DocumentSigningModule: React.FC<DocumentSigningModuleProps> = ({
  caregiver,
  onSignDocument,
  activeDocIdToSign,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending_signature' | 'signed'>('all');
  const [signingModalDoc, setSigningModalDoc] = useState<DocumentContract | null>(null);
  const [previewDoc, setPreviewDoc] = useState<DocumentContract | null>(null);

  // Canvas E-Signature Refs & State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Auto-open modal if triggered from notification or workflow step
  useEffect(() => {
    if (activeDocIdToSign) {
      const target = caregiver.documents.find((d) => d.id === activeDocIdToSign);
      if (target) {
        setSigningModalDoc(target);
      }
    }
  }, [activeDocIdToSign, caregiver.documents]);

  const filteredDocs = caregiver.documents.filter((doc) => {
    if (filterStatus === 'all') return true;
    return doc.status === filterStatus;
  });

  // Setup Canvas listeners
  useEffect(() => {
    if (!signingModalDoc) return;

    // Small delay to ensure modal DOM is mounted
    const timer = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Reset resolution
      canvas.width = canvas.parentElement?.clientWidth || 500;
      canvas.height = 180;

      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#0f172a'; // slate-900
    }, 100);

    return () => clearTimeout(timer);
  }, [signingModalDoc]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.nativeEvent.offsetX;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.nativeEvent.offsetY;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.nativeEvent.offsetX;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.nativeEvent.offsetY;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleConfirmSignature = () => {
    if (!signingModalDoc) return;
    const canvas = canvasRef.current;
    if (!canvas || !hasDrawn) {
      alert('請先於手寫框簽署您的姓名');
      return;
    }

    const signatureBase64 = canvas.toDataURL('image/png');
    onSignDocument(signingModalDoc.id, signatureBase64);

    // Fire Confetti celebratory effect
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    setSigningModalDoc(null);
    setHasDrawn(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full mb-1 border border-blue-200">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> 符合電子簽章法 (Electronic Signatures Act)
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              雇主必要文件線上簽署中心
            </h2>
            <p className="text-xs text-slate-500">
              包含外籍家庭看護工勞動契約、Private Agency 委任契約、薪資發放明細與健檢資料授權書。
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {[
              { id: 'all', label: '全部文件' },
              { id: 'pending_signature', label: '待簽署 📝' },
              { id: 'signed', label: '已完成簽章 ✓' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg transition ${
                  filterStatus === tab.id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map((doc) => {
          const isPending = doc.status === 'pending_signature';

          return (
            <div
              key={doc.id}
              className={`p-5 rounded-2xl border transition shadow-sm flex flex-col justify-between ${
                isPending
                  ? 'bg-amber-50/40 border-amber-300 ring-2 ring-amber-400/20'
                  : 'bg-white border-slate-200/90'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                    {doc.categoryName}
                  </span>

                  {isPending ? (
                    <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-300 animate-pulse">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> 待雇主電子簽章
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 已完成電子簽章
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-2.5">{doc.title}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{doc.description}</p>

                {/* Key Points Summary */}
                <div className="mt-3 bg-slate-50 border border-slate-200/80 p-3 rounded-xl text-xs space-y-1">
                  <strong className="text-slate-700 block mb-1">契約條款重點摘要：</strong>
                  {doc.summaryBulletPoints.map((pt, i) => (
                    <p key={i} className="text-slate-600 flex items-start gap-1">
                      <span className="text-teal-600 font-bold">•</span> {pt}
                    </p>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>建立時間：{doc.createdAt}</span>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setPreviewDoc(doc)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl flex items-center gap-1 transition"
                  >
                    <Eye className="w-3.5 h-3.5" /> 預覽條款
                  </button>

                  {isPending ? (
                    <button
                      onClick={() => setSigningModalDoc(doc)}
                      className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md flex items-center gap-1.5 transition"
                    >
                      <FileSignature className="w-4 h-4" /> 點擊進行線上簽名
                    </button>
                  ) : (
                    <button
                      onClick={() => alert(`「${doc.title}」已完成簽署，正下載加密電子憑證與核備檔。`)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl flex items-center gap-1 transition"
                    >
                      <Download className="w-3.5 h-3.5 text-teal-400" /> 下載簽署檔 (PDF)
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive E-Signature Modal */}
      {signingModalDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-teal-100 text-teal-700 rounded-lg">
                  <FileSignature className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">線上電子簽章作業</h3>
                  <p className="text-xs text-slate-500">雇主手寫簽章授權驗證</p>
                </div>
              </div>
              <button
                onClick={() => setSigningModalDoc(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs space-y-1">
              <span className="font-bold text-slate-900 block">{signingModalDoc.title}</span>
              <p className="text-slate-600">簽署對象：{caregiver.employerName} (雇主) 授權辦理外籍看護工 {caregiver.name} 之聘僱相關法規文件。</p>
            </div>

            {/* Canvas Signature Pad Area */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" /> 請於下方框內使用滑鼠或手指簽署您的姓名：
                </label>
                <button
                  onClick={clearSignature}
                  className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1 transition"
                >
                  <Eraser className="w-3.5 h-3.5" /> 清除重簽
                </button>
              </div>

              <div className="border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50/80 p-2 text-center relative touch-none">
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-44 bg-white rounded-xl shadow-inner cursor-crosshair border border-slate-200"
                />
                {!hasDrawn && (
                  <span className="absolute inset-0 flex items-center justify-center text-xs text-slate-400 pointer-events-none font-medium">
                    在此手寫簽名 (請簽署「張志明」)
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSigningModalDoc(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
              >
                取消
              </button>
              <button
                onClick={handleConfirmSignature}
                disabled={!hasDrawn}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition ${
                  hasDrawn
                    ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-500/20'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Check className="w-4 h-4" /> 確認送出簽章並完成合約
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">{previewDoc.title}</h3>
              <button onClick={() => setPreviewDoc(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <div className="space-y-3 text-xs text-slate-700 leading-relaxed max-h-96 overflow-y-auto p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="font-bold text-slate-900">立合約書人：立契人（雇主：{caregiver.employerName}，以下簡稱甲方）與（受僱看護工：{caregiver.name}，以下簡稱乙方）。</p>
              <p>一、工作項目：乙方專職於甲方家庭內照護【{caregiver.patientName}】之日常生活起居與健康陪伴，不得要求從事非許可範圍之許工作。</p>
              <p>二、薪資與加班：固定基本月薪為新臺幣 20,000 元整。逢每週休假經乙方同意出勤者，依約加發假日加班費。</p>
              <p>三、膳宿與醫療：甲方免費提供合適安全之獨立住處與日常膳食，並依法協助安排衛福部指定定期健康檢查。</p>
              <p>四、契約效期與終止：本契約自兩造完成簽署日起生效。</p>

              {previewDoc.signatureImage && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <span className="font-bold text-slate-900 block mb-2">雇主手寫電子簽章驗證檔：</span>
                  <div className="p-2 bg-white rounded-xl border border-slate-200 inline-block shadow-sm">
                    <img src={previewDoc.signatureImage} alt="雇主簽章" className="h-16" />
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">簽署時間：{previewDoc.signedAt} (憑證碼: SHA-256 Validated)</span>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
              >
                關閉預覽
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
