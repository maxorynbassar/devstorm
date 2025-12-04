import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { TransactionData, RiskAnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using 'gemini-2.5-flash' for speed and efficiency as per guidelines for text tasks
const MODEL_NAME = "gemini-2.5-flash"; 

export const analyzeTransaction = async (data: TransactionData): Promise<RiskAnalysisResult> => {
  try {
    const prompt = `
    Проанализируй следующую транзакцию на предмет мошенничества:
    
    - type: ${data.type}
    - amount: ${data.amount}
    - nameOrig: ${data.nameOrig}
    - oldbalanceOrg: ${data.oldbalanceOrg}
    - newbalanceOrig: ${data.newbalanceOrig}
    - nameDest: ${data.nameDest}
    - oldbalanceDest: ${data.oldbalanceDest}
    - newbalanceDest: ${data.newbalanceDest}
    - step: ${data.step}

    Используй формат ответа, описанный в системной инструкции. Обязательно оцени бизнес-эффект (денежный риск).
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.1, // Lower temperature for consistent risk assessment
      },
    });

    const text = response.text || "";
    
    // Naive parsing to extract structured data for UI, relying on text explanation for details
    // Ideally we would use JSON schema mode, but the prompt requirement asks for a specific text format output.
    // We will return the full raw text to display, but attempt to parse score for the UI.
    
    let riskScore = 0;
    let riskLevel: 'НИЗКИЙ' | 'СРЕДНИЙ' | 'ВЫСОКИЙ' = 'НИЗКИЙ';
    let verdict = "Неизвестно";
    let recommendedAction = "См. детальное описание";

    // Extract Risk Score: "fraud_score 0.87" or "fraud_score от 0 до 1... 0.87"
    const scoreMatch = text.match(/fraud_score.*?(\d+(\.\d+)?)/i);
    if (scoreMatch) {
      riskScore = parseFloat(scoreMatch[1]);
    }

    // Extract Risk Level
    if (text.toUpperCase().includes("ВЫСОКИЙ")) riskLevel = 'ВЫСОКИЙ';
    else if (text.toUpperCase().includes("СРЕДНИЙ")) riskLevel = 'СРЕДНИЙ';
    else riskLevel = 'НИЗКИЙ';

    // Extract Verdict (first line usually)
    const verdictMatch = text.match(/Вердикт:\s*(.*?)(?:\n|$)/i);
    if (verdictMatch) {
      verdict = verdictMatch[1].replace(/«|»|"/g, '').trim();
    }

    // Extract Action - Looking for "4. Рекомендуемое действие..."
    const actionMatch = text.match(/Рекомендуемое действие.*?:(.*?)(?:\n|$)/i) || text.match(/4\.\s*Рекомендуемое действие.*?:?\s*(.*?)(?:\n|$)/i);
    if (actionMatch) {
       let actionText = actionMatch[1].trim();
       if (!actionText) {
         // If the header is on one line and text on next, try to grab the next line
         const splitText = text.split(/4\.\s*Рекомендуемое действие.*?:/i);
         if (splitText.length > 1) {
            const nextPart = splitText[1].trim().split('\n')[0];
            if (nextPart) actionText = nextPart.replace(/^- /, '').trim();
         }
       }
       if (actionText) recommendedAction = actionText;
    }

    return {
      verdict,
      riskScore,
      riskLevel,
      explanation: [], // We will render markdown directly from rawResponse
      recommendedAction,
      rawResponse: text
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Не удалось проанализировать транзакцию. Проверьте API ключ.");
  }
};

export const sendChatMessage = async (history: {role: string, parts: {text: string}[]}[], message: string) => {
    try {
        const chat = ai.chats.create({
            model: MODEL_NAME,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
            },
            history: history,
        });

        const result = await chat.sendMessage({ message });
        return result.text;
    } catch (error) {
        console.error("Chat Error:", error);
        throw error;
    }
}