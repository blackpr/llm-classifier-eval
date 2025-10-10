import dotenv from 'dotenv';
import { runEvaluation } from './services/evaluation.js';

dotenv.config();

runEvaluation().catch(error => {
  console.error('Evaluation failed:', error);
  process.exit(1);
});
