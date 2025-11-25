import { CloudSun } from 'lucide-react';
import { summarizeHistoricalWeatherData } from '@/ai/flows/summarize-historical-weather-data';
import WeatherForm from '@/components/weather-form';
import HistoricalWeather from '@/components/historical-weather';
import { generateWeatherForecast, GenerateWeatherForecastOutput } from '@/ai/flows/generate-weather-forecast';
import { presets } from '@/lib/presets';

export type PresetForecast = { name: string, forecast: GenerateWeatherForecastOutput | null };

export default async function Home() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const defaultLocation = 'Mumbai, MH';
  const historicalDataText = `On this day in the past, Mumbai experienced warm and humid conditions with temperatures around 88°F (31°C). Skies were partly cloudy with a chance of afternoon showers. Winds were moderate from the southwest.`;

  let historicalSummary = { summary: 'Historical weather data is currently unavailable. Please check your Gemini API key.' };
  let presetForecasts: PresetForecast[] = [];

  if (process.env.GEMINI_API_KEY) {
    try {
      const [summaryResult, ...forecastResults] = await Promise.all([
        summarizeHistoricalWeatherData({
          date: currentDate,
          location: defaultLocation,
          historicalData: historicalDataText,
        }),
        generateWeatherForecast(presets[0]),
        generateWeatherForecast(presets[1]),
        generateWeatherForecast(presets[2]),
      ]);

      historicalSummary = summaryResult;
      presetForecasts = [
        { name: 'Mumbai', forecast: forecastResults[0] },
        { name: 'New Delhi', forecast: forecastResults[1] },
        { name: 'Bengaluru', forecast: forecastResults[2] },
      ];

    } catch (error) {
      console.error('Error fetching initial data:', error);
      historicalSummary = { summary: 'Could not fetch historical weather data. The AI service may be down.' };
      presetForecasts = [
        { name: 'Mumbai', forecast: null },
        { name: 'New Delhi', forecast: null },
        { name: 'Bengaluru', forecast: null },
      ];
    }
  }


  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <header className="flex items-center justify-center gap-4 p-6 border-b bg-card">
        <CloudSun className="w-12 h-12 text-primary" />
        <div>
          <h1 className="text-3xl font-bold font-headline">Precise Weather Forecasting</h1>
          <p className="text-muted-foreground">by JAVAbugs</p>
        </div>
      </header>

      <main className="p-4 md:p-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <WeatherForm historicalDataText={historicalDataText} presetForecasts={presetForecasts} />
          </div>

          <div className="space-y-8">
            <HistoricalWeather
              summary={historicalSummary.summary}
              date={currentDate}
              location={defaultLocation}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
