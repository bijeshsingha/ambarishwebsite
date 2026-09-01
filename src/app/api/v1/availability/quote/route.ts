import { NextResponse } from "next/server";
import { getStayQuote } from "@/lib/hotel-os-client";
import { getTodayDate, getTomorrowDate } from "@/lib/formatters";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get("roomId") || searchParams.get("room") || undefined;
    const checkIn = searchParams.get("checkIn") || getTodayDate();
    const checkOut = searchParams.get("checkOut") || getTomorrowDate();
    const adults = parseInt(searchParams.get("adults") || "2", 10);
    const children = parseInt(searchParams.get("children") || "0", 10);
    const ratePlanCode = (searchParams.get("plan") as any) || "EP";

    const quote = getStayQuote({
      checkIn,
      checkOut,
      adults,
      children,
      roomId,
      ratePlanCode,
    });

    return NextResponse.json(quote);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to calculate quote" }, { status: 500 });
  }
}
