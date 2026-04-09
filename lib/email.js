import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderEmail(orderDetails) {
  try {
    const { customerDetails, items, totalAmount, orderId } = orderDetails;

    const itemsHtml = items
      .map(item => `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #eee;">${item.name}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">₹${item.price}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">₹${item.price * item.quantity}</td>
        </tr>
      `).join('');

    const fullAddress = [
      customerDetails.address,
      customerDetails.city,
      customerDetails.state,
      customerDetails.pincode,
    ].filter(Boolean).join(', ');

    const ownerHtml = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="background:#D85A8C;color:white;padding:16px;margin:0;">🛍️ नया ऑर्डर — #${orderId}</h2>
        <div style="padding:16px;background:#fff8fb;border:1px solid #f6c9d6;">
          <h3 style="color:#D85A8C;">ग्राहक की जानकारी</h3>
          <p><strong>नाम:</strong> ${customerDetails.name}</p>
          <p><strong>फोन:</strong> ${customerDetails.phone}</p>
          <p><strong>ईमेल:</strong> ${customerDetails.email || 'नहीं दिया'}</p>
          <h3 style="color:#D85A8C;">डिलीवरी पता</h3>
          <p><strong>पता:</strong> ${customerDetails.address}</p>
          <p><strong>शहर:</strong> ${customerDetails.city || 'नहीं दिया'}</p>
          <p><strong>राज्य:</strong> ${customerDetails.state || 'नहीं दिया'}</p>
          <p><strong>पिनकोड:</strong> ${customerDetails.pincode || 'नहीं दिया'}</p>
          <h3 style="color:#D85A8C;">ऑर्डर</h3>
          <table style="width:100%;border-collapse:collapse;">
            <tr style="background:#f6c9d6;">
              <th style="padding:8px;text-align:left;">सामान</th>
              <th style="padding:8px;text-align:center;">मात्रा</th>
              <th style="padding:8px;text-align:right;">दाम</th>
              <th style="padding:8px;text-align:right;">कुल</th>
            </tr>
            ${itemsHtml}
          </table>
          <p style="font-size:18px;font-weight:bold;text-align:right;color:#D85A8C;">कुल: ₹${totalAmount}</p>
          <p style="color:green;font-weight:bold;">✅ भुगतान हो गया</p>
        </div>
      </div>
    `;

    const buyerHtml = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="background:#D85A8C;color:white;padding:16px;margin:0;">✨ आपका ऑर्डर मिल गया!</h2>
        <div style="padding:16px;background:#fff8fb;border:1px solid #f6c9d6;">
          <p>नमस्ते <strong>${customerDetails.name}</strong>,</p>
          <p>आपका ऑर्डर <strong>#${orderId}</strong> सफलतापूर्वक प्राप्त हो गया है। जल्द ही आपके पते पर भेजा जाएगा।</p>
          <h3 style="color:#D85A8C;">डिलीवरी पता</h3>
          <p>${fullAddress}</p>
          <h3 style="color:#D85A8C;">ऑर्डर विवरण</h3>
          <table style="width:100%;border-collapse:collapse;">
            <tr style="background:#f6c9d6;">
              <th style="padding:8px;text-align:left;">सामान</th>
              <th style="padding:8px;text-align:center;">मात्रा</th>
              <th style="padding:8px;text-align:right;">दाम</th>
              <th style="padding:8px;text-align:right;">कुल</th>
            </tr>
            ${itemsHtml}
          </table>
          <p style="font-size:18px;font-weight:bold;text-align:right;color:#D85A8C;">कुल: ₹${totalAmount}</p>
          <p style="color:green;font-weight:bold;">✅ भुगतान पूरा हुआ</p>
          <hr style="border:1px solid #f6c9d6;margin:16px 0;">
          <p style="color:#888;font-size:12px;">किसी भी सवाल के लिए WhatsApp करें या हमसे संपर्क करें।</p>
          <p style="color:#888;font-size:12px;">धन्यवाद — Albelee Fashion Jewels 💎</p>
        </div>
      </div>
    `;

    await resend.emails.send({
      from: 'noreply@shop-at-albelee.com',
      to: process.env.OWNER_EMAIL,
      subject: `नया ऑर्डर #${orderId} — ${customerDetails.name} — ${fullAddress}`,
      html: ownerHtml,
    });

    if (customerDetails.email) {
      await resend.emails.send({
        from: 'noreply@shop-at-albelee.com',
        to: customerDetails.email,
        subject: `आपका ऑर्डर मिल गया — #${orderId} — Albelee`,
        html: buyerHtml,
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error };
  }
}