/**
 * GST Calculation utility for Hotel accommodation services under SAC 996311.
 * Hotel Ambarish Grand Residency GST rules:
 * - Room Tariff <= ₹7,500 / night: 5% GST (2.5% CGST + 2.5% SGST)
 * - Room Tariff > ₹7,500 / night: 18% GST (9% CGST + 9% SGST)
 */

export interface GSTBreakdown {
  baseAmount: number;
  taxRate: number; // e.g. 0.05 for 5%
  cgstRate: number; // 0.025
  sgstRate: number; // 0.025
  cgst: number;
  sgst: number;
  totalTax: number;
  totalAmount: number;
  sacCode: string;
}

export function calculateRoomGST(
  tariffPerNight: number,
  nights: number = 1,
  isInclusive: boolean = false
): GSTBreakdown {
  const sacCode = "996311";
  const taxRate = tariffPerNight > 7500 ? 0.18 : 0.05;
  const cgstRate = taxRate / 2;
  const sgstRate = taxRate / 2;

  let baseAmount: number;
  let totalTax: number;
  let totalAmount: number;

  if (isInclusive) {
    const rawTotal = tariffPerNight * nights;
    baseAmount = Math.round((rawTotal / (1 + taxRate)) * 100) / 100;
    totalTax = Math.round((rawTotal - baseAmount) * 100) / 100;
    totalAmount = rawTotal;
  } else {
    baseAmount = tariffPerNight * nights;
    totalTax = Math.round(baseAmount * taxRate);
    totalAmount = baseAmount + totalTax;
  }

  const cgst = Math.round((totalTax / 2) * 100) / 100;
  const sgst = Math.round((totalTax - cgst) * 100) / 100;

  return {
    baseAmount,
    taxRate,
    cgstRate,
    sgstRate,
    cgst,
    sgst,
    totalTax,
    totalAmount,
    sacCode,
  };
}
