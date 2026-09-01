"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { ROOMS } from "@/data/rooms";
import RoomCard from "@/components/rooms/RoomCard";

export default function FeaturedRooms() {
  const rooms = ROOMS.filter((r) => r.slug !== "suite-room");

  return (
    <section className="bg-[#FAF7F4] py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-[#0C0B0B]/10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-3"
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#B4872F] font-semibold">
              Accommodations
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#0C0B0B] leading-tight">
              Curated Guest Rooms
            </h2>
            <p className="text-[#7A7067] text-sm sm:text-base font-light max-w-xl leading-relaxed">
              Every room is crafted for quiet comfort, featuring split air-conditioning, high-pressure hot geysers, high-speed Wi-Fi, and plush bedding.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/rooms"
              className="group inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-[0.14em] text-[#0C0B0B] hover:text-[#B62576] transition-colors"
            >
              <span>View all room details</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </motion.div>
        </div>

        {/* 2-Column Grid for Double Deluxe Room & Executive King Room */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {rooms.map((room, i) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              <RoomCard room={room} featured={false} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
