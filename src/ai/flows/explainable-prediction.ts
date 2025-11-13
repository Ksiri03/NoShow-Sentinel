// This is a server-side file!
'use server';

/**
 * @fileOverview A Genkit flow to provide explainable predictions for medical appointment no-shows.
 *
 * - `explainablePrediction`: The main function to call for generating explainable predictions.
 * - `ExplainablePredictionInput`: The input type for the `explainablePrediction` function, defining the patient data.
 * - `ExplainablePredictionOutput`: The output type, providing the prediction, top features, and recommended actions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the explainable prediction flow
const ExplainablePredictionInputSchema = z.object({
  patient_id: z.string().optional().describe('The unique identifier for the patient.'),
  age: z.number().min(0).max(120).describe('The age of the patient in years.'),
  gender: z.enum(['male', 'female', 'other']).describe('The gender of the patient.'),
  scheduled_iso: z.string().describe('The scheduled date and time in ISO format.'),
  appointment_iso: z.string().describe('The appointment date and time in ISO format.'),
  sms_received: z.boolean().describe('Whether an SMS reminder was sent to the patient.'),
  comorb_count: z.number().min(0).describe('The number of comorbidities the patient has.'),
  neighbourhood: z.string().describe('The neighbourhood where the patient resides.'),
  past_no_shows: z.number().min(0).optional().describe('The number of past no-shows by the patient.'),
});
export type ExplainablePredictionInput = z.infer<typeof ExplainablePredictionInputSchema>;

// Define the output schema for the explainable prediction flow
const ExplainablePredictionOutputSchema = z.object({
  probability: z.number().describe('The predicted probability of the patient not showing up.'),
  label: z.enum(['no-show', 'attend']).describe('The predicted label indicating whether the patient will no-show or attend.'),
  top_features: z.array(
    z.object({
      name: z.string().describe('The name of the feature.'),
      contribution: z.number().describe('The contribution of the feature to the prediction.'),
    })
  ).describe('The top features contributing to the prediction.'),
  recommended_action: z.string().describe('The recommended action to take based on the prediction.'),
  explanation_html: z.string().describe('HTML explanation of the prediction.'),
});
export type ExplainablePredictionOutput = z.infer<typeof ExplainablePredictionOutputSchema>;

// Wrapper function to call the flow
export async function explainablePrediction(input: ExplainablePredictionInput): Promise<ExplainablePredictionOutput> {
  return explainablePredictionFlow(input);
}

// Define the prompt for the explainable prediction
const explainablePredictionPrompt = ai.definePrompt({
  name: 'explainablePredictionPrompt',
  input: {schema: ExplainablePredictionInputSchema},
  output: {schema: ExplainablePredictionOutputSchema},
  prompt: `You are an AI assistant that predicts whether a patient will no-show for their medical appointment and provides explanations for the prediction.

  Here is the patient data:
  Patient ID: {{patient_id}}
  Age: {{age}}
  Gender: {{gender}}
  Scheduled Date & Time: {{scheduled_iso}}
  Appointment Date & Time: {{appointment_iso}}
  SMS Received: {{sms_received}}
  Comorbidity Count: {{comorb_count}}
  Neighbourhood: {{neighbourhood}}
  Past No-Shows: {{past_no_shows}}

  Based on this data, predict the probability of the patient not showing up for their appointment, identify the top 3 factors influencing the prediction (positive and negative), and suggest a recommended action (e.g., send SMS reminder, make a phone call). Return the prediction, top features, recommended action, and explanation in a JSON format that matches ExplainablePredictionOutputSchema.
  Ensure the top_features array contains the name and contribution for each feature.
  Use explanation_html to provide a human-readable explanation of the prediction.
  `,
});

// Define the Genkit flow for explainable prediction
const explainablePredictionFlow = ai.defineFlow(
  {
    name: 'explainablePredictionFlow',
    inputSchema: ExplainablePredictionInputSchema,
    outputSchema: ExplainablePredictionOutputSchema,
  },
  async input => {
    const {output} = await explainablePredictionPrompt(input);
    return output!;
  }
);
