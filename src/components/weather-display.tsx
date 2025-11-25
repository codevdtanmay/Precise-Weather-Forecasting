'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';

export default function WeatherDisplay({ forecast }: { forecast: string }) {
  return (
    <Card className="mt-8 bg-primary/10 border-primary/20">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Weekly Weather Forecast</CardTitle>
        <CardDescription>Here is the AI-generated forecast for the next 7 days.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
          {forecast}
        </div>
      </CardContent>
    </Card>
  );
}
