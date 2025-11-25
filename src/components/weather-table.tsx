'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface WeatherTableProps {
  data: {
    day: string;
    highTemp: number;
    lowTemp: number;
    conditions: string;
  }[];
}

export default function WeatherTable({ data }: WeatherTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Day</TableHead>
          <TableHead className="text-right">High</TableHead>
          <TableHead className="text-right">Low</TableHead>
          <TableHead>Conditions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((day) => (
          <TableRow key={day.day}>
            <TableCell className="font-medium">{day.day}</TableCell>
            <TableCell className="text-right">{day.highTemp}°C</TableCell>
            <TableCell className="text-right">{day.lowTemp}°C</TableCell>
            <TableCell>{day.conditions}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
