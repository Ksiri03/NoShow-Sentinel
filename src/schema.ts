import { z } from 'zod';

export const predictionSchema = z.object({
  patient_id: z.string().optional(),
  age: z.coerce.number().min(0, "Age must be 0 or greater.").max(120, "Age must be 120 or less."),
  gender: z.enum(['male', 'female', 'other'], { required_error: "Gender is required." }),
  scheduled_iso: z.date({ required_error: "Scheduled date is required." }).optional(),
  appointment_iso: z.date({ required_error: "Appointment date is required." }).optional(),
  sms_received: z.boolean().default(false),
  comorb_count: z.coerce.number().min(0, "Count must be 0 or greater.").default(0),
  neighbourhood: z.string().min(1, "Neighbourhood is required."),
  past_no_shows: z.coerce.number().min(0, "Must be 0 or greater.").default(0),
}).refine(data => !data.appointment_iso || !data.scheduled_iso || data.appointment_iso >= data.scheduled_iso, {
  message: "Appointment date must be on or after the scheduled date.",
  path: ["appointment_iso"],
});

export type PredictionFormValues = z.infer<typeof predictionSchema>;
