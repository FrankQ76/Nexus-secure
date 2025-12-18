
import { GoogleGenAI, Type } from "@google/genai";
import { Message } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getSmartSummary = async (messages: Message[]): Promise<string> => {
  const history = messages
    .filter(m => m.sender !== 'ai')
    .map(m => `${m.sender}: ${m.text}`)
    .join('\n');

  if (!history) return "No conversation history to summarize.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Summarize this chat conversation concisely:\n\n${history}`,
      config: {
        systemInstruction: "You are a helpful assistant providing brief, bulleted summaries of peer-to-peer conversations.",
        temperature: 0.7,
      },
    });
    return response.text || "Failed to generate summary.";
  } catch (error) {
    console.error("Gemini summary error:", error);
    return "Error generating summary.";
  }
};

export const getSmartReplySuggestions = async (messages: Message[]): Promise<string[]> => {
  const lastMessages = messages.slice(-5).map(m => `${m.sender}: ${m.text}`).join('\n');
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on this conversation, suggest 3 short, natural reply suggestions for 'me'.\n\n${lastMessages}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["suggestions"]
        }
      },
    });
    const data = JSON.parse(response.text || '{"suggestions": []}');
    return data.suggestions || [];
  } catch (error) {
    console.error("Gemini suggestions error:", error);
    return [];
  }
};
