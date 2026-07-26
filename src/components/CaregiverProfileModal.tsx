import React, { useState } from 'react';
import { ForeignCaregiver } from '../types';
import { User, Passport, ShieldCheck, HeartPulse, Building2, Calendar, Phone, Edit, Save, X } from 'lucide-react';

interface CaregiverProfileModalProps {
  caregiver: ForeignCaregiver;
  isOpen: boolean;
  onClose: () => void;
  onSaveProfile: (updated: ForeignCaregiver) => void;
}

export const CaregiverProfileModal: React.FC<CaregiverProfileModalProps> = ({
  caregiver,
  isOpen,
  onClose,
  onSaveProfile,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ForeignCaregiver>({ ...caregiver });

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-3">
            <img
              src={caregiver.avatarUrl}
              alt={caregiver.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-teal-500/30"
            />
            <div>
              <h2 className="text-lg font-bold text-slate-900">{caregiver.name}</h2>
              <p className="text-xs text-slate-500">{caregiver.nationality} ‧ 護照號碼: {caregiver.passportNumber}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1 transition"
              >
                <Edit className="w-3.5 h-3.5" /> 編輯資料
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 transition shadow-sm"
              >
                <Save className="w-3.5 h-3.5" /> 儲存變更
              </button>
            )}

            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 font-bold">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Profile Card Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
              <User className="w-4 h-4 text-teal-600" /> 移工個人基本資料
            </h3>

            <div>
              <label className="text-slate-500 block mb-0.5">中文姓名 / 英文名：</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              ) : (
                <span className="font-semibold text-slate-900">{caregiver.name}</span>
              )}
            </div>

            <div>
              <label className="text-slate-500 block mb-0.5">居留證號 (ARC)：</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.arcNumber}
                  onChange={(e) => setFormData({ ...formData, arcNumber: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              ) : (
                <span className="font-mono font-semibold text-slate-900">{caregiver.arcNumber}</span>
              )}
            </div>

            <div>
              <label className="text-slate-500 block mb-0.5">居留證有效期限：</label>
              <span className="font-bold text-teal-700">{caregiver.arcExpiryDate}</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
              <Building2 className="w-4 h-4 text-teal-600" /> 雇主與被照顧者資訊
            </h3>

            <div>
              <label className="text-slate-500 block mb-0.5">聘僱雇主姓名：</label>
              <span className="font-semibold text-slate-900">{caregiver.employerName}</span>
            </div>

            <div>
              <label className="text-slate-500 block mb-0.5">被照顧者 (病人/長者)：</label>
              <span className="font-semibold text-slate-900">{caregiver.patientName} ({caregiver.patientAge} 歲)</span>
            </div>

            <div>
              <label className="text-slate-500 block mb-0.5">服務人力仲介公司：</label>
              <span className="font-semibold text-slate-900">{caregiver.agencyName}</span>
            </div>

            <div>
              <label className="text-slate-500 block mb-0.5">仲介服務專員電話：</label>
              <span className="font-bold text-teal-700">{caregiver.agencyContact}</span>
            </div>
          </div>

        </div>

        {/* Contract & Health Check History Summary */}
        <div className="p-4 bg-teal-50/60 border border-teal-200 rounded-xl text-xs space-y-2">
          <h4 className="font-bold text-teal-900 flex items-center gap-1.5">
            <HeartPulse className="w-4 h-4 text-teal-600" /> 法定健檢與聘僱合約起訖
          </h4>
          <p className="text-teal-800">
            合約效期：<strong className="text-slate-900">{caregiver.contractStartDate} 至 {caregiver.contractEndDate}</strong>
          </p>
          <p className="text-teal-800">
            已完成健檢次數：<strong className="text-emerald-700">{caregiver.healthChecks.filter(h => h.status === 'completed').length} / 4 次</strong>
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};
