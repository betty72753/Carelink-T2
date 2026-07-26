import React, { useState, useEffect } from 'react';
import { ForeignCaregiver, HealthCheckRecord } from '../types';
import { TAIWAN_HEALTH_CHECK_HOSPITALS } from '../data/mockData';
import { HeartPulse, CheckCircle2, Clock, AlertTriangle, Calendar, Building2, MapPin, Phone, Upload, Download, Send, FileCheck2 } from 'lucide-react';
import { sendWebPushNotification } from '../utils/pushNotification';
import { TypewriterButton } from './TypewriterButton';
import { MouseInteractiveNotification } from './MouseInteractiveNotification';

interface HealthCheckModuleProps {
  caregiver: ForeignCaregiver;
  onUpdateHealthCheckStatus: (recordId: string, status: 'completed' | 'pending', hospital?: string, note?: string) => void;
}

export const HealthCheckModule: React.FC<HealthCheckModuleProps> = ({
  caregiver,
  onUpdateHealthCheckStatus,
}) => {
  const [selectedHospital, setSelectedHospital] = useState(TAIWAN_HEALTH_CHECK_HOSPITALS[0]);
  const [showAppointmentModal, setShowAppointmentModal] = useState<HealthCheckRecord | null>(null);
  const [showUploadModal, setShowUploadModal] = useState<HealthCheckRecord | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [customNote, setCustomNote] = useState('');

  // Count-up animation state for 21 days countdown & progress ring
  const [daysCount, setDaysCount] = useState(0);
  const [ringProgress, setRingProgress] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = 21;
    const duration = 1000;
    const intervalTime = Math.floor(duration / end);

    const timer = setInterval(() => {
      start += 1;
      setDaysCount(start);
      setRingProgress((start / end) * 70); // 70% ring gauge
      if (start >= end) {
        clearInterval(timer);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  const getStatusBadge = (check: HealthCheckRecord) => {
    switch (check.status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 已完成體檢
          </span>
        );
      case 'pending':
        return (
          <TypewriterButton
            isRedBoldAlert={true}
            badgeText="健檢警示"
            icon={<AlertTriangle className="w-3.5 h-3.5 text-red-600 animate-pulse" />}
            sequences={[
              `⚠️ 健檢警示：${check.stageName} (倒數期限中！)`,
              `⚠️ 健檢警示：未依法辦理體檢最高罰鍰 30 萬元！`,
              `⚠️ 健檢警示：點擊立即預約衛福部特約醫院`
            ]}
            onClick={() => setShowAppointmentModal(check)}
          />
        );
      case 'overdue':
        return (
          <TypewriterButton
            isRedBoldAlert={true}
            badgeText="健檢警示"
            icon={<AlertTriangle className="w-3.5 h-3.5 text-red-600 animate-bounce" />}
            sequences={[
              `⚠️ 健檢警示：${check.stageName} 已逾期！請速處理`,
              `⚠️ 健檢警示：勞動部得廢止聘僱許可，請立即補辦！`
            ]}
            onClick={() => setShowAppointmentModal(check)}
          />
        );
      case 'upcoming':
        return (
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-full border border-slate-200">
            <Clock className="w-3.5 h-3.5 text-slate-400" /> 尚未到期
          </span>
        );
    }
  };

  const handleSendReminderPush = (record: HealthCheckRecord) => {
    const title = `🩺 健檢推播提醒：${caregiver.name} ${record.stageName}`;
    const body = `體檢截止日為 ${record.dueDate}。法定檢驗包含胸部X光及寄生蟲檢查，請帶居留證、護照及體檢費前往特約醫院。`;
    sendWebPushNotification(title, { body });
    alert(`已模擬發送手機與電腦推播通知：\n【${title}】\n${body}`);
  };

  const handleCompleteUpload = () => {
    if (showUploadModal) {
      onUpdateHealthCheckStatus(
        showUploadModal.id,
        'completed',
        selectedHospital.name,
        customNote || `體檢完成（報告已上傳，合規）`
      );
      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
        setShowUploadModal(null);
      }, 1500);
    }
  };

  const urgentHc = caregiver.healthChecks.find((h) => h.status === 'pending' || h.status === 'overdue');

  return (
    <div className="space-y-6">
      
      {/* Top Banner Overview with Red Bold Typewriter Alert Button */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden border border-teal-800/50 space-y-4">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-300 text-xs font-semibold px-3 py-1 rounded-full border border-teal-500/30">
              <HeartPulse className="w-3.5 h-3.5 text-teal-400" /> 衛福部疾管署與勞動部規定法定義務
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">
              {caregiver.name} ‧ 定期健康檢查時間表
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              根據《外國人健康檢查指定醫院應行注意事項》，外籍看護工須於入境 3 日內、滿 6 個月、滿 18 個月及滿 30 個月接受定期健康檢查。本系統提供自動倒數提醒與特約醫院預約。
            </p>
          </div>

          <div className="bg-slate-800/90 border border-slate-700 p-4 rounded-xl flex items-center space-x-4 min-w-[260px] shadow-inner relative overflow-hidden group">
            {/* SVG Circular Ring Gauge with animated stroke offset */}
            <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
              <svg className="w-14 h-14 transform -rotate-90">
                <circle
                  cx="28"
                  cy="28"
                  r="22"
                  className="text-slate-700 stroke-current"
                  strokeWidth="4"
                  fill="transparent"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="22"
                  className="text-teal-400 stroke-current transition-all duration-1000 ease-out"
                  strokeWidth="4"
                  strokeDasharray={138.2}
                  strokeDashoffset={138.2 - (138.2 * (ringProgress / 100))}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-extrabold text-teal-300 text-sm">
                18M
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-400">當前急需處置體檢</div>
              <div className="text-sm font-bold text-amber-300">入境滿 18 個月定期健檢</div>
              <div className="text-xs text-teal-300 font-bold flex items-center gap-1.5 mt-0.5">
                <span>截止日：2026/08/15</span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-extrabold border border-amber-500/40 animate-breathing">
                  倒數 {daysCount} 天
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Red Bold Typewriter Alert Button for Health Check Warning */}
        {urgentHc && (
          <div className="pt-3 border-t border-teal-800/60 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-bold text-red-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-500 animate-bounce" /> 衛福部/勞動部合規告警：
            </span>

            <TypewriterButton
              isRedBoldAlert={true}
              badgeText="健檢警示按鈕"
              icon={<AlertTriangle className="w-4 h-4 text-red-600 animate-pulse" />}
              sequences={[
                `⚠️ 健檢警示：【${caregiver.name}】${urgentHc.stageName} 倒數辦理中！`,
                `⚠️ 健檢警示：雇主未依限辦理外籍看護健檢，最高可處罰鍰 30 萬元！`,
                `⚠️ 健檢警示：逾期未補辦經通知，勞動部得廢止雇主聘僱許可！`,
                `⚠️ 健檢警示：點擊立即預約衛福部指定雙北特約醫院`
              ]}
              onClick={() => setShowAppointmentModal(urgentHc)}
              className="w-full sm:w-auto"
            />
          </div>
        )}
      </div>

      {/* Health Check Timeline Schedule Cards with Elevate on Hover */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {caregiver.healthChecks.map((check) => (
          <div
            key={check.id}
            className={`group rounded-2xl border p-5 transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-xl ${
              check.status === 'pending'
                ? 'bg-amber-50/50 border-amber-300 ring-2 ring-amber-400/20 shadow-md hover:border-amber-400'
                : check.status === 'completed'
                ? 'bg-white border-emerald-200/90 hover:border-emerald-400 shadow-sm'
                : 'bg-white border-slate-200 opacity-90 hover:border-slate-300 shadow-sm'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    第 {check.monthInterval === 0 ? '0 (入境3天)' : `${check.monthInterval} 個月`}
                  </span>
                  {getStatusBadge(check)}
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-2">{check.stageName}</h3>
              </div>

              {/* Push Notification Button with Mouse Interactive & Airplane 45-degree slide animation */}
              <MouseInteractiveNotification
                onClick={() => handleSendReminderPush(check)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 text-slate-500 hover:text-teal-700 border border-slate-200 group/btn transition-all"
                title="滑鼠互動：發送測試推播通知至手機與電腦"
                glowColor="rgba(20, 184, 166, 0.4)"
              >
                <div className="p-1 flex items-center gap-1 text-xs font-semibold">
                  <Send className="w-3.5 h-3.5 text-teal-600 transition-transform duration-300 ease-out group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                  <span className="hidden sm:inline">推播</span>
                </div>
              </MouseInteractiveNotification>
            </div>

            <div className="mt-4 space-y-2 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Calendar className="w-3.5 h-3.5" /> 法定截止日期：
                </span>
                <span className="font-bold text-slate-900">{check.dueDate}</span>
              </div>

              {check.completedDate && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 完成體檢日期：
                  </span>
                  <span className="font-semibold text-emerald-700">{check.completedDate}</span>
                </div>
              )}

              {check.hospitalName && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Building2 className="w-3.5 h-3.5" /> 指定醫療院所：
                  </span>
                  <span className="font-medium text-slate-800">{check.hospitalName}</span>
                </div>
              )}
            </div>

            {/* Required Examination Items List */}
            <div className="mt-3 pt-3 border-t border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">必要檢查項目：</span>
              <div className="flex flex-wrap gap-1.5">
                {check.requiredItems.map((item, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200"
                  >
                    ✓ {item}
                  </span>
                ))}
              </div>
            </div>

            {check.note && (
              <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                {check.note}
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              {check.status === 'pending' && (
                <>
                  <button
                    onClick={() => setShowAppointmentModal(check)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-sm transition flex items-center gap-1"
                  >
                    <Building2 className="w-3.5 h-3.5" /> 預約體檢醫院
                  </button>

                  <button
                    onClick={() => setShowUploadModal(check)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition flex items-center gap-1"
                  >
                    <Upload className="w-3.5 h-3.5" /> 上傳體檢報告
                  </button>
                </>
              )}

              {check.status === 'completed' && (
                <button
                  onClick={() => alert(`體檢合格證明已存檔至系統資料庫（核備文號可於勞動部資訊系統查詢）。`)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center gap-1"
                >
                  <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" /> 查看核備報告
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Hospital Appointment Assistant & Hospital Finder */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-teal-600" /> 衛福部指定外籍勞工體檢特約醫院
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              雇主可自由選擇雙北地區合規特約醫院進行體檢，體檢當日請攜帶：1.居留證/護照 2.大頭照2張 3.健檢費用（約 $1,200~$1,500元）
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TAIWAN_HEALTH_CHECK_HOSPITALS.map((hosp, i) => (
            <div
              key={i}
              onClick={() => setSelectedHospital(hosp)}
              className={`p-4 rounded-xl border cursor-pointer transition ${
                selectedHospital.name === hosp.name
                  ? 'bg-teal-50/70 border-teal-500 ring-2 ring-teal-500/20'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-md">
                  {hosp.city}
                </span>
                <span className="text-xs text-slate-400">公立特約</span>
              </div>

              <h4 className="font-bold text-slate-900 text-sm mt-2">{hosp.name}</h4>

              <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{hosp.address}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <a href={`tel:${hosp.phone}`} className="text-teal-600 font-semibold hover:underline">
                    {hosp.phone}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Appointment Modal */}
      {showAppointmentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-600" /> 預約體檢單據導出與紀錄
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              您選擇為 <strong className="text-slate-900">{caregiver.name}</strong> 安排【{showAppointmentModal.stageName}】：
            </p>

            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-2 text-xs">
              <div><strong className="text-slate-700">預約醫療院所：</strong> {selectedHospital.name}</div>
              <div><strong className="text-slate-700">醫院地址：</strong> {selectedHospital.address}</div>
              <div><strong className="text-slate-700">預約諮詢專線：</strong> {selectedHospital.phone}</div>
              <div><strong className="text-slate-700">體檢應備文件：</strong> 移工居留證(ARC)、護照正本、大頭照2張</div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowAppointmentModal(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-medium"
              >
                取消
              </button>
              <button
                onClick={() => {
                  alert(`已成功為 ${caregiver.name} 下載【${selectedHospital.name} 體檢通知與預約憑證 PDF】！`);
                  setShowAppointmentModal(null);
                }}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> 下載體檢通知預約單 (PDF)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Report Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Upload className="w-5 h-5 text-emerald-600" /> 上傳體檢合格報告備查
            </h3>

            {uploadSuccess ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <p className="font-bold text-slate-900">體檢合格紀錄已成功登錄！</p>
                <p className="text-xs text-slate-500">系統已同步自動更新雇主管理進度。</p>
              </div>
            ) : (
              <>
                <p className="text-xs text-slate-600">
                  請拍照或掃描特約醫院開立之「外國人健檢合格證明書」，系統將自動同步備查至勞動部系統：
                </p>

                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-teal-500 hover:bg-teal-50/30 transition cursor-pointer">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700">點擊或將體檢報告檔案拖曳至此處</p>
                  <p className="text-[11px] text-slate-400 mt-1">支援 JPG, PNG, PDF 檔案（最大 10MB）</p>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">備註 / 文號（選填）：</label>
                  <input
                    type="text"
                    placeholder="例：北市衛醫字第 115009812 號合格"
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    onClick={() => setShowUploadModal(null)}
                    className="px-4 py-2 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-medium"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleCompleteUpload}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md"
                  >
                    確認儲存並更新狀態
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
