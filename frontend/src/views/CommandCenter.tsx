import { useEffect, useState } from 'react';
import axios from 'axios';
// import { WorldMap } from '../visuals/WorldMap';
// import { RiskTimeline } from '../visuals/RiskTimeline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { WorldMap } from '@/components/visuals/WorldMap';
import { RiskTimeline } from '@/components/visuals/RiskTimeline';

// Mock Alert Feed Data
const ALERTS = [
  { id: 1, msg: "Site 042 DQI dropped 15 points", type: "critical", time: "2m ago" },
  { id: 2, msg: "Site 004 Missing 3 Lab Reports", type: "warning", time: "15m ago" },
  { id: 3, msg: "Site 021 Enrollment Target Met", type: "success", time: "1h ago" },
];

export function CommandCenter({ onNavigate }: { onNavigate: (view: string, context?: any) => void }) {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Data from your FastAPI Backend
  useEffect(() => {
    axios.get('http://localhost:8000/api/sites')
      .then(res => {
        setSites(res.data);
        setLoading(false);
      })
      .catch(err => console.error("API Error:", err));
  }, []);

  const handleSiteClick = (site: any) => {
    if (site.id === '042') {
      // Navigate to Agent Workspace with Site 42 context
      onNavigate('agents', { siteId: '042' });
    }
  };

  return (
    <div className="h-full flex flex-col gap-4 p-6 bg-slate-950 text-white overflow-hidden">
      {/* Top Stats Row */}
      <div className="grid grid-cols-4 gap-4 h-[120px]">
        <StatsCard title="Avg DQI Score" value="87.4" sub="-1.2% vs last week" icon={<Activity className="text-blue-400" />} />
        <StatsCard title="Critical Alerts" value="3" sub="Requires Attention" icon={<AlertTriangle className="text-red-500 animate-pulse" />} highlight />
        <StatsCard title="Sites Active" value="45" sub="6 Regions" icon={<CheckCircle className="text-green-400" />} />
        <StatsCard title="Next DB Lock" value="180d" sub="On Track" icon={<Clock className="text-purple-400" />} />
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
        
        {/* Left: Map (8 cols) */}
        <div className="col-span-8 h-full flex flex-col gap-4">
          <WorldMap sites={sites} onSiteClick={handleSiteClick} />
        </div>

        {/* Right: Timeline & Alerts (4 cols) */}
        <div className="col-span-4 h-full flex flex-col gap-4">
          
          {/* 1. Risk Timeline */}
          <div className="h-1/3">
            <RiskTimeline />
          </div>

          {/* 2. Live Alert Feed */}
          <Card className="flex-1 border-slate-800 bg-slate-900/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Live Operational Feed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ALERTS.map((alert, i) => (
                  <motion.div 
                    key={alert.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.2 }}
                    className={`p-3 rounded-lg border text-xs flex justify-between items-start ${
                      alert.type === 'critical' ? 'bg-red-950/30 border-red-900/50 text-red-200' :
                      alert.type === 'warning' ? 'bg-yellow-950/30 border-yellow-900/50 text-yellow-200' :
                      'bg-green-950/30 border-green-900/50 text-green-200'
                    }`}
                  >
                    <div>
                      <span className="font-bold block mb-1">{alert.type.toUpperCase()}</span>
                      {alert.msg}
                    </div>
                    <span className="text-slate-500 text-[10px]">{alert.time}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}

// Helper Component for Stats
function StatsCard({ title, value, sub, icon, highlight }: any) {
  return (
    <Card className={`border-slate-800 bg-slate-900/50 flex flex-col justify-center ${highlight ? 'ring-1 ring-red-500/50' : ''}`}>
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 font-medium">{title}</p>
          <div className="text-2xl font-bold text-slate-100 mt-1">{value}</div>
          <p className="text-[10px] text-slate-500 mt-1">{sub}</p>
        </div>
        <div className={`p-3 rounded-full bg-slate-950 border border-slate-800`}>{icon}</div>
      </CardContent>
    </Card>
  );
}