import { ArrowRight, Clock3, MapPin } from "lucide-react";
import JourneyStatusBadge from "./JourneyStatusBadge";

function formatJourneyDate(dateString) {
  if (!dateString) return "Date unavailable";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

function formatJourneyTime(dateString) {
  if (!dateString) return "--:--";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "--:--";
  }

  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function RecentJourneys({
  journeys,
  totalJourneys,
  onViewAll,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base font-extrabold text-slate-900">
            Recent Journeys
          </h2>

          <p className="text-xs text-slate-500">
            Your latest saved train trips
          </p>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 transition hover:bg-red-50 hover:text-[#902D41]"
        >
          View All ({totalJourneys}) →
        </button>
      </div>

      {journeys.length === 0 ? (
        <div className="flex min-h-52 flex-col items-center justify-center text-center">
          <MapPin size={34} className="text-slate-300" />

          <p className="mt-3 font-bold text-slate-700">
            No saved journeys yet
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Your latest saved train trips will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-3 divide-y divide-slate-100">
          {journeys.map((journey) => (
            <div
              key={journey.id}
              className="flex flex-col gap-3 rounded-xl p-2.5 py-4 transition hover:bg-slate-50/60 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-extrabold text-slate-900">
                    {journey.fromStation || "Unknown Station"}
                  </span>

                  <ArrowRight
                    size={15}
                    className="text-[#902D41]"
                  />

                  <span className="text-sm font-extrabold text-slate-900">
                    {journey.toStation || "Unknown Station"}
                  </span>

                  {journey.products?.[0] && (
                    <span className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-700">
                      {journey.products[0]}
                    </span>
                  )}
                </div>

                <p className="mt-1 flex flex-wrap items-center gap-x-1 text-xs font-medium text-slate-500">
                  <span>
                    {formatJourneyTime(journey.departure)}
                  </span>

                  <span>•</span>

                  <span>
                    {formatJourneyDate(journey.departure)}
                  </span>

                  <span>•</span>

                  <span className="inline-flex items-center gap-1">
                    <Clock3 size={12} />
                    {Number(journey.durationMinutes) || 0} min
                  </span>

                  <span>•</span>

                  <span
                    className={
                      Number(journey.transfers) === 0
                        ? "font-semibold text-emerald-600"
                        : "font-semibold text-amber-600"
                    }
                  >
                    {Number(journey.transfers) === 0
                      ? "Direct"
                      : `${journey.transfers} transfer${
                          Number(journey.transfers) > 1
                            ? "s"
                            : ""
                        }`}
                  </span>

                  {journey.departurePlatform && (
                    <>
                      <span>•</span>
                      <span>
                        Pl. {journey.departurePlatform}
                      </span>
                    </>
                  )}
                </p>
              </div>

              <JourneyStatusBadge
                status={journey.status}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default RecentJourneys;