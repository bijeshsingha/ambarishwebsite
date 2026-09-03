import { NextResponse } from "next/server";
import { getTodayDate, getTomorrowDate } from "@/lib/formatters";
import { fetchPmsAvailability } from "@/lib/hotel-os-client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const checkIn = searchParams.get("checkIn") || getTodayDate();
  const checkOut = searchParams.get("checkOut") || getTomorrowDate();

  const data = await fetchPmsAvailability(checkIn, checkOut);
  return NextResponse.json(data);
}
