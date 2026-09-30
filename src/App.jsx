import { useEffect, useState } from "react";

import Dashboard from "./components/dashboard/Dashboard";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

import PlanJourney from "./pages/PlanJourney";
import TravelStatus from "./pages/TravelStatus";
import MyJourneys from "./pages/MyJourneys";

import "./App.css";

const STORAGE_KEY = "railtrack_saved_journeys";

function loadJourneys() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to load journeys:", error);
    return [];
  }
}

function App() {
  const [savedJourneys, setSavedJourneys] = useState(loadJourneys);

  // Dashboard opens first
  const [currentPage, setCurrentPage] = useState("Dashboard");

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(savedJourneys)
    );
  }, [savedJourneys]);

  const handleNavigation = (page) => {
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
      case "Dashboard":
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

      case "Plan Journey":
        return (
          <PlanJourney
            savedJourneys={savedJourneys}
            setSavedJourneys={setSavedJourneys}
          />
        );

      case "My Journeys":
        return (
          <MyJourneys
            savedJourneys={savedJourneys}
            setSavedJourneys={setSavedJourneys}
            onPlanJourney={() =>
              handleNavigation("Plan Journey")
            }
          />
        );

      case "Travel Stats":
        return (
          <TravelStatus
            savedJourneys={savedJourneys}
            onPlanJourney={() =>
              handleNavigation("Plan Journey")
            }
          />
        );

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
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Sidebar
        currentPage={currentPage}
        savedJourneys={savedJourneys}
        onNavigation={handleNavigation}
        onReset={handleReset}
      />

      <div
        style={{
          marginLeft: "315px",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header
        currentPage={currentPage}
        savedJourneys={savedJourneys}
        onNavigation={handleNavigation}
        />

        <main style={{ flex: 1 }}>
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