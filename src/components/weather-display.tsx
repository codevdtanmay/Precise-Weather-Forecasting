'use client';

import { GenerateWeatherForecastOutput } from '@/ai/flows/generate-weather-forecast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import WeatherChart from './weather-chart';
import WeatherTable from './weather-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';


export default function WeatherDisplay({ forecast }: { forecast: GenerateWeatherForecastOutput }) {
  return (
    <Card className="mt-8 bg-primary/10 border-primary/20">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Weekly Weather Forecast</CardTitle>
        <CardDescription>{forecast.summary}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chart">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chart">Chart</TabsTrigger>
            <TabsTrigger value="table">Table</TabsTrigger>
          </TabsList>
          <TabsContent value="chart">
            <WeatherChart data={forecast.weeklyForecast} />
          </TabsContent>
          <TabsContent value="table">
            <WeatherTable data={forecast.weeklyForecast} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
