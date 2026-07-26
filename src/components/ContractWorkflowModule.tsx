import React, { useState } from 'react';
import { ForeignCaregiver, WorkflowStep } from '../types';
import { CheckCircle2, Clock, AlertCircle, FileSignature, Building2, UserCheck, ShieldAlert, ArrowRight, FileText, Download } from 'lucide-react';

interface ContractWorkflowModuleProps {
  caregiver: ForeignCaregiver;
  onOpenDocumentSigningModal: (documentId?: string) => void;
}

export const ContractWorkflowModule: React.FC<ContractWorkflowModuleProps> = ({
  caregiver,
  onOpenDocumentSigningModal,
}) => {
  const [selectedStep, setSelectedStep] = useState<WorkflowStep | null>(caregiver.workflowSteps[caregiver.workflowSteps.length - 1]);

  const completedCount = caregiver.workflowSteps.filter((s) => s.status === 'completed').length;
  const totalCount = caregiver.workflowSteps.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const getStepIcon = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-teal-600 animate-spin" />;
      case 'action_required':
        return <ShieldAlert className="w-5 h-5 text-amber-500 animate-bounce" />;
      default:
        return <Clock className="w-5 h-5 text-slate-300" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Progress Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full mb-1">
              <Building2 className="w-3.5 h-3.5 text-teal-600" /> 申辦單位：勞動部 ‧ 內政部移民署 ‧ 外國人關懷站
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              聘僱與合約申辦流程追蹤 ({caregiver.name})
            </h2>
            <p className="text-xs text-slate-500">
              即時掌握巴氏量表評估、招募許可函、海外驗證、入境交接、聘僱許可與居留證辦理進度。
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-right flex-shrink-0">
            <span className="text-xs text-slate-500 font-medium block">申辦整體完成度</span>
            <span className="text-2xl font-black text-teal-600">{progressPercent}%</span>
            <span className="text-[11px] text-slate-400 block">({completedCount} / {totalCount} 步驟已完成)</span>
          </div>
        </div>

        {/* Progress Bar Visual */}
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Main Workflow Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Step List Timeline Pipeline */}
        <div className="lg:col-span-2 space-y-3">
          {caregiver.workflowSteps.map((step) => {
            const isSelected = selectedStep?.id === step.id;

            return (
              <div
                key={step.id}
                onClick={() => setSelectedStep(step)}
                className={`p-4 rounded-2xl border transition cursor-pointer relative ${
                  step.status === 'action_required'
                    ? 'bg-amber-50/60 border-amber-300 shadow-md ring-2 ring-amber-400/20'
                    : step.status === 'in_progress'
                    ? 'bg-teal-50/50 border-teal-300 shadow-sm'
                    : isSelected
                    ? 'bg-white border-teal-500 ring-2 ring-teal-500/20 shadow-md'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start space-x-3.5">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="p-1 bg-white rounded-full shadow-sm border border-slate-100">
                      {getStepIcon(step.status)}
                    </div>
                    {step.stepNumber < totalCount && (
                      <div className="w-0.5 h-10 bg-slate-200 mt-2"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        STEP {step.stepNumber}
                      </span>
                      {step.status === 'action_required' && (
                        <span className="text-xs bg-rose-500 text-white font-bold px-2 py-0.5 rounded-full animate-pulse">
                          需要雇主處理
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">{step.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{step.subtitle}</p>

                    {step.officialDocumentNo && (
                      <div className="mt-2 inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-xs font-mono px-2.5 py-1 rounded-lg border border-slate-200">
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        <span>公文文號：{step.officialDocumentNo}</span>
                      </div>
                    )}

                    {step.requiredAction && (
                      <div className="mt-3 p-2.5 bg-amber-100/70 border border-amber-300/80 rounded-xl text-xs text-amber-900 font-medium flex items-center justify-between">
                        <span>⚠️ {step.requiredAction}</span>
                        {step.linkedDocumentId && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenDocumentSigningModal(step.linkedDocumentId);
                            }}
                            className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1 transition"
                          >
                            <FileSignature className="w-3.5 h-3.5" /> 前往簽署
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Step Detail Panel */}
        <div className="lg:col-span-1">
          {selectedStep ? (
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl sticky top-24 space-y-4 border border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wide">
                  步驟 {selectedStep.stepNumber} 申辦細節
                </span>
                <span className="text-xs text-slate-400">承辦單位：{selectedStep.responsibleParty}</span>
              </div>

              <h3 className="text-lg font-bold text-slate-100">{selectedStep.title}</h3>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80">
                {selectedStep.description}
              </p>

              <div className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                {selectedStep.officialDocumentNo && (
                  <div>
                    <span className="text-slate-400 block">核發公文號碼：</span>
                    <span className="font-mono font-bold text-teal-300">{selectedStep.officialDocumentNo}</span>
                  </div>
                )}

                {selectedStep.updatedAt && (
                  <div>
                    <span className="text-slate-400 block">最近更新時間：</span>
                    <span className="font-medium text-slate-200">{selectedStep.updatedAt}</span>
                  </div>
                )}

                {selectedStep.estimatedCompletionDate && (
                  <div>
                    <span className="text-slate-400 block">預計完成日期：</span>
                    <span className="font-semibold text-amber-300">{selectedStep.estimatedCompletionDate}</span>
                  </div>
                )}
              </div>

              {selectedStep.linkedDocumentId && (
                <div className="pt-4 border-t border-slate-800">
                  <button
                    onClick={() => onOpenDocumentSigningModal(selectedStep.linkedDocumentId)}
                    className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 transition"
                  >
                    <FileSignature className="w-4 h-4 stroke-[2.5]" /> 開啟必要文件線上電子簽章
                  </button>
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={() => alert(`已下載「${selectedStep.title}」之公文憑證檔。`)}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" /> 下載階段備查公文 (PDF)
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center text-slate-400">
              請點擊左側流程項目查看申辦細節。
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
