import { CloudSun } from 'lucide-react';
import { summarizeHistoricalWeatherData } from '@/ai/flows/summarize-historical-weather-data';
import WeatherForm from '@/components/weather-form';
import HistoricalWeather from '@/components/historical-weather';
import { generateWeatherForecast } from '@/ai/flows/generate-weather-forecast';
import { presets } from '@/lib/presets';
import WeatherDisplay from '@/components/weather-display';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function Home() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const defaultLocation = 'Mumbai, MH';
  const historicalDataText = `On this day in the past, Mumbai experienced warm and humid conditions with temperatures around 88°F (31°C). Skies were partly cloudy with a chance of afternoon showers. Winds were moderate from the southwest.`;

  let historicalSummary = { summary: 'Historical weather data is currently unavailable. Please check your Gemini API key.' };
  let presetForecasts: { title: string; forecast: string; }[] = [];

  if (process.env.GEMINI_API_KEY) {
    try {
      const summaryPromise = summarizeHistoricalWeatherData({
        date: currentDate,
        location: defaultLocation,
        historicalData: historicalDataText,
      });

      const forecastPromises = presets.map(p => generateWeatherForecast(p));

      const [summary, ...forecasts] = await Promise.all([summaryPromise, ...forecastPromises]);
      
      historicalSummary = summary;
      presetForecasts = forecasts.map((f, i) => ({
        title: `Example Forecast for ${presets[i].city}`,
        forecast: f.weeklyForecast
      }));

    } catch (error) {
      console.error('Error fetching initial data:', error);
      historicalSummary = { summary: 'Could not fetch historical weather data. The AI service may be down.' };
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
            <WeatherForm historicalDataText={historicalDataText} />
          </div>

          <div className="space-y-8">
            <HistoricalWeather
              summary={historicalSummary.summary}
              date={currentDate}
              location={defaultLocation}
            />
            {presetForecasts.length > 0 && (
               <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">Example Forecasts</CardTitle>
                  <CardDescription>
                    Here are some examples of AI-generated forecasts.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {presetForecasts.map((pf, index) => (
                    <div key={index}>
                      <h3 className="font-bold text-lg">{pf.title}</h3>
                       <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap p-4 rounded-md bg-primary/10 border-primary/20">
                        {pf.forecast}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
