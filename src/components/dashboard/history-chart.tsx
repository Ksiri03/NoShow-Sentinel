
'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { AuditLogEntry } from '@/lib/types';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';

interface HistoryChartProps {
  data: AuditLogEntry[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border p-2 rounded-lg shadow-lg">
        <p className="label font-bold">{`${format(new Date(label), 'PPP')}`}</p>
        <p className="intro text-primary">{`Risk: ${(payload[0].value * 100).toFixed(0)}%`}</p>
      </div>
    );
  }

  return null;
};

export default function HistoryChart({ data }: HistoryChartProps) {
  const chartData = data.map(entry => ({
    date: entry.timestamp.toISOString(),
    probability: entry.prediction.probability,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
            </linearGradient>
        </defs>
        <XAxis
            dataKey="date"
            tickFormatter={(str) => format(new Date(str), 'MMM d')}
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
        />
        <YAxis
            tickFormatter={(num) => `${(num * 100).toFixed(0)}%`}
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={[0, 1]}
        />
        <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="probability" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorUv)" />
        </AreaChart>
    </ResponsiveContainer>
  );
}
