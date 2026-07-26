import React, { useState } from 'react';
import { ForeignCaregiver } from '../types';
import { Bot, Send, Languages, BookOpen, Sparkles, Copy, Check, MessageSquare, ShieldCheck, HeartPulse, ArrowRight } from 'lucide-react';

interface AiAssistantModuleProps {
  caregiver: ForeignCaregiver;
}

export const AiAssistantModule: React.FC<AiAssistantModuleProps> = ({ caregiver }) => {
  const [activeTab, setActiveTab] = useState<'legal_qa' | 'translation'>('translation');
  
  // Q&A State
  const [qaPrompt, setQaPrompt] = useState('');
  const [qaLoading, setQaLoading] = useState(false);
  const [qaHistory, setQaHistory] = useState<Array<{ question: string; answer: string; time: string }>>([
    {
      question: '請問滿 18 個月定期體檢如果逾期會有什麼法律處分？',
      answer: '依據《就業服務法》第 57 條第 5 款規定，雇主未安排外籍看護工於指定期限內接受健康檢查者，可處新臺幣 6 萬元以上 30 萬元以下罰鍰。若經通知限期補正而逾期未辦理，勞動部得廢止雇主聘僱許可。建議您立即使用系統特約醫院預約功能排定體檢！',
      time: '10:15'
    }
  ]);

  // Translation Card State
  const [instructionInput, setInstructionInput] = useState('');
  const [targetLang, setTargetLang] = useState<'印尼語' | '越南語' | '他加祿語 (菲律賓)'>(
    caregiver.nationalityCode === 'ID' ? '印尼語' : caregiver.nationalityCode === 'VN' ? '越南語' : '他加祿語 (菲律賓)'
  );
  const [translateLoading, setTranslateLoading] = useState(false);
  const [translatedResult, setTranslatedResult] = useState<{
    chineseSummary?: string;
    targetLanguageName?: string;
    translatedText?: string;
    pronunciationGuide?: string;
    keyCareTips?: string[];
  } | null>({
    chineseSummary: '張老太太下午 2 點需要服降血壓藥，吃完請協助測量血壓並記錄於護理表',
    targetLanguageName: 'Indonesian (印尼語)',
    translatedText: 'Nenek Chang perlu minum obat darah tinggi jam 2 siang. Setelah minum obat, tolong bantu ukur tekanan darah dan catat di formulir perawatan.',
    pronunciationGuide: 'Nenek Chang per-lu mi-num o-bat da-rah ting-gi jam dua si-ang...',
    keyCareTips: ['請確認搭配溫開水服藥', '血壓高於 140/90 請立即傳訊息通知張先生']
  });

  const [copied, setCopied] = useState(false);

  // Quick Preset Care Commands
  const presets = [
    { label: '💊 飯後服藥與記錄', text: `請阿嬤（被照顧者）在吃完飯半小時後吃這包黃色藥包，吃完藥請幫她量體體溫與血壓並上記錄簿。` },
    { label: '🩺 安排醫院體檢', text: `我們明天早上 8 點需要去台北市立聯合醫院做定期健康檢查，請帶好護照、居留證和水壺。` },
    { label: '🚶 陪同下午散步', text: `今天下午 4 點天氣很好，請幫阿嬤穿上薄外套，推輪椅帶她到附近公園散步 30 分鐘。` },
    { label: '🛌 協助翻身與伸展', text: `每 2 個小時請協助阿嬤翻身拍背，並幫她的手腳做 10 分鐘溫和伸展運動。` }
  ];

  const handleAskLegalQa = async (queryToAsk?: string) => {
    const textToSubmit = queryToAsk || qaPrompt;
    if (!textToSubmit.trim() || qaLoading) return;

    setQaLoading(true);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'legal_qa', prompt: textToSubmit })
      });

      const data = await res.json();
      if (data.success) {
        setQaHistory((prev) => [
          ...prev,
          { question: textToSubmit, answer: data.answer, time: timeStr }
        ]);
        setQaPrompt('');
      } else {
        alert(data.error || 'AI 回覆生成失敗');
      }
    } catch (e) {
      console.error('API Error:', e);
      alert('無法連接 AI 服務，請確認網路連線');
    } finally {
      setQaLoading(false);
    }
  };

  const handleTranslateInstruction = async (textToTranslate?: string) => {
    const textToSubmit = textToTranslate || instructionInput;
    if (!textToSubmit.trim() || translateLoading) return;

    setTranslateLoading(true);

    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'translation',
          chineseInstruction: textToSubmit,
          targetLanguage: targetLang
        })
      });

      const data = await res.json();
      if (data.success && data.data) {
        setTranslatedResult(data.data);
      } else {
        alert(data.error || '翻譯生成失敗');
      }
    } catch (e) {
      console.error('API Error:', e);
      alert('無法連接 AI 翻譯服務');
    } finally {
      setTranslateLoading(false);
    }
  };

  const handleTypewriterClick = (selectedText: string) => {
    if (selectedText.includes('翻譯') || selectedText.includes('服降血壓藥') || selectedText.includes('照護') || selectedText.includes('散步')) {
      setActiveTab('translation');
      const cleanText = selectedText.replace(/^[🤖💬💡✨]\s*(多國語言助手|雙語溝通卡|AI智囊|AI 智囊)：/g, '').trim();
      setInstructionInput(cleanText);
      handleTranslateInstruction(cleanText);
    } else {
      setActiveTab('legal_qa');
      const cleanText = selectedText.replace(/^[🤖💬💡✨]\s*(雇主智囊|AI智囊|AI 智囊)：/g, '').trim();
      setQaPrompt(cleanText);
      handleAskLegalQa(cleanText);
    }
  };

  const handleCopyResult = () => {
    if (!translatedResult) return;
    const textToCopy = `【雇主照護指示 - ${translatedResult.targetLanguageName}】\n${translatedResult.translatedText}\n\n(中文：${translatedResult.chineseSummary})`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Header with Dynamic Typewriter Button */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-indigo-800/50 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Powered by Gemini 3.6 AI
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">
              AI 雇主智囊與多國語言溝通助手
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              即時解答台灣外籍看護工聘僱法規、就業安定費與健檢規範，並提供印尼語/越南語/他加祿語雙語照護指令翻譯卡！
            </p>
          </div>

          {/* Module Nav Tabs */}
          <div className="flex bg-slate-800/90 p-1.5 rounded-xl border border-slate-700">
            <button
              onClick={() => setActiveTab('translation')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'translation'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Languages className="w-4 h-4" /> 雙語照護指令卡
            </button>
            <button
              onClick={() => setActiveTab('legal_qa')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'legal_qa'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" /> 法規與健檢諮詢
            </button>
          </div>
        </div>

        {/* Slide-in Hover Action Buttons for AI Assistant & Multilingual Translation */}
        <div className="pt-3 border-t border-indigo-900/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-indigo-300 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> 滑入浮現快捷諮詢與雙語翻譯：
            </span>
            <span className="text-[11px] text-indigo-400/80 hidden sm:inline">滑鼠移入浮現效果 ‧ 點擊帶入 AI 諮詢</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {[
              {
                type: 'legal',
                badge: '雇主智囊',
                icon: <Bot className="w-3.5 h-3.5 text-indigo-300" />,
                title: '體檢逾期處分？',
                prompt: '滿 18 個月定期體檢逾期會有何法律處分與罰鍰？'
              },
              {
                type: 'trans',
                badge: '語言助手',
                icon: <Languages className="w-3.5 h-3.5 text-teal-300" />,
                title: '服藥測量血壓卡',
                prompt: '請阿嬤下午 2 點服降血壓藥，並記錄血壓於護理表'
              },
              {
                type: 'legal',
                badge: '雇主智囊',
                icon: <BookOpen className="w-3.5 h-3.5 text-amber-300" />,
                title: '加班費計算標準',
                prompt: '家庭看護工例假日加班費與休假標準如何計算？'
              },
              {
                type: 'trans',
                badge: '語言助手',
                icon: <Sparkles className="w-3.5 h-3.5 text-rose-300" />,
                title: '醫院體檢通知卡',
                prompt: '明天早上 8 點需要去台北市立聯合醫院做定期體檢'
              }
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (item.type === 'legal') {
                    setActiveTab('legal_qa');
                    setQaPrompt(item.prompt);
                    handleAskLegalQa(item.prompt);
                  } else {
                    setActiveTab('translation');
                    setInstructionInput(item.prompt);
                    handleTranslateInstruction(item.prompt);
                  }
                }}
                className="group relative bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-700/50 hover:border-indigo-400/80 rounded-xl p-2.5 text-left transition-all duration-300 ease-out transform hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/20 cursor-pointer flex items-center justify-between gap-2 overflow-hidden"
              >
                {/* Slide-in shine backdrop highlight */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none transform -translate-x-full group-hover:translate-x-full duration-1000 ease-in-out" />

                <div className="space-y-0.5 min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-800/80 text-indigo-200 border border-indigo-600/40">
                      {item.badge}
                    </span>
                    <span className="text-xs font-bold text-white truncate group-hover:text-indigo-200 transition-colors">
                      {item.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-indigo-300/80 truncate">
                    {item.prompt}
                  </p>
                </div>

                <div className="p-1.5 rounded-lg bg-indigo-800/50 text-indigo-300 group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:translate-x-0.5 flex-shrink-0">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab 1: Bilingual Care Instructions Translator */}
      {activeTab === 'translation' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Column: Input & Quick Presets */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Languages className="w-5 h-5 text-indigo-600" /> 輸入中文照護指示
              </h3>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-500">看護母語：</span>
                <select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value as any)}
                  className="text-xs bg-slate-100 font-bold text-slate-800 rounded-lg px-2.5 py-1 border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="印尼語">印尼語 (Indonesian)</option>
                  <option value="越南語">越南語 (Vietnamese)</option>
                  <option value="他加祿語 (菲律賓)">他加祿語 (Tagalog)</option>
                </select>
              </div>
            </div>

            <div>
              <textarea
                rows={4}
                placeholder="例如：請阿嬤下午 2 點吃降血壓藥，吃完請幫她量血壓並記在表格上。"
                value={instructionInput}
                onChange={(e) => setInstructionInput(e.target.value)}
                className="w-full text-xs p-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 focus:outline-none text-slate-800 leading-relaxed"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => handleTranslateInstruction()}
                disabled={translateLoading || !instructionInput.trim()}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md flex items-center gap-2 transition ${
                  translateLoading || !instructionInput.trim()
                    ? 'bg-slate-300 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'
                }`}
              >
                {translateLoading ? (
                  <>AI 生成翻譯中...</>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> 生成雙語卡片
                  </>
                )}
              </button>
            </div>

            {/* Quick Presets */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <span className="text-xs font-bold text-slate-600 block">常用照護指令快速範本：</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {presets.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInstructionInput(p.text);
                      handleTranslateInstruction(p.text);
                    }}
                    className="p-2.5 text-left bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-300 rounded-xl transition text-xs text-slate-700 font-medium group"
                  >
                    <span className="font-bold text-indigo-700 block mb-0.5">{p.label}</span>
                    <span className="text-[11px] text-slate-500 line-clamp-2">{p.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: AI Translation Card Output */}
          <div>
            {translatedResult ? (
              <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> {translatedResult.targetLanguageName || targetLang} 雙語對照照護卡
                  </span>

                  <button
                    onClick={handleCopyResult}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1 transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? '已複製！' : '複製給看護'}</span>
                  </button>
                </div>

                {/* Translation Display */}
                <div className="space-y-3">
                  <div className="p-4 bg-slate-800/90 rounded-xl border border-slate-700/80">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      {translatedResult.targetLanguageName} (看護母語):
                    </span>
                    <p className="text-sm font-semibold text-teal-300 leading-relaxed">
                      {translatedResult.translatedText}
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
                    <span className="text-[11px] font-bold text-slate-400 block mb-1">原始中文意思：</span>
                    <p className="text-slate-200">{translatedResult.chineseSummary}</p>
                  </div>

                  {translatedResult.pronunciationGuide && (
                    <div className="p-3 bg-slate-800/50 rounded-xl text-xs text-slate-400">
                      <span className="font-semibold text-indigo-300 block mb-0.5">發音/念法提示：</span>
                      {translatedResult.pronunciationGuide}
                    </div>
                  )}

                  {translatedResult.keyCareTips && translatedResult.keyCareTips.length > 0 && (
                    <div className="pt-2">
                      <span className="text-xs font-bold text-slate-300 block mb-1">注意事項提示：</span>
                      <ul className="space-y-1 text-xs text-amber-300">
                        {translatedResult.keyCareTips.map((tip, idx) => (
                          <li key={idx} className="flex items-center gap-1">
                            <span>•</span> {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="pt-2 text-[11px] text-slate-500 text-center">
                  可直接點擊複製傳送至 LINE / WhatsApp 與外籍看護溝通
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center text-slate-400 space-y-2">
                <Languages className="w-10 h-10 mx-auto text-slate-300" />
                <p className="font-medium text-sm">輸入中文指示後點擊「生成雙語卡片」</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Tab 2: Taiwan Labor Laws & Health Check Legal Q&A */}
      {activeTab === 'legal_qa' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" /> 台灣外籍看護工聘僱法規與健檢 Q&A
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              可詢問：健檢逾期處理、滿期續聘流程、休假加班費計算、就業安定費繳納、轉換雇主等議題。
            </p>
          </div>

          {/* Q&A Chat History */}
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {qaHistory.map((item, idx) => (
              <div key={idx} className="space-y-2 text-xs">
                {/* Question Bubble */}
                <div className="flex justify-end">
                  <div className="bg-indigo-600 text-white p-3 rounded-2xl rounded-tr-none max-w-lg shadow-sm">
                    <p className="font-medium">{item.question}</p>
                    <span className="text-[10px] text-indigo-200 block text-right mt-1">{item.time}</span>
                  </div>
                </div>

                {/* Answer Bubble */}
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-indigo-400 flex items-center justify-center font-bold flex-shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-slate-100 border border-slate-200/80 p-3.5 rounded-2xl rounded-tl-none max-w-xl text-slate-800 leading-relaxed shadow-sm">
                    <p className="whitespace-pre-line">{item.answer}</p>
                  </div>
                </div>
              </div>
            ))}

            {qaLoading && (
              <div className="flex items-center space-x-2 text-xs text-slate-500 py-2">
                <Bot className="w-4 h-4 animate-spin text-indigo-600" />
                <span>AI 顧問正在檢視勞動部與衛福部最新規定並撰寫回覆...</span>
              </div>
            )}
          </div>

          {/* Quick FAQ Question Buttons */}
          <div className="pt-3 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-600 block mb-2">雇主常見熱門問題：</span>
            <div className="flex flex-wrap gap-2">
              {[
                '看護工每週休假加班費怎麼算？',
                '滿期續聘跟直聘流程要多久？',
                '就業安定費何時扣繳與免繳條件？',
                '體檢不合格有幾天複檢時間？'
              ].map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleAskLegalQa(q)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-xs font-medium rounded-xl border border-slate-200 transition"
                >
                  💬 {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <div className="flex gap-2 pt-2">
            <input
              type="text"
              placeholder="輸入您的聘僱或健檢法規疑問..."
              value={qaPrompt}
              onChange={(e) => setQaPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAskLegalQa()}
              className="flex-1 text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 focus:outline-none"
            />
            <button
              onClick={() => handleAskLegalQa()}
              disabled={qaLoading || !qaPrompt.trim()}
              className={`px-4 py-3 rounded-xl text-xs font-bold text-white transition flex items-center gap-1 ${
                qaLoading || !qaPrompt.trim()
                  ? 'bg-slate-300 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              <Send className="w-4 h-4" /> 提問
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
