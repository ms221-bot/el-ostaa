
import { GoogleGenAI } from "@google/genai";

// Fix: Use process.env.API_KEY directly as per the @google/genai coding guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAISupportResponse = async (userPrompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userPrompt,
      config: {
        systemInstruction: "أنت مساعد ذكي لمنصة 'الأسطى'. ساعد المستخدمين في تشخيص مشاكلهم المنزلية واقتراح الخدمة المناسبة لهم باللغة العربية. كن ودوداً ومختصراً.",
      },
    });
    // Fix: Access the .text property directly (not a method) from GenerateContentResponse.
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "عذراً، حدث خطأ في الاتصال بالمساعد الذكي. يرجى المحاولة لاحقاً.";
  }
};
