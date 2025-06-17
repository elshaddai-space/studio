import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
// import {configure} from 'genkit'; // If you need to set logLevel for debugging, uncomment


// If you need to debug Genkit activity, uncomment and configure:
// configure({
//   logLevel: 'debug',
//   telemetry: {
//     instrumentation: {
//       // provide your configuration
//     },
//     management: {
//       // provide your configuration
//     }
//   }
// });


export const ai = genkit({
  plugins: [
    googleAI() // Default Gemini Flash model. You can specify other models if needed.
  ],
  // The default model used by ai.generate() and ai.prompt().
  // You can remove this if you always specify the model in each call.
  model: 'googleai/gemini-1.5-flash-latest', 
});

// Note: For this specific onboarding app, we are using server actions with Zod validation
// and scripted responses primarily, rather than complex LLM generation for each step.
// The `ai` object is initialized here for potential future use or if specific parts
// of the conversation were to be handled by an LLM (e.g., handling unexpected user queries).
