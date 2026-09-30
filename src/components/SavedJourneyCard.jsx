function SavedJourneyCard({
  journey,
  onToggleStatus,
  onDelete,
  onEditNote,
}) {
  const isCompleted = journey.status === "completed";

  const departureDate = new Date(journey.departure);
  const arrivalDate = new Date(journey.arrival);

  const departureTime = departureDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const arrivalTime = arrivalDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const departureDateText = departureDate.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });

  const arrivalDateText = arrivalDate.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* Top colored line */}
      <div
        className={`h-2 ${
          isCompleted
            ? "bg-gradient-to-r from-emerald-400 to-teal-400"
            : "bg-gradient-to-r from-blue-500 to-indigo-500"
        }`}
      />

      <div className="p-8">
        {/* Route + Status */}
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-400">
              Route
            </p>

            <h2 className="text-2xl font-bold text-slate-900">
              {journey.fromStation}
              <span className="mx-2 text-red-700">→</span>
              {journey.toStation}
            </h2>
          </div>

          <button
            onClick={onToggleStatus}
            className={`rounded-full border px-5 py-2 text-sm font-semibold transition hover:shadow-sm ${
              isCompleted
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                : "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
            }`}
          >
            {isCompleted ? "✓ Completed" : "⌛ Planned"}
          </button>
        </div>

        {/* Departure / Arrival */}
        <div className="grid gap-4 rounded-2xl bg-slate-50 p-5 sm:grid-cols-2">
          <div>
            <p className="mb-1 text-sm font-medium uppercase tracking-wide text-slate-400">
              Departure
            </p>

            <p className="text-2xl font-bold text-slate-900">
              {departureTime}
            </p>

            <p className="text-sm text-slate-500">
              {departureDateText}
              {" • "}
              Pl. {journey.departurePlatform || "N/A"}
            </p>
          </div>

          <div>
            <p className="mb-1 text-sm font-medium uppercase tracking-wide text-slate-400">
              Arrival
            </p>

            <p className="text-2xl font-bold text-slate-900">
              {arrivalTime}
            </p>

            <p className="text-sm text-slate-500">
              {arrivalDateText}
              {" • "}
              Pl. {journey.arrivalPlatform || "N/A"}
            </p>
          </div>
        </div>

        {/* Journey information */}
        <div className="mt-5 flex flex-wrap gap-3">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
            ⏱ {formatDuration(journey.duration, journey.durationMinutes)}
          </span>

          <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
            {journey.transfers === 0
              ? "Direct Train"
              : `${journey.transfers} Transfer${
                  journey.transfers > 1 ? "s" : ""
                }`}
          </span>

          {journey.products?.map((product) => (
            <span
              key={product}
              className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700"
            >
              {product}
            </span>
          ))}
        </div>

        {/* Note */}
        <div className="mt-6 flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
          <button
            onClick={onEditNote}
            className="flex-1 text-left text-sm text-slate-700 hover:text-slate-900"
          >
            📝{" "}
            {journey.notes
              ? journey.notes
              : "Add a note about this journey"}
          </button>

          <button
            onClick={onEditNote}
            className="ml-4 text-sm font-medium text-slate-400 hover:text-slate-700"
          >
            Edit
          </button>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
          <button
            onClick={onToggleStatus}
            className="font-semibold text-red-800 hover:text-red-900"
          >
            {isCompleted
              ? "Mark as Planned ⌛"
              : "Mark as Completed ✓"}
          </button>

          <button
            onClick={onDelete}
            className="font-medium text-slate-400 hover:text-red-600"
          >
            🗑 Remove
          </button>
        </div>
      </div>
    </div>
  );
}

function formatDuration(duration, durationMinutes) {
  if (durationMinutes !== undefined && durationMinutes !== null) {
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    if (hours === 0) {
      return `${minutes} min`;
    }

    if (minutes === 0) {
      return `${hours}h`;
    }

    return `${hours}h ${minutes}m`;
  }

  if (!duration) {
    return "N/A";
  }

  const parts = duration.split("d");
  const timePart = parts[1] || parts[0];

  const [hours, minutes] = timePart.split(":");

  const h = parseInt(hours, 10);
  const m = parseInt(minutes, 10);

  if (h === 0) {
    return `${m} min`;
  }

  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export default SavedJourneyCard;