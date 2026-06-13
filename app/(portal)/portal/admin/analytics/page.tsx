"use client";

import useSWR from "swr";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import { IndianRupee, Users, Radio, CalendarCheck, Car, TrendingUp } from "lucide-react";
import { fetcher } from "@/lib/fetcher";
import { PageHeader, MetricCard, CardPanel, EmptyState } from "@/components/portal/widgets";
import { BOOKING_STATUS_META, type BookingStatus } from "@/lib/constants";

interface Analytics {
  metrics: {
    totalRevenue: number; completedTrips: number; totalBookings: number;
    registeredCustomers: number; liveVehicles: number; availableVehicles: number; totalVehicles: number;
  };
  revenueSeries: { month: string; revenue: number; bookings: number }[];
  customerGrowth: { month: string; customers: number }[];
  bookingsByStatus: { status: BookingStatus; count: number }[];
  vehicleUtilization: { name: string; trips: number; revenue: number }[];
}

const STATUS_COLORS: Record<BookingStatus, string> = {
  new: "#3b82f6",
  confirmed: "#22a25f",
  completed: "#64748b",
  cancelled: "#ef4444",
};

export default function AnalyticsPage() {
  const { data, isLoading } = useSWR<Analytics>("/api/admin/analytics", fetcher, { refreshInterval: 30000 });

  if (isLoading || !data) {
    return (
      <>
        <PageHeader title="Analytics" subtitle="Revenue, customers and fleet performance." />
        <p className="text-sm text-slate-500">Loading analytics…</p>
      </>
    );
  }

  const m = data.metrics;
  const hasBookings = m.totalBookings > 0;
  const pieData = data.bookingsByStatus
    .filter((s) => s.count > 0)
    .map((s) => ({ name: BOOKING_STATUS_META[s.status].label, value: s.count, status: s.status }));

  return (
    <>
      <PageHeader title="Analytics" subtitle="Revenue, customers and fleet performance at a glance." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total revenue" value={`₹${m.totalRevenue.toLocaleString("en-IN")}`} icon={IndianRupee} tone="brand" hint={`${m.completedTrips} completed trips`} />
        <MetricCard label="Registered customers" value={m.registeredCustomers} icon={Users} tone="blue" />
        <MetricCard label="Live / on trip now" value={m.liveVehicles} icon={Radio} tone="accent" hint={`${m.availableVehicles} available`} />
        <MetricCard label="Total bookings" value={m.totalBookings} icon={CalendarCheck} tone="violet" />
      </div>

      {!hasBookings ? (
        <div className="mt-6">
          <EmptyState icon={TrendingUp} title="No data to chart yet" desc="Charts will populate once you start receiving and completing bookings." />
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <CardPanel title="Revenue (last 6 months)">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={data.revenueSeries} margin={{ left: -10, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22a25f" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#22a25f" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f0" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="#15834b" strokeWidth={2} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardPanel>

          <CardPanel title="Bookings by status">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                  {pieData.map((e) => (
                    <Cell key={e.status} fill={STATUS_COLORS[e.status as BookingStatus]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardPanel>

          <CardPanel title="New customers (last 6 months)">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.customerGrowth} margin={{ left: -10, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f0" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="customers" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardPanel>

          <CardPanel title="Fleet utilization (completed trips)">
            {data.vehicleUtilization.length === 0 ? (
              <EmptyState icon={Car} title="No completed trips yet" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data.vehicleUtilization} layout="vertical" margin={{ left: 20, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef2f0" />
                  <XAxis type="number" stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={11} width={90} />
                  <Tooltip />
                  <Bar dataKey="trips" fill="#f7700f" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardPanel>
        </div>
      )}
    </>
  );
}
