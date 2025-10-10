import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';

export const MODEL_CONFIGS = {
  'gemini-2.5-pro': createGoogleGenerativeAI()('gemini-2.5-pro'),
  'gemini-2.5-flash': createGoogleGenerativeAI()('gemini-2.5-flash'),
  'gemini-2.5-flash-preview': createGoogleGenerativeAI()('gemini-2.5-flash-preview-09-2025'),
  'gemini-2.5-flash-lite': createGoogleGenerativeAI()('gemini-2.5-flash-lite'),
  'gemini-2.5-flash-lite-preview': createGoogleGenerativeAI()('gemini-2.5-flash-lite-preview-09-2025'),
  'gpt-5': createOpenAI()('gpt-5'),
  'gpt-5-mini': createOpenAI()('gpt-5-mini'),
  'gpt-5-nano': createOpenAI()('gpt-5-nano'),
};

export const MODEL_PRICING = {
  'gemini-2.5-pro': { input: 2.50, output: 10.00 },
  'gemini-2.5-flash': { input: 0.30, output: 2.50 },
  'gemini-2.5-flash-preview': { input: 0.30, output: 2.50 },
  'gemini-2.5-flash-lite': { input: 0.10, output: 0.40 },
  'gemini-2.5-flash-lite-preview': { input: 0.10, output: 0.40 },
  'gpt-5': { input: 1.25, output: 10.00 },
  'gpt-5-mini': { input: 0.25, output: 2.00 },
  'gpt-5-nano': { input: 0.05, output: 0.40 },
};

export const CATEGORIES = ['valid_query', 'out_of_scope', 'malicious', 'greeting'];
