import * as fs from 'fs';
import { MODEL_PRICING } from '../config/models.js';
import { calculateCost, calculateAverageCost, calculateAccuracy } from '../utils/metrics.js';

function buildConfusionMatrix(results, modelName) {
  const matrix = {
    valid_query: { correct: 0, total: 0 },
    out_of_scope: { correct: 0, total: 0 },
    malicious: { correct: 0, total: 0 },
    greeting: { correct: 0, total: 0 },
  };

  results.forEach(result => {
    const expected = result.expected_category;
    const prediction = result[`${modelName}_prediction`];
    
    if (matrix[expected]) {
      matrix[expected].total++;
      if (prediction === expected) {
        matrix[expected].correct++;
      }
    }
  });

  return matrix;
}

function buildDifficultyStats(results, modelName) {
  const stats = {
    easy: { correct: 0, total: 0 },
    medium: { correct: 0, total: 0 },
    hard: { correct: 0, total: 0 },
  };

  results.forEach(result => {
    const difficulty = result.difficulty;
    const expected = result.expected_category;
    const prediction = result[`${modelName}_prediction`];

    if (stats[difficulty]) {
      stats[difficulty].total++;
      if (prediction === expected) {
        stats[difficulty].correct++;
      }
    }
  });

  return stats;
}

function analyzeModelPerformance(results, modelName) {
  let correct = 0;
  let errors = 0;
  let totalPromptTokens = 0;
  let totalCompletionTokens = 0;

  results.forEach(result => {
    const prediction = result[`${modelName}_prediction`];
    const expected = result.expected_category;

    if (prediction === 'ERROR') {
      errors++;
    } else if (prediction === expected) {
      correct++;
    }

    totalPromptTokens += Number(result[`${modelName}_prompt_tokens`] || 0);
    totalCompletionTokens += Number(result[`${modelName}_completion_tokens`] || 0);
  });

  const totalAnswered = results.length - errors;
  const accuracy = calculateAccuracy(correct, totalAnswered);
  
  const pricing = MODEL_PRICING[modelName];
  const totalCost = calculateCost(totalPromptTokens, totalCompletionTokens, pricing);
  const avgCostPerQuery = calculateAverageCost(totalCost, results.length);

  return {
    correct,
    totalAnswered,
    errors,
    accuracy,
    totalPromptTokens,
    totalCompletionTokens,
    totalCost,
    avgCostPerQuery,
  };
}

function formatModelReport(modelName, performance, difficultyStats, confusionMatrix) {
  const lines = [];
  
  lines.push('========================================');
  lines.push(`  Model: ${modelName}`);
  lines.push('========================================');
  lines.push(`  Overall Accuracy: ${performance.accuracy.toFixed(2)}% (${performance.correct} / ${performance.totalAnswered})`);
  lines.push(`  API Errors / Failed Parses: ${performance.errors}`);
  lines.push('');
  lines.push(`  Token Usage & Cost Analysis:`);
  lines.push(`    - Total Prompt Tokens    : ${performance.totalPromptTokens}`);
  lines.push(`    - Total Completion Tokens: ${performance.totalCompletionTokens}`);
  lines.push(`    - Total Cost             : $${performance.totalCost.toFixed(6)}`);
  lines.push(`    - Avg. Cost per Query    : $${performance.avgCostPerQuery.toFixed(6)}`);
  lines.push('');
  lines.push(`  Accuracy by Difficulty:`);
  
  for (const [difficulty, stats] of Object.entries(difficultyStats)) {
    const acc = calculateAccuracy(stats.correct, stats.total);
    const accStr = stats.total > 0 ? acc.toFixed(2) : 'N/A';
    lines.push(`    - ${difficulty.padEnd(6)}: ${accStr}% (${stats.correct}/${stats.total})`);
  }
  
  lines.push('');
  lines.push(`  Correct Predictions by Category:`);
  
  for (const [category, stats] of Object.entries(confusionMatrix)) {
    lines.push(`    - ${category.padEnd(12)}: ${stats.correct} / ${stats.total}`);
  }
  lines.push('');
  
  return lines;
}

export function generateReport(results, modelNames, outputPath) {
  const reportLines = [];
  
  reportLines.push('--- Evaluation Summary Report ---');
  reportLines.push(`Generated: ${new Date().toISOString()}`);
  reportLines.push(`Total Test Cases: ${results.length}`);
  reportLines.push('');

  for (const modelName of modelNames) {
    const performance = analyzeModelPerformance(results, modelName);
    const difficultyStats = buildDifficultyStats(results, modelName);
    const confusionMatrix = buildConfusionMatrix(results, modelName);
    
    const modelReport = formatModelReport(modelName, performance, difficultyStats, confusionMatrix);
    reportLines.push(...modelReport);
    
    console.log(modelReport.join('\n'));
  }

  reportLines.push('========================================');
  
  const reportContent = reportLines.join('\n');
  fs.writeFileSync(outputPath, reportContent);
  console.log(`\n✅ Summary report saved to ${outputPath}`);
}
