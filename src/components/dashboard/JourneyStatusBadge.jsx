import { CheckCircle2, Clock3 } from "lucide-react";

function JourneyStatusBadge({ status }) {
  const normalizedStatus = status?.toLowerCase();

  if (normalizedStatus === "completed") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
        <CheckCircle2 size={14} />
        Completed
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
      <Clock3 size={14} />
      Planned
    </span>
  );
}

export default JourneyStatusBadge;