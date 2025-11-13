import type { ExplainablePredictionOutput } from '@/ai/flows/explainable-prediction';

export type AuditLogEntry = {
  id: string;
  timestamp: Date;
  prediction: ExplainablePredictionOutput;
};
