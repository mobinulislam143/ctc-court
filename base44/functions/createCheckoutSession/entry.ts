import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';
import Stripe from 'npm:stripe@14.21.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { lineItems, customerEmail, customerName, courtDescription, totalAmount, designData, discountCode, discountCodeId, discountCodeTimesUsed } = body;

    if (!lineItems || !totalAmount) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const origin = req.headers.get('origin') || 'https://coasttocoastcourts.com';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'affirm'],
      line_items: lineItems,
      mode: 'payment',
      automatic_tax: { enabled: true },
      customer_email: customerEmail || undefined,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      metadata: {
        customer_name: customerName || '',
        court_description: courtDescription || '',
        design_data: designData ? JSON.stringify(designData).slice(0, 500) : '',
        discount_code: discountCode || '',
        discount_code_id: discountCodeId || '',
        discount_code_times_used: discountCodeTimesUsed !== null && discountCodeTimesUsed !== undefined ? String(discountCodeTimesUsed) : '',
      },
      custom_text: {
        submit: {
          message: '⚠️ DIY Materials Only — Installation not included. Tiles snap together in under 2 hours with no special tools needed. By completing this purchase you agree to our Terms of Service and Privacy Policy at ctccourts.com',
        },
      },
      success_url: `${origin}/OrderSuccess?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/Summary`,
    });

    return Response.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});