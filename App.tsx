
import React, { useState, useEffect, useCallback } from 'react';
import { User, Campaign, Drop, DropStatus, AppState, UserRole, Company } from './types';
import { supabase } from './services/supabaseClient';
import Auth from './components/Auth';
import CrewDashboard from './components/CrewDashboard';
import AdminDashboard from './components/AdminDashboard';
import Navigation from './components/Navigation';
import BillingPage from './components/BillingPage';
import LandingPage from './components/LandingPage';
import CampaignsPage from './components/CampaignsPage';
import CampaignDetails from './components/CampaignDetails';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    user: null,
    company: null,
    currentCampaignId: null,
    drops: [],
    campaigns: [],
    leads: []
  });

  const [view, setView] = useState<'dashboard' | 'campaigns' | 'profile'>('dashboard');
  const [loading, setLoading] = useState(true);
  const [selectedCampaignForManagement, setSelectedCampaignForManagement] = useState<Campaign | null>(null);

  // Simple routing logic
  const path = window.location.pathname;
  const isAuthView = path === '/login' || path === '/signup';

  const fetchAppData = useCallback(async (userId: string) => {
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*, companies(*)')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      const company = userData.companies;
      const user: User = {
        id: userData.id,
        company_id: userData.company_id,
        name: userData.name,
        email: userData.email,
        role: userData.role as UserRole
      };

      const { data: campaignsData } = await supabase
        .from('campaigns')
        .select('*')
        .eq('company_id', company.id);

      const { data: dropsData } = await supabase
        .from('drops')
        .select('*')
        .eq('company_id', company.id);

      setAppState({
        user,
        company,
        currentCampaignId: campaignsData?.[0]?.id || null,
        drops: (dropsData || []).map(d => ({
          id: d.id,
          userId: d.user_id,
          company_id: d.company_id,
          campaignId: d.campaign_id,
          lat: d.latitude,
          lng: d.longitude,
          address: d.address,
          status: d.status as DropStatus,
          timestamp: d.created_at,
          imageUrl: d.image_url
        })),
        campaigns: (campaignsData || []).map(c => ({
          id: c.id,
          company_id: c.company_id,
          name: c.name,
          startDate: c.start_date,
          qrCodeUrl: c.qr_code_url,
          targetNeighborhood: c.target_neighborhood,
          assignedCrewIds: [],
          stats: c.stats
        })),
        leads: []
      });
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchAppData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchAppData(session.user.id);
      } else {
        setAppState(prev => ({ ...prev, user: null, company: null }));
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchAppData]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const handleSelectCampaign = (id: string) => {
    setAppState(prev => ({ ...prev, currentCampaignId: id }));
  };

  const handleDeleteCampaign = async (id: string) => {
    try {
      await supabase.from('drops').delete().eq('campaign_id', id);
      await supabase.from('campaigns').delete().eq('id', id);

      setAppState(prev => ({
        ...prev,
        campaigns: prev.campaigns.filter(c => c.id !== id),
        currentCampaignId: prev.currentCampaignId === id ? null : prev.currentCampaignId,
        drops: prev.drops.filter(d => d.campaignId !== id)
      }));
      setSelectedCampaignForManagement(null);
    } catch (err) {
      console.error('Error deleting campaign:', err);
    }
  };

  const handleAddCampaign = async (name: string, neighborhood: string) => {
    if (!appState.user || !appState.company) return;

    try {
      const { data, error } = await supabase
        .from('campaigns')
        .insert([{
          company_id: appState.company.id,
          name,
          target_neighborhood: neighborhood,
          qr_code_url: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://hangrmap.app/scan/${Math.random().toString(36).substring(7)}`,
          stats: { totalDrops: 0, scans: 0 }
        }])
        .select()
        .single();

      if (error) throw error;

      const newCampaign: Campaign = {
        id: data.id,
        company_id: data.company_id,
        name: data.name,
        startDate: data.created_at,
        qrCodeUrl: data.qr_code_url,
        targetNeighborhood: data.target_neighborhood,
        assignedCrewIds: [],
        stats: data.stats
      };

      setAppState(prev => ({
        ...prev,
        campaigns: [newCampaign, ...prev.campaigns],
        currentCampaignId: prev.currentCampaignId || newCampaign.id
      }));
    } catch (err) {
      console.error('Error adding campaign:', err);
    }
  };

  const handleAddDrop = async (drop: Omit<Drop, 'id' | 'timestamp' | 'userId' | 'campaignId' | 'company_id'>) => {
    if (!appState.user || !appState.company) return;

    try {
      const { data, error } = await supabase
        .from('drops')
        .insert([{
          company_id: appState.company.id,
          campaign_id: appState.currentCampaignId,
          user_id: appState.user.id,
          latitude: drop.lat,
          longitude: drop.lng,
          status: drop.status,
          address: drop.address,
          image_url: drop.imageUrl
        }])
        .select()
        .single();

      if (error) throw error;

      const newDrop: Drop = {
        ...drop,
        id: data.id,
        timestamp: data.created_at,
        userId: appState.user.id,
        campaignId: appState.currentCampaignId || '',
        company_id: appState.company.id
      };

      setAppState(prev => ({
        ...prev,
        drops: [newDrop, ...prev.drops]
      }));
    } catch (err) {
      console.error('Error adding drop:', err);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full bg-slate-900 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-white font-black uppercase tracking-widest text-[10px]">Verifying Session...</p>
      </div>
    );
  }

  if (!appState.user) {
    if (isAuthView) {
      return <Auth onSuccess={() => { window.location.href = '/'; }} />;
    }
    return <LandingPage />;
  }

  const isPremiumActive = appState.company?.subscription_status === 'active' || appState.company?.subscription_status === 'trialing';

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50">
      <main className="flex-1 overflow-hidden relative">
        {appState.user.role === 'crew' ? (
          <CrewDashboard
            drops={appState.drops}
            onAddDrop={handleAddDrop}
            activeCampaign={appState.campaigns.find(c => c.id === appState.currentCampaignId)}
            userId={appState.user.id}
          />
        ) : (
          <div className="h-full">
            {!isPremiumActive ? (
              <BillingPage company={appState.company!} />
            ) : (
              <>
                {selectedCampaignForManagement ? (
                  <CampaignDetails
                    campaign={selectedCampaignForManagement}
                    drops={appState.drops}
                    onBack={() => setSelectedCampaignForManagement(null)}
                    onDelete={handleDeleteCampaign}
                  />
                ) : (
                  <>
                    {view === 'dashboard' && (
                      <AdminDashboard
                        state={appState}
                        onAddCampaign={handleAddCampaign}
                        onUpdateCampaign={(c) => {
                          // Implement Supabase update
                        }}
                      />
                    )}
                    {view === 'campaigns' && (
                      <CampaignsPage
                        state={appState}
                        onAddCampaign={handleAddCampaign}
                        onSelectCampaign={handleSelectCampaign}
                        onManageCampaign={(c) => setSelectedCampaignForManagement(c)}
                      />
                    )}
                  </>
                )}
              </>
            )}
          </div>
        )}
      </main>

      <Navigation
        user={appState.user}
        activeView={view}
        onViewChange={(v) => {
          setSelectedCampaignForManagement(null);
          setView(v);
        }}
        onLogout={handleLogout}
      />
    </div>
  );
};

export default App;
