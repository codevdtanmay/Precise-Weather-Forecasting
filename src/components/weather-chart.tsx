'use client';

import { TrendingDown, TrendingUp } from 'lucide-react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface WeatherChartProps {
  data: {
    day: string;
    highTemp: number;
    lowTemp: number;
    conditions: string;
  }[];
}

const chartConfig = {
  highTemp: {
    label: 'High Temp',
    color: 'hsl(var(--primary))',
    icon: TrendingUp,
  },
  lowTemp: {
    label: 'Low Temp',
    color: 'hsl(var(--accent))',
    icon: TrendingDown,
  },
};

export default function WeatherChart({ data }: WeatherChartProps) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <LineChart
        accessibilityLayer
        data={data}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <YAxis
          dataKey="highTemp"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => `${value}°C`}
        />
        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Line
          dataKey="highTemp"
          type="monotone"
          stroke="var(--color-highTemp)"
          strokeWidth={2}
          dot={true}
        />
        <Line
          dataKey="lowTemp"
          type="monotone"
          stroke="var(--color-lowTemp)"
          strokeWidth={2}
          dot={true}
        />
      </LineChart>
    </ChartContainer>
  );
}
