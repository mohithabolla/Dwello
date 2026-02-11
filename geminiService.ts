
import { GoogleGenAI, Type } from "@google/genai";

// Initialize GoogleGenAI client with required named parameter and direct environment variable access
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSocialContent = async (topic: string, platform: string, language: string = 'English') => {
  const ai = getAI();
  const prompt = `Generate a ${platform} post about ${topic} in ${language}. Include relevant hashtags and emojis for a construction/architecture context.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      systemInstruction: 'You are a professional social media manager for top-tier architectural and construction firms.'
    }
  });
  
  // Accessing text as a property as per latest SDK guidelines
  return response.text;
};

export const generateProjectPlan = async (projectData: any) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Create a detailed construction project plan for: ${JSON.stringify(projectData)}`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          estimatedBudgetBreakdown: { type: Type.ARRAY, items: { type: Type.STRING } },
          riskAnalysis: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendedTimelineWeeks: { type: Type.NUMBER },
          milestones: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                durationDays: { type: Type.NUMBER },
                requiredMaterials: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ['name', 'durationDays']
            }
          }
        },
        required: ['estimatedBudgetBreakdown', 'milestones']
      }
    }
  });
  
  return JSON.parse(response.text || '{}');
};
