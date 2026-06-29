'use client';

import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl, LayerGroup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { AlertOctagon, Clock } from 'lucide-react';
import Link from 'next/link';
import HeatmapLayer from './HeatmapLayer';

const createCustomIcon = (color: string, isEmergency: boolean) => {
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `<div style="
      background-color: ${color};
      width: ${isEmergency ? '24px' : '16px'};
      height: ${isEmergency ? '24px' : '16px'};
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 0 10px ${color};
      ${isEmergency ? 'animation: pulse-ring 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;' : ''}
    "></div>`,
    iconSize: isEmergency ? [24, 24] : [16, 16],
    iconAnchor: isEmergency ? [12, 12] : [8, 8],
  });
};

function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

interface IssueMapProps {
  issues: any[];
}

export default function IssueMap({ issues }: IssueMapProps) {
  const defaultCenter: [number, number] = [19.0760, 72.8777];
  const center = issues.length > 0 && issues[0].location?.coordinates
    ? [issues[0].location.coordinates[1], issues[0].location.coordinates[0]] as [number, number]
    : defaultCenter;

  const heatPoints = issues
    .filter(i => i.location?.coordinates)
    .map(i => [
      i.location.coordinates[1], 
      i.location.coordinates[0], 
      i.severity === 'critical' ? 1.0 : i.severity === 'high' ? 0.7 : 0.4
    ] as [number, number, number]);

  return (
    <div className="w-full h-full min-h-[500px] z-0 rounded-xl overflow-hidden shadow-xl border border-border relative">
      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { transform: scale(1.1); box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); }
          100% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
      `}</style>
      <MapContainer 
        key={typeof window !== 'undefined' ? window.location.pathname : 'map'}
        center={center} 
        zoom={12} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%', background: '#0f172a' }} // Dark background for dark mode map tiles
      >
        <ChangeView center={center} zoom={12} />
        
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Dark Matter (Premium)">
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">Carto</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Voyager (Light)">
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
          </LayersControl.BaseLayer>

          <LayersControl.Overlay checked name="Issue Heatmap">
            <LayerGroup>
              <HeatmapLayer points={heatPoints} />
            </LayerGroup>
          </LayersControl.Overlay>

          <LayersControl.Overlay checked name="Active Incidents (Clustered)">
            <MarkerClusterGroup
              chunkedLoading
              polygonOptions={{ fillColor: '#2563eb', color: '#2563eb', weight: 1, opacity: 0.5 }}
            >
              {issues.map((issue) => {
                if (!issue.location || !issue.location.coordinates) return null;
                const position: [number, number] = [issue.location.coordinates[1], issue.location.coordinates[0]];
                const isEmergency = issue.aiAnalysis?.isEmergency || issue.severity === 'critical';
                const color = isEmergency ? '#ef4444' : issue.status === 'completed' ? '#22c55e' : '#f59e0b';
                
                return (
                  <Marker key={issue._id} position={position} icon={createCustomIcon(color, isEmergency)}>
                    <Popup className="rounded-xl overflow-hidden border-0 bg-background/95 backdrop-blur shadow-2xl">
                      <div className="p-2 min-w-[200px]">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-bold text-sm block text-foreground">{issue.title}</span>
                          {isEmergency && <span className="bg-destructive/20 text-destructive text-[10px] px-1.5 py-0.5 rounded font-bold animate-pulse flex items-center"><AlertOctagon className="w-3 h-3 mr-1"/> SOS</span>}
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">{issue.aiAnalysis?.summary || issue.description}</p>
                        
                        <div className="bg-accent/50 p-2 rounded text-xs space-y-1 mb-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground font-medium">Trust Score</span>
                            <span className={`font-bold ${issue.trustScore > 80 ? 'text-success' : 'text-warning'}`}>{issue.trustScore}/100</span>
                          </div>
                          {issue.aiAnalysis?.estimatedResolutionTime && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground font-medium">ETA</span>
                              <span className="font-bold text-primary flex items-center"><Clock className="w-3 h-3 mr-1"/>{issue.aiAnalysis.estimatedResolutionTime}</span>
                            </div>
                          )}
                        </div>
                        
                        <Link href={`/issues/${issue._id}`} className="block w-full text-center bg-primary text-primary-foreground py-1.5 rounded text-xs font-semibold hover:bg-primary/90 transition-colors">
                          View Deep Analysis
                        </Link>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MarkerClusterGroup>
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
    </div>
  );
}
