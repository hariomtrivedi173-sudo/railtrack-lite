import { useState, useEffect } from "react";
import TravelStatus from "./pages/TravelStatus";

const STORAGE_KEY = "railtrack_saved_journeys";

function loadJourneys() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Failed to load from localStorage", e);
    return [];
  }
}

export default function App() {
  const [savedJourneys, setSavedJourneys] = useState(loadJourneys);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedJourneys));
  }, [savedJourneys]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
        <div>
          <p className="text-sm text-slate-500">
            JourneyHub / <span className="font-semibold text-slate-800">Travel Stats</span>
          </p>
          <h2 className="text-xl font-bold">Travel Stats</h2>
        </div>
        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
          LocalStorage {savedJourneys.length}
        </span>
      </header>

      <TravelStatus
        savedJourneys={savedJourneys}
        onPlanJourney={() => alert("Go to Plan Journey")}
      />
    </div>
  );
}