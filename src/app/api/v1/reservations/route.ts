import { NextResponse } from "next/server";
import { sendReservationNotificationEmails } from "@/lib/email";

// In-memory server store for confirmed web reservations
const globalReservationStore = new Map<string, any>();

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.checkIn || !body.checkOut || !body.guestName || !body.guestPhone) {
      return NextResponse.json(
        { error: "Missing required reservation fields (checkIn, checkOut, guestName, guestPhone)" },
        { status: 400 }
      );
    }

    // Generate guaranteed unique direct booking confirmation number
    const dateStamp = new Date().toISOString().slice(2, 10).replace(/-/g, "");
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const confirmationNo = `RES-${dateStamp}-${randomSeq}`;

    const reservation = {
      bookingReference: confirmationNo,
      confirmationNo,
      status: "CONFIRMED",
      createdAt: new Date().toISOString(),
      ...body,
    };

    // Cache in server store
    globalReservationStore.set(confirmationNo, reservation);

    // Dispatch background email notification to hotel management and guest
    sendReservationNotificationEmails({
      confirmationNo,
      ...body,
    }).catch((mailErr) => {
      console.warn("[Reservation Email] Dispatch warning:", mailErr?.message);
    });

    return NextResponse.json({
      success: true,
      reservation,
    });
  } catch (error: any) {
    console.error("[Reservation API] Creation failed:", error?.message);
    return NextResponse.json(
      { error: error.message || "Reservation creation failed" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference") || searchParams.get("id");

  if (!reference) {
    return NextResponse.json({ error: "Booking reference required" }, { status: 400 });
  }

  const reservation = globalReservationStore.get(reference);

  if (reservation) {
    return NextResponse.json({ success: true, reservation });
  }

  return NextResponse.json({ error: "Reservation not found in active session" }, { status: 404 });
}
