export function extractTokenUsage(result, modelName) {
  if (modelName.startsWith('gemini')) {
    const usageMeta = result.providerMetadata?.google?.usageMetadata;
    return {
      promptTokens: usageMeta?.promptTokenCount || 0,
      completionTokens: usageMeta?.candidatesTokenCount || 0,
    };
  }
  
  if (modelName.startsWith('gpt')) {
    const usage = result.usage || {};
    return {
      promptTokens: usage.inputTokens || 0,
      completionTokens: usage.outputTokens || 0,
    };
  }

  const usage = result.usage || {};
  return {
    promptTokens: usage.promptTokens || usage.inputTokens || 0,
    completionTokens: usage.completionTokens || usage.outputTokens || 0,
  };
}
