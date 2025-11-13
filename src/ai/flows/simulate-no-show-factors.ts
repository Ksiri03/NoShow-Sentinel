'use server';

/**
 * @fileOverview Simulates the impact of different patient factors on the predicted no-show probability.
 *
 * - simulateNoShowFactors - A function that accepts patient factors and returns the predicted no-show probability.
 * - SimulateNoShowFactorsInput - The input type for the simulateNoShowFactors function.
 * - SimulateNoShowFactorsOutput - The return type for the simulateNoShowFactors function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SimulateNoShowFactorsInputSchema = z.object({
  patient_id: z.string().optional().describe('The patient identifier.'),
  age: z.number().min(0).max(120).describe('The age of the patient.'),
  gender: z.enum(['male', 'female', 'other']).describe('The gender of the patient.'),
  scheduled_iso: z.string().describe('The scheduled date and time in ISO format.'),
  appointment_iso: z.string().describe('The appointment date and time in ISO format.'),
  sms_received: z.boolean().describe('Whether an SMS reminder was sent.'),
  comorb_count: z.number().min(0).describe('The number of comorbidities the patient has.'),
  neighbourhood: z.string().describe('The neighbourhood where the patient lives.'),
  past_no_shows: z.number().min(0).optional().describe('The number of past no-shows.'),
});
export type SimulateNoShowFactorsInput = z.infer<typeof SimulateNoShowFactorsInputSchema>;

const SimulateNoShowFactorsOutputSchema = z.object({
  probability: z.number().min(0).max(1).describe('The predicted probability of a no-show (0-1).'),
  label: z.enum(['no-show', 'attend']).describe('The predicted label (no-show or attend).'),
  top_features: z
    .array(
      z.object({
        name: z.string().describe('Name of the feature.'),
        contribution: z.string().describe('The feature contribution to the prediction.'),
      })
    )
    .describe('Top features contributing to the prediction.'),
  recommended_action: z.string().describe('Recommended action based on prediction.'),
  explanation_html: z.string().describe('HTML explanation of the prediction.'),
});
export type SimulateNoShowFactorsOutput = z.infer<typeof SimulateNoShowFactorsOutputSchema>;

export async function simulateNoShowFactors(input: SimulateNoShowFactorsInput): Promise<SimulateNoShowFactorsOutput> {
  return simulateNoShowFactorsFlow(input);
}

const simulateNoShowFactorsFlow = ai.defineFlow(
  {
    name: 'simulateNoShowFactorsFlow',
    inputSchema: SimulateNoShowFactorsInputSchema,
    outputSchema: SimulateNoShowFactorsOutputSchema,
  },
  async input => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const predictEndpoint = `${baseUrl}/api/predict`;

    try {
      const response = await fetch(predictEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
        cache: 'no-store', //  instruct Next.js to skip the cache
      });

      if (!response.ok) {
        console.error('API error:', response.status, await response.text());
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = (await response.json()) as SimulateNoShowFactorsOutput;
      return data;
    } catch (error: any) {
      console.error('Error calling /api/predict:', error);
      throw new Error(`Failed to call /api/predict: ${error.message}`);
    }
  }
);
