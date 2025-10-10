export function calculateCost(promptTokens, completionTokens, pricing) {
  const inputCost = (promptTokens / 1_000_000) * pricing.input;
  const outputCost = (completionTokens / 1_000_000) * pricing.output;
  return inputCost + outputCost;
}

export function calculateAverageCost(totalCost, totalCases) {
  return totalCases > 0 ? totalCost / totalCases : 0;
}

export function calculateAccuracy(correct, total) {
  return total > 0 ? (correct / total) * 100 : 0;
}
