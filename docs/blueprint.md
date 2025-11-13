# **App Name**: NoShow Sentinel

## Core Features:

- Predict No-Show Risk: Call the `/api/predict` endpoint with patient data to predict the probability of a no-show appointment using an AI model.
- Form Input and Validation: Capture patient data through a responsive form with client-side validation (age, date/time, etc.) and inline error messages.
- Result Display: Display the predicted no-show probability (%), binary decision (At Risk/Likely to Attend), recommended action (SMS/call), and confidence level.
- Feature Contribution Explanation: Display the top 3 features contributing to the prediction (positive/negative) with name, effect, and delta percentage.
- Input Simulation: Allow users to tweak patient data and see instant probability updates, using the prediction model as a tool.
- Data Export: Provide export buttons for downloading a PDF summary and copying JSON prediction data.
- Audit Log: Maintain a log of the last 5 predictions with timestamps for auditing purposes.

## Style Guidelines:

- Primary color: Deep Indigo (#4F46E5) to convey trust and intelligence.
- Background color: Very light Indigo (#F5F3FF) to complement the primary color and provide a clean backdrop.
- Accent color: Teal (#14B8A6) for interactive elements and key performance indicators, as an analogous color that provides visual interest.
- Body and headline font: 'Inter', a sans-serif font that is suitable for both headlines and body text.
- Use clean, minimalist icons to represent different patient attributes and prediction results.
- Implement a responsive, single-page dashboard layout with a left-aligned form and a right-side results panel, collapsing into an accordion on small screens.
- Subtle transitions and loading animations to improve the user experience, especially when waiting for predictions.