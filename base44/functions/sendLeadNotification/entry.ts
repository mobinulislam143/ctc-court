import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { event, data } = await req.json();
    
    if (!data) {
      return Response.json({ error: 'No lead data provided' }, { status: 400 });
    }

    // Format the email HTML
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3fb9ff 0%, #0ea5e9 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
          .section { margin-bottom: 25px; }
          .section-title { font-size: 16px; font-weight: 600; color: #3fb9ff; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
          .field { margin-bottom: 12px; }
          .field-label { font-weight: 600; color: #64748b; font-size: 13px; margin-bottom: 4px; }
          .field-value { color: #1e293b; font-size: 15px; }
          .design-box { background: #f8fafc; padding: 15px; border-radius: 6px; border-left: 4px solid #3fb9ff; }
          .footer { text-align: center; padding: 20px; color: #94a3b8; font-size: 13px; }
          .badge { display: inline-block; padding: 4px 10px; background: #dbeafe; color: #0369a1; border-radius: 12px; font-size: 12px; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏀 New ${data.design_id ? 'Quote Request' : 'Contact Form'} Submission</h1>
          </div>
          
          <div class="content">
            <div class="section">
              <div class="section-title">Contact Information</div>
              <div class="field">
                <div class="field-label">Name</div>
                <div class="field-value">${data.full_name || 'Not provided'}</div>
              </div>
              <div class="field">
                <div class="field-label">Email</div>
                <div class="field-value"><a href="mailto:${data.email}" style="color: #3fb9ff;">${data.email}</a></div>
              </div>
              <div class="field">
                <div class="field-label">Phone</div>
                <div class="field-value"><a href="tel:${data.phone}" style="color: #3fb9ff;">${data.phone}</a></div>
              </div>
            </div>

            ${data.city || data.state || data.zip_code ? `
            <div class="section">
              <div class="section-title">Location</div>
              ${data.city ? `<div class="field"><div class="field-label">City</div><div class="field-value">${data.city}</div></div>` : ''}
              ${data.state ? `<div class="field"><div class="field-label">State</div><div class="field-value">${data.state}</div></div>` : ''}
              ${data.zip_code ? `<div class="field"><div class="field-label">ZIP Code</div><div class="field-value">${data.zip_code}</div></div>` : ''}
            </div>
            ` : ''}

            ${data.surface_type || data.indoor_outdoor ? `
            <div class="section">
              <div class="section-title">Project Details</div>
              ${data.surface_type ? `<div class="field"><div class="field-label">Surface Type</div><div class="field-value">${data.surface_type}</div></div>` : ''}
              ${data.indoor_outdoor ? `<div class="field"><div class="field-label">Installation Location</div><div class="field-value"><span class="badge">${data.indoor_outdoor.toUpperCase()}</span></div></div>` : ''}
              ${data.timeline ? `<div class="field"><div class="field-label">Timeline</div><div class="field-value">${data.timeline.replace('_', ' ')}</div></div>` : ''}
            </div>
            ` : ''}

            ${data.design_summary ? `
            <div class="section">
              <div class="section-title">Court Design</div>
              <div class="design-box">
                ${data.design_summary.court_type ? `<div class="field"><div class="field-label">Court Type</div><div class="field-value">${data.design_summary.court_type}</div></div>` : ''}
                ${data.design_summary.dimensions ? `<div class="field"><div class="field-label">Dimensions</div><div class="field-value">${data.design_summary.dimensions}</div></div>` : ''}
                ${data.design_summary.total_sqft ? `<div class="field"><div class="field-label">Square Footage</div><div class="field-value">${data.design_summary.total_sqft} sq ft</div></div>` : ''}
                ${data.design_summary.tile_count ? `<div class="field"><div class="field-label">Tile Count</div><div class="field-value">${data.design_summary.tile_count} tiles</div></div>` : ''}
                ${data.design_summary.environment ? `<div class="field"><div class="field-label">Environment</div><div class="field-value"><span class="badge">${data.design_summary.environment.toUpperCase()}</span></div></div>` : ''}
              </div>
            </div>
            ` : ''}

            ${data.estimated_value ? `
            <div class="section">
              <div class="section-title">Estimated Value</div>
              <div class="field-value" style="font-size: 24px; font-weight: 700; color: #3fb9ff;">
                $${data.estimated_value.toLocaleString()}
              </div>
            </div>
            ` : ''}

            ${data.notes ? `
            <div class="section">
              <div class="section-title">Additional Notes</div>
              <div class="field-value" style="background: #f8fafc; padding: 15px; border-radius: 6px;">
                ${data.notes}
              </div>
            </div>
            ` : ''}

            <div class="section" style="border-top: 2px solid #f1f5f9; padding-top: 20px; margin-top: 30px;">
              <div class="field-label" style="font-size: 12px;">Submission ID</div>
              <div class="field-value" style="font-size: 12px; color: #94a3b8;">${data.id}</div>
              <div class="field-label" style="font-size: 12px; margin-top: 8px;">Submitted</div>
              <div class="field-value" style="font-size: 12px; color: #94a3b8;">${new Date(data.created_date).toLocaleString()}</div>
            </div>
          </div>

          <div class="footer">
            <p>Coast to Coast Courts Lead Notification</p>
            <p>This email was automatically generated from your website.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email via Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      return Response.json({ error: 'Resend API key not configured' }, { status: 500 });
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Coast to Coast Courts <notifications@ctccourts.com>',
        to: ['coasttocoastcourts@gmail.com'],
        subject: `🏀 New ${data.design_id ? 'Quote Request' : 'Contact Form'} - ${data.full_name}`,
        html: emailHtml,
        reply_to: data.email,
      }),
    });

    if (!emailResponse.ok) {
      const error = await emailResponse.text();
      console.error('Resend API error:', error);
      return Response.json({ error: 'Failed to send email', details: error }, { status: 500 });
    }

    const result = await emailResponse.json();
    return Response.json({ success: true, emailId: result.id });

  } catch (error) {
    console.error('Error sending notification:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});