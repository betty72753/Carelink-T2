import React, { useState } from 'react';
import { ForeignCaregiver } from '../types';
import { UserPlus, Check, X } from 'lucide-react';

interface NewCaregiverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCaregiver: (newCg: ForeignCaregiver) => void;
}

export const NewCaregiverModal: React.FC<NewCaregiverModalProps> = ({
  isOpen,
  onClose,
  onAddCaregiver,
}) => {
  const [name, setName] = useState('');
  const [nationality, setNationality] = useState<'印尼 (Indonesia)' | '越南 (Vietnam)' | '菲律賓 (Philippines)'>('印尼 (Indonesia)');
  const [patientName, setPatientName] = useState('張老先生');
  const [passportNumber, setPassportNumber] = useState('K9827162');
  const [arcNumber, setArcNumber] = useState('A900881726');
  const [agencyName, setAgencyName] = useState('東南亞人力資源顧問有限公司');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('請輸入看護工姓名');
      return;
    }

    const nationalityCode = nationality.includes('印尼') ? 'ID' : nationality.includes('越南') ? 'VN' : 'PH';
    const languageCode = nationality.includes('印尼') ? 'id' : nationality.includes('越南') ? 'vi' : 'tl';

    const newCg: ForeignCaregiver = {
      id: `cg-${Date.now()}`,
      name,
      englishName: name,
      nationality,
      nationalityCode,
      languageCode,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      gender: '女',
      passportNumber,
      arcNumber,
      arcExpiryDate: '2028-08-01',
      arrivalDate: '2026-08-01',
      contractStartDate: '2026-08-01',
      contractEndDate: '2029-07-31',
      employerName: '張志明',
      patientName,
      patientAge: 82,
      agencyName,
      agencyContact: '林專員 (0912-345-678)',
      healthChecks: [
        {
          id: `hc-${Date.now()}-1`,
          stageName: '入境後 3 日內指定健康檢查',
          monthInterval: 0,
          dueDate: '2026-08-04',
          status: 'pending',
          requiredItems: ['胸部X光', '腸寄生蟲', '傷寒', '身體檢查'],
          note: '即將入境，請準備體檢事項'
        },
        {
          id: `hc-${Date.now()}-2`,
          stageName: '入境滿 6 個月定期健康檢查',
          monthInterval: 6,
          dueDate: '2027-02-01',
          status: 'upcoming',
          requiredItems: ['胸部X光', '腸寄生蟲', '身體檢查']
        }
      ],
      workflowSteps: [
        {
          id: `wf-${Date.now()}-1`,
          stepNumber: 1,
          title: '勞動部初次招募許可函核發',
          subtitle: '取得配額',
          description: '已向勞動部取得外籍家庭看護工招募許可。',
          status: 'completed',
          responsibleParty: '勞動部'
        }
      ],
      documents: [
        {
          id: `doc-${Date.now()}-1`,
          title: '外籍家庭看護工標準勞動契約書',
          type: 'employment_contract',
          categoryName: '勞動合約',
          description: '新聘看護工基本薪資與膳宿特別規定',
          status: 'pending_signature',
          createdAt: new Date().toISOString().split('T')[0],
          signDeadline: '2026-08-15',
          fileSize: '1.1 MB',
          summaryBulletPoints: ['基本薪資 $20,000 元/月', '每週休假一日']
        }
      ]
    };

    onAddCaregiver(newCg);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-teal-100 text-teal-700 rounded-lg">
              <UserPlus className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">登記新外籍看護工</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">看護工姓名：</label>
            <input
              type="text"
              required
              placeholder="例：阿蒂 (Ayu Pratiwi)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">國籍：</label>
            <select
              value={nationality}
              onChange={(e) => setNationality(e.target.value as any)}
              className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500"
            >
              <option value="印尼 (Indonesia)">印尼 (Indonesia)</option>
              <option value="越南 (Vietnam)">越南 (Vietnam)</option>
              <option value="菲律賓 (Philippines)">菲律賓 (Philippines)</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">被照顧者姓名：</label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-slate-700 block mb-1">護照號碼：</label>
              <input
                type="text"
                value={passportNumber}
                onChange={(e) => setPassportNumber(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">居留證號 (ARC)：</label>
              <input
                type="text"
                value={arcNumber}
                onChange={(e) => setArcNumber(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md"
            >
              確認新增並載入健檢時程
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
