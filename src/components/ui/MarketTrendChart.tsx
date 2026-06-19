"use client";

import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', interest: 1200, projection: 1200 },
  { name: 'Feb', interest: 1900, projection: 1900 },
  { name: 'Mar', interest: 3000, projection: 3000 },
  { name: 'Apr', interest: 2500, projection: 2500 },
  { name: 'May', interest: 4800, projection: 4800 },
  { name: 'Jun', interest: 4200, projection: 4200 },
  { name: 'Jul', interest: 5800, projection: 5800 },
  { name: 'Aug', interest: 6400, projection: 6400 },
  { name: 'Sep', interest: 7100, projection: 7100 },
  { name: 'Oct', interest: 8500, projection: 8500 },
  { name: 'Nov', interest: 10200, projection: null },
  { name: 'Dec', interest: null, projection: 12400 },
];

export function MarketTrendChart({ isAnimationActive = true }: { isAnimationActive?: boolean }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorProjection" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis 
          dataKey="name" 
          stroke="rgba(255,255,255,0.3)" 
          fontSize={10} 
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          stroke="rgba(255,255,255,0.3)" 
          fontSize={10} 
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value / 1000}k`}
        />
        <Tooltip 
          contentStyle={{ backgroundColor: '#0B0F0C', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
          itemStyle={{ color: '#fff' }}
        />
        <Area
          type="monotone"
          dataKey="interest"
          stroke="#22c55e"
          fillOpacity={1}
          fill="url(#colorInterest)"
          isAnimationActive={isAnimationActive}
        />
        <Area
          type="monotone"
          dataKey="projection"
          stroke="#06b6d4"
          strokeDasharray="5 5"
          fillOpacity={1}
          fill="url(#colorProjection)"
          isAnimationActive={isAnimationActive}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
