'use server';
/**
 * @fileOverview Summarizes historical weather data for a specific date.
 *
 * - summarizeHistoricalWeatherData - A function that summarizes historical weather data.
 * - SummarizeHistoricalWeatherDataInput - The input type for the summarizeHistoricalWeatherData function.
 * - SummarizeHistoricalWeatherDataOutput - The return type for the summarizeHistoricalWeatherData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeHistoricalWeatherDataInputSchema = z.object({
  date: z.string().describe('The date for which to summarize historical weather data.'),
  location: z.string().describe('The location for which to summarize historical weather data.'),
  historicalData: z.string().describe('Historical weather data for the specified date and location.'),
});
export type SummarizeHistoricalWeatherDataInput = z.infer<
  typeof SummarizeHistoricalWeatherDataInputSchema
>;

const SummarizeHistoricalWeatherDataOutputSchema = z.object({
  summary: z.string().describe('A summary of the historical weather data.'),
});
export type SummarizeHistoricalWeatherDataOutput = z.infer<
  typeof SummarizeHistoricalWeatherDataOutputSchema
>;

export async function summarizeHistoricalWeatherData(
  input: SummarizeHistoricalWeatherDataInput
): Promise<SummarizeHistoricalWeatherDataOutput> {
  return summarizeHistoricalWeatherDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeHistoricalWeatherDataPrompt',
  input: {schema: SummarizeHistoricalWeatherDataInputSchema},
  output: {schema: SummarizeHistoricalWeatherDataOutputSchema},
  prompt: `You are an expert weather historian. Please summarize the historical weather data for the specified date and location. Be concise but informative.

Date: {{{date}}}
Location: {{{location}}}
Historical Data: {{{historicalData}}}`,
});

const summarizeHistoricalWeatherDataFlow = ai.defineFlow(
  {
    name: 'summarizeHistoricalWeatherDataFlow',
    inputSchema: SummarizeHistoricalWeatherDataInputSchema,
    outputSchema: SummarizeHistoricalWeatherDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
