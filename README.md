<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# HangrMap SaaS Platform

## Core Technologies
- **Vite / React / TypeScript**
- **Supabase** (Auth, Database, RLS)
- **Stripe** (Subscription Billing)
- **Google Maps JS API** (Tracking & Visualization)

## Setup Instructions

### 1. Database Setup (Supabase)
1.  Create a new project in [Supabase](https://supabase.com).
2.  Open the **SQL Editor** and run the contents of [`supabase_schema.sql`](./supabase_schema.sql).
    - This creates the `companies`, `users`, `campaigns`, and `drops` tables.
    - It also enables **Row Level Security (RLS)** to ensure multi-tenant isolation.
3.  Go to **Authentication** -> **Providers** and ensure **Email** is enabled.

### 2. Stripe Setup
1.  Create a Stripe account.
2.  Create 3 Subscription Products (Solo, Crew, Agency) in the Stripe Dashboard.
3.  Note the **Price IDs** for each.
4.  Configure a **Webhook** in Stripe to point to your deployment URL (e.g., `https://your-app.com/api/stripe-webhook`) to handle subscription updates (status: `active`, `canceled`, etc.).

### 3. Environment Variables
Copy `.env.local.example` to `.env.local` and fill in:
- `VITE_SUPABASE_URL` & `VITE_SUPABASE_ANON_KEY`
- `VITE_GOOGLE_MAPS_API_KEY`
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY` (for serverless functions)
- `STRIPE_PRICE_...` (Price IDs for your plans)

### 4. Running Locally
```bash
npm install
npm run dev
```

## Multi-Tenant Features
- **Company Isolation**: Users are linked to a `company_id`. RLS policies ensure they only see their own company's data.
- **Role-Based Access**: 
    - `admin`: Full dashboard access, billing management, and global reports.
    - `crew`: Marker placement and GPS tracking only.
- **Billing Gate**: Access to the dashboard is restricted until a valid Stripe subscription is linked to the company.

## Deployment (Vercel)
This project is optimized for Vercel:
1.  Connect your Git repo to Vercel.
2.  Add all environment variables from `.env.local` to the Vercel project settings.
3.  Deploy! The `api/` folder will automatically be treated as serverless functions.
