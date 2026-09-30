import { useEffect, useState } from "react";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import PlanJourney from "./pages/PlanJourney";
import TravelStatus from "./pages/TravelStatus";

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
    localStorage.removeItem(STORAGE_KEY);
    setSavedJourneys([]);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "Dashboard":
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">
              Dashboard
            </h1>

            <p className="text-gray-600">
              Welcome to RailTrack Lite.
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow p-5">
                <h2 className="font-semibold text-lg">
                  Total Journeys
                </h2>
                <p className="text-3xl font-bold mt-2">
                  {savedJourneys.length}
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-5">
                <h2 className="font-semibold text-lg">
                  Plan Journey
                </h2>
                <p className="text-gray-600 mt-2">
                  Plan your next railway journey.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-5">
                <h2 className="font-semibold text-lg">
                  Travel Stats
                </h2>
                <p className="text-gray-600 mt-2">
                  View your travel analytics and metrics.
                </p>
              </div>
            </div>
          </div>
        );

      case "Plan Journey":
        return (
          <PlanJourney
            savedJourneys={savedJourneys}
            setSavedJourneys={setSavedJourneys}
          />
        );

      case "Travel Stats":
        return (
          <TravelStatus
            savedJourneys={savedJourneys}
            onPlanJourney={() =>
              setCurrentPage("Plan Journey")
            }
          />
        );

      case "My Journeys":
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">
              My Journeys
            </h1>

            {savedJourneys.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">
                  No saved journeys yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {savedJourneys.map((journey, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow p-5"
                  >
                    <h2 className="font-semibold">
                      Journey {index + 1}
                    </h2>

                    <pre className="mt-3 text-sm text-gray-600 whitespace-pre-wrap">
                      {JSON.stringify(journey, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold">
              Dashboard
            </h1>
          </div>
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