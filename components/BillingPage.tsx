
import React from 'react';
import { Company, PlanType } from '../types';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

interface BillingPageProps {
    company: Company;
}

const PLANS = [
    {
        type: 'solo' as PlanType,
        name: 'Solo Plan',
        price: '$19',
        features: ['1 User', 'Unlimited Drops', 'Basic Analytics'],
        color: 'bg-emerald-500',
        url: 'https://buy.stripe.com/14A9AUf3k4yP2KG0DXgfu0o'
    },
    {
        type: 'crew' as PlanType,
        name: 'Crew Plan',
        price: '$49',
        features: ['Up to 5 Users', 'Phone Support', 'Advanced Analytics', 'Crew Tracking'],
        color: 'bg-sky-500',
        url: 'https://buy.stripe.com/4gM14o7ASc1hgBw3Q9gfu0q'
    },
    {
        type: 'agency' as PlanType,
        name: 'Agency Plan',
        price: '$99',
        features: ['Unlimited Users', 'Dedicated Account Manager', 'Custom Reports', 'API Access'],
        color: 'bg-indigo-600',
        url: 'https://buy.stripe.com/8x228sf3k3uL5WS0DXgfu0p'
    }
];

const BillingPage: React.FC<BillingPageProps> = ({ company }) => {
    const handleCheckout = (planUrl: string) => {
        // Redirect to direct Stripe payment link
        window.location.href = `${planUrl}?client_reference_id=${company.id}`;
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12 pb-32 overflow-y-auto">
            <header className="max-w-6xl mx-auto mb-16 text-center">
                <h1 className="text-5xl font-black text-slate-800 tracking-tight mb-4">Subscription Plan Required</h1>
                <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">Unlock full access to HangrMap</p>

                <div className="mt-8 inline-flex items-center gap-4 bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100">
                    <div className="w-3 h-3 bg-rose-500 rounded-full animate-pulse"></div>
                    <p className="text-slate-600 font-bold text-sm">Status: <span className="text-rose-600 uppercase">{company.subscription_status}</span></p>
                </div>
            </header>

            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
                {PLANS.map((plan) => (
                    <div key={plan.type} className={`bg-white rounded-[3rem] shadow-xl border-4 ${company.plan_type === plan.type ? 'border-emerald-500 scale-105' : 'border-slate-50'} overflow-hidden flex flex-col`}>
                        <div className={`p-8 ${plan.color} text-white text-center`}>
                            <h3 className="text-2xl font-black uppercase tracking-tight">{plan.name}</h3>
                            <div className="mt-4 flex items-center justify-center">
                                <span className="text-4xl font-black">{plan.price}</span>
                                <span className="text-[10px] uppercase font-black opacity-80 ml-2">/ month</span>
                            </div>
                        </div>

                        <div className="p-10 flex-1 flex flex-col">
                            <ul className="space-y-6 mb-12 flex-1">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-4">
                                        <div className="mt-1 bg-emerald-100 text-emerald-600 p-1 rounded-lg">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="text-slate-600 font-bold">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleCheckout(plan.url)}
                                className={`w-full py-6 rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-xl transition-all active:scale-95 ${company.plan_type === plan.type
                                    ? 'bg-emerald-500 text-white shadow-emerald-200'
                                    : 'bg-slate-900 text-white shadow-slate-200'
                                    }`}
                            >
                                {company.plan_type === plan.type ? 'Current Plan' : 'Select Plan'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="max-w-2xl mx-auto mt-20 text-center">
                <p className="text-slate-400 font-bold text-sm leading-relaxed">
                    Secure payments powered by Stripe. All plans include 256-bit SSL encryption.
                    Cancel anytime from your dashboard.
                </p>
            </div>
        </div>
    );
};

export default BillingPage;
