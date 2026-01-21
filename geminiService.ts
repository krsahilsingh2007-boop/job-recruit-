
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini client with apiKey from environment variables as required.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateJobDescription = async (title: string, company: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a professional job description for a ${title} position at ${company}. Keep it concise with sections for Role, Responsibilities, and Requirements.`,
    });
    return response.text || "Failed to generate description.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating content. Please try manual entry.";
  }
};

export const getResumeFeedback = async (summary: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Acting as a professional recruiter, provide 3 actionable tips to improve this candidate summary: "${summary}"`,
    });
    return response.text || "No feedback available.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Could not generate AI tips.";
  }
};

export const chatWithAssistant = async (message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: "You are a professional AI Career Assistant for JobPortal. Your goal is to help users with job searches, resume improvements, interview preparation, and general career advice. Keep your responses concise, encouraging, and professional. If a user asks about the website, tell them you can help find jobs or build profiles.",
        maxOutputTokens: 500,
        temperature: 0.7,
      }
    });
    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Assistant Error:", error);
    return "I'm having trouble connecting right now. Please try again in a moment.";
  }
};
