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

// 105 -> "1h 45m"
function formatMinutes(totalMinutes) {
  const mins = Math.max(0, Math.round(totalMinutes || 0));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

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

// Read a station name from several possible data shapes
function getStationName(j, side) {
  if (side === "from") {
    return j.fromStation ?? j.from?.station?.name ?? (typeof j.from === "string" ? j.from : null);
  }
  return j.toStation ?? j.to?.station?.name ?? (typeof j.to === "string" ? j.to : null);
}

// Most frequent station, using .reduce() -> { name, n } or null
function getTopStation(journeys, side) {
  const counts = journeys.reduce((acc, j) => {
    const name = getStationName(j, side);
    if (name) acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});

  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return top ? { name: top[0], n: top[1] } : null;
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
      <div className="mt-4 flex items-end justify-between gap-2">
        <p className={`text-4xl font-extrabold ${s.value}`}>{value}</p>
        <span className={`whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-semibold ${s.badge}`}>{tag}</span>
      </div>
    </div>
  );
}

// Same structure as your snippet: icon | label + name | count pill
function Hub({ icon, iconBg, label, station, unit }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl ${iconBg}`}>
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <small className="block text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</small>
        <strong className="block truncate text-xl font-bold text-slate-900">
          {station ? station.name : "—"}
        </strong>
      </div>
      {station && (
        <span className="whitespace-nowrap rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700">
          {station.n} {unit}
          {station.n > 1 ? "s" : ""}
        </span>
      )}
    </div>
  );
}

function ProgressRow({ label, count, percent, dotColor, barColor }) {
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between text-sm font-semibold text-slate-900">
        <span className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${dotColor}`} />
          {label} ({count})
        </span>
        <span>{percent}%</span>
      </div>
      <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export default function TravelStatus({ savedJourneys, onPlanJourney }) {
  const journeys = useMemo(
    () => (Array.isArray(savedJourneys) ? savedJourneys : loadFromStorage()),
    [savedJourneys]
  );

  // Everything below is derived: no extra state or storage
  const s = useMemo(() => {
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
      dep: getTopStation(journeys, "from"),
      arr: getTopStation(journeys, "to"),
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
        <StatCard label="Total Journeys" value={s.total} tag="Logged Trips" icon="◎" color="maroon" />
        <StatCard
          label="Time on Rails"
          value={formatMinutes(s.totalMinutes)}
          tag={`${s.totalMinutes} mins`}
          icon="◔"
          color="amber"
        />
        <StatCard label="Completed" value={s.completed} tag={`${s.completedPct}%`} icon="✓" color="green" />
        <StatCard label="Planned Ahead" value={s.planned} tag="Upcoming" icon="▤" color="blue" />
      </section>

      {/* Hubs + Connection types */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Favorite Station Hubs */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900">Favorite Station Hubs ✨</h3>
          <p className="mt-1 text-sm text-slate-500">Your most frequently visited railway stations</p>

          <div className="mt-5 space-y-4">
            <Hub icon="🚉" iconBg="bg-[#fde8ec]" label="Top departure hub" station={s.dep} unit="departure" />
            <Hub icon="🎯" iconBg="bg-[#d1fae5]" label="Top destination" station={s.arr} unit="arrival" />
          </div>
        </div>

        {/* Connection Types & Eco Impact */}
        <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900">Connection Types &amp; Eco Impact</h3>
          <p className="mt-1 text-sm text-slate-500">Train transfer efficiency &amp; estimated environmental benefit</p>

          <ProgressRow
            label="Direct Trains"
            count={s.direct}
            percent={s.directPct}
            dotColor="bg-emerald-500"
            barColor="bg-emerald-500"
          />
          <ProgressRow
            label="Transfers Required"
            count={s.withTransfers}
            percent={s.transferPct}
            dotColor="bg-amber-500"
            barColor="bg-amber-500"
          />

          <div className="mt-6 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-5">
            <div>
              <p className="text-lg font-bold text-slate-900">🌱 Estimated CO2 Avoided</p>
              <p className="text-sm text-emerald-700">Compared to highway automobile travel</p>
            </div>
            <p className="text-2xl font-extrabold text-slate-900">~{s.co2Kg} kg</p>
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