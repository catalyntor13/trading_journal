"use client";

import React, { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,

} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Dictionary: 'YYYY-MM-DD' -> { profit, count }
export type CalendarData = Record<string, { profit: number; count: number }>

const TradingCalendar = ({ data }: { data: CalendarData }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  // Calculate stats for current view
  const monthlyStats = Object.entries(data).reduce(
    (acc, [dateStr, dayData]) => {
      // Parse "yyyy-MM-dd" safely locally or just check substring if distinct
      const [y, m, d] = dateStr.split("-").map(Number);
      // Note: Month in Date is 0-indexed
      const date = new Date(y, m - 1, d);

      if (isSameMonth(date, currentMonth)) {
        acc.profit += dayData.profit;
        acc.trades += dayData.count; // Sum total trades
      }
      return acc;
    },
    { profit: 0, trades: 0 }
  );

  return (
    <div className="w-full text-foreground p-2 md:p-4 bg-background/50 rounded-xl">
      {/* HEADER CALENDAR */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1 hover:bg-muted rounded transition-colors text-muted-foreground hover:text-foreground">
            <ChevronLeft className="w-5 h-5 cursor-pointer" />
          </button>
          <h2 className="text-xl font-bold capitalize text-foreground">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1 hover:bg-muted rounded transition-colors text-muted-foreground hover:text-foreground">
            <ChevronRight className="w-5 h-5 cursor-pointer" />
          </button>
        </div>

        <div className="text-[13px] text-muted-foreground space-x-4">
          <span>
            Monthly P&L:{" "}
            <span className={cn("font-bold", monthlyStats.profit >= 0 ? "text-emerald-500" : "text-red-500")}>
              {monthlyStats.profit >= 0 ? "+" : ""}{monthlyStats.profit.toFixed(2)}
            </span>
          </span>
          <span>
            Total Trades: <span className="text-foreground font-bold">{monthlyStats.trades}</span>
          </span>
        </div>
      </div>

      {/* GRID CALENDAR */}
      <div className="grid grid-cols-7 gap-1">
        {/* Zilele Săptămânii */}
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div key={day} className="text-center text-muted-foreground text-[10px] font-medium py-1 uppercase tracking-wider">
            <span className="md:hidden">{day.charAt(0)}</span>
            <span className="hidden md:block">{day}</span>
          </div>
        ))}

        {/* Zilele propriu-zise */}
        {calendarDays.map((day, idx) => {
          const dateStr = format(day, "yyyy-MM-dd");
          // Check if data exists for this day
          const dayData = data[dateStr]
          const hasTrade = dayData !== undefined
          const profit = dayData?.profit || 0

          const isCurrentMonth = isSameMonth(day, monthStart);

          return (
            <div
              key={idx}
              className={cn(
                "min-h-[50px] md:min-h-[70px] p-0.5 md:p-1 rounded-md border transition-all relative flex flex-col justify-between",
                "border-border bg-card/50",
                !isCurrentMonth && "opacity-20",
                hasTrade && profit > 0 && "bg-emerald-500/10 border-emerald-500/30",
                hasTrade && profit < 0 && "bg-red-500/10 border-red-500/30"
              )}
            >
              <div className="flex justify-between items-start">
                <span className="text-[8px] md:text-[10px] text-muted-foreground">{format(day, "d")}</span>

              </div>

              {hasTrade && (
                <div className="mt-0.5">
                  <div className={cn(
                    "text-[10px] md:text-xs font-bold font-mono",
                    profit > 0 ? "text-emerald-500" : "text-red-500"
                  )}>


                    {profit > 0 ? "+" : ""}{profit.toFixed(0)}



                  </div>
                  <div className="text-[8px] md:text-[10px] text-muted-foreground mt-1 hidden sm:block">Trades: {dayData.count}</div>
                  <div className="text-[8px] text-muted-foreground sm:hidden">T: {dayData.count}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TradingCalendar;