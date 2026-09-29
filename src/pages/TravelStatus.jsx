import { useMemo } from "react";

const STORAGE_KEY = "railtrack_saved_journeys";

// Eco estimate: average train speed x CO2 saved per km vs. a highway car
const AVG_TRAIN_SPEED_KMH = 80;
const CO2_SAVED_KG_PER_KM = 0.15;

// "00d01:35:00" -> 95 (total minutes)
function durationToMinutes(durationStr) {
  if (!durationStr) return 0;
  const [dayPart, timePart] = durationStr.includes("d")
    ? durationStr.split("d")
    : ["0", durationStr];
  const [h = 0, m = 0] = timePart.split(":").map((n) => parseInt(n, 10) || 0);
  return (parseInt(dayPart, 10) || 0) * 1440 + h * 60 + m;
}

// 171 -> "2h 51m"
function formatMinutes(totalMinutes) {
  const mins = Math.max(0, Math.round(totalMinutes || 0));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

// Fallback: read directly from localStorage if App doesn't pass the data
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Failed to load from localStorage", e);
    return [];
  }
}

// Most frequent value of a key, using .reduce()
function getTopItem(journeys, key) {
  const counts = journeys.reduce((acc, j) => {
    const name = j[key];
    if (name) acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});

  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return top ? { name: top[0], count: top[1] } : null;
}

const CARD_STYLES = {
  maroon: { border: "border-t-[#8b1e3f]", badge: "bg-rose-100 text-[#8b1e3f]", value: "text-slate-900" },
  amber: { border: "border-t-amber-600", badge: "bg-amber-100 text-amber-700", value: "text-amber-600" },
  green: { border: "border-t-emerald-600", badge: "bg-emerald-100 text-emerald-700", value: "text-emerald-600" },
  blue: { border: "border-t-blue-600", badge: "bg-blue-100 text-blue-700", value: "text-blue-600" },
};

function StatCard({ label, value, tag, icon, color }) {
  const s = CARD_STYLES[color];
  return (
    <div className={`rounded-2xl border border-slate-200 border-t-4 ${s.border} bg-white p-5 shadow-sm`}>
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
        <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${s.badge}`}>{icon}</span>
      </div>
      <div className="mt-4 flex items-end justify-between">
        <p className={`text-4xl font-extrabold ${s.value}`}>{value}</p>
        <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${s.badge}`}>{tag}</span>
      </div>
    </div>
  );
}

function HubCard({ icon, iconBg, label, name, count, unit }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-center">
      <span className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg ${iconBg}`}>{icon}</span>
      <p className="mt-3 text-xs font-medium uppercase tracking-wider text-slate-500">{label}</p>
      <p className="text-xl font-bold text-slate-900">{name}</p>
      <span className="mt-3 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-700">
        {count} {count === 1 ? unit : `${unit}s`}
      </span>
    </div>
  );
}

function ProgressRow({ label, count, percent, dotColor, barColor }) {
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between text-sm font-semibold text-slate-900">
        <span className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${dotColor}`} />
          {label} ({count})
        </span>
        <span>{percent}%</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export default function TravelStatus({ savedJourneys, onPlanJourney }) {
  // Use props from App if given, otherwise read localStorage
  const journeys = useMemo(
    () => (Array.isArray(savedJourneys) ? savedJourneys : loadFromStorage()),
    [savedJourneys]
  );

  // All values below are derived: no extra state or storage
  const stats = useMemo(() => {
    const total = journeys.length;
    const completed = journeys.filter((j) => j.status === "completed").length;
    const planned = journeys.filter((j) => j.status === "planned").length;

    const totalMinutes = journeys.reduce(
      (sum, j) => sum + (j.durationMinutes ?? durationToMinutes(j.duration)),
      0
    );

    const direct = journeys.filter((j) => (j.transfers ?? 0) === 0).length;
    const withTransfers = total - direct;

    const pct = (n) => (total === 0 ? 0 : Math.round((n / total) * 100));

    const co2Kg = Math.round((totalMinutes / 60) * AVG_TRAIN_SPEED_KMH * CO2_SAVED_KG_PER_KM);

    return {
      total,
      completed,
      planned,
      totalMinutes,
      completedPct: pct(completed),
      direct,
      withTransfers,
      directPct: pct(direct),
      transferPct: pct(withTransfers),
      co2Kg,
      topDeparture: getTopItem(journeys, "fromStation"),
      topDestination: getTopItem(journeys, "toStation"),
    };
  }, [journeys]);

  return (
    <div className="space-y-5 p-6">
      {/* Intro */}
      <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-3xl font-extrabold text-slate-900">Travel Analytics &amp; Metrics</h2>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              Calculated Client-Side
            </span>
          </div>
          <p className="mt-3 text-slate-600">
            Computed in real time using vanilla JavaScript array reducers (
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">.reduce()</code>,{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">.filter()</code>) on localStorage.
          </p>
        </div>
        <button
          onClick={onPlanJourney}
          className="rounded-lg bg-[#8b1e3f] px-6 py-3 font-semibold text-white shadow hover:bg-[#741934] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8b1e3f] focus-visible:ring-offset-2"
        >
          + Plan Next Journey
        </button>
      </section>

      {/* KPI cards */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Journeys" value={stats.total} tag="Logged Trips" icon="◎" color="maroon" />
        <StatCard
          label="Time on Rails"
          value={formatMinutes(stats.totalMinutes)}
          tag={`${stats.totalMinutes} mins`}
          icon="◔"
          color="amber"
        />
        <StatCard label="Completed" value={stats.completed} tag={`${stats.completedPct}%`} icon="✓" color="green" />
        <StatCard label="Planned Ahead" value={stats.planned} tag="Upcoming" icon="▤" color="blue" />
      </section>

      {/* Hubs + Connection types */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900">Favorite Station Hubs ✨</h3>
          <p className="mt-1 text-sm text-slate-500">Your most frequently visited railway stations</p>

          {stats.topDeparture ? (
            <div className="mt-5 space-y-4">
              <HubCard
                icon="🚉"
                iconBg="bg-rose-100"
                label="Top Departure Hub"
                name={stats.topDeparture.name}
                count={stats.topDeparture.count}
                unit="departure"
              />
              <HubCard
                icon="🎯"
                iconBg="bg-emerald-100"
                label="Top Destination"
                name={stats.topDestination.name}
                count={stats.topDestination.count}
                unit="arrival"
              />
            </div>
          ) : (
            <p className="mt-6 rounded-xl bg-slate-50 p-6 text-center text-slate-500">
              Save a journey to see your favorite stations here.
            </p>
          )}
        </div>

        <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900">Connection Types &amp; Eco Impact</h3>
          <p className="mt-1 text-sm text-slate-500">Train transfer efficiency &amp; estimated environmental benefit</p>

          <ProgressRow
            label="Direct Trains"
            count={stats.direct}
            percent={stats.directPct}
            dotColor="bg-emerald-500"
            barColor="bg-emerald-500"
          />
          <ProgressRow
            label="Transfers Required"
            count={stats.withTransfers}
            percent={stats.transferPct}
            dotColor="bg-amber-500"
            barColor="bg-amber-500"
          />

          <div className="mt-6 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-5">
            <div>
              <p className="text-lg font-bold text-slate-900">🌱 Estimated CO2 Avoided</p>
              <p className="text-sm text-slate-500">Compared to highway automobile travel</p>
            </div>
            <p className="text-2xl font-extrabold text-slate-900">~{stats.co2Kg} kg</p>
          </div>

          <div className="mt-auto border-t border-slate-200 pt-5 text-right">
            <button onClick={onPlanJourney} className="font-semibold text-[#8b1e3f] hover:underline">
              Search New Route →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}