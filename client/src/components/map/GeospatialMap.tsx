import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Hotspot, CitizenRequest } from '../../types';
import { Flame, Users, AlertCircle, TrendingUp, Layers, MapPin, Sparkles, ExternalLink } from 'lucide-react';

// Fix leaflet marker icon path
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface GeospatialMapProps {
  hotspots: Hotspot[];
  selectedHotspot: Hotspot | null;
  onSelectHotspot: (hotspot: Hotspot | null) => void;
  filteredRequests: CitizenRequest[];
}

// Map center adjuster helper
const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
};

export const GeospatialMap: React.FC<GeospatialMapProps> = ({
  hotspots,
  selectedHotspot,
  onSelectHotspot,
  filteredRequests
}) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>([23.5937, 80.9629]); // Central India
  const [zoomLevel, setZoomLevel] = useState<number>(5);
  const [layerMode, setLayerMode] = useState<'hotspots' | 'requests' | 'combined'>('combined');

  useEffect(() => {
    if (selectedHotspot) {
      setMapCenter([selectedHotspot.latitude, selectedHotspot.longitude]);
      setZoomLevel(9);
    }
  }, [selectedHotspot]);

  const getHotspotColor = (score: number) => {
    if (score >= 80) return '#dc2626'; // Deep Red (Critical Demand)
    if (score >= 65) return '#ea580c'; // Orange (High Demand)
    if (score >= 50) return '#eab308'; // Yellow (Medium Demand)
    return '#10b981'; // Emerald Green (Low Demand)
  };

  const getHotspotRadius = (requestCount: number, score: number) => {
    return Math.min(42, Math.max(16, (requestCount / 5) + (score / 4)));
  };

  return (
    <div className="relative w-full h-[520px] rounded-2xl overflow-hidden border border-slate-300 shadow-elevated bg-slate-900">
      {/* Map Control Overlay */}
      <div className="absolute top-3 left-3 z-[400] flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-md text-xs font-semibold">
        <span className="text-slate-500 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-gov-600" />
          Layer:
        </span>
        <button
          onClick={() => setLayerMode('combined')}
          className={`px-2 py-0.5 rounded-md transition ${layerMode === 'combined' ? 'bg-gov-700 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          Combined View
        </button>
        <button
          onClick={() => setLayerMode('hotspots')}
          className={`px-2 py-0.5 rounded-md transition ${layerMode === 'hotspots' ? 'bg-gov-700 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          Hotspot Clusters ({hotspots.length})
        </button>
        <button
          onClick={() => setLayerMode('requests')}
          className={`px-2 py-0.5 rounded-md transition ${layerMode === 'requests' ? 'bg-gov-700 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          Citizen Pins ({filteredRequests.length})
        </button>
      </div>

      {/* Legend Card */}
      <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-md p-3 rounded-xl border border-slate-200 shadow-lg text-[11px] space-y-1.5">
        <div className="font-bold text-slate-800 text-xs flex items-center gap-1">
          <Flame className="w-3.5 h-3.5 text-red-500" />
          <span>Demand Hotspot Intensity</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-600 shadow-sm"></span>
          <span className="text-slate-700">Critical Demand (Score 80–100)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-orange-500 shadow-sm"></span>
          <span className="text-slate-700">High Demand (Score 65–79)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm"></span>
          <span className="text-slate-700">Medium Demand (Score 50–64)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm"></span>
          <span className="text-slate-700">Low / Stable (Score &lt; 50)</span>
        </div>
      </div>

      {/* Reset Map Button */}
      <button
        onClick={() => {
          onSelectHotspot(null);
          setMapCenter([23.5937, 80.9629]);
          setZoomLevel(5);
        }}
        className="absolute top-3 right-3 z-[400] bg-white/95 hover:bg-white text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 shadow-md text-xs font-bold transition flex items-center gap-1.5"
      >
        <span>Reset India View</span>
      </button>

      {/* Leaflet Map */}
      <MapContainer
        center={mapCenter}
        zoom={zoomLevel}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <MapController center={mapCenter} zoom={zoomLevel} />
        
        {/* High-contrast clean OpenStreetMap tile layer (100% free, zero watermarks) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Hotspot Circles */}
        {(layerMode === 'hotspots' || layerMode === 'combined') &&
          hotspots.map((h) => {
            const color = getHotspotColor(h.hotspotScore);
            const radius = getHotspotRadius(h.requestCount, h.hotspotScore);
            const isSelected = selectedHotspot?.id === h.id;

            return (
              <CircleMarker
                key={h.id}
                center={[h.latitude, h.longitude]}
                radius={radius}
                pathOptions={{
                  fillColor: color,
                  fillOpacity: isSelected ? 0.85 : 0.6,
                  color: isSelected ? '#1e293b' : color,
                  weight: isSelected ? 3 : 1.5
                }}
                eventHandlers={{
                  click: () => onSelectHotspot(h)
                }}
              >
                <Popup>
                  <div className="p-3 max-w-xs space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                      <span className="font-extrabold text-sm text-slate-900">{h.district}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {h.state}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-semibold">Hotspot Score</span>
                      <span className="font-extrabold text-base" style={{ color }}>
                        {h.hotspotScore}/100
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <div>
                        <span className="text-slate-400 block font-medium">Demands:</span>
                        <span className="font-bold text-slate-800">{h.requestCount} Submissions</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Affected Pop:</span>
                        <span className="font-bold text-slate-800">~{h.affectedPopulation.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="text-[11px]">
                      <span className="text-slate-500 font-semibold block mb-0.5">Top Infrastructure Demands:</span>
                      <div className="flex flex-wrap gap-1">
                        {h.topCategories.slice(0, 2).map((c, i) => (
                          <span key={i} className="px-1.5 py-0.5 bg-gov-50 text-gov-800 rounded border border-gov-100 font-medium">
                            {c.category} ({c.count})
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-700 bg-amber-50/80 p-2 rounded border border-amber-200">
                      <strong className="text-amber-900 block font-bold">Recommended Intervention:</strong>
                      {h.recommendedIntervention}
                    </div>

                    <button
                      onClick={() => onSelectHotspot(h)}
                      className="w-full mt-2 py-1.5 bg-gov-700 hover:bg-gov-800 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 shadow-sm"
                    >
                      <span>Inspect Hotspot Demands</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}

        {/* Individual Citizen Request Markers */}
        {(layerMode === 'requests' || layerMode === 'combined') &&
          filteredRequests.slice(0, 150).map((r) => (
            <CircleMarker
              key={r.id}
              center={[r.location.latitude, r.location.longitude]}
              radius={4}
              pathOptions={{
                fillColor: '#0284c7',
                fillOpacity: 0.8,
                color: '#ffffff',
                weight: 1
              }}
            >
              <Popup>
                <div className="p-2.5 max-w-xs text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-800 border-b pb-1">
                    <span>{r.requestId}</span>
                    <span className="text-[10px] text-gov-700">{r.category}</span>
                  </div>
                  <p className="text-slate-700 italic">"{r.text}"</p>
                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                    <span>{r.location.cityOrVillage || r.location.district}</span>
                    <span className="font-bold text-gov-800">Priority: {r.priorityScore}/100</span>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
      </MapContainer>
    </div>
  );
};
