
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent, role: UserRole) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
      onLogin({
        id: `user-${role}-1`,
        name: role === 'admin' ? 'John Owner' : 'Mike Crew',
        email: email || `${role}@hangrmap.com`,
        role
      });
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-emerald-600 overflow-y-auto">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10">
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mb-4 rotate-3 shadow-inner">
            <svg className="w-12 h-12 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tighter">HangrMap</h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Lawn Care Marketing Tracker</p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-emerald-500 font-bold transition-colors"
              placeholder="name@company.com"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-emerald-500 font-bold transition-colors"
              placeholder="••••••••"
            />
          </div>

          <div className="pt-4 grid grid-cols-2 gap-4">
            <button
              onClick={(e) => handleSubmit(e, 'crew')}
              disabled={isLoading}
              className="py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-sm shadow-xl shadow-emerald-600/20 active:scale-95 transition-all disabled:opacity-50"
            >
              Crew Log In
            </button>
            <button
              onClick={(e) => handleSubmit(e, 'admin')}
              disabled={isLoading}
              className="py-4 bg-slate-800 text-white rounded-2xl font-black uppercase text-sm shadow-xl shadow-slate-800/20 active:scale-95 transition-all disabled:opacity-50"
            >
              Admin Log In
            </button>
          </div>
        </form>

        <div className="mt-10 text-center">
          <p className="text-slate-400 text-xs font-medium">
            Don't have an account? <span className="text-emerald-600 font-black cursor-pointer">Start Free Trial</span>
          </p>
        </div>
      </div>
      
      <p className="mt-8 text-white/60 text-[10px] font-black uppercase tracking-[0.3em]">Built for scale • HangrMap v1.0.4</p>
    </div>
  );
};

export default Login;
