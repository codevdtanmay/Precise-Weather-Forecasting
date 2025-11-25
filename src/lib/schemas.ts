import { z } from 'zod';

export const weatherFormSchema = z.object({
  humidity: z.coerce.number().min(0).max(100),
  windSpeed: z.coerce.number().min(0),
  airPressure: z.coerce.number(),
  rainfallAmount: z.coerce.number().min(0),
  uvIndex: z.coerce.number().min(0).max(10),
  soilMoisture: z.coerce.number().min(0).max(100),
  soilTemperature: z.coerce.number(),
  fogDensity: z.coerce.number().min(0).max(100),
  airQuality: z.string().min(1, 'Air quality is required.'),
  visibility: z.coerce.number().min(0),
  satelliteImages: z.string().min(1, 'Satellite image description is required.'),
  radarData: z.string().min(1, 'Radar data description is required.'),
  historicalData: z.string(),
  cloudSourceData: z.string().min(1, 'Cloud source data is required.'),
});

export type WeatherFormData = z.infer<typeof weatherFormSchema>;
