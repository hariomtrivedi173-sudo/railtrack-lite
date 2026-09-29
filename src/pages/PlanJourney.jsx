<<<<<<< Updated upstream
=======
import { useEffect, useState } from "react";
import {
  searchStations,
  searchConnections,
} from "../api/transportApi";

const STORAGE_KEY = "railtrack_saved_journeys";

/* ================= ICONS ================= */

function PlanIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8" />
      <path d="M8 12h8" />
    </svg>
  );
}

function JourneysIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="4" width="6" height="6" rx="1" />
      <rect x="14" y="4" width="6" height="6" rx="1" />
      <rect x="4" y="14" width="6" height="6" rx="1" />
      <rect x="14" y="14" width="6" height="6" rx="1" />
    </svg>
  );
}

function StatsIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19V9" />
      <path d="M10 19V5" />
      <path d="M16 19v-7" />
      <path d="M22 19V3" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9 21v-6h6v6" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 7h16" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M6 7l1 14h10l1-14" />
      <path d="M9 7V4h6v3" />
    </svg>
  );
}

function TrainLogoIcon() {
  return (
    <svg
      width="27"
      height="27"
      viewBox="0 0 32 32"
      fill="none"
    >
      <rect
        x="2"
        y="2"
        width="28"
        height="28"
        rx="7"
        fill="url(#trainGradient)"
      />

      <path
        d="M10 9.5C10 8.12 11.12 7 12.5 7h7C20.88 7 22 8.12 22 9.5v8.8c0 1.49-1.21 2.7-2.7 2.7h-6.6c-1.49 0-2.7-1.21-2.7-2.7V9.5Z"
        fill="white"
      />

      <path
        d="M12.5 10h7v5h-7v-5Z"
        fill="#5B8DB8"
      />

      <circle cx="13" cy="18.5" r="1.2" fill="#A72E49" />
      <circle cx="19" cy="18.5" r="1.2" fill="#A72E49" />

      <path
        d="M12 22.5 9.5 25M20 22.5l2.5 2.5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <defs>
        <linearGradient
          id="trainGradient"
          x1="3"
          y1="3"
          x2="29"
          y2="29"
        >
          <stop offset="0%" stopColor="#38C6E8" />
          <stop offset="100%" stopColor="#A72E49" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function SwapIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 7h11l-3-3" />
      <path d="m18 7-3 3" />
      <path d="M17 17H6l3 3" />
      <path d="m6 17 3-3" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.2 5.3L6 10l4.8 1.7L12 17l1.2-5.3L18 10l-4.8-1.7L12 3Z" />
      <path d="m19 16-.6 2.4L16 19l2.4.6L19 22l.6-2.4L22 19l-2.4-.6L19 16Z" />
    </svg>
  );
}

/* ================= COMPONENT ================= */

function PlanJourney() {
  const [fromStation, setFromStation] = useState("Zürich HB");
  const [toStation, setToStation] = useState("Bern");

  const [departureDate, setDepartureDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [departureTime, setDepartureTime] = useState(() => {
    const now = new Date();

    return `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;
  });

  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);

  const [loadingFrom, setLoadingFrom] = useState(false);
  const [loadingTo, setLoadingTo] = useState(false);

  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [savedJourneys, setSavedJourneys] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(savedJourneys)
    );
  }, [savedJourneys]);

  useEffect(() => {
    if (fromStation.length < 2) {
      setFromSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoadingFrom(true);

        const data = await searchStations(fromStation);

        setFromSuggestions(data.stations || []);
      } catch (err) {
        console.error("From station error:", err);
        setFromSuggestions([]);
      } finally {
        setLoadingFrom(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [fromStation]);

  useEffect(() => {
    if (toStation.length < 2) {
      setToSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoadingTo(true);

        const data = await searchStations(toStation);

        setToSuggestions(data.stations || []);
      } catch (err) {
        console.error("To station error:", err);
        setToSuggestions([]);
      } finally {
        setLoadingTo(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [toStation]);

  const handleSwap = () => {
    const temp = fromStation;

    setFromStation(toStation);
    setToStation(temp);

    setConnections([]);
    setError("");
  };

  const handleQuickStation = (station) => {
    if (!fromStation || fromStation === "Zürich HB") {
      setFromStation(station);
    } else {
      setToStation(station);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!fromStation || !toStation) {
      setError(
        "Please enter both departure and arrival stations."
      );
      return;
    }

    if (
      fromStation.toLowerCase() ===
      toStation.toLowerCase()
    ) {
      setError(
        "Departure and arrival stations cannot be the same."
      );
      return;
    }

    setLoading(true);
    setError("");
    setConnections([]);

    try {
      const data = await searchConnections(
        fromStation,
        toStation,
        departureDate,
        departureTime
      );

      setConnections(data.connections || []);

      if (
        !data.connections ||
        data.connections.length === 0
      ) {
        setError(
          "No train connections found for this search."
        );
      }
    } catch (err) {
      console.error("Connection API error:", err);

      setError(
        "Unable to find train connections. Please check the station names and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const saveJourney = (connection) => {
    const departure =
      connection.from?.departure || "";

    const arrival =
      connection.to?.arrival || "";

    const alreadySaved = savedJourneys.some(
      (journey) =>
        journey.fromStation === fromStation &&
        journey.toStation === toStation &&
        journey.departure === departure
    );

    if (alreadySaved) {
      return;
    }

    const journey = {
      id: `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,

      fromStation:
        connection.from?.station?.name ||
        fromStation,

      toStation:
        connection.to?.station?.name ||
        toStation,

      departure,
      arrival,

      departurePlatform:
        connection.from?.platform || "",

      arrivalPlatform:
        connection.to?.platform || "",

      duration: connection.duration || "",

      durationMinutes: getDurationMinutes(
        connection.duration
      ),

      transfers: connection.transfers || 0,

      products: connection.products || [],

      status: "planned",

      notes: "",

      savedAt: new Date().toISOString(),
    };

    setSavedJourneys((prev) => [
      ...prev,
      journey,
    ]);
  };

  const isSaved = (connection) => {
    const departure =
      connection.from?.departure || "";

    return savedJourneys.some(
      (journey) =>
        journey.fromStation === fromStation &&
        journey.toStation === toStation &&
        journey.departure === departure
    );
  };

  const resetLocalTrips = () => {
    const confirmReset = window.confirm(
      "Are you sure you want to remove all saved trips?"
    );

    if (!confirmReset) return;

    setSavedJourneys([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const formatTime = (dateString) => {
    if (!dateString) return "--:--";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "--:--";
    }

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatDuration = (duration) => {
    if (!duration) return "--";

    const match = duration.match(
      /(\d+)d(\d+):(\d+):(\d+)/
    );

    if (!match) {
      return duration;
    }

    const days = Number(match[1]);
    const hours = Number(match[2]);
    const minutes = Number(match[3]);

    let result = "";

    if (days > 0) {
      result += `${days}d `;
    }

    if (hours > 0) {
      result += `${hours}h `;
    }

    result += `${minutes} min`;

    return result.trim();
  };

  const getDurationMinutes = (duration) => {
    if (!duration) return 0;

    const match = duration.match(
      /(\d+)d(\d+):(\d+):(\d+)/
    );

    if (!match) return 0;

    const days = Number(match[1]);
    const hours = Number(match[2]);
    const minutes = Number(match[3]);

    return (
      days * 24 * 60 +
      hours * 60 +
      minutes
    );
  };

  const getProductName = (connection) => {
    if (
      connection.products &&
      connection.products.length > 0
    ) {
      return connection.products.join(" ");
    }

    return "Train";
  };

  const handleNavigation = (page) => {
    if (page === "Plan Journey") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    alert(
      `${page} will be available when the team module is connected.`
    );
  };

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#f6f8fb",
      color: "#0f1b33",
      fontFamily:
        "Inter, Arial, Helvetica, sans-serif",
      display: "flex",
    },

    sidebar: {
      width: "315px",
      background: "#ffffff",
      borderRight: "1px solid #e3e8ef",
      display: "flex",
      flexDirection: "column",
      position: "fixed",
      left: 0,
      top: 0,
      bottom: 0,
      zIndex: 20,
    },

    logoArea: {
      height: "92px",
      display: "flex",
      alignItems: "center",
      padding: "0 28px",
      borderBottom: "1px solid #f0f2f5",
    },

    logoIcon: {
      width: "34px",
      height: "34px",
      borderRadius: "8px",
      background:
        "linear-gradient(135deg, #29c8ec, #a93854)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginRight: "12px",
    },

    logoText: {
      fontSize: "24px",
      fontWeight: 800,
      color: "#111827",
    },

    lite: {
      marginLeft: "8px",
      padding: "3px 8px",
      background: "#fff0f3",
      color: "#a52e49",
      borderRadius: "7px",
      fontSize: "12px",
      fontWeight: 700,
    },

    nav: {
      padding: "18px 14px",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },

    navButton: {
      width: "100%",
      border: "none",
      background: "transparent",
      padding: "15px 16px",
      borderRadius: "16px",
      display: "flex",
      alignItems: "center",
      gap: "15px",
      fontSize: "17px",
      color: "#18304f",
      textAlign: "left",
      cursor: "pointer",
    },

    activeNav: {
      background: "#fff0f3",
      color: "#a52e49",
      fontWeight: 700,
    },

    navIcon: {
      width: "25px",
      height: "25px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },

    navBadge: {
      marginLeft: "auto",
      width: "30px",
      height: "30px",
      borderRadius: "50%",
      background: "#fff1f4",
      color: "#a52e49",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 700,
      fontSize: "14px",
    },

    resetArea: {
      marginTop: "auto",
      padding: "22px 24px",
      borderTop: "1px solid #e8edf3",
    },

    resetButton: {
      border: "none",
      background: "transparent",
      color: "#8295b1",
      fontSize: "16px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },

    main: {
      marginLeft: "315px",
      width: "calc(100% - 315px)",
      minHeight: "100vh",
    },

    header: {
      height: "86px",
      background: "#ffffff",
      borderBottom: "1px solid #e3e8ef",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 42px",
    },

    breadcrumb: {
      color: "#94a3b8",
      fontSize: "16px",
      marginBottom: "4px",
    },

    breadcrumbActive: {
      color: "#1c2c45",
      fontWeight: 700,
    },

    pageTitle: {
      margin: 0,
      fontSize: "25px",
      fontWeight: 800,
    },

    headerActions: {
      display: "flex",
      alignItems: "center",
      gap: "14px",
    },

    storageBadge: {
      display: "flex",
      alignItems: "center",
      gap: "9px",
      border: "1px solid #9ce7ca",
      background: "#edfff7",
      color: "#08754f",
      padding: "10px 17px",
      borderRadius: "24px",
      fontSize: "15px",
      fontWeight: 700,
    },

    greenDot: {
      width: "10px",
      height: "10px",
      background: "#13b67a",
      borderRadius: "50%",
    },

    countCircle: {
      minWidth: "25px",
      height: "25px",
      padding: "0 6px",
      borderRadius: "50%",
      background: "#c9f5e3",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },

    savedTripsButton: {
      border: "1px solid #dbe3ec",
      background: "#ffffff",
      color: "#273952",
      padding: "11px 19px",
      borderRadius: "24px",
      fontSize: "15px",
      fontWeight: 700,
      cursor: "pointer",
    },

    content: {
      padding: "30px 42px 42px",
    },

    searchCard: {
      background: "#ffffff",
      border: "1px solid #e1e7ef",
      borderRadius: "20px",
      padding: "35px",
      boxShadow:
        "0 8px 22px rgba(31, 48, 71, 0.06)",
    },

    searchTop: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: "25px",
      paddingBottom: "26px",
      borderBottom: "1px solid #edf0f4",
    },

    searchTitleArea: {
      flex: 1,
    },

    searchTitle: {
      margin: 0,
      fontSize: "24px",
      fontWeight: 800,
      display: "inline-block",
    },

    liveBadge: {
      marginLeft: "12px",
      padding: "9px 13px",
      borderRadius: "25px",
      background: "#fff0f3",
      color: "#aa2e49",
      fontWeight: 700,
      fontSize: "14px",
      display: "inline-block",
    },

    searchSubtitle: {
      margin: "7px 0 0",
      fontSize: "19px",
      color: "#182c49",
    },

    quickArea: {
      display: "flex",
      alignItems: "center",
      gap: "9px",
      flexWrap: "wrap",
      justifyContent: "flex-end",
    },

    quickLabel: {
      color: "#8ca0ba",
      fontSize: "15px",
      marginRight: "2px",
      display: "flex",
      alignItems: "center",
      gap: "4px",
    },

    quickButton: {
      background: "#ffffff",
      border: "1px solid #dbe3ec",
      color: "#253b58",
      padding: "8px 13px",
      borderRadius: "9px",
      cursor: "pointer",
      fontSize: "14px",
    },

    formGrid: {
      display: "grid",
      gridTemplateColumns:
        "1fr 70px 1fr",
      gap: "22px",
      alignItems: "end",
      marginTop: "30px",
    },

    field: {
      position: "relative",
    },

    labelRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "9px",
    },

    label: {
      fontSize: "14px",
      fontWeight: 800,
      color: "#263c59",
      letterSpacing: "0.3px",
    },

    via: {
      color: "#aa2e49",
      fontWeight: 700,
      fontSize: "14px",
      cursor: "pointer",
    },

    inputWrapper: {
      position: "relative",
    },

    inputIcon: {
      position: "absolute",
      left: "17px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#9aabc0",
      display: "flex",
      alignItems: "center",
      pointerEvents: "none",
    },

    input: {
      width: "100%",
      boxSizing: "border-box",
      height: "54px",
      border: "1px solid #dce4ed",
      background: "#fbfcfe",
      borderRadius: "13px",
      padding: "0 18px 0 48px",
      fontSize: "17px",
      color: "#172944",
      outline: "none",
    },

    suggestionBox: {
      position: "absolute",
      left: 0,
      right: 0,
      top: "64px",
      background: "#ffffff",
      border: "1px solid #dce4ed",
      borderRadius: "12px",
      boxShadow:
        "0 10px 25px rgba(31, 48, 71, 0.15)",
      zIndex: 100,
      overflow: "hidden",
    },

    suggestion: {
      padding: "13px 17px",
      cursor: "pointer",
      borderBottom: "1px solid #f0f2f5",
      fontSize: "15px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },

    swapButton: {
      width: "48px",
      height: "48px",
      borderRadius: "50%",
      border: "1px solid #dce4ed",
      background: "#ffffff",
      color: "#6f829d",
      cursor: "pointer",
      boxShadow:
        "0 2px 5px rgba(20, 40, 60, 0.04)",
      alignSelf: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },

    bottomGrid: {
      display: "grid",
      gridTemplateColumns:
        "1fr 70px 1fr",
      gap: "22px",
      marginTop: "23px",
      alignItems: "end",
    },

    dateTimeGroup: {
      display: "flex",
      gap: "14px",
    },

    dateInput: {
      flex: 1,
      height: "54px",
      border: "1px solid #dce4ed",
      background: "#fbfcfe",
      borderRadius: "13px",
      padding: "0 16px",
      fontSize: "17px",
      color: "#172944",
      outline: "none",
    },

    timeInput: {
      width: "130px",
      height: "54px",
      border: "1px solid #dce4ed",
      background: "#fbfcfe",
      borderRadius: "13px",
      padding: "0 12px",
      fontSize: "17px",
      color: "#172944",
      outline: "none",
    },

    depBadge: {
      width: "52px",
      height: "32px",
      borderRadius: "9px",
      background: "#fff0f3",
      color: "#a52e49",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 700,
      marginBottom: "11px",
    },

    searchButton: {
      height: "54px",
      border: "none",
      borderRadius: "13px",
      background: "#a72e49",
      color: "#ffffff",
      fontSize: "17px",
      fontWeight: 800,
      cursor: "pointer",
      boxShadow:
        "0 5px 10px rgba(167, 46, 73, 0.18)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
    },

    resultCard: {
      marginTop: "30px",
      background: "#ffffff",
      border: "1px solid #e1e7ef",
      borderRadius: "20px",
      overflow: "hidden",
      boxShadow:
        "0 8px 22px rgba(31, 48, 71, 0.05)",
    },

    resultHeader: {
      padding: "27px 25px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid #e7ebf0",
    },

    resultTitle: {
      margin: 0,
      fontSize: "21px",
      fontWeight: 800,
    },

    resultSubtitle: {
      margin: "5px 0 0",
      color: "#7890ad",
      fontSize: "15px",
    },

    routeCount: {
      background: "#edf2f7",
      color: "#31465f",
      padding: "7px 13px",
      borderRadius: "18px",
      fontSize: "14px",
      fontWeight: 700,
    },

    route: {
      minHeight: "130px",
      padding: "0 25px",
      display: "grid",
      gridTemplateColumns:
        "120px 1fr 120px 85px 130px",
      gap: "18px",
      alignItems: "center",
      borderBottom: "1px solid #e7ebf0",
    },

    time: {
      fontSize: "30px",
      fontWeight: 800,
      color: "#0b1c38",
      lineHeight: 1,
    },

    stationName: {
      marginTop: "7px",
      fontSize: "15px",
      color: "#233c59",
    },

    platform: {
      display: "inline-block",
      marginTop: "7px",
      padding: "4px 8px",
      background: "#f0f3f6",
      borderRadius: "5px",
      color: "#5c6f86",
      fontSize: "12px",
      fontWeight: 700,
    },

    timeline: {
      position: "relative",
      height: "65px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },

    line: {
      position: "absolute",
      left: 0,
      right: 0,
      height: "2px",
      background: "#d7dee8",
      top: "50%",
    },

    leftDot: {
      position: "absolute",
      left: 0,
      width: "10px",
      height: "10px",
      border: "2px solid #a72e49",
      background: "#ffffff",
      borderRadius: "50%",
      top: "calc(50% - 5px)",
      zIndex: 2,
    },

    rightDot: {
      position: "absolute",
      right: 0,
      width: "10px",
      height: "10px",
      background: "#a72e49",
      borderRadius: "50%",
      top: "calc(50% - 5px)",
      zIndex: 2,
    },

    duration: {
      position: "relative",
      zIndex: 3,
      background: "#ffffff",
      padding: "0 8px",
      color: "#627994",
      fontSize: "13px",
      display: "flex",
      alignItems: "center",
      gap: "4px",
    },

    direct: {
      position: "absolute",
      top: "55%",
      color: "#00a66a",
      fontWeight: 700,
      fontSize: "13px",
    },

    transfer: {
      position: "absolute",
      top: "56%",
      color: "#8a99ae",
      fontSize: "13px",
    },

    product: {
      background: "#f0f4f8",
      border: "1px solid #dce4ec",
      borderRadius: "8px",
      padding: "7px 10px",
      color: "#31455e",
      fontSize: "13px",
      fontWeight: 700,
      textAlign: "center",
    },

    saveButton: {
      height: "38px",
      padding: "0 15px",
      border: "1px solid #dce4ec",
      borderRadius: "20px",
      background: "#ffffff",
      color: "#243a57",
      fontSize: "14px",
      fontWeight: 700,
      cursor: "pointer",
    },

    savedButton: {
      height: "38px",
      padding: "0 15px",
      border: "1px solid #a8e8ce",
      borderRadius: "20px",
      background: "#d8faeb",
      color: "#00875b",
      fontSize: "14px",
      fontWeight: 700,
      cursor: "default",
    },

    message: {
      marginTop: "20px",
      padding: "15px 18px",
      borderRadius: "12px",
      background: "#fff5f6",
      border: "1px solid #ffd5dc",
      color: "#a52e49",
      fontSize: "15px",
    },

    loading: {
      marginTop: "25px",
      textAlign: "center",
      padding: "25px",
      color: "#71839b",
      fontSize: "16px",
    },

    footer: {
      background: "#ffffff",
      borderTop: "1px solid #e1e7ef",
      marginTop: "30px",
      minHeight: "75px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 42px",
    },

    footerLeft: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      color: "#213754",
      fontSize: "14px",
    },

    footerRight: {
      display: "flex",
      alignItems: "center",
      gap: "15px",
      color: "#7187a2",
      fontSize: "14px",
    },

    footerButton: {
      border: "none",
      background: "transparent",
      color: "#7187a2",
      cursor: "pointer",
      fontSize: "14px",
      padding: 0,
    },

    footerActive: {
      color: "#a52e49",
      fontWeight: 700,
    },
  };

  return (
    <div style={styles.page}>
      {/* ================= SIDEBAR ================= */}

      <aside style={styles.sidebar}>
        <div style={styles.logoArea}>
          <div style={styles.logoIcon}>
            <TrainLogoIcon />
          </div>

          <span style={styles.logoText}>
            railtrack
          </span>

          <span style={styles.lite}>
            Lite
          </span>
        </div>

        <nav style={styles.nav}>
          {/* PLAN JOURNEY */}

          <button
            type="button"
            style={{
              ...styles.navButton,
              ...styles.activeNav,
            }}
            onClick={() =>
              handleNavigation("Plan Journey")
            }
          >
            <span style={styles.navIcon}>
              <PlanIcon />
            </span>

            <span>Plan Journey</span>
          </button>

          {/* MY JOURNEYS */}

          <button
            type="button"
            style={styles.navButton}
            onClick={() =>
              handleNavigation("My Journeys")
            }
          >
            <span style={styles.navIcon}>
              <JourneysIcon />
            </span>

            <span>My Journeys</span>

            <span style={styles.navBadge}>
              {savedJourneys.length}
            </span>
          </button>

          {/* TRAVEL STATS */}

          <button
            type="button"
            style={styles.navButton}
            onClick={() =>
              handleNavigation("Travel Stats")
            }
          >
            <span style={styles.navIcon}>
              <StatsIcon />
            </span>

            <span>Travel Stats</span>
          </button>

          {/* DASHBOARD */}

          <button
            type="button"
            style={styles.navButton}
            onClick={() =>
              handleNavigation("Dashboard")
            }
          >
            <span style={styles.navIcon}>
              <DashboardIcon />
            </span>

            <span>Dashboard</span>
          </button>
        </nav>

        {/* RESET */}

        <div style={styles.resetArea}>
          <button
            type="button"
            style={styles.resetButton}
            onClick={resetLocalTrips}
          >
            <TrashIcon />
            <span>Reset Local Trips</span>
          </button>
        </div>
      </aside>

      {/* ================= MAIN ================= */}

      <main style={styles.main}>
        {/* HEADER */}

        <header style={styles.header}>
          <div>
            <div style={styles.breadcrumb}>
              Railtrack&nbsp; / &nbsp;

              <span style={styles.breadcrumbActive}>
                Plan Journey
              </span>
            </div>

            <h1 style={styles.pageTitle}>
              Plan Journey
            </h1>
          </div>

          <div style={styles.headerActions}>
            <div style={styles.storageBadge}>
              <span style={styles.greenDot}></span>

              LocalStorage

              <span style={styles.countCircle}>
                {savedJourneys.length}
              </span>
            </div>

            <button
              type="button"
              style={styles.savedTripsButton}
              onClick={() => {
                document
                  .getElementById("results")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  });
              }}
            >
              Saved Trips ({savedJourneys.length})
            </button>
          </div>
        </header>

        {/* CONTENT */}

        <div style={styles.content}>
          {/* ================= SEARCH CARD ================= */}

          <section style={styles.searchCard}>
            <div style={styles.searchTop}>
              <div style={styles.searchTitleArea}>
                <h2 style={styles.searchTitle}>
                  Find Train Connections
                </h2>

                <span style={styles.liveBadge}>
                  Live SBB Timetable
                </span>

                <p style={styles.searchSubtitle}>
                  Real-time schedules from
                  transport.opendata.ch API
                </p>
              </div>

              <div style={styles.quickArea}>
                <span style={styles.quickLabel}>
                  <SparkleIcon />
                  Quick:
                </span>

                <button
                  type="button"
                  style={styles.quickButton}
                  onClick={() =>
                    handleQuickStation(
                      "Zürich HB"
                    )
                  }
                >
                  Zürich HB
                </button>

                <button
                  type="button"
                  style={styles.quickButton}
                  onClick={() =>
                    setToStation("Bern")
                  }
                >
                  Bern
                </button>

                <button
                  type="button"
                  style={styles.quickButton}
                  onClick={() =>
                    setToStation("Genève")
                  }
                >
                  Genève
                </button>

                <button
                  type="button"
                  style={styles.quickButton}
                  onClick={() =>
                    setToStation("Basel SBB")
                  }
                >
                  Basel SBB
                </button>
              </div>
            </div>

            {/* FROM / TO */}

            <div style={styles.formGrid}>
              {/* FROM */}

              <div style={styles.field}>
                <div style={styles.labelRow}>
                  <label style={styles.label}>
                    DEPARTURE STATION
                  </label>
                </div>

                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}>
                    <LocationIcon />
                  </span>

                  <input
                    value={fromStation}
                    onChange={(e) =>
                      setFromStation(
                        e.target.value
                      )
                    }
                    style={styles.input}
                    placeholder="Enter departure station"
                  />

                  {loadingFrom && (
                    <span
                      style={{
                        position: "absolute",
                        right: "15px",
                        top: "17px",
                        fontSize: "13px",
                        color: "#8ca0ba",
                      }}
                    >
                      Searching...
                    </span>
                  )}

                  {fromSuggestions.length > 0 && (
                    <div
                      style={
                        styles.suggestionBox
                      }
                    >
                      {fromSuggestions
                        .slice(0, 5)
                        .map(
                          (
                            station,
                            index
                          ) => (
                            <div
                              key={
                                station.id ||
                                `${station.name}-${index}`
                              }
                              style={
                                styles.suggestion
                              }
                              onClick={() => {
                                setFromStation(
                                  station.name
                                );

                                setFromSuggestions(
                                  []
                                );
                              }}
                              onMouseEnter={(
                                e
                              ) => {
                                e.currentTarget.style.background =
                                  "#f8fafc";
                              }}
                              onMouseLeave={(
                                e
                              ) => {
                                e.currentTarget.style.background =
                                  "#ffffff";
                              }}
                            >
                              <LocationIcon />

                              {station.name}
                            </div>
                          )
                        )}
                    </div>
                  )}
                </div>
              </div>

              {/* SWAP */}

              <button
                type="button"
                style={styles.swapButton}
                onClick={handleSwap}
                title="Swap stations"
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "#fff0f3";

                  e.currentTarget.style.color =
                    "#a52e49";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "#ffffff";

                  e.currentTarget.style.color =
                    "#6f829d";
                }}
              >
                <SwapIcon />
              </button>

              {/* TO */}

              <div style={styles.field}>
                <div style={styles.labelRow}>
                  <label style={styles.label}>
                    ARRIVAL STATION
                  </label>

                  <span
                    style={styles.via}
                    onClick={() =>
                      alert(
                        "Via station option can be connected later."
                      )
                    }
                  >
                    + Via
                  </span>
                </div>

                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}>
                    <LocationIcon />
                  </span>

                  <input
                    value={toStation}
                    onChange={(e) =>
                      setToStation(
                        e.target.value
                      )
                    }
                    style={styles.input}
                    placeholder="Enter arrival station"
                  />

                  {loadingTo && (
                    <span
                      style={{
                        position: "absolute",
                        right: "15px",
                        top: "17px",
                        fontSize: "13px",
                        color: "#8ca0ba",
                      }}
                    >
                      Searching...
                    </span>
                  )}

                  {toSuggestions.length > 0 && (
                    <div
                      style={
                        styles.suggestionBox
                      }
                    >
                      {toSuggestions
                        .slice(0, 5)
                        .map(
                          (
                            station,
                            index
                          ) => (
                            <div
                              key={
                                station.id ||
                                `${station.name}-${index}`
                              }
                              style={
                                styles.suggestion
                              }
                              onClick={() => {
                                setToStation(
                                  station.name
                                );

                                setToSuggestions(
                                  []
                                );
                              }}
                              onMouseEnter={(
                                e
                              ) => {
                                e.currentTarget.style.background =
                                  "#f8fafc";
                              }}
                              onMouseLeave={(
                                e
                              ) => {
                                e.currentTarget.style.background =
                                  "#ffffff";
                              }}
                            >
                              <LocationIcon />

                              {station.name}
                            </div>
                          )
                        )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* DATE / TIME / SEARCH */}

            <div style={styles.bottomGrid}>
              <div style={styles.field}>
                <div style={styles.labelRow}>
                  <label style={styles.label}>
                    DEPARTURE DATE & TIME
                  </label>
                </div>

                <div
                  style={
                    styles.dateTimeGroup
                  }
                >
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) =>
                      setDepartureDate(
                        e.target.value
                      )
                    }
                    style={styles.dateInput}
                  />

                  <input
                    type="time"
                    value={departureTime}
                    onChange={(e) =>
                      setDepartureTime(
                        e.target.value
                      )
                    }
                    style={styles.timeInput}
                  />
                </div>
              </div>

              <div style={styles.depBadge}>
                Dep
              </div>

              <button
                type="button"
                style={{
                  ...styles.searchButton,
                  opacity:
                    loading ||
                    !fromStation ||
                    !toStation
                      ? 0.65
                      : 1,
                }}
                disabled={
                  loading ||
                  !fromStation ||
                  !toStation
                }
                onClick={handleSearch}
              >
                <SearchIcon />

                {loading
                  ? "Finding..."
                  : "Find Journey"}
              </button>
            </div>
          </section>

          {/* ERROR */}

          {error && (
            <div style={styles.message}>
              {error}
            </div>
          )}

          {/* LOADING */}

          {loading && (
            <div style={styles.loading}>
              Searching live train connections...
            </div>
          )}

          {/* ================= RESULTS ================= */}

          {connections.length > 0 && (
            <section
              id="results"
              style={styles.resultCard}
             >
              <div style={styles.resultHeader}>
                <div>
                  <h2 style={styles.resultTitle}>
                    Available Train Connections
                  </h2>

                  <p
                    style={
                      styles.resultSubtitle
                    }
                  >
                    Found connections from{" "}
                    {fromStation} to{" "}
                    {toStation}
                  </p>
                </div>

                <div style={styles.routeCount}>
                  {connections.length} Routes Found
                </div>
              </div>

              {connections
                .slice(0, 5)
                .map(
                  (
                    connection,
                    index
                  ) => {
                    const fromTime =
                      formatTime(
                        connection.from
                          ?.departure
                      );

                    const toTime =
                      formatTime(
                        connection.to
                          ?.arrival
                      );

                    const duration =
                      formatDuration(
                        connection.duration
                      );

                    const transfers =
                      connection.transfers ||
                      0;

                    const saved =
                      isSaved(connection);

                    return (
                      <div
                        key={`${connection.from?.departure}-${index}`}
                        style={{
                          ...styles.route,
                          borderBottom:
                            index ===
                            Math.min(
                              connections.length,
                              5
                            ) -
                              1
                              ? "none"
                              : "1px solid #e7ebf0",
                        }}
                      >
                        {/* DEPARTURE */}

                        <div>
                          <div
                            style={
                              styles.time
                            }
                          >
                            {fromTime}
                          </div>

                          <div
                            style={
                              styles.stationName
                            }
                          >
                            {connection.from
                              ?.station
                              ?.name ||
                              fromStation}
                          </div>

                          <span
                            style={
                              styles.platform
                            }
                          >
                            Pl.{" "}
                            {connection.from
                              ?.platform ||
                              "-"}
                          </span>
                        </div>

                        {/* TIMELINE */}

                        <div
                          style={
                            styles.timeline
                          }
                        >
                          <span
                            style={
                              styles.line
                            }
                          ></span>

                          <span
                            style={
                              styles.leftDot
                            }
                          ></span>

                          <span
                            style={
                              styles.rightDot
                            }
                          ></span>

                          <span
                            style={
                              styles.duration
                            }
                          >
                            <ClockIcon />
                            {duration}
                          </span>

                          {transfers ===
                          0 ? (
                            <span
                              style={
                                styles.direct
                              }
                            >
                              Direct
                            </span>
                          ) : (
                            <span
                              style={
                                styles.transfer
                              }
                            >
                              {transfers}{" "}
                              transfer
                              {transfers >
                              1
                                ? "s"
                                : ""}
                            </span>
                          )}
                        </div>

                        {/* ARRIVAL */}

                        <div>
                          <div
                            style={
                              styles.time
                            }
                          >
                            {toTime}
                          </div>

                          <div
                            style={
                              styles.stationName
                            }
                          >
                            {connection.to
                              ?.station
                              ?.name ||
                              toStation}
                          </div>

                          <span
                            style={
                              styles.platform
                            }
                          >
                            Pl.{" "}
                            {connection.to
                              ?.platform ||
                              "-"}
                          </span>
                        </div>

                        {/* PRODUCT */}

                        <div
                          style={
                            styles.product
                          }
                        >
                          {getProductName(
                            connection
                          )}
                        </div>

                        {/* SAVE */}

                        <div>
                          {saved ? (
                            <button
                              type="button"
                              style={
                                styles.savedButton
                              }
                              disabled
                            >
                              ✓ Saved
                            </button>
                          ) : (
                            <button
                              type="button"
                              style={
                                styles.saveButton
                              }
                              onClick={() =>
                                saveJourney(
                                  connection
                                )
                              }
                            >
                              Save Journey
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
            </section>
          )}
        </div>

        {/* ================= FOOTER ================= */}

        <footer style={styles.footer}>
          <div style={styles.footerLeft}>
            <TrainLogoIcon />

            <strong>Railtrack</strong>

            <span>•</span>

            <span>
              © 2026 Train Journey Planner
            </span>
          </div>

          <div style={styles.footerRight}>
            <button
              type="button"
              style={{
                ...styles.footerButton,
                ...styles.footerActive,
              }}
              onClick={() =>
                handleNavigation(
                  "Plan Journey"
                )
              }
            >
              Plan Journey
            </button>

            <span>•</span>

            <button
              type="button"
              style={styles.footerButton}
              onClick={() =>
                handleNavigation(
                  "My Journeys"
                )
              }
            >
              My Journeys
            </button>

            <span>•</span>

            <button
              type="button"
              style={styles.footerButton}
              onClick={() =>
                handleNavigation(
                  "Travel Stats"
                )
              }
            >
              Travel Stats
            </button>

            <span>•</span>

            <button
              type="button"
              style={styles.footerButton}
              onClick={() =>
                window.open(
                  "https://transport.opendata.ch/",
                  "_blank"
                )
              }
            >
              Swiss Open Data ↗
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default PlanJourney;
>>>>>>> Stashed changes
