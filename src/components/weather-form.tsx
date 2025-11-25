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
  Globe,
  MapPin,
  Building,
  Wand,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useActionState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from './ui/textarea';
import WeatherDisplay from './weather-display';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { countries, states, cities } from '@/lib/locations';

const formFields = [
  { name: 'humidity', label: 'Humidity (%)', icon: Droplets, placeholder: 'e.g., 75' },
  { name: 'windSpeed', label: 'Wind Speed (km/h)', icon: Wind, placeholder: 'e.g., 15' },
  { name: 'airPressure', label: 'Air Pressure (hPa)', icon: RadioTower, placeholder: 'e.g., 1005' },
  { name: 'rainfallAmount', label: 'Rainfall (mm)', icon: CloudRain, placeholder: 'e.g., 5' },
  { name: 'uvIndex', label: 'UV Index', icon: Sun, placeholder: 'e.g., 6' },
  { name: 'soilMoisture', label: 'Soil Moisture (%)', icon: Leaf, placeholder: 'e.g., 60' },
  { name: 'soilTemperature', label: 'Soil Temp (°C)', icon: Thermometer, placeholder: 'e.g., 28' },
  { name: 'fogDensity', label: 'Fog Density (%)', icon: Cloudy, placeholder: 'e.g., 5' },
  { name: 'airQuality', label: 'Air Quality', icon: ShieldAlert, placeholder: 'e.g., Moderate' },
  { name: 'visibility', label: 'Visibility (km)', icon: Eye, placeholder: 'e.g., 8' },
];

const textAreaFields = [
  { name: 'satelliteImages', label: 'Satellite Images', icon: Satellite, placeholder: 'Describe satellite imagery...' },
  { name: 'radarData', label: 'Radar Data', icon: RadioTower, placeholder: 'Describe radar data...' },
  { name: 'historicalData', label: 'Historical Data Context', icon: History, placeholder: 'Summary of past weather...' },
  { name: 'cloudSourceData', label: 'Cloud Source Data', icon: Cloud, placeholder: 'Describe cloud source data...' },
];

const presets: WeatherFormData[] = [
  { // Default/Rainy Mumbai
    country: 'IN',
    state: 'MH',
    city: 'Mumbai',
    humidity: 85,
    windSpeed: 20,
    airPressure: 1002,
    rainfallAmount: 15,
    uvIndex: 3,
    soilMoisture: 75,
    soilTemperature: 26,
    fogDensity: 10,
    airQuality: 'Good',
    visibility: 5,
    satelliteImages: 'Widespread dense cloud cover observed over the coastal areas.',
    radarData: 'Continuous moderate to heavy rainfall detected across the city.',
    historicalData: 'On this day in the past, Mumbai experienced warm and humid conditions with temperatures around 88°F (31°C). Skies were partly cloudy with a chance of afternoon showers. Winds were moderate from the southwest.',
    cloudSourceData: 'Strong monsoon currents from the Arabian Sea are feeding moisture.',
  },
  { // Sunny Delhi
    country: 'IN',
    state: 'DL',
    city: 'New Delhi',
    humidity: 30,
    windSpeed: 8,
    airPressure: 1015,
    rainfallAmount: 0,
    uvIndex: 9,
    soilMoisture: 25,
    soilTemperature: 38,
    fogDensity: 0,
    airQuality: 'Unhealthy for Sensitive Groups',
    visibility: 10,
    satelliteImages: 'Clear skies visible across the entire northern plains.',
    radarData: 'No precipitation detected in the vicinity.',
    historicalData: 'Historically, this time of year in Delhi is characterized by dry heat and clear skies.',
    cloudSourceData: 'Very dry continental air mass with no significant moisture source.',
  },
  { // Foggy Bengaluru
    country: 'IN',
    state: 'KA',
    city: 'Bengaluru',
    humidity: 95,
    windSpeed: 5,
    airPressure: 1010,
    rainfallAmount: 1,
    uvIndex: 2,
    soilMoisture: 65,
    soilTemperature: 21,
    fogDensity: 80,
    airQuality: 'Moderate',
    visibility: 1,
    satelliteImages: 'Low-level stratus clouds and fog covering the Deccan plateau.',
    radarData: 'Occasional light drizzle detected, but no significant rain bands.',
    historicalData: 'Mornings in Bengaluru during this season often feature dense fog, clearing by noon.',
    cloudSourceData: 'Local moisture condensation due to temperature inversion.',
  }
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
  
  const [presetIndex, setPresetIndex] = useState(0);

  const form = useForm<WeatherFormData>({
    resolver: zodResolver(weatherFormSchema),
    defaultValues: presets[0],
  });

  const loadNextPreset = () => {
    const nextIndex = (presetIndex + 1) % presets.length;
    form.reset(presets[nextIndex]);
    setPresetIndex(nextIndex);
  };

  const selectedCountry = form.watch('country');
  const selectedState = form.watch('state');

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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-headline text-2xl">Atmospheric Data Input</CardTitle>
            <CardDescription>Enter the location and current weather metrics to generate a forecast.</CardDescription>
          </div>
          <Button variant="outline" onClick={loadNextPreset}>
            <Wand className="mr-2 h-4 w-4" />
            Load Example
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form action={formAction} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><Globe className="h-4 w-4 text-primary" />Country</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select a country" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countries.map(country => (
                          <SelectItem key={country.code} value={country.code}>{country.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />State/Province</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={!selectedCountry}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select a state/province" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {states[selectedCountry]?.map(state => (
                          <SelectItem key={state.code} value={state.code}>{state.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><Building className="h-4 w-4 text-primary" />City/Town</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={!selectedState}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select a city/town" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cities[selectedState]?.map(city => (
                          <SelectItem key={city.name} value={city.name}>{city.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
                        <Input placeholder={placeholder} {...field} type={typeof field.value === 'number' ? 'number' : 'text'} />
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
