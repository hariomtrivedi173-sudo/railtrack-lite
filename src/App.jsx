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
  } catch (e) {
    console.error("Failed to load from localStorage", e);
    return [];
  }
}

function App() {
  const [savedJourneys, setSavedJourneys] = useState(loadJourneys);
  const [currentPage, setCurrentPage] = useState("Plan Journey");

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
          <div
            style={{
              padding: "40px",
              fontSize: "20px",
            }}
          >
            <h2>My Journeys</h2>

            {savedJourneys.length === 0 ? (
              <p>No saved journeys yet.</p>
            ) : (
              <ul>
                {savedJourneys.map((journey, index) => (
                  <li key={index}>
                    Journey {index + 1}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );

      case "Dashboard":
        return (
          <div
            style={{
              padding: "40px",
              fontSize: "20px",
            }}
          >
            <h2>Dashboard</h2>
            <p>Dashboard page.</p>
          </div>
        );

      default:
        return <PlanJourney />;
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        color: "#111827",
      }}
    >
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