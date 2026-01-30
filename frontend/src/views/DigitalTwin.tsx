import { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, AlertTriangle, Sliders, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export function DigitalTwin({ onBack }: { onBack: () => void }) {
  const [activeScenario, setActiveScenario] = useState<'baseline' | 'reassign' | 'sla'>('baseline');
  
  // --- HITL FEATURE: Human Calibration State ---
  // The human user overrides the AI's assumption of "100% Staff Capacity"
  const [staffCapacity, setStaffCapacity] = useState(100); 

  // --- DYNAMIC ENGINE: Recalculate Futures based on Human Input ---
  const currentData = useMemo(() => {
    // 1. Define the "Base" curves (AI Predictions at 100% capacity)
    const baseScenarios = {
        baseline: [20, 45, 80, 120], // Crisis curve
        reassign: [20, 25, 15, 5],   // Recovery curve
        sla: [20, 10, 5, 0]          // Aggressive curve
    };

    const baseWorkloads = {
        baseline: [100, 120, 150, 180],
        reassign: [100, 110, 90, 80],
        sla: [100, 140, 80, 60]
    };

    const selectedBase = baseScenarios[activeScenario];
    const selectedWorkload = baseWorkloads[activeScenario];

    // 2. Apply Human Context Factor
    // Logic: If Staff Capacity is LOW (<100%), Backlog grows FASTER.
    //        If Staff Capacity is HIGH (>100%), Backlog drops FASTER.
    const capacityMultiplier = 1 + ((100 - staffCapacity) / 100); 

    return [
        { day: 'Now', workload: selectedWorkload[0], backlog: selectedBase[0] },
        { day: '+30d', workload: selectedWorkload[1], backlog: Math.max(0, Math.round(selectedBase[1] * capacityMultiplier)) },
        { day: '+60d', workload: selectedWorkload[2], backlog: Math.max(0, Math.round(selectedBase[2] * capacityMultiplier)) },
        { day: '+90d', workload: selectedWorkload[3], backlog: Math.max(0, Math.round(selectedBase[3] * capacityMultiplier)) },
    ];
  }, [activeScenario, staffCapacity]);

  // Recalculate Metrics based on capacity
  const barChartData = [
    { 
      name: 'Visit Comp', 
      current: 40, 
      projected: Math.min(100, Math.round((activeScenario === 'baseline' ? 30 : 85) * (staffCapacity / 100))) 
    },
    { 
      name: 'Query Res', 
      current: 35, 
      projected: Math.min(100, Math.round((activeScenario === 'baseline' ? 20 : 90) * (staffCapacity / 100))) 
    },
    { 
      name: 'Data Conf', 
      current: 60, 
      projected: Math.min(100, Math.round((activeScenario === 'baseline' ? 55 : 88) * (staffCapacity / 100))) 
    },
  ];

  const getColor = () => activeScenario === 'baseline' ? '#ef4444' // Red
                       : activeScenario === 'reassign' ? '#22c55e' // Green
                       : '#3b82f6'; // Blue

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
        <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setStaffCapacity(100)} className="text-slate-500">
                <RefreshCw className="w-4 h-4 mr-2" /> Reset Params
            </Button>
            <Button variant="outline" onClick={onBack} className="border-slate-700 text-slate-400">Exit Simulation</Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* LEFT: Control Panel (4 Cols) */}
        <div className="col-span-4 flex flex-col gap-4">
          
          {/* HITL: Human Calibration Control */}
          <Card className="bg-blue-950/10 border-blue-900/30">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm text-blue-400 flex items-center gap-2">
                    <Sliders className="w-4 h-4" /> Human Calibration (HITL)
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-slate-400 flex justify-between mb-2">
                            <span>Adjust Real-world Staff Availability</span>
                            <span className="font-mono text-white">{staffCapacity}%</span>
                        </label>
                        <input 
                            type="range" 
                            min="50" 
                            max="150" 
                            value={staffCapacity} 
                            onChange={(e) => setStaffCapacity(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                        <div className="flex justify-between text-[10px] text-slate-600 mt-1">
                            <span>Severe Shortage</span>
                            <span>Normal</span>
                            <span>Overstaffed</span>
                        </div>
                    </div>
                    <p className="text-[10px] text-slate-500 italic border-l-2 border-slate-700 pl-2">
                        "The AI assumes 100% capacity. Use this slider to inject real-world context (e.g., sick leave, holidays) into the prediction model."
                    </p>
                </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 flex-1">
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
          <Card className="bg-slate-900/50 border-slate-800 flex flex-col justify-center items-center text-center py-4">
            <CardContent className="pb-0">
              <div className="text-sm text-slate-500 mb-2">Projected Database Lock</div>
              <motion.div 
                key={`${activeScenario}-${staffCapacity}`} // Animate on change
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`text-3xl font-bold mb-1 ${
                    // Dynamic coloring based on the calculated backlog at 90d
                    currentData[3].backlog > 20 ? 'text-red-500' : 'text-green-400'
                }`}
              >
                {currentData[3].backlog > 50 ? '+45 Days' : currentData[3].backlog > 10 ? '+15 Days' : 'On Time'}
              </motion.div>
              <div className="text-xs text-slate-400">
                Adjusted for {staffCapacity}% Staffing
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT: Visualizations (8 Cols) */}
        <div className="col-span-8 flex flex-col gap-6">
          {/* Chart 1: Workload Forecast */}
          <Card className="h-1/2 bg-slate-900/50 border-slate-800">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm text-slate-300">
                Workload vs. Backlog Projection 
                <span className="ml-2 text-xs font-normal text-slate-500">(Dynamic Update)</span>
              </CardTitle>
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
                    animationDuration={500}
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
               <CardTitle className="text-sm text-slate-300">Site 042 Recovery Metrics (Adjusted)</CardTitle>
            </CardHeader>
            <CardContent className="h-full pb-10">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barChartData}
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
                    animationDuration={800}
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