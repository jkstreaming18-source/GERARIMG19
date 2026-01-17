
import { GoogleGenAI } from "@google/genai";

const MODEL_NAME = 'gemini-2.5-flash-image';

export const generateAIImage = async (
  prompt: string, 
  presetId: string, 
  mode: 'create' | 'edit',
  base64Image1?: string,
  base64Image2?: string
): Promise<string> => {
  // Fix: Always use process.env.API_KEY directly when initializing the GoogleGenAI instance
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let finalPrompt = prompt;
  
  // Apply preset context
  switch (presetId) {
    case 'sticker': finalPrompt = `Sticker/figure of: ${prompt}. Clean white background, high quality vector style.`; break;
    case 'text': finalPrompt = `Professional logo design of: ${prompt}. Modern, clean, professional aesthetics.`; break;
    case 'comic': finalPrompt = `Comic book drawing style: ${prompt}. Vibrant colors, ink outlines, dynamic composition.`; break;
    case 'retouch': finalPrompt = `Retouch and enhance this image: ${prompt}. High resolution, natural lighting.`; break;
    case 'style': finalPrompt = `Apply a unique artistic style to this image based on: ${prompt}.`; break;
    case 'compose': finalPrompt = `Artistically merge and blend these two images together based on: ${prompt}. Smooth transition.`; break;
  }

  const parts: any[] = [{ text: finalPrompt }];
  
  if (base64Image1) {
    parts.push({
      inlineData: {
        data: base64Image1.split(',')[1] || base64Image1,
        mimeType: 'image/png'
      }
    });
  }
  
  if (base64Image2) {
    parts.push({
      inlineData: {
        data: base64Image2.split(',')[1] || base64Image2,
        mimeType: 'image/png'
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: { parts },
    });

    let imageUrl = '';
    
    // Look for image part in candidates
    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
      // Fix: Iterate through all parts to find the image part as per SDK best practices
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!imageUrl) {
      throw new Error("A IA não retornou uma imagem válida.");
    }

    return imageUrl;
  } catch (error: any) {
    console.error("Gemini Image API Error:", error);
    throw error;
  }
};
