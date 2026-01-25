import { useState } from 'react';
import axios from 'axios';
import { AgentNetwork } from '@/components/visuals/AgentNetwork';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, CheckCircle, ArrowLeft, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock script structure for the UI
interface AgentLog {
  id: string;
  agent: string;
  msg: string;
  type: 'info' | 'alert' | 'success';
}

export function AgentWorkspace({ siteId, onBack }: { siteId: string, onBack: () => void }) {
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [showPlan, setShowPlan] = useState(false);

  const runSimulation = async () => {
    setIsRunning(true);
    setLogs([]); // Clear previous
    setShowPlan(false);

    try {
      // 1. Call Backend to get the script
      const res = await axios.get(`http://localhost:8000/api/agents/run/${siteId}`);
      const script = res.data.agents; // { DataQuality: {...}, SitePerformance: {...} }

      // 2. Play out the script sequentially (The "Movie" effect)
      
      // Step A: Data Quality Agent (The Trigger)
      setActiveAgent('quality');
      addLog('quality', script.DataQuality.message, 'alert');
      await wait(2000);

      // Step B: Site Performance Agent (The Root Cause)
      setActiveAgent('site');
      addLog('site', script.SitePerformance.message, 'info');
      await wait(2500);

      // Step C: Orchestrator (The Solution)
      setActiveAgent('orchestrator');
      addLog('orchestrator', "Synthesizing mitigation strategy...", 'info');
      await wait(1500);
      addLog('orchestrator', script.Orchestrator.message, 'success');
      
      // Finish
      setActiveAgent(null);
      setIsRunning(false);
      setShowPlan(true);

    } catch (err) {
      console.error("Simulation failed", err);
      setIsRunning(false);
    }
  };

  const addLog = (agent: string, msg: string, type: any) => {
    setLogs(prev => [...prev, { id: Date.now().toString(), agent, msg, type }]);
  };

  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  return (
    <div className="h-full bg-slate-950 p-6 flex flex-col gap-6 text-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="text-slate-400 hover:text-white p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              Agent Workspace <Badge variant="critical" className="animate-pulse">Site {siteId} Crisis</Badge>
            </h1>
            <p className="text-slate-500 text-sm">Autonomous Multi-Agent Investigation</p>
          </div>
        </div>
        <Button 
          onClick={runSimulation} 
          disabled={isRunning}
          className="bg-blue-600 hover:bg-blue-500 text-white min-w-[150px]"
        >
          {isRunning ? <Terminal className="w-4 h-4 mr-2 animate-spin"/> : <Play className="w-4 h-4 mr-2"/>}
          {isRunning ? 'Agents Active...' : 'Initiate Protocol'}
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Left: Visualization (4 cols) */}
        <div className="col-span-4 flex flex-col gap-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-sm text-slate-400">Neural Link Status</CardTitle>
            </CardHeader>
            <CardContent>
              <AgentNetwork activeAgent={activeAgent} />
            </CardContent>
          </Card>

          {/* Corrective Action Plan (Appears at end) */}
          <AnimatePresence>
            {showPlan && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <Card className="bg-green-950/20 border-green-900">
                  <CardHeader>
                    <CardTitle className="text-green-400 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" /> Recommended Action
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-green-100/80 space-y-2">
                    <p>1. Reassign Senior CRA from Site 008.</p>
                    <p>2. Initiate Remote Monitoring Audit.</p>
                    <Button className="w-full mt-4 bg-green-700 hover:bg-green-600 text-white text-sm py-1 px-3">
                      Auto-Execute (Digital Twin Verify)
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Live Logs (8 cols) */}
        <div className="col-span-8">
          <Card className="h-full bg-black border-slate-800 flex flex-col">
            <CardHeader className="border-b border-slate-900 py-3">
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs text-slate-500">SESSION_ID: {Date.now()}</span>
                <span className="flex items-center gap-2 text-xs text-slate-500">
                  <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`} />
                  {isRunning ? 'LIVE CONNECTION' : 'STANDBY'}
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-4 overflow-y-auto space-y-4 font-mono text-sm">
               {logs.length === 0 && !isRunning && (
                 <div className="h-full flex items-center justify-center text-slate-600 italic">
                   Waiting to initiate investigation protocol...
                 </div>
               )}
               {logs.map((log) => (
                 <motion.div 
                   key={log.id}
                   initial={{ opacity: 0, x: -10 }}
                   animate={{ opacity: 1, x: 0 }}
                   className={`p-3 rounded border-l-2 ${
                     log.type === 'alert' ? 'bg-red-950/20 border-red-500 text-red-200' :
                     log.type === 'success' ? 'bg-green-950/20 border-green-500 text-green-200' :
                     'bg-blue-950/20 border-blue-500 text-blue-200'
                   }`}
                 >
                   <span className="font-bold opacity-50 text-[10px] block mb-1 uppercase tracking-wider">
                     {log.agent} AGENT
                   </span>
                   {log.msg}
                 </motion.div>
               ))}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}