'use server';

import { generateWeatherForecast } from '@/ai/flows/generate-weather-forecast';
import { weatherFormSchema } from '@/lib/schemas';

interface FormState {
  data: {
    weeklyForecast: string;
  } | null;
  error: string | null;
}

export async function getForecastAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = weatherFormSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      data: null,
      error: 'Invalid form data. Please check your inputs.',
    };
  }

  try {
    const forecast = await generateWeatherForecast(validatedFields.data);
    return { data: forecast, error: null };
  } catch (e) {
    return {
      data: null,
      error: 'Failed to generate forecast. Please try again later.',
    };
  }
}
