import { connectDB } from "@/lib/db";
import { Booking } from "@/models/Booking";
import { Customer } from "@/models/Customer";
import { Vehicle } from "@/models/Vehicle";
import { handler, ok, requireRole } from "@/lib/api";
import { BOOKING_STATUSES } from "@/lib/constants";

export const dynamic = "force-dynamic";

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function monthLabel(d: Date) {
  return d.toLocaleString("en-US", { month: "short" });
}

export const GET = handler(async () => {
  await requireRole("admin");
  await connectDB();

  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [
    completedAgg,
    totalBookings,
    registeredCustomers,
    statusCounts,
    vehicleCounts,
    recentBookings,
    recentCustomers,
    utilization,
  ] = await Promise.all([
    Booking.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, revenue: { $sum: "$fare" }, count: { $sum: 1 } } },
    ]),
    Booking.countDocuments(),
    Customer.countDocuments(),
    Booking.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Vehicle.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Booking.find({ createdAt: { $gte: sixMonthsAgo } }).select("createdAt fare status").lean(),
    Customer.find({ createdAt: { $gte: sixMonthsAgo } }).select("createdAt").lean(),
    Booking.aggregate([
      { $match: { status: "completed", assignedVehicle: { $ne: null } } },
      { $group: { _id: "$assignedVehicle", trips: { $sum: 1 }, revenue: { $sum: "$fare" } } },
      { $sort: { trips: -1 } },
      { $limit: 10 },
    ]),
  ]);

  // Build 6-month buckets.
  const months: { key: string; label: string }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ key: monthKey(d), label: monthLabel(d) });
  }

  const revenueSeries = months.map((m) => {
    const inMonth = recentBookings.filter((b) => monthKey(new Date(b.createdAt)) === m.key);
    return {
      month: m.label,
      revenue: inMonth.filter((b) => b.status === "completed").reduce((s, b) => s + (b.fare || 0), 0),
      bookings: inMonth.length,
    };
  });

  const customerGrowth = months.map((m) => ({
    month: m.label,
    customers: recentCustomers.filter((c) => monthKey(new Date(c.createdAt)) === m.key).length,
  }));

  const statusMap = Object.fromEntries(statusCounts.map((s) => [s._id, s.count]));
  const bookingsByStatus = BOOKING_STATUSES.map((status) => ({ status, count: statusMap[status] || 0 }));

  const vehicleMap = Object.fromEntries(vehicleCounts.map((v) => [v._id, v.count]));

  // Resolve vehicle names for the utilization chart.
  const vehicleIds = utilization.map((u) => u._id);
  const vehicleNames = await Vehicle.find({ _id: { $in: vehicleIds } }).select("name").lean();
  const nameById = Object.fromEntries(vehicleNames.map((v) => [String(v._id), v.name]));

  return ok({
    metrics: {
      totalRevenue: completedAgg[0]?.revenue || 0,
      completedTrips: completedAgg[0]?.count || 0,
      totalBookings,
      registeredCustomers,
      liveVehicles: (vehicleMap["on_trip"] || 0) + (vehicleMap["busy"] || 0),
      availableVehicles: vehicleMap["available"] || 0,
      totalVehicles: vehicleCounts.reduce((s, v) => s + v.count, 0),
    },
    revenueSeries,
    customerGrowth,
    bookingsByStatus,
    vehicleStatusBreakdown: Object.entries(vehicleMap).map(([status, count]) => ({ status, count })),
    vehicleUtilization: utilization.map((u) => ({
      name: nameById[String(u._id)] || "Unknown",
      trips: u.trips,
      revenue: u.revenue,
    })),
  });
});
