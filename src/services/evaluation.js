import { MODEL_CONFIGS } from '../config/models.js';
import { EVALUATION_CONFIG } from '../config/evaluation.js';
import { loadTestData, writeCsvRows, appendCsvRows } from '../utils/csv-handler.js';
import { sleep, truncateMessage } from '../utils/helpers.js';
import { classifyMessage } from './classifier.js';
import { generateReport } from './report-generator.js';

async function evaluateTestCase(testCase, modelNames) {
  const resultRow = { ...testCase };
  
  const modelPromises = modelNames.map(async (modelName) => {
    const model = MODEL_CONFIGS[modelName];
    const { category, usage } = await classifyMessage(model, modelName, testCase.message_text);
    
    return {
      modelName,
      category,
      usage,
    };
  });
  
  const modelResults = await Promise.all(modelPromises);
  
  modelResults.forEach(({ modelName, category, usage }) => {
    resultRow[`${modelName}_prediction`] = category;
    resultRow[`${modelName}_prompt_tokens`] = usage.promptTokens;
    resultRow[`${modelName}_completion_tokens`] = usage.completionTokens;
  });
  
  console.log(`  ✓ Completed case #${testCase.id}: "${truncateMessage(testCase.message_text)}"`);
  
  return resultRow;
}

async function evaluateBatch(batch, batchNumber, modelNames, isFirstBatch) {
  console.log(`\nProcessing batch ${batchNumber}...`);
  
  const batchPromises = batch.map(testCase => evaluateTestCase(testCase, modelNames));
  const batchResults = await Promise.all(batchPromises);
  
  if (isFirstBatch) {
    const headers = Object.keys(batchResults[0]).join(',');
    const rows = batchResults.map(row => {
      const values = Object.values(row).map(val => `"${String(val).replace(/"/g, '""')}"`);
      return values.join(',');
    });
    const csvContent = `${headers}\n${rows.join('\n')}\n`;
    writeCsvRows(EVALUATION_CONFIG.resultsPath, [csvContent]);
    console.log(`  📝 Wrote batch ${batchNumber} to ${EVALUATION_CONFIG.resultsPath}`);
  } else {
    appendCsvRows(EVALUATION_CONFIG.resultsPath, batchResults);
    console.log(`  📝 Appended batch ${batchNumber} to ${EVALUATION_CONFIG.resultsPath}`);
  }
  
  return batchResults;
}

export async function runEvaluation() {
  console.log('--- Starting LLM Classifier Evaluation ---\n');

  let testCases = loadTestData(EVALUATION_CONFIG.testDataPath);
  console.log(`Loaded ${testCases.length} test cases from CSV.`);
  
  if (EVALUATION_CONFIG.maxTestCases !== null && EVALUATION_CONFIG.maxTestCases > 0) {
    testCases = testCases.slice(0, EVALUATION_CONFIG.maxTestCases);
    console.log(`Limited to first ${testCases.length} test cases.\n`);
  }

  const modelNames = Object.keys(MODEL_CONFIGS);
  const results = [];
  
  for (let batchStart = 0; batchStart < testCases.length; batchStart += EVALUATION_CONFIG.batchSize) {
    const batchEnd = Math.min(batchStart + EVALUATION_CONFIG.batchSize, testCases.length);
    const batch = testCases.slice(batchStart, batchEnd);
    const batchNumber = Math.floor(batchStart / EVALUATION_CONFIG.batchSize) + 1;
    const isFirstBatch = batchStart === 0;
    
    const batchResults = await evaluateBatch(batch, batchNumber, modelNames, isFirstBatch);
    results.push(...batchResults);
    
    if (batchEnd < testCases.length) {
      await sleep(EVALUATION_CONFIG.batchDelayMs);
    }
  }

  console.log(`\n--- All results saved to ${EVALUATION_CONFIG.resultsPath} ---\n`);
  
  generateReport(results, modelNames, EVALUATION_CONFIG.summaryPath);
}
