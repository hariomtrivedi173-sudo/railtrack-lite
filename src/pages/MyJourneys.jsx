  import { useEffect, useMemo, useState } from "react";
  import SavedJourneyCard from "../components/SavedJourneyCard";

  const STORAGE_KEY = "railtrack_saved_journeys";

  function MyJourneys() {
    const [savedJourneys, setSavedJourneys] = useState(() => {
      try {
        const storedJourneys = localStorage.getItem(STORAGE_KEY);

        return storedJourneys ? JSON.parse(storedJourneys) : [];
      } catch (error) {
        console.error("Failed to load journeys:", error);
        return [];
      }
    });

    const [statusFilter, setStatusFilter] = useState("all");

    // Save changes to localStorage
    useEffect(() => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(savedJourneys)
      );
    }, [savedJourneys]);

    // Filter journeys
    const filteredJourneys = useMemo(() => {
      if (statusFilter === "all") {
        return savedJourneys;
      }

      return savedJourneys.filter(
        (journey) => journey.status === statusFilter
      );
    }, [savedJourneys, statusFilter]);

    // Counts
    const plannedCount = savedJourneys.filter(
      (journey) => journey.status === "planned"
    ).length;

    const completedCount = savedJourneys.filter(
      (journey) => journey.status === "completed"
    ).length;

    // Toggle planned/completed
    const toggleStatus = (id) => {
      setSavedJourneys((currentJourneys) =>
        currentJourneys.map((journey) =>
          journey.id === id
            ? {
                ...journey,
                status:
                  journey.status === "planned"
                    ? "completed"
                    : "planned",
              }
            : journey
        )
      );
    };

    // Delete one journey
    const deleteJourney = (id) => {
      const confirmed = window.confirm(
        "Are you sure you want to remove this journey?"
      );

      if (!confirmed) {
        return;
      }

      setSavedJourneys((currentJourneys) =>
        currentJourneys.filter((journey) => journey.id !== id)
      );
    };

    // Edit note
    const editNote = (journey) => {
      const newNote = window.prompt(
        "Enter a note for this journey:",
        journey.notes || ""
      );

      if (newNote === null) {
        return;
      }

      setSavedJourneys((currentJourneys) =>
        currentJourneys.map((item) =>
          item.id === journey.id
            ? {
                ...item,
                notes: newNote,
              }
            : item
        )
      );
    };

    // Clear all
    const clearAllJourneys = () => {
      if (savedJourneys.length === 0) {
        return;
      }

      const confirmed = window.confirm(
        "Are you sure you want to delete all saved journeys?"
      );

      if (!confirmed) {
        return;
      }

      setSavedJourneys([]);
    };

    // Go to Plan Journey
    const goToPlanJourney = () => {
      window.location.href = "/plan-journey";
    };

    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        {/* Top Header */}
        <header className="border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between px-6 py-5 lg:px-10">
            <div>
              <p className="text-sm font-medium text-slate-400">
                Railtrack / My Journeys
              </p>

              <h1 className="mt-1 text-3xl font-bold">
                My Journeys
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden rounded-full border border-emerald-200 bg-emerald-50 px-5 py-2 text-sm font-semibold text-emerald-700 sm:block">
                🟢 LocalStorage
                <span className="ml-2 rounded-full bg-emerald-100 px-2 py-1">
                  {savedJourneys.length}
                </span>
              </div>

              <button
                onClick={goToPlanJourney}
                className="rounded-full bg-red-800 px-6 py-3 font-semibold text-white transition hover:bg-red-900"
              >
                ＋ Plan Journey
              </button>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
          {/* Saved Journeys Header */}
          <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-3xl font-bold">
                    My Saved Journeys
                  </h2>

                  <span className="rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-800">
                    {savedJourneys.length}{" "}
                    {savedJourneys.length === 1 ? "Trip" : "Trips"}
                  </span>
                </div>

                <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">
                  Personal travel journal stored safely in browser
                  LocalStorage. No database or account required.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={goToPlanJourney}
                  className="rounded-2xl bg-red-800 px-6 py-4 font-semibold text-white transition hover:bg-red-900"
                >
                  ＋
                  <span className="ml-2">
                    Plan New Trip
                  </span>
                </button>

                <button
                  onClick={clearAllJourneys}
                  disabled={savedJourneys.length === 0}
                  className="rounded-2xl border border-slate-200 bg-white px-6 py-4 font-semibold text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  🗑
                  <span className="ml-2">
                    Clear All
                  </span>
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-6">
              <span className="mr-2 text-sm font-semibold uppercase tracking-wider text-slate-400">
                Filter:
              </span>

              <button
                onClick={() => setStatusFilter("all")}
                className={`rounded-full px-6 py-3 text-sm font-semibold transition ${
                  statusFilter === "all"
                    ? "bg-slate-900 text-white"
                    : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                }`}
              >
                All Trips ({savedJourneys.length})
              </button>

              <button
                onClick={() => setStatusFilter("planned")}
                className={`rounded-full px-6 py-3 text-sm font-semibold transition ${
                  statusFilter === "planned"
                    ? "bg-slate-900 text-white"
                    : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                }`}
              >
                Planned ({plannedCount})
              </button>

              <button
                onClick={() => setStatusFilter("completed")}
                className={`rounded-full px-6 py-3 text-sm font-semibold transition ${
                  statusFilter === "completed"
                    ? "bg-slate-900 text-white"
                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                }`}
              >
                Completed ({completedCount})
              </button>
            </div>
          </section>

          {/* Journey List */}
          {filteredJourneys.length > 0 ? (
            <section className="mt-8 grid gap-7 lg:grid-cols-2">
              {filteredJourneys.map((journey) => (
                <SavedJourneyCard
                  key={journey.id}
                  journey={journey}
                  onToggleStatus={() =>
                    toggleStatus(journey.id)
                  }
                  onDelete={() =>
                    deleteJourney(journey.id)
                  }
                  onEditNote={() =>
                    editNote(journey)
                  }
                />
              ))}
            </section>
          ) : (
            <section className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center shadow-sm">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-4xl">
                🚆
              </div>

              <h2 className="mt-6 text-2xl font-bold text-slate-900">
                No journeys found
              </h2>

              <p className="mx-auto mt-3 max-w-md text-slate-500">
                {savedJourneys.length === 0
                  ? "You haven't saved any train journeys yet. Plan your first journey and save it here."
                  : "There are no journeys matching the selected filter."}
              </p>

              {savedJourneys.length === 0 && (
                <button
                  onClick={goToPlanJourney}
                  className="mt-7 rounded-2xl bg-red-800 px-7 py-3 font-semibold text-white hover:bg-red-900"
                >
                  Plan your first journey
                </button>
              )}
            </section>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-10 border-t border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-8 py-6 text-sm text-slate-500">
            <p>
              🚆
              <span className="ml-2 font-semibold text-slate-700">
                Railtrack
              </span>
              <span className="mx-2">•</span>
              © 2026 Train Journey Planner
            </p>

            <div className="flex flex-wrap gap-5">
              <button
                onClick={goToPlanJourney}
                className="hover:text-red-800"
              >
                Plan Journey
              </button>

              <span>•</span>

              <span className="font-semibold text-red-800">
                My Journeys
              </span>

              <span>•</span>

              <button
                onClick={() => {
                  window.location.href = "/travel-stats";
                }}
                className="hover:text-red-800"
              >
                Travel Stats
              </button>

              <span>•</span>

              <a
                href="https://opentransportdata.swiss/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-red-800"
              >
                Swiss Open Data ↗
              </a>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  export default MyJourneys;