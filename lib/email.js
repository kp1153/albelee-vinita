import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderEmail(orderDetails) {
  try {
    const { customerDetails, items, totalAmount, orderId } = orderDetails;

    const itemsList = items
      .map(item => `${item.name} - Rs.${item.price} x ${item.quantity} = Rs.${item.price * item.quantity}`)
      .join('\n');

    const emailContent = `
New Order Received!

Order ID: ${orderId}

Customer Details:
Name: ${customerDetails.name}
Email: ${customerDetails.email || 'Not provided'}
Phone: ${customerDetails.phone}

Delivery Address:
${customerDetails.address}
City: ${customerDetails.city || 'Not provided'}
State: ${customerDetails.state || 'Not provided'}
Pincode: ${customerDetails.pincode || 'Not provided'}

Order Items:
${itemsList}

Total Amount: Rs.${totalAmount}

Payment Status: Completed
    `;

    const result = await resend.emails.send({
      from: 'noreply@shop-at-albelee.com',
      to: process.env.OWNER_EMAIL,
      subject: `New Order #${orderId} - ${customerDetails.name}`,
      text: emailContent,
    });

    console.log('Email sent:', result);
    return { success: true };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error };
  }
}