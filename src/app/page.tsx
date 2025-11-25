import { CloudSun, History } from 'lucide-react';
import { summarizeHistoricalWeatherData } from '@/ai/flows/summarize-historical-weather-data';
import WeatherForm from '@/components/weather-form';
import HistoricalWeather from '@/components/historical-weather';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function Home() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const location = 'San Francisco, CA';
  const historicalDataText = `On this day in the past, San Francisco experienced mild temperatures around 60°F with intermittent fog clearing by the afternoon. Winds were light from the west. No significant precipitation was recorded.`;

  let historicalSummary = { summary: 'Historical weather data is currently unavailable. Please check your Gemini API key.' };

  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_API_KEY_HERE') {
    try {
      historicalSummary = await summarizeHistoricalWeatherData({
        date: currentDate,
        location,
        historicalData: historicalDataText,
      });
    } catch (error) {
      console.error('Error fetching historical weather data:', error);
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
              location={location}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
