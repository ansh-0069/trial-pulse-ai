import { useState } from 'react';
import { CommandCenter } from './views/CommandCenter';
import { AgentWorkspace } from './views/AgentWorkspace';
import { DigitalTwin } from './views/DigitalTwin';
import { NLInterface } from './views/NLInterface';
import { Button } from '@/components/ui/button';
import { MessageSquare, LayoutDashboard } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState('command');
  const [context, setContext] = useState<{ siteId: string } | null>(null);

  const handleNavigate = (view: string, ctx?: any) => {
    if (ctx) setContext(ctx);
    setCurrentView(view);
  };

  return (
    <div className="w-screen h-screen bg-black text-slate-100 overflow-hidden font-sans relative">
      
      {/* Global Sidebar / Navigation (Floating) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-2 bg-slate-900/90 p-2 rounded-full border border-slate-700 shadow-2xl backdrop-blur-md">
        <Button 
          variant={currentView === 'command' ? 'default' : 'ghost'} 
          onClick={() => setCurrentView('command')}
          className="rounded-full"
        >
          <LayoutDashboard className="w-4 h-4 mr-2" /> Command
        </Button>
        <Button 
          variant={currentView === 'digital_twin' ? 'default' : 'ghost'} 
          onClick={() => setCurrentView('digital_twin')}
          className="rounded-full"
        >
          Digital Twin
        </Button>
        <Button 
          variant={currentView === 'nl_interface' ? 'default' : 'ghost'} 
          onClick={() => setCurrentView('nl_interface')}
          className="rounded-full"
        >
          <MessageSquare className="w-4 h-4 mr-2" /> AI Chat
        </Button>
      </div>

      {/* View Switcher */}
      {currentView === 'command' && <CommandCenter onNavigate={handleNavigate} />}
      
      {currentView === 'agents' && context && (
        <AgentWorkspace siteId={context.siteId} onBack={() => setCurrentView('command')} />
      )}
      
      {currentView === 'digital_twin' && <DigitalTwin onBack={() => setCurrentView('command')} />}
      
      {currentView === 'nl_interface' && <NLInterface onBack={() => setCurrentView('command')} />}

    </div>
  );
}

export default App;