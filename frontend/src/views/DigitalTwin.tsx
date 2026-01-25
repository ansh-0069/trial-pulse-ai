import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

// --- MOCK DATA FOR SCENARIOS ---

// Baseline: Things are getting worse (Red Line)
const DATA_BASELINE = [
  { day: 'Now', workload: 100, backlog: 20 },
  { day: '+30d', workload: 120, backlog: 45 },
  { day: '+60d', workload: 150, backlog: 80 }, // Crisis
  { day: '+90d', workload: 180, backlog: 120 },
];

// Scenario 1: Reassign CRA (Green Line - Stabilization)
const DATA_REASSIGN = [
  { day: 'Now', workload: 100, backlog: 20 },
  { day: '+30d', workload: 110, backlog: 25 }, // Slower growth
  { day: '+60d', workload: 90, backlog: 15 },  // Recovery starts
  { day: '+90d', workload: 80, backlog: 5 },   // Solved
];

// Scenario 2: Change SLA (Blue Line - Aggressive Drop)
const DATA_SLA = [
  { day: 'Now', workload: 100, backlog: 20 },
  { day: '+30d', workload: 140, backlog: 10 }, // Higher workload initially
  { day: '+60d', workload: 80, backlog: 5 },   // Fast clear
  { day: '+90d', workload: 60, backlog: 0 },
];

export function DigitalTwin({ onBack }: { onBack: () => void }) {
  const [activeScenario, setActiveScenario] = useState<'baseline' | 'reassign' | 'sla'>('baseline');

  // Dynamic Data based on selection
  const currentData = activeScenario === 'baseline' ? DATA_BASELINE 
                    : activeScenario === 'reassign' ? DATA_REASSIGN 
                    : DATA_SLA;

  const getColor = () => activeScenario === 'baseline' ? '#ef4444' // Red
                       : activeScenario === 'reassign' ? '#22c55e' // Green
                       : '#3b82f6'; // Blue

  // FIX: Define BarChart data here, outside of JSX
  const barChartData = [
    { name: 'Visit Comp', current: 40, projected: activeScenario === 'baseline' ? 30 : 85 },
    { name: 'Query Res', current: 35, projected: activeScenario === 'baseline' ? 20 : 90 },
    { name: 'Data Conf', current: 60, projected: activeScenario === 'baseline' ? 55 : 88 },
  ];

  return (
    <div className="h-full bg-slate-950 p-6 flex flex-col gap-6 text-white overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Digital Twin Simulator 
            <Badge variant="warning" className="border-blue-500 text-blue-400">Predictive Engine Active</Badge>
          </h1>
          <p className="text-slate-500 text-sm">Monte Carlo Simulation (n=10,000 iterations)</p>
        </div>
        <Button variant="outline" onClick={onBack} className="border-slate-700 text-slate-400">Exit Simulation</Button>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* LEFT: Control Panel (4 Cols) */}
        <div className="col-span-4 flex flex-col gap-4">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader><CardTitle className="text-sm">Intervention Scenarios</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              
              {/* Scenario A: Baseline */}
              <button 
                onClick={() => setActiveScenario('baseline')}
                className={`w-full text-left p-4 rounded-lg border transition-all ${activeScenario === 'baseline' ? 'bg-red-950/30 border-red-500 ring-1 ring-red-500' : 'bg-slate-950 border-slate-800 hover:border-slate-600'}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-sm">Do Nothing (Baseline)</span>
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                </div>
                <p className="text-xs text-slate-400">Current trajectory. High risk of DB lock delay.</p>
              </button>

              {/* Scenario B: The Fix */}
              <button 
                onClick={() => setActiveScenario('reassign')}
                className={`w-full text-left p-4 rounded-lg border transition-all ${activeScenario === 'reassign' ? 'bg-green-950/30 border-green-500 ring-1 ring-green-500' : 'bg-slate-950 border-slate-800 hover:border-slate-600'}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-sm text-green-400">Strategy A: Reassign CRA</span>
                  <Users className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-xs text-slate-400">Deploy resource from Site 008. +20% capacity.</p>
              </button>

              {/* Scenario C: Alternative */}
              <button 
                onClick={() => setActiveScenario('sla')}
                className={`w-full text-left p-4 rounded-lg border transition-all ${activeScenario === 'sla' ? 'bg-blue-950/30 border-blue-500 ring-1 ring-blue-500' : 'bg-slate-950 border-slate-800 hover:border-slate-600'}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-sm text-blue-400">Strategy B: Change SLA</span>
                  <Clock className="w-4 h-4 text-blue-500" />
                </div>
                <p className="text-xs text-slate-400">Reduce query time 48h → 24h. High short-term load.</p>
              </button>

            </CardContent>
          </Card>

          {/* Impact Summary Box */}
          <Card className="flex-1 bg-slate-900/50 border-slate-800 flex flex-col justify-center items-center text-center">
            <CardContent>
              <div className="text-sm text-slate-500 mb-2">Projected Database Lock</div>
              <motion.div 
                key={activeScenario}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`text-4xl font-bold mb-1 ${activeScenario === 'baseline' ? 'text-red-500' : 'text-white'}`}
              >
                {activeScenario === 'baseline' ? '+45 Days' : activeScenario === 'reassign' ? 'On Time' : '-5 Days'}
              </motion.div>
              <div className="text-xs text-slate-400">
                Financial Impact: <span className={activeScenario === 'baseline' ? 'text-red-400' : 'text-green-400'}>
                  {activeScenario === 'baseline' ? '-$2.5M Revenue' : 'Savings Secured'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT: Visualizations (8 Cols) */}
        <div className="col-span-8 flex flex-col gap-6">
          {/* Chart 1: Workload Forecast */}
          <Card className="h-1/2 bg-slate-900/50 border-slate-800">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm text-slate-300">Workload vs. Backlog Projection</CardTitle>
            </CardHeader>
            <CardContent className="h-full pb-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentData}>
                  <defs>
                    <linearGradient id="colorSplit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={getColor()} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={getColor()} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="day" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="backlog" 
                    name="Backlog Count"
                    stroke={getColor()} 
                    fill="url(#colorSplit)" 
                    strokeWidth={3} 
                    animationDuration={1000}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="workload" 
                    name="Total Workload"
                    stroke="#64748b" 
                    fill="transparent" 
                    strokeDasharray="5 5" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Chart 2: Comparative Bar (Before vs After) */}
          <Card className="h-1/2 bg-slate-900/50 border-slate-800">
            <CardHeader className="pb-2">
               <CardTitle className="text-sm text-slate-300">Site 042 Recovery Metrics</CardTitle>
            </CardHeader>
            <CardContent className="h-full pb-10">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barChartData} // <--- USING THE VARIABLE HERE
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} />
                  <XAxis type="number" domain={[0, 100]} stroke="#64748b" />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" width={80} />
                  <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                  <Legend />
                  <Bar dataKey="current" name="Current Score" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={20} />
                  <Bar 
                    dataKey="projected" 
                    name="Projected Score (90d)" 
                    fill={activeScenario === 'baseline' ? '#7f1d1d' : '#22c55e'} 
                    radius={[0, 4, 4, 0]} 
                    barSize={20} 
                    animationDuration={1500}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}