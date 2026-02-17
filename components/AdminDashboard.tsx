
import React, { useMemo } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';
import { AppState, Campaign } from '../types';
import { MOCK_CREW, STATUS_COLORS, STATUS_HEX, STATUS_LABELS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AdminDashboardProps {
  state: AppState;
  onUpdateCampaign: (campaign: Campaign) => void;
  onAddCampaign: (name: string, neighborhood: string) => void;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 34.0522,
  lng: -118.2437
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeControl: false,
  scaleControl: true,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: true,
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ state, onAddCampaign }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });

  const handleNewCampaign = () => {
    const name = prompt("Enter Campaign Name (e.g., Spring 2024 Flyers):");
    if (!name) return;
    const neighborhood = prompt("Enter Target Neighborhood (e.g., North Heights):");
    if (!neighborhood) return;
    onAddCampaign(name, neighborhood);
  };

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstOfMonth = new Date();
    firstOfMonth.setDate(1);
    firstOfMonth.setHours(0, 0, 0, 0);

    return {
      totalDrops: state.drops.length,
      monthDrops: state.drops.filter(d => new Date(d.timestamp) >= firstOfMonth).length,
      conversion: state.drops.length > 0 ? (state.leads.length / state.drops.length * 100).toFixed(1) : '0',
      activeCrew: MOCK_CREW.length,
      todayDrops: state.drops.filter(d => new Date(d.timestamp) >= today).length,
      byStatus: {
        dropped: state.drops.filter(d => d.status === 'dropped').length,
        skipped: state.drops.filter(d => d.status === 'skipped').length,
        noSoliciting: state.drops.filter(d => d.status === 'no-soliciting').length,
        existingClient: state.drops.filter(d => d.status === 'existing-client').length,
      }
    };
  }, [state]);

  const chartData = useMemo(() => {
    const statuses = ['dropped', 'skipped', 'no-soliciting', 'existing-client'];
    return statuses.map(s => ({
      name: s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' '),
      count: state.drops.filter(d => d.status === s).length,
      color: (STATUS_HEX as any)[s]
    }));
  }, [state.drops]);

  const center = useMemo(() => {
    if (state.drops.length > 0) {
      return { lat: state.drops[0].lat, lng: state.drops[0].lng };
    }
    return defaultCenter;
  }, [state.drops]);

  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-6 pb-24">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Strategic Oversight • {state.company?.name}</p>
        </div>

        <div className="flex gap-3">
          <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${state.company?.subscription_status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{state.company?.plan_type} Plan</span>
          </div>
          <div className="bg-slate-900 px-4 py-2 rounded-2xl shadow-sm flex items-center gap-2">
            <span className="text-[10px] font-black text-white uppercase tracking-widest">{state.company?.subscription_status}</span>
          </div>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Drops</p>
          <p className="text-4xl font-black text-slate-900">{stats.totalDrops}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Monthly Usage</p>
          <p className="text-4xl font-black text-emerald-600">{stats.monthDrops}</p>
          <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">Resetting in 12 days</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Crew</p>
          <p className="text-4xl font-black text-amber-500">{stats.activeCrew}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Conversion</p>
          <p className="text-4xl font-black text-sky-600">{stats.conversion}%</p>
        </div>
      </div>

      {/* Map Overview */}
      <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden mb-8">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <h3 className="text-xl font-black text-slate-800 tracking-tight">Live Map Overview</h3>
          <div className="flex gap-4">
            {Object.entries(STATUS_HEX).map(([status, color]) => (
              <div key={status} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{(STATUS_LABELS as any)[status]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="h-[500px] w-full relative">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={14}
              options={mapOptions}
            >
              {state.drops.map((drop) => (
                <MarkerF
                  key={drop.id}
                  position={{ lat: drop.lat, lng: drop.lng }}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 7,
                    fillColor: (STATUS_HEX as any)[drop.status] || "#94a3b8",
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: "#ffffff",
                  }}
                />
              ))}
            </GoogleMap>
          ) : (
            <div className="h-full bg-slate-100 flex items-center justify-center">
              <p className="font-black text-slate-400 uppercase tracking-widest">Loading Analytics Map...</p>
            </div>
          )}
        </div>
      </div>

      {/* Stats Breakdown */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Distribution Chart */}
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
          <h3 className="text-xl font-black text-slate-800 mb-8 tracking-tight">Status Distribution</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" fontSize={10} axisLine={false} tickLine={false} width={100} />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
                />
                <Bar dataKey="count" radius={[0, 10, 10, 0]} barSize={32}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Quick Counts */}
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(STATUS_LABELS).map(([key, label]) => (
            <div key={key} className="bg-white p-8 rounded-[2.5rem] shadow-sm border-2 border-slate-50 flex flex-col items-center justify-center text-center">
              <div className={`w-4 h-4 rounded-full mb-4`} style={{ backgroundColor: (STATUS_HEX as any)[key] }}></div>
              <p className="text-4xl font-black text-slate-900 mb-1">{(stats.byStatus as any)[key === 'no-soliciting' ? 'noSoliciting' : key === 'existing-client' ? 'existingClient' : key]}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Campaigns List */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6 px-2">
          <h3 className="text-xl font-black text-slate-800 tracking-tight">Active Campaigns</h3>
          <button
            onClick={handleNewCampaign}
            className="bg-emerald-500 text-white font-black text-xs uppercase tracking-widest px-6 py-3 rounded-2xl shadow-lg shadow-emerald-200 active:scale-95 transition-transform"
          >
            + New Campaign
          </button>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {state.campaigns.map(camp => (
            <div key={camp.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-6 group hover:shadow-xl transition-shadow">
              <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center p-2 group-hover:bg-white border border-slate-100 transition-colors">
                <img src={camp.qrCodeUrl} alt="QR" className="w-full h-full" />
              </div>
              <div className="flex-1">
                <h4 className="font-black text-slate-800 text-lg leading-tight mb-1">{camp.name}</h4>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-3">{camp.targetNeighborhood}</p>
                <div className="flex gap-2">
                  <span className="text-[9px] font-black text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">{camp.stats.totalDrops} Drops</span>
                  <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">{camp.stats.scans} Scans</span>
                </div>
              </div>
              <button className="p-3 text-slate-300 group-hover:text-emerald-500 transition-colors bg-slate-50 rounded-2xl">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
