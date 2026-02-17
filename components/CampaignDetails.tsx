
import React, { useMemo } from 'react';
import { Campaign, Drop, AppState } from '../types';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';
import { STATUS_HEX, STATUS_LABELS } from '../constants';

interface CampaignDetailsProps {
    campaign: Campaign;
    drops: Drop[];
    onBack: () => void;
    onDelete: (id: string) => void;
}

const mapContainerStyle = {
    width: '100%',
    height: '100%',
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

const CampaignDetails: React.FC<CampaignDetailsProps> = ({ campaign, drops, onBack, onDelete }) => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    });

    const campaignDrops = useMemo(() => {
        return drops.filter(d => d.campaignId === campaign.id);
    }, [drops, campaign.id]);

    const center = useMemo(() => {
        if (campaignDrops.length > 0) {
            return { lat: campaignDrops[0].lat, lng: campaignDrops[0].lng };
        }
        return { lat: 34.0522, lng: -118.2437 }; // Default
    }, [campaignDrops]);

    return (
        <div className="h-full overflow-y-auto bg-slate-50 pb-32">
            {/* Header */}
            <header className="bg-white p-8 border-b border-slate-100 sticky top-0 z-20 shadow-sm">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={onBack}
                            className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 transition-all active:scale-95"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div>
                            <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-none mb-1">{campaign.name}</h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{campaign.targetNeighborhood} • Started {new Date(campaign.startDate).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => {
                                if (confirm('Are you sure? This will delete all drop data for this campaign.')) {
                                    onDelete(campaign.id);
                                }
                            }}
                            className="p-4 bg-red-50 text-red-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all active:scale-95"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto p-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Drops</p>
                        <p className="text-4xl font-black text-slate-900">{campaign.stats.totalDrops}</p>
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 text-emerald-600">
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">QR Scans</p>
                        <p className="text-4xl font-black">{campaign.stats.scans}</p>
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Scan Rate</p>
                        <p className="text-4xl font-black text-slate-900">
                            {campaign.stats.totalDrops > 0 ? ((campaign.stats.scans / campaign.stats.totalDrops) * 100).toFixed(1) : 0}%
                        </p>
                    </div>
                    <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white">
                        <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center mb-4">
                            <img src={campaign.qrCodeUrl} alt="QR" className="w-8 h-8 invert" />
                        </div>
                        <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1">QR Status</p>
                        <p className="text-xl font-black">Active Link</p>
                    </div>
                </div>

                {/* Map & List */}
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden h-[600px]">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                            <h3 className="text-xl font-black text-slate-800 tracking-tight">Campaign Heatmap</h3>
                        </div>
                        <div className="h-full w-full">
                            {isLoaded ? (
                                <GoogleMap
                                    mapContainerStyle={mapContainerStyle}
                                    center={center}
                                    zoom={15}
                                    options={mapOptions}
                                >
                                    {campaignDrops.map((drop) => (
                                        <MarkerF
                                            key={drop.id}
                                            position={{ lat: drop.lat, lng: drop.lng }}
                                            icon={{
                                                path: google.maps.SymbolPath.CIRCLE,
                                                scale: 8,
                                                fillColor: (STATUS_HEX as any)[drop.status] || "#94a3b8",
                                                fillOpacity: 1,
                                                strokeWeight: 2,
                                                strokeColor: "#ffffff",
                                            }}
                                        />
                                    ))}
                                </GoogleMap>
                            ) : (
                                <div className="h-full bg-slate-50 flex items-center justify-center">
                                    <p className="font-black text-slate-300 uppercase tracking-widest">Loading Map...</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h3 className="text-xl font-black text-slate-800 tracking-tight px-2">Drop History</h3>
                        <div className="space-y-4">
                            {campaignDrops.length === 0 ? (
                                <div className="py-12 bg-white rounded-[2rem] border border-slate-100 flex flex-col items-center justify-center text-center">
                                    <p className="text-slate-300 font-black uppercase text-xs tracking-widest">No Drops Yet</p>
                                </div>
                            ) : (
                                campaignDrops.map(drop => (
                                    <div key={drop.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4">
                                        <div className={`w-3 h-3 rounded-full shrink-0`} style={{ backgroundColor: (STATUS_HEX as any)[drop.status] }}></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-black text-slate-800 truncate mb-1">{drop.address || 'Unknown Address'}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                {new Date(drop.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CampaignDetails;
