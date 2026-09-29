import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  RefreshCw,
  Search,
  TrainFront,
} from "lucide-react";

import RecentJourneys from "./RecentJourneys";
import ScenicRoutes from "./ScenicRoutes";
import StatCard from "./StatCard";

const STORAGE_KEY = "railtrack_saved_journeys";

function readSavedJourneys() {
  try {
    const storedJourneys = localStorage.getItem(STORAGE_KEY);

    if (!storedJourneys) {
      return [];
    }

    const parsedJourneys = JSON.parse(storedJourneys);

    return Array.isArray(parsedJourneys) ? parsedJourneys : [];
  } catch (error) {
    console.error("Unable to read saved journeys:", error);
    return [];
  }
}

function formatTravelTime(totalMinutes) {
  const minutesValue = Number(totalMinutes) || 0;

  const hours = Math.floor(minutesValue / 60);
  const minutes = minutesValue % 60;

  if (hours === 0) {
    return `${minutes}m`;
  }

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}m`;
}

function Dashboard({
  onPlanJourney,
  onMyJourneys,
}) {
  const [savedJourneys, setSavedJourneys] = useState(() =>
    readSavedJourneys()
  );

  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === STORAGE_KEY) {
        setSavedJourneys(readSavedJourneys());
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const dashboardData = useMemo(() => {
    const totalJourneys = savedJourneys.length;

    const completedJourneys = savedJourneys.filter(
      (journey) => journey.status === "completed"
    ).length;

    const plannedJourneys = savedJourneys.filter(
      (journey) => journey.status === "planned"
    ).length;

    const totalTravelMinutes = savedJourneys.reduce(
      (total, journey) =>
        total + (Number(journey.durationMinutes) || 0),
      0
    );

    const completedPercentage =
      totalJourneys === 0
        ? 0
        : Math.round(
            (completedJourneys / totalJourneys) * 100
          );

    return {
      totalJourneys,
      completedJourneys,
      plannedJourneys,
      totalTravelMinutes,
      completedPercentage,
    };
  }, [savedJourneys]);

  const recentJourneys = useMemo(() => {
    return [...savedJourneys]
      .sort((a, b) => {
        const dateA = new Date(
          a.savedAt || a.departure || 0
        );

        const dateB = new Date(
          b.savedAt || b.departure || 0
        );

        return dateB - dateA;
      })
      .slice(0, 4);
  }, [savedJourneys]);

  const stats = [
    {
      id: "saved",
      title: "Saved Journeys",
      value: dashboardData.totalJourneys,
      subtitle: "In browser LocalStorage",
      icon: TrainFront,
      accent:
        "bg-gradient-to-r from-[#902D41] to-[#AB3F55]",
      iconStyle: "bg-red-50 text-[#902D41]",
      valueStyle: "text-slate-900",
    },
    {
      id: "time",
      title: "Total Travel Time",
      value: formatTravelTime(
        dashboardData.totalTravelMinutes
      ),
      subtitle: `${dashboardData.totalTravelMinutes} total minutes`,
      icon: Clock3,
      accent:
        "bg-gradient-to-r from-amber-400 to-amber-500",
      iconStyle: "bg-amber-50 text-amber-600",
      valueStyle: "text-slate-900",
    },
    {
      id: "completed",
      title: "Completed",
      value: dashboardData.completedJourneys,
      subtitle: `${dashboardData.completedPercentage}% of total trips`,
      icon: CheckCircle2,
      accent:
        "bg-gradient-to-r from-emerald-400 to-teal-500",
      iconStyle: "bg-emerald-50 text-emerald-600",
      valueStyle: "text-emerald-600",
    },
    {
      id: "upcoming",
      title: "Upcoming",
      value: dashboardData.plannedJourneys,
      subtitle: "Ready to board",
      icon: CalendarDays,
      accent:
        "bg-gradient-to-r from-blue-400 to-indigo-500",
      iconStyle: "bg-blue-50 text-blue-600",
      valueStyle: "text-blue-600",
    },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);

    setSavedJourneys(readSavedJourneys());

    window.setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  const handlePlanJourney = () => {
    if (onPlanJourney) {
      onPlanJourney();
      return;
    }

    alert(
      "Plan Journey page will open from the main application layout."
    );
  };

  const handleMyJourneys = () => {
    if (onMyJourneys) {
      onMyJourneys();
      return;
    }

    alert(
      "My Journeys page will open from the main application layout."
    );
  };

  return (
    <div className="w-full bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 md:p-8">

        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#7B2538] via-[#902D41] to-[#AB3F55] p-7 text-white shadow-xl sm:p-9">
          <div className="pointer-events-none absolute -bottom-16 -right-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />

          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />

                Railtrack Lite • Client-Side Edition
              </span>

              <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-4xl">
                Plan, Track & Log Your Train Journeys
              </h1>

              <p className="mt-2 text-sm font-normal leading-relaxed text-red-100 sm:text-base">
                Connect to live Swiss public transport timetables
                with zero backend complexity. Master React hooks,
                Axios, and LocalStorage with modern Tailwind design.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">

              <button
                type="button"
                onClick={handlePlanJourney}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#902D41] shadow-lg transition-all duration-200 hover:scale-105 hover:bg-slate-100 active:scale-95"
              >
                <Search size={18} />

                Search Connections
              </button>

              <button
                type="button"
                onClick={handleMyJourneys}
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/15 px-5 py-3 text-sm font-bold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/25 active:scale-95"
              >
                My Trips ({dashboardData.totalJourneys})
              </button>

            </div>
          </div>
        </section>

        {/* KPI CARDS */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard
              key={stat.id}
              {...stat}
            />
          ))}
        </section>

        {/* RECENT + RIGHT SIDE */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          <div className="lg:col-span-2">
            <RecentJourneys
              journeys={recentJourneys}
              totalJourneys={
                dashboardData.totalJourneys
              }
              onViewAll={handleMyJourneys}
            />
          </div>

          <div className="space-y-6">

            <ScenicRoutes
              onSearchRoute={handlePlanJourney}
            />

            {/* LEARNING CARD */}
            <div className="rounded-2xl border border-red-200 bg-gradient-to-br from-red-50/60 to-white p-5 shadow-sm">

              <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#902D41]">
                Tailwind & React Stack
              </span>

              <ul className="mt-3 space-y-2 text-xs text-slate-600">

                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#902D41]">
                    ✓
                  </span>

                  <span>
                    <strong>Design Tokens:</strong>{" "}
                    Curated primary palette, card shadows,
                    and smooth radius
                  </span>
                </li>

                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#902D41]">
                    ✓
                  </span>

                  <span>
                    <strong>Micro-Interactions:</strong>{" "}
                    Hover scales, rotators, and focus rings
                  </span>
                </li>

                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#902D41]">
                    ✓
                  </span>

                  <span>
                    <strong>Client-Side:</strong>{" "}
                    React Hooks + LocalStorage + Axios
                  </span>
                </li>

              </ul>
            </div>

          </div>
        </section>

        {/* REFRESH */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 shadow-sm transition hover:border-[#902D41]/30 hover:text-[#902D41] disabled:opacity-60"
          >
            <RefreshCw
              size={15}
              className={
                isRefreshing ? "animate-spin" : ""
              }
            />

            {isRefreshing
              ? "Refreshing..."
              : "Refresh Dashboard"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;