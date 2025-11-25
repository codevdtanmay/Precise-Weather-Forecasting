'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { History } from 'lucide-react';

interface HistoricalWeatherProps {
  summary: string;
  date: string;
  location: string;
}

export default function HistoricalWeather({ summary, date, location }: HistoricalWeatherProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="font-headline text-2xl">Historical Snapshot</CardTitle>
            <CardDescription>
              Weather on this day in {location}
            </CardDescription>
          </div>
          <History className="h-8 w-8 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm font-medium text-muted-foreground mb-4">{date}</p>
        <p className="text-foreground">{summary}</p>
      </CardContent>
    </Card>
  );
}
