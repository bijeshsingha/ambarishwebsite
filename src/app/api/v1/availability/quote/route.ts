import { NextResponse } from "next/server";
import { getTodayDate, getTomorrowDate } from "@/lib/formatters";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const checkIn = searchParams.get("checkIn") || getTodayDate();
  const checkOut = searchParams.get("checkOut") || getTomorrowDate();

  // Return physical inventory limits
  const categories = [
    {
      roomTypeId: "rt_deluxe_king",
      roomTypeCode: "DELUXE_KING",
      roomTypeName: "Double Deluxe Room (King)",
      totalRooms: 10,
      occupiedOrBlocked: 0,
      availableCount: 10,
      capacity: 3,
    },
    {
      roomTypeId: "rt_deluxe_twin",
      roomTypeCode: "DELUXE_TWIN",
      roomTypeName: "Double Deluxe Room (Twin)",
      totalRooms: 15,
      occupiedOrBlocked: 0,
      availableCount: 15,
      capacity: 3,
    },
    {
      roomTypeId: "rt_exec_king",
      roomTypeCode: "EXEC_KING",
      roomTypeName: "Executive Room (King)",
      totalRooms: 3,
      occupiedOrBlocked: 0,
      availableCount: 3,
      capacity: 3,
    },
    {
      roomTypeId: "rt_exec_twin",
      roomTypeCode: "EXEC_TWIN",
      roomTypeName: "Executive Room (Twin)",
      totalRooms: 5,
      occupiedOrBlocked: 0,
      availableCount: 5,
      capacity: 3,
    },
    {
      roomTypeId: "rt_suite",
      roomTypeCode: "SUITE",
      roomTypeName: "Presidential Luxury Suite",
      totalRooms: 2,
      occupiedOrBlocked: 0,
      availableCount: 2,
      capacity: 4,
    },
  ];

  return NextResponse.json({
    arrivalDate: checkIn,
    departureDate: checkOut,
    totalRooms: 35,
    availableRooms: 35,
    categories,
  });
}
