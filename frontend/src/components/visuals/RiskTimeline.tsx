import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { day: 'Day 0', risk: 20 },
  { day: 'Day 15', risk: 25 },
  { day: 'Day 30', risk: 45 }, // Rising risk
  { day: 'Day 45', risk: 60 },
  { day: 'Day 60', risk: 85 }, // Critical forecast
  { day: 'Day 90', risk: 90 },
];

export function RiskTimeline() {
  return (
    <div className="h-full w-full bg-slate-900/50 rounded-xl border border-slate-800 p-4 flex flex-col">
       <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-slate-300">Predictive Risk Forecast (90 Days)</h3>
        <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded border border-red-500/50">High Risk Trend</span>
      </div>
      <div className="flex-1 min-h-[150px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="day" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
              itemStyle={{ color: '#ef4444' }}
            />
            <Area type="monotone" dataKey="risk" stroke="#ef4444" fillOpacity={1} fill="url(#colorRisk)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}