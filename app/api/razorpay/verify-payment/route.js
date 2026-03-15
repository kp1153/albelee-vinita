import crypto from "crypto";
import { NextResponse } from "next/server";
import { createClient } from "@libsql/client";
import { sendOrderEmail } from "@/lib/email";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export async function POST(req) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customerDetails,
      items,
    } = await req.json();

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");
    if (razorpay_signature === expectedSign) {
      const totalAmount = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      const result = await turso.execute({
        sql: `INSERT INTO orders (user_name, user_email, user_phone, shipping_address, city, state, pincode, total_amount, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          customerDetails.name,
          customerDetails.email || "",
          customerDetails.phone,
          customerDetails.address,
          customerDetails.city || "",
          customerDetails.state || "",
          customerDetails.pincode || "",
          totalAmount,
          "completed",
        ],
      });

      const orderId = Number(result.lastInsertRowid);

      await sendOrderEmail({
        customerDetails,
        items,
        totalAmount,
        orderId,
      });

      return NextResponse.json({
        success: true,
        orderId: orderId,
        message: "Payment verified successfully",
      });
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid signature" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Payment verification failed:", error);
    return NextResponse.json(
      { success: false, error: "Verification failed" },
      { status: 500 },
    );
  }
}
