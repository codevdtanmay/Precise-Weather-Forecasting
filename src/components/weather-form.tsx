'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { WeatherFormData, weatherFormSchema } from '@/lib/schemas';
import { getForecastAction } from '@/app/actions';
import {
  Droplets,
  Wind,
  Thermometer,
  CloudRain,
  Sun,
  Leaf,
  Cloudy,
  ShieldAlert,
  Eye,
  Satellite,
  RadioTower,
  History,
  Cloud,
  Loader2,
  Bot,
} from 'lucide-react';
import React, { useEffect, useActionState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from './ui/textarea';
import WeatherDisplay from './weather-display';

const formFields = [
  { name: 'humidity', label: 'Humidity (%)', icon: Droplets, placeholder: 'e.g., 60' },
  { name: 'windSpeed', label: 'Wind Speed (mph)', icon: Wind, placeholder: 'e.g., 5' },
  { name: 'airPressure', label: 'Air Pressure (hPa)', icon: RadioTower, placeholder: 'e.g., 1012' },
  { name: 'rainfallAmount', label: 'Rainfall (in)', icon: CloudRain, placeholder: 'e.g., 0.1' },
  { name: 'uvIndex', label: 'UV Index', icon: Sun, placeholder: 'e.g., 3' },
  { name: 'soilMoisture', label: 'Soil Moisture (%)', icon: Leaf, placeholder: 'e.g., 45' },
  { name: 'soilTemperature', label: 'Soil Temp (°F)', icon: Thermometer, placeholder: 'e.g., 68' },
  { name: 'fogDensity', label: 'Fog Density (%)', icon: Cloudy, placeholder: 'e.g., 10' },
  { name: 'airQuality', label: 'Air Quality', icon: ShieldAlert, placeholder: 'e.g., Good' },
  { name: 'visibility', label: 'Visibility (miles)', icon: Eye, placeholder: 'e.g., 10' },
];

const textAreaFields = [
  { name: 'satelliteImages', label: 'Satellite Images', icon: Satellite, placeholder: 'Describe satellite imagery...' },
  { name: 'radarData', label: 'Radar Data', icon: RadioTower, placeholder: 'Describe radar data...' },
  { name: 'historicalData', label: 'Historical Data Context', icon: History, placeholder: 'Summary of past weather...' },
  { name: 'cloudSourceData', label: 'Cloud Source Data', icon: Cloud, placeholder: 'Describe cloud source data...' },
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating Forecast...
        </>
      ) : (
        <>
          <Bot className="mr-2 h-4 w-4" />
          Generate Forecast
        </>
      )}
    </Button>
  );
}

export default function WeatherForm({ historicalDataText }: { historicalDataText: string }) {
  const { toast } = useToast();
  const [state, formAction] = useActionState(getForecastAction, {
    data: null,
    error: null,
  });

  const form = useForm<WeatherFormData>({
    resolver: zodResolver(weatherFormSchema),
    defaultValues: {
      humidity: 85,
      windSpeed: 7,
      airPressure: 1010,
      rainfallAmount: 0,
      uvIndex: 2,
      soilMoisture: 55,
      soilTemperature: 62,
      fogDensity: 30,
      airQuality: 'Moderate',
      visibility: 5,
      satelliteImages: 'Scattered low-level clouds observed over the coastal region.',
      radarData: 'No significant precipitation echoes detected within 100 miles.',
      historicalData: historicalDataText,
      cloudSourceData: 'Moisture influx from the Pacific Ocean is the primary cloud source.',
    },
  });

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: state.error,
      });
    }
  }, [state.error, toast]);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Atmospheric Data Input</CardTitle>
        <CardDescription>Enter the current weather metrics to generate a forecast.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form action={formAction} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {formFields.map(({ name, label, icon: Icon, placeholder }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name as keyof WeatherFormData}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-primary" />
                        {label}
                      </FormLabel>
                      <FormControl>
                        <Input placeholder={placeholder} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
              {textAreaFields.map(({ name, label, icon: Icon, placeholder }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name as keyof WeatherFormData}
                  render={({ field }) => (
                    <FormItem>
                       <FormLabel className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-primary" />
                        {label}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={placeholder}
                          className="resize-none"
                          readOnly={name === 'historicalData'}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <SubmitButton />
          </form>
        </Form>
        {state.data && <WeatherDisplay forecast={state.data.weeklyForecast} />}
      </CardContent>
    </Card>
  );
}
