
import { GoogleGenAI, Type } from "@google/genai";
import { Todo, Suggestion } from "../types";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});


export async function getTaskSuggestions(existingTasks: Todo[]): Promise<Suggestion[]> {
  const taskContext = existingTasks.map(t => t.text).join(', ');
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Based on these current tasks: [${taskContext}], suggest 3-5 new, productive tasks. Return them in JSON format.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            category: { type: Type.STRING },
            priority: { type: Type.STRING, enum: ['low', 'medium', 'high'] }
          },
          required: ['text', 'category', 'priority']
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || '[]');
  } catch (e) {
    console.error("Failed to parse suggestions", e);
    return [];
  }
}

export async function getSubtasks(task: string): Promise<string[]> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Break down the task "${task}" into 4-6 actionable sub-tasks. Return them as a JSON array of strings.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });

  try {
    return JSON.parse(response.text || '[]');
  } catch (e) {
    console.error("Failed to parse subtasks", e);
    return [];
  }
}
