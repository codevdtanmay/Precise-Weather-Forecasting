import { CloudSun } from 'lucide-react';
import { summarizeHistoricalWeatherData } from '@/ai/flows/summarize-historical-weather-data';
import WeatherForm from '@/components/weather-form';
import HistoricalWeather from '@/components/historical-weather';
import { GenerateWeatherForecastOutput } from '@/ai/flows/generate-weather-forecast';
import { presets } from '@/lib/presets';

export type PresetForecast = { name: string, forecast: GenerateWeatherForecastOutput | null };

export default async function Home() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const defaultLocation = 'Mumbai, MH';
  
  let historicalSummary = { summary: 'Historical weather data is currently unavailable. Please check your Gemini API key.' };
  
  // Hard-coded forecasts to ensure they always display
  const presetForecasts: PresetForecast[] = [
    {
      name: 'Mumbai',
      forecast: {
        summary: "Mumbai is currently under the influence of strong monsoon currents, leading to a week of heavy and continuous rainfall, high humidity, and overcast skies. Expect waterlogging in low-lying areas and potential disruptions due to intense downpours and gusty winds throughout the week.",
        weeklyForecast: [
          { day: "Monday", highTemp: 29, lowTemp: 25, conditions: "Continuous heavy rainfall with thunderstorms, gusty winds." },
          { day: "Tuesday", highTemp: 28, lowTemp: 25, conditions: "Moderate to heavy rain, very cloudy, isolated intense showers." },
          { day: "Wednesday", highTemp: 28, lowTemp: 24, conditions: "Persistent moderate rainfall, overcast with occasional heavy spells." },
          { day: "Thursday", highTemp: 29, lowTemp: 25, conditions: "Intermittent heavy rain and thundershowers, high humidity." },
          { day: "Friday", highTemp: 30, lowTemp: 25, conditions: "Moderate rain with partly cloudy intervals, still humid." },
          { day: "Saturday", highTemp: 31, lowTemp: 26, conditions: "Showers likely, mostly cloudy with humid conditions." },
          { day: "Sunday", highTemp: 31, lowTemp: 26, conditions: "Scattered showers, warm and humid with glimpses of sun." }
        ]
      }
    },
    {
      name: 'New Delhi',
      forecast: {
        summary: "New Delhi is set to experience a week of intense dry heat and clear skies, characteristic of this time of year. Temperatures will remain very high, with a significant UV index. Air quality will be unhealthy for sensitive groups, advising caution.",
        weeklyForecast: [
          { day: "Monday", highTemp: 42, lowTemp: 29, conditions: "Clear, hot, and dry with a very high UV index. Air quality unhealthy for sensitive groups." },
          { day: "Tuesday", highTemp: 42, lowTemp: 29, conditions: "Persistent clear skies and dry heat. Very high UV index. Air quality remains unhealthy for sensitive groups." },
          { day: "Wednesday", highTemp: 43, lowTemp: 30, conditions: "Extremely hot and sunny conditions, remaining very dry. High UV index. Air quality unhealthy for sensitive groups." },
          { day: "Thursday", highTemp: 43, lowTemp: 30, conditions: "Continued clear and scorching conditions with strong sun. High UV levels. Air quality unhealthy for sensitive groups." },
          { day: "Friday", highTemp: 42, lowTemp: 29, conditions: "Sunny, hot, and dry. Very high UV index. Air quality unhealthy for sensitive groups." },
          { day: "Saturday", highTemp: 41, lowTemp: 28, conditions: "Clear skies and persistent dry heat. Elevated UV index. Air quality unhealthy for sensitive groups." },
          { day: "Sunday", highTemp: 41, lowTemp: 28, conditions: "Sunny and hot, maintaining dry conditions throughout the day. High UV index. Air quality unhealthy for sensitive groups." }
        ]
      }
    },
    {
      name: 'Bengaluru',
      forecast: {
        summary: "Bengaluru is set for a week dominated by typical seasonal patterns, featuring dense morning fog that will gradually dissipate by midday, giving way to partly cloudy or hazy conditions. High humidity will persist, and there's a recurring chance of light drizzle, particularly in the mornings. Temperatures will remain mild and stable throughout the week.",
        weeklyForecast: [
          { day: "Monday", highTemp: 24, lowTemp: 17, conditions: "Dense morning fog, clearing to partly cloudy and hazy afternoon with a chance of light drizzle." },
          { day: "Tuesday", highTemp: 24, lowTemp: 17, conditions: "Widespread morning fog, gradually lifting to a hazy sky by midday. Isolated light drizzle possible." },
          { day: "Wednesday", highTemp: 23, lowTemp: 16, conditions: "Thick fog in the morning, giving way to an overcast and damp afternoon with occasional light drizzle." },
          { day: "Thursday", highTemp: 23, lowTemp: 16, conditions: "Persistent morning fog, turning into a generally cloudy day. A few light showers expected." },
          { day: "Friday", highTemp: 24, lowTemp: 17, conditions: "Early morning fog. Partial clearing to scattered clouds later in the day, with a slight chance of light rain." },
          { day: "Saturday", highTemp: 25, lowTemp: 18, conditions: "Foggy start, then partly sunny with some haze. Less chance of drizzle in the afternoon." },
          { day: "Sunday", highTemp: 25, lowTemp: 18, conditions: "Morning fog dissipating to mostly sunny conditions with high humidity by afternoon." }
        ]
      }
    }
  ];

  if (process.env.GEMINI_API_KEY) {
    try {
      historicalSummary = await summarizeHistoricalWeatherData({
        date: currentDate,
        location: defaultLocation,
        historicalData: presets[0].historicalData,
      });
    } catch (error) {
      console.error('Error fetching historical data:', error);
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
            <WeatherForm historicalDataText={presets[0].historicalData} presetForecasts={presetForecasts} />
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
