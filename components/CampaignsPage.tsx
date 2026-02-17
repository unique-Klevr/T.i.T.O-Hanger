
import React from 'react';
import { AppState, Campaign } from '../types';

interface CampaignsPageProps {
    state: AppState;
    onAddCampaign: (name: string, neighborhood: string) => void;
    onSelectCampaign: (id: string) => void;
}

const CampaignsPage: React.FC<CampaignsPageProps> = ({ state, onAddCampaign, onSelectCampaign }) => {
    const handleNewCampaign = () => {
        const name = prompt("Enter Campaign Name (e.g., Spring 2024 Flyers):");
        if (!name) return;
        const neighborhood = prompt("Enter Target Neighborhood (e.g., North Heights):");
        if (!neighborhood) return;
        onAddCampaign(name, neighborhood);
    };

    return (
        <div className="h-full overflow-y-auto bg-slate-50 p-6 pb-32">
            <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Campaigns</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Manage your marketing territories</p>
                </div>

                <button
                    onClick={handleNewCampaign}
                    className="bg-emerald-500 text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded-2xl shadow-xl shadow-emerald-200 active:scale-95 transition-all flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                    </svg>
                    Create New Campaign
                </button>
            </header>

            {/* Campaign Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {state.campaigns.length === 0 ? (
                    <div className="col-span-full py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-black text-slate-800 mb-2">No Campaigns Yet</h3>
                        <p className="text-slate-400 font-bold text-sm max-w-xs mb-8">Create your first campaign to start tracking door hanger drops.</p>
                        <button onClick={handleNewCampaign} className="text-emerald-500 font-black text-xs uppercase tracking-widest">Start Now +</button>
                    </div>
                ) : (
                    state.campaigns.map(camp => (
                        <div
                            key={camp.id}
                            className={`bg-white p-8 rounded-[3rem] shadow-sm border-2 transition-all hover:shadow-2xl hover:border-emerald-100 group relative ${state.currentCampaignId === camp.id ? 'border-emerald-500' : 'border-slate-50'}`}
                        >
                            {state.currentCampaignId === camp.id && (
                                <div className="absolute top-6 right-8 bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Active</div>
                            )}

                            <div className="flex items-start gap-6 mb-8">
                                <div className="w-24 h-24 bg-slate-50 rounded-3xl p-3 border border-slate-100 group-hover:bg-white transition-colors flex items-center justify-center">
                                    <img src={camp.qrCodeUrl} alt="QR" className="w-full h-full" />
                                </div>
                                <div className="flex-1 pt-2">
                                    <h4 className="text-2xl font-black text-slate-900 leading-tight mb-1">{camp.name}</h4>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {camp.targetNeighborhood}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-50">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Drops</p>
                                    <p className="text-2xl font-black text-slate-900">{camp.stats.totalDrops}</p>
                                </div>
                                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-50 text-emerald-600">
                                    <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1">Scans</p>
                                    <p className="text-2xl font-black">{camp.stats.scans}</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => onSelectCampaign(camp.id)}
                                    className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${state.currentCampaignId === camp.id ? 'bg-slate-100 text-slate-400 cursor-default' : 'bg-slate-900 text-white hover:bg-emerald-600 active:scale-95 shadow-xl shadow-slate-200'}`}
                                    disabled={state.currentCampaignId === camp.id}
                                >
                                    {state.currentCampaignId === camp.id ? 'Targeting This' : 'Set as Current'}
                                </button>
                                <button className="p-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors text-slate-400 hover:text-emerald-500">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CampaignsPage;
