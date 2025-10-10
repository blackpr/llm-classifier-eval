import { generateObject } from 'ai';
import { z } from 'zod';
import { CATEGORIES } from '../config/models.js';
import { extractTokenUsage } from '../utils/token-usage.js';

const CLASSIFICATION_PROMPT = `You are a message classification API for Instashop, a grocery delivery service. 
Analyze the user's message and categorize it based on its content and intent. 
Respond ONLY with a valid JSON object containing the category.
User Message: "{message}"`;

export async function classifyMessage(model, modelName, message) {
  try {
    const result = await generateObject({
      model,
      schema: z.object({
        category: z.enum(CATEGORIES),
      }),
      prompt: CLASSIFICATION_PROMPT.replace('{message}', message),
    });

    const usage = extractTokenUsage(result, modelName);

    return {
      category: result.object.category,
      usage,
    };
  } catch (error) {
    console.error(`Error classifying with ${modelName}: ${error.message}`);
    return {
      category: 'ERROR',
      usage: { promptTokens: 0, completionTokens: 0 },
    };
  }
}
