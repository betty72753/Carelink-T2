import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini Client
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set in environment variables");
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  };

  // API Endpoint: AI Foreign Caregiver Employer Assistant & Translator
  app.post("/api/ai-assistant", async (req, res) => {
    try {
      const { type, prompt, targetLanguage, chineseInstruction } = req.body;

      const ai = getGeminiClient();
      if (!ai) {
        return res.status(500).json({
          error: "API 金鑰未設定，請於 AI Studio Secrets 面板設定 GEMINI_API_KEY。"
        });
      }

      if (type === 'translation') {
        // Translation & Care Instruction Card
        const systemInstruction = `你是一位專業的「台灣外籍家庭看護工雇主與看護溝通助理」。
請將雇主輸入的繁體中文照護指令，翻譯為對應的外籍看護母語（印尼語 Indonesian / 越南語 Vietnamese / 菲律賓他加祿語 Tagalog）。
語氣必須友善、清晰、尊重大方，並標註時間、用藥或生活注意事項。
請輸出 JSON 格式：
{
  "chineseSummary": "原始中文說明",
  "targetLanguageName": "語言名稱",
  "translatedText": "翻譯後的目標語言文章/對話",
  "pronunciationGuide": "簡易羅馬拼音或念法提示",
  "keyCareTips": ["關鍵提示1", "關鍵提示2"]
}`;

        const userPrompt = `被照護對象說明與指令：
"${chineseInstruction || prompt}"
請翻譯為目標語言：${targetLanguage || '印尼語'}`;

        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: userPrompt,
          config: {
            systemInstruction,
            responseMimeType: "application/json"
          }
        });

        const responseText = response.text || "{}";
        const parsed = JSON.parse(responseText);
        return res.json({ success: true, data: parsed });
      } else {
        // General Employer Advisory (Taiwan Labor Laws, Health Check Rules, Contract Renewals)
        const systemInstruction = `你是一位精通台灣勞動部「外籍家庭看護工」聘僱法規、衛福部健康檢查規範、居留證ARC展延、巴氏量表評估及雇主管理實務的專業顧問 AI。
雇主會提出關於：健檢時程、合約續聘、薪資與加班費計算、就業安定費、休假與請假、疾病照顧溝通等問題。
請以溫暖、專業、條理分明的繁體中文回答雇主，適當使用列點說明，內容必須符合台灣現行外籍勞工勞動權益法規。`;

        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: prompt,
          config: {
            systemInstruction
          }
        });

        return res.json({ success: true, answer: response.text });
      }
    } catch (err: unknown) {
      console.error("Error in /api/ai-assistant:", err);
      const errorMessage = err instanceof Error ? err.message : "處理 AI 請求時發生未知錯誤";
      return res.status(500).json({ error: errorMessage });
    }
  });

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "Caregiver Employer Management Portal" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Caregiver Employer Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
