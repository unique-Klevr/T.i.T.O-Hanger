
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16' as any,
});

export default async function handler(req: any, res: any) {
    if (req.method === 'POST') {
        const { companyId, plan } = req.body;

        const priceMap: Record<string, string> = {
            solo: process.env.STRIPE_PRICE_SOLO || '',
            crew: process.env.STRIPE_PRICE_CREW || '',
            agency: process.env.STRIPE_PRICE_AGENCY || '',
        };

        try {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price: priceMap[plan],
                        quantity: 1,
                    },
                ],
                mode: 'subscription',
                success_url: `${req.headers.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${req.headers.origin}/billing`,
                metadata: {
                    companyId,
                    plan_type: plan,
                },
            });

            res.status(200).json({ id: session.id });
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}
