import { useMemo } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { motion } from "framer-motion";

// GeoJSON for the world map (standard low-res)
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface Site {
  id: string;
  name: string;
  lat: number;
  lng: number;
  dqi: number;
  status: string;
}

interface WorldMapProps {
  sites: Site[];
  onSiteClick: (site: Site) => void;
}

export function WorldMap({ sites, onSiteClick }: WorldMapProps) {
  // Color scale: Red (40) to Green (100)
  const colorScale = scaleLinear<string>()
    .domain([50, 80, 100])
    .range(["#ef4444", "#eab308", "#22c55e"]);

  return (
    <div className="w-full h-full bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden relative">
      <div className="absolute top-4 left-4 z-10 bg-slate-950/80 p-2 rounded-lg border border-slate-800 backdrop-blur-sm">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Global Site Operations</h3>
        <div className="flex gap-4 mt-1 text-[10px] text-slate-500">
          <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-green-500 mr-1"/> Healthy ({sites.filter(s => s.dqi >= 80).length})</span>
          <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-red-500 mr-1"/> Critical ({sites.filter(s => s.dqi < 60).length})</span>
        </div>
      </div>

      <ComposableMap projectionConfig={{ scale: 180, center: [20, 0] }} style={{ width: "100%", height: "100%" }}>
        <Geographies geography={geoUrl}>
          {({ geographies }: { geographies: any[] }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#1e293b"
                stroke="#334155"
                strokeWidth={0.5}
                style={{
                  default: { outline: "none" },
                  hover: { fill: "#334155", outline: "none" },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>

        {sites.map((site) => (
          <Marker 
            key={site.id} 
            coordinates={[site.lng, site.lat]} 
            onClick={() => onSiteClick(site)}
            className="cursor-pointer group"
          >
            {/* Pulsing Effect for Critical Sites (Site 42) */}
            {site.dqi < 60 && (
              <motion.circle
                r={12}
                fill="#ef4444"
                initial={{ opacity: 0.5, scale: 0.5 }}
                animate={{ opacity: 0, scale: 2 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
              />
            )}
            
            {/* The Dot */}
            <circle
              r={4}
              fill={colorScale(site.dqi)}
              stroke="#0f172a"
              strokeWidth={1}
              className="transition-all duration-300 group-hover:r-6"
            />
            
            {/* Tooltip on Hover */}
            <text
              textAnchor="middle"
              y={-10}
              style={{ fontFamily: "system-ui", fill: "white", fontSize: "10px", pointerEvents: "none" }}
              className="opacity-0 group-hover:opacity-100 transition-opacity font-bold shadow-black drop-shadow-md"
            >
              {site.name.split(" - ")[0]}
            </text>
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
}