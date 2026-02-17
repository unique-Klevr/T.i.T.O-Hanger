
import React from 'react';
import { User } from '../types';

interface NavigationProps {
  user: User;
  activeView: string;
  onViewChange: (view: any) => void;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ user, activeView, onViewChange, onLogout }) => {
  return (
    <nav className="h-20 bg-white border-t border-slate-200 flex items-center justify-around px-4 pb-safe">
      <button 
        onClick={() => onViewChange('dashboard')}
        className={`flex flex-col items-center gap-1 ${activeView === 'dashboard' ? 'text-emerald-600' : 'text-slate-400'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A2 2 0 013 15.382V6.418a2 2 0 011.106-1.789L9 2m0 18l6-3m-6 3V2m6 15l5.447 2.724A2 2 0 0021 17.894V8.922a2 2 0 00-1.106-1.789L15 4m0 13V4m0 0L9 2" />
        </svg>
        <span className="text-xs font-medium">Map</span>
      </button>

      <button 
        onClick={() => onViewChange('campaigns')}
        className={`flex flex-col items-center gap-1 ${activeView === 'campaigns' ? 'text-emerald-600' : 'text-slate-400'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <span className="text-xs font-medium">{user.role === 'admin' ? 'Campaigns' : 'Stats'}</span>
      </button>

      <button 
        onClick={onLogout}
        className="flex flex-col items-center gap-1 text-slate-400"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span className="text-xs font-medium">Exit</span>
      </button>
    </nav>
  );
};

export default Navigation;
