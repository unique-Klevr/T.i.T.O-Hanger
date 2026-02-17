
import { GoogleGenAI, Type } from "@google/genai";
import { AppState } from "../types";

export const analyzeCampaign = async (state: AppState) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const prompt = `
    Analyze this lawn care marketing data and provide 3 actionable insights for the business owner.
    Data:
    Total Drops: ${state.drops.length}
    Successful Drops: ${state.drops.filter(d => d.status === 'dropped').length}
    Skipped Houses: ${state.drops.filter(d => d.status === 'skipped').length}
    Leads: ${state.leads.length}
    
    Format the response as JSON with an array of "insights", each having a "title" and "description".
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            insights: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Analysis failed:", error);
    return null;
  }
};
