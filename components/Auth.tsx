
import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { UserRole } from '../types';

interface AuthProps {
    onSuccess: () => void;
}

const Auth: React.FC<AuthProps> = ({ onSuccess }) => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isSignUp) {
                // 1. Sign up user
                const { data: authData, error: authError } = await supabase.auth.signUp({
                    email,
                    password,
                });

                if (authError) throw authError;
                if (!authData.user) throw new Error('Sign up failed');

                // 2. Create company
                const { data: companyData, error: companyError } = await supabase
                    .from('companies')
                    .insert([{ name: companyName, plan_type: 'solo', subscription_status: 'incomplete' }])
                    .select()
                    .single();

                if (companyError) throw companyError;

                // 3. Create user profile
                const { error: profileError } = await supabase
                    .from('users')
                    .insert([{
                        id: authData.user.id,
                        company_id: companyData.id,
                        name: fullName,
                        email: email,
                        role: 'admin' as UserRole
                    }]);

                if (profileError) throw profileError;

            } else {
                const { error: authError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (authError) throw authError;
            }
            onSuccess();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden p-10">
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-200 mb-6">
                        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                        {isSignUp ? 'Launch Your Agency' : 'Welcome Back'}
                    </h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">
                        HangrMap SaaS Platform
                    </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-6">
                    {isSignUp && (
                        <>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500 transition-colors font-bold text-slate-700"
                                    placeholder="John Doe"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Company Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500 transition-colors font-bold text-slate-700"
                                    placeholder="Acme Lawn Services"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                />
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500 transition-colors font-bold text-slate-700"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500 transition-colors font-bold text-slate-700"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && (
                        <div className="bg-rose-50 border-2 border-rose-100 rounded-2xl p-4 text-rose-600 text-xs font-bold text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
                    </button>
                </form>

                <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="w-full mt-8 text-slate-400 font-bold uppercase tracking-widest text-[10px] hover:text-emerald-500 transition-colors"
                >
                    {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                </button>
            </div>
        </div>
    );
};

export default Auth;
