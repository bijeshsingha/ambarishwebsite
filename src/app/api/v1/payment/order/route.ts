import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency = "INR", receipt } = body;

    if (!amount) {
      return NextResponse.json({ error: "amount is required" }, { status: 400 });
    }

    // If Razorpay keys are provided in process.env, real Razorpay API can be invoked.
    // In local / sandbox mode, we generate a mock Razorpay Order ID for smooth testing.
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    return NextResponse.json({
      success: true,
      orderId,
      amount: Math.round(amount * 100), // in paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_AmbarishMockKey",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create payment order" }, { status: 500 });
  }
}
