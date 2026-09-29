import { useState } from "react";

import Dashboard from "./components/dashboard/Dashboard";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import PlanJourney from "./pages/PlanJourney";

const STORAGE_KEY = "railtrack_saved_journeys";

function getSavedJourneys() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Unable to read saved journeys:", error);
    return [];
  }
}

function App() {
  const [currentPage, setCurrentPage] = useState("Dashboard");

  const [savedJourneys, setSavedJourneys] = useState(() =>
    getSavedJourneys()
  );

  const handleNavigation = (page) => {
    setSavedJourneys(getSavedJourneys());
    setCurrentPage(page);
  };

  const handleReset = () => {
    const confirmed = window.confirm(
      "Are you sure you want to remove all saved journeys?"
    );

    if (!confirmed) {
      return;
    }

    localStorage.removeItem(STORAGE_KEY);
    setSavedJourneys([]);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "Plan Journey":
        return (
          <PlanJourney
            savedJourneys={savedJourneys}
            setSavedJourneys={setSavedJourneys}
          />
        );

      case "My Journeys":
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-slate-900">
              My Journeys
            </h2>

            <p className="mt-2 text-slate-500">
              My Journeys page will appear here after Khushi's work is merged.
            </p>
          </div>
        );

      case "Travel Stats":
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-slate-900">
              Travel Stats
            </h2>

            <p className="mt-2 text-slate-500">
              Travel Stats page will appear here after Divya's work is merged.
            </p>
          </div>
        );

      case "Dashboard":
      default:
        return (
          <Dashboard
            onPlanJourney={() =>
              handleNavigation("Plan Journey")
            }
            onMyJourneys={() =>
              handleNavigation("My Journeys")
            }
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        currentPage={currentPage}
        savedJourneys={savedJourneys}
        onNavigation={handleNavigation}
        onReset={handleReset}
      />

      <div
        className="flex min-h-screen flex-col"
        style={{ marginLeft: "315px" }}
      >
        <Header
          currentPage={currentPage}
          savedJourneys={savedJourneys}
        />

        <main className="flex-1">
          {renderPage()}
        </main>

        <Footer
          currentPage={currentPage}
          onNavigation={handleNavigation}
        />
      </div>
    </div>
  );
}

export default App;