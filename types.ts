
export type UserRole = 'admin' | 'crew';
export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'incomplete' | 'trialing';
export type PlanType = 'solo' | 'crew' | 'agency';

export interface Company {
  id: string;
  name: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  plan_type: PlanType;
  subscription_status: SubscriptionStatus;
  created_at: string;
}

export interface User {
  id: string;
  company_id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export type DropStatus = 'dropped' | 'skipped' | 'no-soliciting' | 'existing-client';

export interface Drop {
  id: string;
  userId: string;
  company_id: string;
  campaignId: string;
  lat: number;
  lng: number;
  address: string;
  status: DropStatus;
  timestamp: string;
  imageUrl?: string;
}

export interface Campaign {
  id: string;
  company_id: string;
  name: string;
  startDate: string;
  qrCodeUrl: string;
  targetNeighborhood: string;
  assignedCrewIds: string[];
  stats: {
    totalDrops: number;
    scans: number;
    leads: number;
  };
}

export interface Lead {
  id: string;
  company_id: string;
  campaignId: string;
  sourceQr: string;
  timestamp: string;
  status: 'new' | 'contacted' | 'converted' | 'lost';
  address: string;
}

export interface AppState {
  user: User | null;
  company: Company | null;
  currentCampaignId: string | null;
  drops: Drop[];
  campaigns: Campaign[];
  leads: Lead[];
  team: User[];
}
