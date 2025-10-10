# LLM Classifier Evaluation

A professional framework for evaluating and comparing LLM-based message classification performance across multiple models.

## Overview

This tool benchmarks various Large Language Models (LLMs) on a message classification task for Instashop, a grocery delivery service. It evaluates models from Google (Gemini) and OpenAI (GPT) families, providing comprehensive metrics on accuracy, token usage, and cost efficiency.

## Features

- **Multi-Model Evaluation**: Test multiple models in parallel with configurable batch processing
- **Comprehensive Metrics**: Track accuracy, token usage, and per-query costs
- **Detailed Reporting**: Generate summary reports with difficulty analysis and confusion matrices
- **Incremental Results**: Save results progressively to handle large test sets
- **Professional Architecture**: Clean, modular codebase following industry best practices

## Project Structure

```
llm-classifier-eval/
├── src/
│   ├── config/
│   │   ├── models.js          # Model configurations and pricing
│   │   └── evaluation.js      # Evaluation settings
│   ├── services/
│   │   ├── classifier.js      # Message classification logic
│   │   ├── evaluation.js      # Main evaluation orchestrator
│   │   └── report-generator.js # Report generation
│   ├── utils/
│   │   ├── token-usage.js     # Token extraction utilities
│   │   ├── csv-handler.js     # CSV read/write operations
│   │   ├── metrics.js         # Cost and accuracy calculations
│   │   └── helpers.js         # General utilities
│   └── index.js               # Application entry point
├── data/
│   └── test_set.csv           # Test dataset
├── .env                       # Environment variables (API keys)
├── .gitignore
├── package.json
└── README.md
```

## Installation

```bash
npm install
```

## Configuration

### Environment Variables

Create a `.env` file with your API keys:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key
OPENAI_API_KEY=your_openai_api_key
```

### Evaluation Settings

Modify `src/config/evaluation.js` to adjust:

- `maxTestCases`: Limit the number of test cases (set to `null` for all)
- `batchSize`: Number of concurrent test cases per batch
- `batchDelayMs`: Delay between batches to respect rate limits

### Model Configuration

Add or remove models in `src/config/models.js`. Update pricing in `MODEL_PRICING` to reflect current rates.

## Usage

Run the evaluation:

```bash
npm start
```

Or:

```bash
npm run eval
```

The tool will:
1. Load test cases from `data/test_set.csv`
2. Process them in batches across all configured models
3. Save detailed results to `data/evaluation_results.csv`
4. Generate a summary report in `data/evaluation_summary.txt`

## Test Data Format

The CSV file should include these columns:

- `id`: Test case identifier
- `message_text`: The message to classify
- `expected_category`: Ground truth label
- `difficulty`: Test difficulty level (easy/medium/hard)

## Categories

The classifier categorizes messages into:

- `valid_query`: Legitimate customer inquiries
- `out_of_scope`: Off-topic messages
- `malicious`: Harmful or spam content
- `greeting`: Simple greetings

## Output

### data/evaluation_results.csv

Contains per-test-case results with model predictions, token counts, and expected categories.

### data/evaluation_summary.txt

Provides aggregated metrics:
- Overall accuracy per model
- Token usage and cost analysis
- Accuracy breakdown by difficulty level
- Correct predictions by category

## Requirements

- Node.js >= 18.0.0
- Valid API keys for Google Generative AI and OpenAI

## License

ISC
