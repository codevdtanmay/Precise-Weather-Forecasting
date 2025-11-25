'use server';

/**
 * @fileOverview Predicts weather conditions for the next week based on input atmospheric data.
 *
 * - generateWeatherForecast - A function that handles the weather forecast generation.
 * - GenerateWeatherForecastInput - The input type for the generateWeatherForecast function.
 * - GenerateWeatherForecastOutput - The return type for the generateWeatherForecast function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWeatherForecastInputSchema = z.object({
  city: z.string().describe('The city for the weather forecast.'),
  state: z.string().describe('The state or province for the weather forecast.'),
  country: z.string().describe('The country for the weather forecast.'),
  humidity: z.number().describe('Humidity percentage (0-100).'),
  windSpeed: z.number().describe('Wind speed in mph.'),
  airPressure: z.number().describe('Air pressure in hPa.'),
  rainfallAmount: z.number().describe('Rainfall amount in inches.'),
  uvIndex: z.number().describe('UV index (0-10).'),
  soilMoisture: z.number().describe('Soil moisture percentage (0-100).'),
  soilTemperature: z.number().describe('Soil temperature in degrees Fahrenheit.'),
  fogDensity: z.number().describe('Fog density percentage (0-100).'),
  airQuality: z.string().describe('Air quality description (e.g., Good, Moderate, Unhealthy).'),
  visibility: z.number().describe('Visibility in miles.'),
  satelliteImages: z.string().describe('Description of satellite images.'),
  radarData: z.string().describe('Description of radar data.'),
  historicalData: z.string().describe('Summary of historical weather data.'),
  cloudSourceData: z.string().describe('Description of cloud source data.'),
});
export type GenerateWeatherForecastInput = z.infer<typeof GenerateWeatherForecastInputSchema>;

const DailyForecastSchema = z.object({
  day: z.string().describe("Day of the week (e.g., Monday)."),
  highTemp: z.number().describe("The high temperature for the day in Celsius."),
  lowTemp: z.number().describe("The low temperature for the day in Celsius."),
  conditions: z.string().describe("A brief description of the weather conditions (e.g., 'Sunny with scattered clouds')."),
});

const GenerateWeatherForecastOutputSchema = z.object({
  summary: z.string().describe("A brief summary of the week's weather outlook."),
  weeklyForecast: z.array(DailyForecastSchema).describe('A 7-day weather forecast.'),
});
export type GenerateWeatherForecastOutput = z.infer<typeof GenerateWeatherForecastOutputSchema>;

export async function generateWeatherForecast(input: GenerateWeatherForecastInput): Promise<GenerateWeatherForecastOutput> {
  return generateWeatherForecastFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWeatherForecastPrompt',
  input: {schema: GenerateWeatherForecastInputSchema},
  output: {schema: GenerateWeatherForecastOutputSchema},
  prompt: `You are an expert meteorologist. Based on the provided atmospheric data, generate a detailed 7-day weather forecast for {{{city}}}, {{{state}}}, {{{country}}}. Provide a general summary and then a day-by-day breakdown with high/low temperatures in Celsius and weather conditions.

Atmospheric Data:
Humidity: {{{humidity}}}%
Wind Speed: {{{windSpeed}}} mph
Air Pressure: {{{airPressure}}} hPa
Rainfall Amount: {{{rainfallAmount}}} inches
UV Index: {{{uvIndex}}}
Soil Moisture: {{{soilMoisture}}}%
Soil Temperature: {{{soilTemperature}}} °F
Fog Density: {{{fogDensity}}}%
Air Quality: {{{airQuality}}}
Visibility: {{{visibility}}} miles
Satellite Images: {{{satelliteImages}}}
Radar Data: {{{radarData}}}
Historical Data: {{{historicalData}}}
Cloud Source Data: {{{cloudSourceData}}}

Forecast:`,
});

const generateWeatherForecastFlow = ai.defineFlow(
  {
    name: 'generateWeatherForecastFlow',
    inputSchema: GenerateWeatherForecastInputSchema,
    outputSchema: GenerateWeatherForecastOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
