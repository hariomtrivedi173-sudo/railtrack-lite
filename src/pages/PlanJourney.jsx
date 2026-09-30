import { useEffect, useState } from "react";
import {
  searchStations,
  searchConnections,
} from "../api/transportApi";

const STORAGE_KEY = "railtrack_saved_journeys";

/* =========================================================
   ICONS
========================================================= */

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
      <path d="m19 16-.6 2.4L16 19l2.4.6L19 22l.6-2.4L19 16Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function TrashSmallIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="M6 7l1 14h10l1-14" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ChevronUpIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

function PlanJourney({
  savedJourneys,
  setSavedJourneys,
}) {
  /* =======================================================
     STATIONS
  ======================================================= */

  const [fromStation, setFromStation] = useState("");
  const [toStation, setToStation] = useState("");

  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);

  const [loadingFrom, setLoadingFrom] = useState(false);
  const [loadingTo, setLoadingTo] = useState(false);

  const [fromSelected, setFromSelected] = useState(false);
  const [toSelected, setToSelected] = useState(false);

  /* =======================================================
     DATE / TIME
  ======================================================= */

  const [departureDate, setDepartureDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [departureTime, setDepartureTime] = useState(() => {
    const now = new Date();

    return `${String(now.getHours()).padStart(
      2,
      "0"
    )}:${String(now.getMinutes()).padStart(2, "0")}`;
  });

  /* =======================================================
     DEP / ARR
  ======================================================= */

  const [isArrivalTime, setIsArrivalTime] =
    useState(false);

  /* =======================================================
     CONNECTIONS
  ======================================================= */

  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* =======================================================
     IMPORTANT:
     savedJourneys is now received from App.jsx.
     Do NOT create another useState here.
  ======================================================= */

  /* =======================================================
     ROUTE EXPANSION
  ======================================================= */

  const [expandedRoutes, setExpandedRoutes] =
    useState({});

  const [showStops, setShowStops] =
    useState({});

  /* =======================================================
     TOAST
  ======================================================= */

  const [saveMessage, setSaveMessage] =
    useState("");

  const [saveToastType, setSaveToastType] =
    useState("success");

  const showToast = (
    message,
    type = "success"
  ) => {
    setSaveMessage(message);
    setSaveToastType(type);

    window.clearTimeout(
      showToast.timeoutId
    );

    showToast.timeoutId =
      window.setTimeout(() => {
        setSaveMessage("");
      }, 2800);
  };

  /* =======================================================
     FROM AUTOCOMPLETE
  ======================================================= */

  useEffect(() => {
    const query =
      fromStation.trim();

    if (
      query.length === 0 ||
      fromSelected
    ) {
      setFromSuggestions([]);
      return;
    }

    if (
      !/[A-Za-zÀ-ÖØ-öø-ÿ]/.test(query)
    ) {
      setFromSuggestions([]);
      return;
    }

    const timer =
      setTimeout(
        async () => {
          try {
            setLoadingFrom(true);

            const data =
              await searchStations(query);

            setFromSuggestions(
              (data.stations || []).slice(
                0,
                5
              )
            );
          } catch (error) {
            console.error(
              "From station search error:",
              error
            );

            setFromSuggestions([]);
          } finally {
            setLoadingFrom(false);
          }
        },
        400
      );

    return () =>
      clearTimeout(timer);
  }, [
    fromStation,
    fromSelected,
  ]);

  /* =======================================================
     TO AUTOCOMPLETE
  ======================================================= */

  useEffect(() => {
    const query =
      toStation.trim();

    if (
      query.length === 0 ||
      toSelected
    ) {
      setToSuggestions([]);
      return;
    }

    if (
      !/[A-Za-zÀ-ÖØ-öø-ÿ]/.test(query)
    ) {
      setToSuggestions([]);
      return;
    }

    const timer =
      setTimeout(
        async () => {
          try {
            setLoadingTo(true);

            const data =
              await searchStations(query);

            setToSuggestions(
              (data.stations || []).slice(
                0,
                5
              )
            );
          } catch (error) {
            console.error(
              "To station search error:",
              error
            );

            setToSuggestions([]);
          } finally {
            setLoadingTo(false);
          }
        },
        400
      );

    return () =>
      clearTimeout(timer);
  }, [
    toStation,
    toSelected,
  ]);

  /* =======================================================
     QUICK BUTTONS
  ======================================================= */

  const handleQuickStation =
    (station) => {
      if (!fromStation.trim()) {
        setFromStation(station);
        setFromSelected(true);
        setFromSuggestions([]);
        return;
      }

      if (!toStation.trim()) {
        setToStation(station);
        setToSelected(true);
        setToSuggestions([]);
        return;
      }

      setToStation(station);
      setToSelected(true);
      setToSuggestions([]);
    };

  /* =======================================================
     SWAP STATIONS
  ======================================================= */

  const handleSwap = () => {
    const oldFrom =
      fromStation;

    const oldTo =
      toStation;

    setFromStation(oldTo);
    setToStation(oldFrom);

    setFromSelected(
      Boolean(oldTo)
    );

    setToSelected(
      Boolean(oldFrom)
    );

    setFromSuggestions([]);
    setToSuggestions([]);

    setConnections([]);
    setError("");

    setExpandedRoutes({});
    setShowStops({});
  };

  /* =======================================================
     DEP / ARR SWITCH
  ======================================================= */

  const handleTimeModeChange =
    () => {
      setIsArrivalTime(
        (previous) =>
          !previous
      );

      setConnections([]);
      setError("");

      setExpandedRoutes({});
      setShowStops({});
    };

  /* =======================================================
     SEARCH
  ======================================================= */

  const handleSearch =
    async (e) => {
      e.preventDefault();

      const from =
        fromStation.trim();

      const to =
        toStation.trim();

      if (!from || !to) {
        setError(
          "Please enter both departure and arrival stations."
        );

        return;
      }

      if (
        from.toLowerCase() ===
        to.toLowerCase()
      ) {
        setError(
          "Departure and arrival stations cannot be the same."
        );

        return;
      }

      setLoading(true);
      setError("");
      setConnections([]);

      setExpandedRoutes({});
      setShowStops({});

      setFromSuggestions([]);
      setToSuggestions([]);

      try {
        const data =
          await searchConnections(
            from,
            to,
            departureDate,
            departureTime,
            isArrivalTime
          );

        const results =
          data.connections || [];

        setConnections(
          results
        );

        if (
          results.length ===
          0
        ) {
          setError(
            "No train connections found for this search."
          );
        }
      } catch (error) {
        console.error(
          "Connection API error:",
          error
        );

        setError(
          "Unable to find train connections. Please check the station names and try again."
        );
      } finally {
        setLoading(false);
      }
    };

  /* =======================================================
     FIND SAVED
  ======================================================= */

  const findSavedJourney =
    (connection) => {
      const departure =
        connection.from
          ?.departure ||
        "";

      const realFrom =
        connection.from
          ?.station?.name ||
        fromStation.trim();

      const realTo =
        connection.to
          ?.station?.name ||
        toStation.trim();

      return savedJourneys.find(
        (journey) =>
          journey.fromStation ===
            realFrom &&
          journey.toStation ===
            realTo &&
          journey.departure ===
            departure
      );
    };

  /* =======================================================
     SAVE / UNSAVE
  ======================================================= */

  const saveJourney =
    (connection) => {
      const existing =
        findSavedJourney(
          connection
        );

      /* ===================================================
         UNSAVE
      =================================================== */

      if (existing) {
        const updated =
          savedJourneys.filter(
            (journey) =>
              journey.id !==
              existing.id
          );

        setSavedJourneys(
          updated
        );

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(
            updated
          )
        );

        showToast(
          `${existing.fromStation} → ${existing.toStation} removed from saved journeys.`,
          "removed"
        );

        return;
      }

      /* ===================================================
         SAVE
      =================================================== */

      const realFrom =
        connection.from
          ?.station?.name ||
        fromStation.trim();

      const realTo =
        connection.to
          ?.station?.name ||
        toStation.trim();

      const newJourney = {
        id: `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`,

        fromStation:
          realFrom,

        toStation:
          realTo,

        departure:
          connection.from
            ?.departure || "",

        arrival:
          connection.to
            ?.arrival || "",

        departurePlatform:
          connection.from
            ?.platform || "",

        arrivalPlatform:
          connection.to
            ?.platform || "",

        duration:
          connection.duration ||
          "",

        durationMinutes:
          getDurationMinutes(
            connection.duration
          ),

        transfers:
          connection.transfers ||
          0,

        products:
          connection.products ||
          [],

        status:
          "planned",

        notes:
          "",

        savedAt:
          new Date().toISOString(),
      };

      setSavedJourneys(
        (previous) => {
          const updated = [
            ...previous,
            newJourney,
          ];

          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(
              updated
            )
          );

          return updated;
        }
      );

      showToast(
        `${realFrom} → ${realTo} saved successfully!`,
        "success"
      );
    };

  /* =======================================================
     EXPAND / COLLAPSE
  ======================================================= */

  const toggleRoute =
    (index) => {
      const next =
        !expandedRoutes[
          index
        ];

      setExpandedRoutes(
        (previous) => ({
          ...previous,
          [index]:
            next,
        })
      );

      if (next) {
        setShowStops(
          (previous) => ({
            ...previous,
            [index]:
              false,
          })
        );
      }
    };

  /* =======================================================
     PLUS / MINUS
  ======================================================= */

  const toggleStops =
    (index) => {
      setShowStops(
        (previous) => ({
          ...previous,
          [index]:
            !previous[index],
        })
      );
    };

  /* =======================================================
     FORMAT TIME
  ======================================================= */

  const formatTime =
    (value) => {
      if (!value) {
        return "--:--";
      }

      const date =
        new Date(value);

      if (
        Number.isNaN(
          date.getTime()
        )
      ) {
        return "--:--";
      }

      return date.toLocaleTimeString(
        [],
        {
          hour:
            "2-digit",

          minute:
            "2-digit",

          hour12:
            false,
        }
      );
    };

  /* =======================================================
     FORMAT DURATION
  ======================================================= */

  const formatDuration =
    (duration) => {
      if (!duration) {
        return "--";
      }

      const match =
        duration.match(
          /(\d+)d(\d+):(\d+):(\d+)/
        );

      if (!match) {
        return duration;
      }

      const days =
        Number(match[1]);

      const hours =
        Number(match[2]);

      const minutes =
        Number(match[3]);

      let result =
        "";

      if (days > 0) {
        result +=
          `${days}d `;
      }

      if (hours > 0) {
        result +=
          `${hours}h `;
      }

      result +=
        `${minutes} min`;

      return result.trim();
    };

  /* =======================================================
     DURATION MINUTES
  ======================================================= */

  const getDurationMinutes =
    (duration) => {
      if (!duration) {
        return 0;
      }

      const match =
        duration.match(
          /(\d+)d(\d+):(\d+):(\d+)/
        );

      if (!match) {
        return 0;
      }

      const days =
        Number(match[1]);

      const hours =
        Number(match[2]);

      const minutes =
        Number(match[3]);

      return (
        days * 24 * 60 +
        hours * 60 +
        minutes
      );
    };

  /* =======================================================
     PRODUCT
  ======================================================= */

  const getProductName =
    (connection) => {
      if (
        Array.isArray(
          connection.products
        ) &&
        connection.products.length >
          0
      ) {
        return connection.products.join(
          " "
        );
      }

      return "Train";
    };

  /* =======================================================
     JOURNEY STOPS
  ======================================================= */

  const getJourneyStops =
    (connection) => {
      const sections =
        connection.sections ||
        [];

      const stops =
        [];

      sections.forEach(
        (section) => {
          const passList =
            section.journey
              ?.passList ||
            [];

          passList.forEach(
            (pass) => {
              const stationName =
                pass.station
                  ?.name;

              if (!stationName) {
                return;
              }

              const item = {
                key: [
                  stationName,
                  pass.arrival ||
                    "",
                  pass.departure ||
                    "",
                  pass.platform ||
                    "",
                ].join("|"),

                stationName,

                arrival:
                  pass.arrival ||
                  "",

                departure:
                  pass.departure ||
                  "",

                platform:
                  pass.platform ||
                  "",
              };

              const exists =
                stops.some(
                  (stop) =>
                    stop.key ===
                    item.key
                );

              if (!exists) {
                stops.push(
                  item
                );
              }
            }
          );
        }
      );

      if (
        stops.length < 2
      ) {
        return [
          {
            key:
              "start",

            stationName:
              connection.from
                ?.station
                ?.name ||
              fromStation,

            arrival:
              "",

            departure:
              connection.from
                ?.departure ||
              "",

            platform:
              connection.from
                ?.platform ||
              "",
          },

          {
            key:
              "end",

            stationName:
              connection.to
                ?.station
                ?.name ||
              toStation,

            arrival:
              connection.to
                ?.arrival ||
              "",

            departure:
              "",

            platform:
              connection.to
                ?.platform ||
              "",
          },
        ];
      }

      return stops;
    };

  /* =======================================================
     DIRECTION
  ======================================================= */

  const getDirection =
    (connection) => {
      const sections =
        connection.sections ||
        [];

      const journeySection =
        sections.find(
          (section) =>
            section.journey
        );

      return (
        journeySection
          ?.journey
          ?.to
          ?.name ||
        connection.to
          ?.station
          ?.name ||
        toStation ||
        "Destination"
      );
    };

  /* =======================================================
     STOP TIMES
  ======================================================= */

  const renderStopTimes =
    (stop) => {
      const arrival =
        stop.arrival
          ? formatTime(
              stop.arrival
            )
          : "";

      const departure =
        stop.departure
          ? formatTime(
              stop.departure
            )
          : "";

      if (
        arrival &&
        departure &&
        arrival !==
          departure
      ) {
        return (
          <div>
            <div>
              {arrival}
            </div>

            <div>
              {departure}
            </div>
          </div>
        );
      }

      return (
        <div>
          {departure ||
            arrival ||
            "--:--"}
        </div>
      );
    };

  /* =======================================================
     STATION ROW
  ======================================================= */

  const StationRow = ({
    stop,
    first = false,
    last = false,
  }) => {
    return (
      <div
        style={{
          display:
            "grid",

          gridTemplateColumns:
            "100px 40px minmax(0,1fr)",

          alignItems:
            "center",

          minHeight:
            "82px",
        }}
      >
        <div
          style={{
            fontSize:
              "16px",

            color:
              first || last
                ? "#0f2745"
                : "#7b8fa8",

            fontWeight:
              first || last
                ? 700
                : 500,

            lineHeight:
              1.35,
          }}
        >
          {renderStopTimes(
            stop
          )}
        </div>

        <div
          style={{
            height:
              "82px",

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            position:
              "relative",
          }}
        >
          <span
            style={{
              width:
                first || last
                  ? "12px"
                  : "10px",

              height:
                first || last
                  ? "12px"
                  : "10px",

              borderRadius:
                "50%",

              background:
                "#a72e49",

              position:
                "relative",

              zIndex:
                5,
            }}
          />
        </div>

        <div
          style={{
            paddingLeft:
              "8px",

            fontSize:
              "16px",

            color:
              "#173453",

            fontWeight:
              first || last
                ? 700
                : 500,

            minWidth:
              0,
          }}
        >
          <div>
            {stop.stationName}
          </div>

          {stop.platform && (
            <span
              style={{
                display:
                  "inline-block",

                marginTop:
                  "5px",

                padding:
                  "3px 7px",

                background:
                  "#f0f3f6",

                borderRadius:
                  "4px",

                color:
                  "#61758d",

                fontSize:
                  "11px",

                fontWeight:
                  700,
              }}
            >
              Pl.{" "}
              {stop.platform}
            </span>
          )}
        </div>
      </div>
    );
  };

  /* =======================================================
     COMPACT TIMELINE
  ======================================================= */

  const CompactTimeline =
    ({
      connection,
      index,
      stops,
    }) => {
      const firstStop =
        stops[0];

      const lastStop =
        stops[
          stops.length - 1
        ];

      const hasIntermediate =
        stops.length > 2;

      return (
        <div
          style={{
            padding:
              "20px 18px 8px",
          }}
        >
          <div
            style={{
              display:
                "flex",

              alignItems:
                "center",

              gap:
                "9px",

              marginBottom:
                "12px",
            }}
          >
            <span
              style={{
                background:
                  "#a72e49",

                color:
                  "#ffffff",

                padding:
                  "6px 11px",

                borderRadius:
                  "16px",

                fontSize:
                  "14px",

                fontWeight:
                  800,
              }}
            >
              {getProductName(
                connection
              )}
            </span>

            <span
              style={{
                fontSize:
                  "17px",

                color:
                  "#163250",
              }}
            >
              Direction{" "}
              {getDirection(
                connection
              )}
            </span>
          </div>

          <div
            style={{
              position:
                "relative",

              maxWidth:
                "720px",
            }}
          >
            <div
              style={{
                position:
                  "absolute",

                left:
                  "120px",

                top:
                  "41px",

                bottom:
                  "41px",

                width:
                  "2px",

                background:
                  "#a72e49",

                zIndex:
                  1,
              }}
            />

            <StationRow
              stop={
                firstStop
              }
              first
            />

            {hasIntermediate && (
              <button
                type="button"
                onClick={() =>
                  toggleStops(
                    index
                  )
                }
                title="Show intermediate stations"
                style={{
                  position:
                    "absolute",

                  left:
                    "120px",

                  top:
                    "50%",

                  transform:
                    "translate(-50%, -50%)",

                  width:
                    "26px",

                  height:
                    "26px",

                  padding:
                    0,

                  border:
                    "1px solid #a72e49",

                  borderRadius:
                    "50%",

                  background:
                    "#ffffff",

                  color:
                    "#a72e49",

                  fontSize:
                    "19px",

                  lineHeight:
                    "22px",

                  cursor:
                    "pointer",

                  display:
                    "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",

                  zIndex:
                    20,

                  boxShadow:
                    "0 2px 6px rgba(167,46,73,0.12)",
                }}
              >
                +
              </button>
            )}

            <StationRow
              stop={
                lastStop
              }
              last
            />
          </div>
        </div>
      );
    };

  /* =======================================================
     EXPANDED TIMELINE
  ======================================================= */

  const ExpandedTimeline =
    ({
      connection,
      index,
      stops,
    }) => {
      const hasIntermediate =
        stops.length > 2;

      return (
        <div
          style={{
            padding:
              "20px 18px 8px",
          }}
        >
          <div
            style={{
              display:
                "flex",

              alignItems:
                "center",

              gap:
                "9px",

              marginBottom:
                "12px",
            }}
          >
            <span
              style={{
                background:
                  "#a72e49",

                color:
                  "#ffffff",

                padding:
                  "6px 11px",

                borderRadius:
                  "16px",

                fontSize:
                  "14px",

                fontWeight:
                  800,
              }}
            >
              {getProductName(
                connection
              )}
            </span>

            <span
              style={{
                fontSize:
                  "17px",

                color:
                  "#163250",
              }}
            >
              Direction{" "}
              {getDirection(
                connection
              )}
            </span>
          </div>

          <div
            style={{
              position:
                "relative",

              maxWidth:
                "720px",
            }}
          >
            <div
              style={{
                position:
                  "absolute",

                left:
                  "120px",

                top:
                  "41px",

                bottom:
                  "41px",

                width:
                  "2px",

                background:
                  "#a72e49",

                zIndex:
                  1,
              }}
            />

            {stops.map(
              (
                stop,
                stopIndex
              ) => (
                <StationRow
                  key={
                    stop.key
                  }
                  stop={
                    stop
                  }
                  first={
                    stopIndex ===
                    0
                  }
                  last={
                    stopIndex ===
                    stops.length - 1
                  }
                />
              )
            )}

            {hasIntermediate && (
              <button
                type="button"
                onClick={() =>
                  toggleStops(
                    index
                  )
                }
                title="Hide intermediate stations"
                style={{
                  position:
                    "absolute",

                  left:
                    "120px",

                  top:
                    "50%",

                  transform:
                    "translate(-50%, -50%)",

                  width:
                    "26px",

                  height:
                    "26px",

                  padding:
                    0,

                  border:
                    "1px solid #a72e49",

                  borderRadius:
                    "50%",

                  background:
                    "#ffffff",

                  color:
                    "#a72e49",

                  fontSize:
                    "19px",

                  lineHeight:
                    "22px",

                  cursor:
                    "pointer",

                  display:
                    "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",

                  zIndex:
                    20,

                  boxShadow:
                    "0 2px 6px rgba(167,46,73,0.12)",
                }}
              >
                −
              </button>
            )}
          </div>
        </div>
      );
    };

  /* =======================================================
     STYLES
  ======================================================= */

  const styles = {
    page: {
      width:
        "100%",

      minHeight:
        "100vh",

      background:
        "#f6f8fb",

      color:
        "#0f1b33",

      fontFamily:
        "Inter, Arial, Helvetica, sans-serif",

      boxSizing:
        "border-box",
    },

    content: {
      width:
        "100%",

      maxWidth:
        "1600px",

      margin:
        "0 auto",

      padding:
        "20px",

      boxSizing:
        "border-box",
    },

    /* =====================================================
       SEARCH CARD
    ===================================================== */

    searchCard: {
      width:
        "100%",

      background:
        "#ffffff",

      border:
        "1px solid #e1e7ef",

      borderRadius:
        "16px",

      padding:
        "28px",

      boxSizing:
        "border-box",

      boxShadow:
        "0 8px 22px rgba(31,48,71,0.05)",
    },

    searchTop: {
      display:
        "flex",

      justifyContent:
        "space-between",

      alignItems:
        "flex-start",

      gap:
        "24px",

      paddingBottom:
        "22px",

      borderBottom:
        "1px solid #edf0f4",
    },

    searchTitleArea: {
      flex:
        1,

      minWidth:
        0,
    },

    searchTitle: {
      margin:
        0,

      fontSize:
        "23px",

      fontWeight:
        800,

      color:
        "#0f2039",

      display:
        "inline-block",

      lineHeight:
        "1.2",
    },

    liveBadge: {
      marginLeft:
        "10px",

      padding:
        "8px 11px",

      borderRadius:
        "20px",

      background:
        "#fff0f3",

      color:
        "#a72e49",

      fontWeight:
        700,

      fontSize:
        "12px",

      display:
        "inline-block",

      verticalAlign:
        "middle",
    },

    searchSubtitle: {
      margin:
        "7px 0 0",

      fontSize:
        "15px",

      color:
        "#617792",
    },

    quickArea: {
      flexShrink:
        0,

      display:
        "flex",

      alignItems:
        "center",

      justifyContent:
        "flex-end",

      gap:
        "8px",

      flexWrap:
        "wrap",

      maxWidth:
        "540px",
    },

    quickLabel: {
      display:
        "flex",

      alignItems:
        "center",

      gap:
        "4px",

      color:
        "#8ca0ba",

      fontSize:
        "13px",
    },

    quickButton: {
      height:
        "35px",

      padding:
        "0 11px",

      border:
        "1px solid #dbe3ec",

      borderRadius:
        "8px",

      background:
        "#ffffff",

      color:
        "#253b58",

      cursor:
        "pointer",

      fontSize:
        "13px",

      fontWeight:
        600,

      whiteSpace:
        "nowrap",
    },

    /* =====================================================
       STATION FORM
    ===================================================== */

    formGrid: {
      display:
        "grid",

      gridTemplateColumns:
        "minmax(0,1fr) 58px minmax(0,1fr)",

      gap:
        "20px",

      alignItems:
        "end",

      marginTop:
        "25px",
    },

    field: {
      position:
        "relative",

      minWidth:
        0,
    },

    labelRow: {
      display:
        "flex",

      justifyContent:
        "space-between",

      alignItems:
        "center",

      marginBottom:
        "8px",
    },

    label: {
      fontSize:
        "13px",

      fontWeight:
        800,

      color:
        "#263c59",

      letterSpacing:
        "0.2px",
    },

    via: {
      color:
        "#a72e49",

      fontWeight:
        700,

      fontSize:
        "13px",

      cursor:
        "pointer",
    },

    inputWrapper: {
      position:
        "relative",

      width:
        "100%",
    },

    input: {
      width:
        "100%",

      height:
        "54px",

      boxSizing:
        "border-box",

      border:
        "1px solid #dce4ed",

      borderRadius:
        "12px",

      background:
        "#fbfcfe",

      padding:
        "0 45px",

      fontSize:
        "16px",

      color:
        "#172944",

      outline:
        "none",
    },

    inputIcon: {
      position:
        "absolute",

      left:
        "16px",

      top:
        "50%",

      transform:
        "translateY(-50%)",

      color:
        "#96a8bd",

      display:
        "flex",

      alignItems:
        "center",

      pointerEvents:
        "none",

      zIndex:
        2,
    },

    suggestionBox: {
      position:
        "absolute",

      left:
        0,

      right:
        0,

      top:
        "64px",

      zIndex:
        1000,

      background:
        "#ffffff",

      border:
        "1px solid #dce4ed",

      borderRadius:
        "11px",

      overflow:
        "hidden",

      boxShadow:
        "0 12px 28px rgba(31,48,71,0.15)",
    },

    suggestion: {
      minHeight:
        "46px",

      padding:
        "10px 15px",

      display:
        "flex",

      alignItems:
        "center",

      gap:
        "8px",

      borderBottom:
        "1px solid #eff2f5",

      color:
        "#213954",

      fontSize:
        "14px",

      cursor:
        "pointer",

      background:
        "#ffffff",
    },

    swapArea: {
      height:
        "54px",

      display:
        "flex",

      alignItems:
        "center",

      justifyContent:
        "center",
    },

    swapButton: {
      width:
        "46px",

      height:
        "46px",

      border:
        "1px solid #dce4ed",

      borderRadius:
        "50%",

      background:
        "#ffffff",

      color:
        "#71839a",

      cursor:
        "pointer",

      display:
        "flex",

      alignItems:
        "center",

      justifyContent:
        "center",

      boxShadow:
        "0 2px 6px rgba(20,40,60,0.05)",
    },

    /* =====================================================
       BOTTOM ROW
    ===================================================== */

    bottomRow: {
      marginTop:
        "22px",

      display:
        "grid",

      gridTemplateColumns:
        "minmax(0,1.55fr) minmax(150px,180px) minmax(0,1.15fr)",

      gap:
        "18px",

      alignItems:
        "end",

      width:
        "100%",
    },

    dateField: {
      minWidth:
        0,

      width:
        "100%",
    },

    dateTimeRow: {
      display:
        "grid",

      gridTemplateColumns:
        "minmax(0,1fr) 125px",

      gap:
        "12px",

      width:
        "100%",

      alignItems:
        "center",
    },

    dateInput: {
      width:
        "100%",

      height:
        "54px",

      boxSizing:
        "border-box",

      border:
        "1px solid #dce4ed",

      borderRadius:
        "12px",

      background:
        "#fbfcfe",

      padding:
        "0 13px",

      fontSize:
        "15px",

      color:
        "#173453",

      outline:
        "none",
    },

    timeInput: {
      width:
        "125px",

      height:
        "54px",

      boxSizing:
        "border-box",

      border:
        "1px solid #dce4ed",

      borderRadius:
        "12px",

      background:
        "#fbfcfe",

      padding:
        "0 12px",

      fontSize:
        "15px",

      color:
        "#173453",

      outline:
        "none",
    },

    timeModeArea: {
      height:
        "54px",

      display:
        "flex",

      alignItems:
        "center",

      justifyContent:
        "center",

      width:
        "100%",
    },

    depArrGroup: {
      width:
        "100%",

      height:
        "54px",

      display:
        "flex",

      alignItems:
        "center",

      justifyContent:
        "center",

      gap:
        "8px",

      whiteSpace:
        "nowrap",
    },

    modeText: {
      fontSize:
        "14px",

      fontWeight:
        600,

      color:
        "#243a56",

      lineHeight:
        1,
    },

    modeTextActive: {
      color:
        "#a72e49",

      fontWeight:
        800,
    },

    modeSwitch: {
      position:
        "relative",

      width:
        "58px",

      height:
        "30px",

      flexShrink:
        0,

      border:
        "none",

      borderRadius:
        "18px",

      background:
        "#a72e49",

      padding:
        0,

      cursor:
        "pointer",
    },

    modeKnob: {
      position:
        "absolute",

      top:
        "4px",

      width:
        "22px",

      height:
        "22px",

      borderRadius:
        "50%",

      background:
        "#ffffff",

      boxShadow:
        "0 1px 3px rgba(0,0,0,0.16)",

      transition:
        "left 0.18s ease",
    },

    searchButton: {
      width:
        "100%",

      height:
        "54px",

      border:
        "none",

      borderRadius:
        "10px",

      background:
        "#a72e49",

      color:
        "#ffffff",

      fontSize:
        "15px",

      fontWeight:
        800,

      cursor:
        "pointer",

      display:
        "flex",

      alignItems:
        "center",

      justifyContent:
        "center",

      gap:
        "9px",

      boxShadow:
        "0 5px 12px rgba(167,46,73,0.16)",
    },

    /* =====================================================
       ERROR
    ===================================================== */

    message: {
      marginTop:
        "17px",

      padding:
        "13px 16px",

      borderRadius:
        "10px",

      background:
        "#fff5f6",

      border:
        "1px solid #ffd5dc",

      color:
        "#a72e49",

      fontSize:
        "14px",
    },

    loading: {
      marginTop:
        "18px",

      padding:
        "20px",

      textAlign:
        "center",

      color:
        "#70849c",

      fontSize:
        "15px",
    },

    /* =====================================================
       RESULTS
    ===================================================== */

    resultsWrapper: {
      width:
        "100%",

      marginTop:
        "26px",
    },

    resultHeader: {
      minHeight:
        "80px",

      padding:
        "18px 24px",

      boxSizing:
        "border-box",

      display:
        "flex",

      justifyContent:
        "space-between",

      alignItems:
        "center",

      gap:
        "20px",

      background:
        "#ffffff",

      border:
        "1px solid #e1e7ef",

      borderBottom:
        "none",

      borderRadius:
        "16px 16px 0 0",
    },

    resultTitle: {
      margin:
        0,

      fontSize:
        "20px",

      fontWeight:
        800,

      color:
        "#11243e",
    },

    resultSubtitle: {
      margin:
        "5px 0 0",

      color:
        "#7a8fa8",

      fontSize:
        "14px",
    },

    routeCount: {
      flexShrink:
        0,

      background:
        "#edf2f7",

      color:
        "#31465f",

      padding:
        "7px 12px",

      borderRadius:
        "17px",

      fontSize:
        "13px",

      fontWeight:
        700,

      whiteSpace:
        "nowrap",
    },

    routeCard: {
      width:
        "100%",

      boxSizing:
        "border-box",

      background:
        "#ffffff",

      overflow:
        "hidden",

      border:
        "1px solid #e1e7ef",
    },

    routeTop: {
      minHeight:
        "124px",

      padding:
        "0 20px",

      display:
        "grid",

      gridTemplateColumns:
        "120px minmax(220px,1fr) 120px 82px 145px",

      gap:
        "18px",

      alignItems:
        "center",

      boxSizing:
        "border-box",
    },

    resultTime: {
      fontSize:
        "29px",

      fontWeight:
        800,

      color:
        "#0b1c38",

      lineHeight:
        1,

      letterSpacing:
        "-0.4px",
    },

    stationName: {
      marginTop:
        "6px",

      fontSize:
        "14px",

      color:
        "#233c59",

      whiteSpace:
        "nowrap",

      overflow:
        "hidden",

      textOverflow:
        "ellipsis",
    },

    platform: {
      display:
        "inline-block",

      marginTop:
        "6px",

      padding:
        "3px 7px",

      background:
        "#f0f3f6",

      borderRadius:
        "4px",

      color:
        "#5c6f86",

      fontSize:
        "11px",

      fontWeight:
        700,
    },

    /* =====================================================
       HORIZONTAL TIMELINE
    ===================================================== */

    horizontalTimeline: {
      position:
        "relative",

      height:
        "72px",

      minWidth:
        0,

      display:
        "block",
    },

    horizontalLine: {
      position:
        "absolute",

      left:
        0,

      right:
        0,

      top:
        "29px",

      height:
        "2px",

      background:
        "#d7dee8",

      zIndex:
        1,
    },

    leftDot: {
      position:
        "absolute",

      left:
        0,

      top:
        "24px",

      width:
        "10px",

      height:
        "10px",

      border:
        "2px solid #a72e49",

      borderRadius:
        "50%",

      background:
        "#ffffff",

      zIndex:
        3,

      boxSizing:
        "border-box",
    },

    rightDot: {
      position:
        "absolute",

      right:
        0,

      top:
        "25px",

      width:
        "10px",

      height:
        "10px",

      borderRadius:
        "50%",

      background:
        "#a72e49",

      zIndex:
        3,
    },

    duration: {
      position:
        "absolute",

      left:
        "50%",

      top:
        "3px",

      transform:
        "translateX(-50%)",

      zIndex:
        5,

      display:
        "flex",

      alignItems:
        "center",

      justifyContent:
        "center",

      gap:
        "4px",

      padding:
        "0 8px",

      background:
        "#ffffff",

      color:
        "#627994",

      fontSize:
        "12px",

      lineHeight:
        "18px",

      whiteSpace:
        "nowrap",
    },

    direct: {
      position:
        "absolute",

      left:
        "50%",

      top:
        "45px",

      transform:
        "translateX(-50%)",

      zIndex:
        5,

      color:
        "#00a66a",

      fontWeight:
        700,

      fontSize:
        "12px",

      lineHeight:
        "18px",

      whiteSpace:
        "nowrap",

      background:
        "#ffffff",

      padding:
        "0 5px",
    },

    transfer: {
      position:
        "absolute",

      left:
        "50%",

      top:
        "45px",

      transform:
        "translateX(-50%)",

      zIndex:
        5,

      color:
        "#8a99ae",

      fontSize:
        "12px",

      lineHeight:
        "18px",

      whiteSpace:
        "nowrap",

      background:
        "#ffffff",

      padding:
        "0 5px",
    },

    product: {
      justifySelf:
        "center",

      padding:
        "6px 9px",

      background:
        "#f0f4f8",

      border:
        "1px solid #dce4ec",

      borderRadius:
        "7px",

      color:
        "#31455e",

      fontSize:
        "12px",

      fontWeight:
        700,

      textAlign:
        "center",

      whiteSpace:
        "nowrap",
    },

    /* =====================================================
       SAVE + ARROW
    ===================================================== */

    routeActions: {
      height:
        "40px",

      display:
        "flex",

      alignItems:
        "center",

      justifyContent:
        "flex-end",

      gap:
        "4px",
    },

    saveSmallButton: {
      border:
        "none",

      background:
        "transparent",

      color:
        "#a72e49",

      fontSize:
        "14px",

      fontWeight:
        700,

      padding:
        "6px 3px",

      cursor:
        "pointer",

      whiteSpace:
        "nowrap",
    },

    savedSmallButton: {
      border:
        "none",

      background:
        "transparent",

      color:
        "#009765",

      fontSize:
        "14px",

      fontWeight:
        700,

      padding:
        "6px 3px",

      cursor:
        "pointer",

      whiteSpace:
        "nowrap",
    },

    arrowButton: {
      width:
        "32px",

      height:
        "32px",

      flexShrink:
        0,

      padding:
        0,

      border:
        "none",

      background:
        "transparent",

      color:
        "#a72e49",

      cursor:
        "pointer",

      borderRadius:
        "6px",

      display:
        "flex",

      alignItems:
        "center",

      justifyContent:
        "center",
    },

    detailSection: {
      borderTop:
        "1px solid #e7ebf0",

      background:
        "#ffffff",
    },

    saveArea: {
      padding:
        "4px 18px 20px",
    },

    saveFullButton: {
      width:
        "100%",

      height:
        "38px",

      border:
        "none",

      borderRadius:
        "7px",

      background:
        "#ffe0e4",

      color:
        "#a72e49",

      fontSize:
        "14px",

      fontWeight:
        500,

      cursor:
        "pointer",
    },

    savedFullButton: {
      width:
        "100%",

      height:
        "38px",

      border:
        "none",

      borderRadius:
        "7px",

      background:
        "#d9f8eb",

      color:
        "#00865c",

      fontSize:
        "14px",

      fontWeight:
        700,

      cursor:
        "pointer",

      display:
        "flex",

      alignItems:
        "center",

      justifyContent:
        "center",

      gap:
        "6px",
    },

    /* =====================================================
       TOAST
    ===================================================== */

    toast: {
      position:
        "fixed",

      top:
        "20px",

      right:
        "20px",

      zIndex:
        9999,

      width:
        "min(400px, calc(100vw - 40px))",

      minHeight:
        "64px",

      padding:
        "13px 15px",

      boxSizing:
        "border-box",

      borderRadius:
        "13px",

      background:
        "#ffffff",

      border:
        "1px solid #dce6e1",

      boxShadow:
        "0 14px 32px rgba(25,45,65,0.16)",

      display:
        "flex",

      alignItems:
        "center",

      gap:
        "11px",
    },

    toastIcon: {
      width:
        "34px",

      height:
        "34px",

      borderRadius:
        "50%",

      flexShrink:
        0,

      display:
        "flex",

      alignItems:
        "center",

      justifyContent:
        "center",
    },

    toastSuccessIcon: {
      background:
        "#d9f8eb",

      color:
        "#00865c",
    },

    toastRemovedIcon: {
      background:
        "#fff0f3",

      color:
        "#a72e49",
    },

    toastInfoIcon: {
      width:
        "34px",

      height:
        "34px",

      borderRadius:
        "50%",

      flexShrink:
        0,

      background:
        "#eef3ff",

      color:
        "#5274b8",

      display:
        "flex",

      alignItems:
        "center",

      justifyContent:
        "center",

      fontWeight:
        800,
    },

    toastTitle: {
      fontSize:
        "14px",

      fontWeight:
        800,

      color:
        "#1d3049",

      marginBottom:
        "2px",
    },

    toastText: {
      fontSize:
        "13px",

      color:
        "#71849b",

      lineHeight:
        1.4,
    },
  };

  /* =======================================================
     RETURN
  ======================================================= */

  return (
    <div
      style={
        styles.page
      }
    >
      {/* ===================================================
          TOAST
      =================================================== */}

      {saveMessage && (
        <div
          style={
            styles.toast
          }
        >
          {saveToastType ===
          "success" ? (
            <div
              style={{
                ...styles.toastIcon,
                ...styles.toastSuccessIcon,
              }}
            >
              <CheckIcon />
            </div>
          ) : saveToastType ===
            "removed" ? (
            <div
              style={{
                ...styles.toastIcon,
                ...styles.toastRemovedIcon,
              }}
            >
              <TrashSmallIcon />
            </div>
          ) : (
            <div
              style={
                styles.toastInfoIcon
              }
            >
              i
            </div>
          )}

          <div>
            <div
              style={
                styles.toastTitle
              }
            >
              {saveToastType ===
              "success"
                ? "Journey Saved"
                : saveToastType ===
                  "removed"
                ? "Journey Removed"
                : "Information"}
            </div>

            <div
              style={
                styles.toastText
              }
            >
              {saveMessage}
            </div>
          </div>
        </div>
      )}

      <div
        style={
          styles.content
        }
      >
        {/* =================================================
            SEARCH CARD
        ================================================= */}

        <section
          style={
            styles.searchCard
          }
        >
          <div
            style={
              styles.searchTop
            }
          >
            <div
              style={
                styles.searchTitleArea
              }
            >
              <h2
                style={
                  styles.searchTitle
                }
              >
                Find Train Connections
              </h2>

              <span
                style={
                  styles.liveBadge
                }
              >
                Live SBB Timetable
              </span>

              <p
                style={
                  styles.searchSubtitle
                }
              >
                Real-time schedules from
                transport.opendata.ch API
              </p>
            </div>

            <div
              style={
                styles.quickArea
              }
            >
              <span
                style={
                  styles.quickLabel
                }
              >
                <SparkleIcon />
                Quick:
              </span>

              <button
                type="button"
                style={
                  styles.quickButton
                }
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
                style={
                  styles.quickButton
                }
                onClick={() =>
                  handleQuickStation(
                    "Bern"
                  )
                }
              >
                Bern
              </button>

              <button
                type="button"
                style={
                  styles.quickButton
                }
                onClick={() =>
                  handleQuickStation(
                    "Genève"
                  )
                }
              >
                Genève
              </button>

              <button
                type="button"
                style={
                  styles.quickButton
                }
                onClick={() =>
                  handleQuickStation(
                    "Basel SBB"
                  )
                }
              >
                Basel SBB
              </button>
            </div>
          </div>

          {/* =================================================
              FROM / SWAP / TO
          ================================================= */}

          <div
            style={
              styles.formGrid
            }
          >
            {/* FROM */}

            <div
              style={
                styles.field
              }
            >
              <div
                style={
                  styles.labelRow
                }
              >
                <label
                  style={
                    styles.label
                  }
                >
                  DEPARTURE STATION
                </label>
              </div>

              <div
                style={
                  styles.inputWrapper
                }
              >
                <span
                  style={
                    styles.inputIcon
                  }
                >
                  <LocationIcon />
                </span>

                <input
                  value={
                    fromStation
                  }
                  onChange={(e) => {
                    setFromStation(
                      e.target.value
                    );

                    setFromSelected(
                      false
                    );

                    setFromSuggestions(
                      []
                    );

                    setError("");
                  }}
                  style={
                    styles.input
                  }
                  placeholder="From station (e.g. Zürich HB)"
                  autoComplete="off"
                />

                {loadingFrom && (
                  <span
                    style={{
                      position:
                        "absolute",

                      right:
                        "14px",

                      top:
                        "18px",

                      fontSize:
                        "12px",

                      color:
                        "#8ca0ba",
                    }}
                  >
                    Searching...
                  </span>
                )}

                {fromSuggestions.length >
                  0 && (
                  <div
                    style={
                      styles.suggestionBox
                    }
                  >
                    {fromSuggestions.map(
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

                            setFromSelected(
                              true
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
                          {
                            station.name
                          }
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* SWAP */}

            <div
              style={
                styles.swapArea
              }
            >
              <button
                type="button"
                style={
                  styles.swapButton
                }
                onClick={
                  handleSwap
                }
                title="Swap stations"
              >
                <SwapIcon />
              </button>
            </div>

            {/* TO */}

            <div
              style={
                styles.field
              }
            >
              <div
                style={
                  styles.labelRow
                }
              >
                <label
                  style={
                    styles.label
                  }
                >
                  ARRIVAL STATION
                </label>

                <span
                  style={
                    styles.via
                  }
                  onClick={() =>
                    alert(
                      "Via station option can be connected later."
                    )
                  }
                >
                  + Via
                </span>
              </div>

              <div
                style={
                  styles.inputWrapper
                }
              >
                <span
                  style={
                    styles.inputIcon
                  }
                >
                  <LocationIcon />
                </span>

                <input
                  value={
                    toStation
                  }
                  onChange={(e) => {
                    setToStation(
                      e.target.value
                    );

                    setToSelected(
                      false
                    );

                    setToSuggestions(
                      []
                    );

                    setError("");
                  }}
                  style={
                    styles.input
                  }
                  placeholder="To station (e.g. Bern)"
                  autoComplete="off"
                />

                {loadingTo && (
                  <span
                    style={{
                      position:
                        "absolute",

                      right:
                        "14px",

                      top:
                        "18px",

                      fontSize:
                        "12px",

                      color:
                        "#8ca0ba",
                    }}
                  >
                    Searching...
                  </span>
                )}

                {toSuggestions.length >
                  0 && (
                  <div
                    style={
                      styles.suggestionBox
                    }
                  >
                    {toSuggestions.map(
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

                            setToSelected(
                              true
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
                          {
                            station.name
                          }
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* =================================================
              DATE / DEP-ARR / FIND JOURNEY
          ================================================= */}

          <div
            style={
              styles.bottomRow
            }
          >
            {/* DATE / TIME */}

            <div
              style={
                styles.dateField
              }
            >
              <div
                style={
                  styles.labelRow
                }
              >
                <label
                  style={
                    styles.label
                  }
                >
                  {isArrivalTime
                    ? "ARRIVAL DATE & TIME"
                    : "DEPARTURE DATE & TIME"}
                </label>
              </div>

              <div
                style={
                  styles.dateTimeRow
                }
              >
                <input
                  type="date"
                  value={
                    departureDate
                  }
                  onChange={(e) =>
                    setDepartureDate(
                      e.target.value
                    )
                  }
                  style={
                    styles.dateInput
                  }
                />

                <input
                  type="time"
                  value={
                    departureTime
                  }
                  onChange={(e) =>
                    setDepartureTime(
                      e.target.value
                    )
                  }
                  style={
                    styles.timeInput
                  }
                />
              </div>
            </div>

            {/* CENTER DEP / ARR */}

            <div
              style={
                styles.timeModeArea
              }
            >
              <div
                style={
                  styles.depArrGroup
                }
              >
                <span
                  style={{
                    ...styles.modeText,

                    ...(!isArrivalTime
                      ? styles.modeTextActive
                      : {}),
                  }}
                >
                  Dep
                </span>

                <button
                  type="button"
                  style={
                    styles.modeSwitch
                  }
                  onClick={
                    handleTimeModeChange
                  }
                  title="Switch between Departure and Arrival"
                  aria-label="Switch between Departure and Arrival"
                >
                  <span
                    style={{
                      ...styles.modeKnob,

                      left:
                        isArrivalTime
                          ? "32px"
                          : "4px",
                    }}
                  />
                </button>

                <span
                  style={{
                    ...styles.modeText,

                    ...(isArrivalTime
                      ? styles.modeTextActive
                      : {}),
                  }}
                >
                  Arr
                </span>
              </div>
            </div>

            {/* FIND JOURNEY */}

            <button
              type="button"
              style={{
                ...styles.searchButton,

                opacity:
                  loading ||
                  !fromStation.trim() ||
                  !toStation.trim()
                    ? 0.65
                    : 1,
              }}
              disabled={
                loading ||
                !fromStation.trim() ||
                !toStation.trim()
              }
              onClick={
                handleSearch
              }
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
          <div
            style={
              styles.message
            }
          >
            {error}
          </div>
        )}

        {/* LOADING */}

        {loading && (
          <div
            style={
              styles.loading
            }
          >
            Searching live train
            connections...
          </div>
        )}

        {/* =================================================
            RESULTS
        ================================================= */}

        {connections.length >
          0 && (
          <section
            id="results"
            style={
              styles.resultsWrapper
            }
          >
            {/* RESULTS HEADER */}

            <div
              style={
                styles.resultHeader
              }
            >
              <div>
                <h2
                  style={
                    styles.resultTitle
                  }
                >
                  Available Train
                  Connections
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

              <div
                style={
                  styles.routeCount
                }
              >
                {Math.min(
                  connections.length,
                  5
                )}{" "}
                Routes Found
              </div>
            </div>

            {/* ROUTES */}

            {connections
              .slice(
                0,
                5
              )
              .map(
                (
                  connection,
                  index
                ) => {
                  const fromTime =
                    formatTime(
                      connection
                        .from
                        ?.departure
                    );

                  const toTime =
                    formatTime(
                      connection
                        .to
                        ?.arrival
                    );

                  const duration =
                    formatDuration(
                      connection
                        .duration
                    );

                  const transfers =
                    connection
                      .transfers ||
                    0;

                  const saved =
                    Boolean(
                      findSavedJourney(
                        connection
                      )
                    );

                  const stops =
                    getJourneyStops(
                      connection
                    );

                  const routeExpanded =
                    Boolean(
                      expandedRoutes[
                        index
                      ]
                    );

                  const stopsVisible =
                    Boolean(
                      showStops[
                        index
                      ]
                    );

                  const lastRoute =
                    index ===
                    Math.min(
                      connections.length,
                      5
                    ) - 1;

                  return (
                    <div
                      key={`${connection.from?.departure || "route"}-${connection.to?.arrival || "arrival"}-${index}`}
                      style={{
                        ...styles.routeCard,

                        borderTop:
                          index ===
                          0
                            ? "none"
                            : "1px solid #e1e7ef",

                        borderRadius:
                          lastRoute
                            ? "0 0 16px 16px"
                            : "0",
                      }}
                    >
                      {/* ROUTE TOP */}

                      <div
                        style={
                          styles.routeTop
                        }
                      >
                        {/* DEPARTURE */}

                        <div>
                          <div
                            style={
                              styles.resultTime
                            }
                          >
                            {
                              fromTime
                            }
                          </div>

                          <div
                            style={
                              styles.stationName
                            }
                          >
                            {connection
                              .from
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
                            {connection
                              .from
                              ?.platform ||
                              "-"}
                          </span>
                        </div>

                        {/* TIMELINE */}

                        <div
                          style={
                            styles.horizontalTimeline
                          }
                        >
                          <span
                            style={
                              styles.horizontalLine
                            }
                          />

                          <span
                            style={
                              styles.leftDot
                            }
                          />

                          <span
                            style={
                              styles.rightDot
                            }
                          />

                          <span
                            style={
                              styles.duration
                            }
                          >
                            <ClockIcon />

                            {
                              duration
                            }
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
                              {
                                transfers
                              }{" "}
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
                              styles.resultTime
                            }
                          >
                            {
                              toTime
                            }
                          </div>

                          <div
                            style={
                              styles.stationName
                            }
                          >
                            {connection
                              .to
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
                            {connection
                              .to
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

                        {/* SAVE + ARROW */}

                        <div
                          style={
                            styles.routeActions
                          }
                        >
                          {saved ? (
                            <button
                              type="button"
                              style={
                                styles.savedSmallButton
                              }
                              onClick={() =>
                                saveJourney(
                                  connection
                                )
                              }
                              title="Click to unsave"
                            >
                              ✓ Saved
                            </button>
                          ) : (
                            <button
                              type="button"
                              style={
                                styles.saveSmallButton
                              }
                              onClick={() =>
                                saveJourney(
                                  connection
                                )
                              }
                            >
                              Save
                            </button>
                          )}

                          <button
                            type="button"
                            style={
                              styles.arrowButton
                            }
                            onClick={() =>
                              toggleRoute(
                                index
                              )
                            }
                            title={
                              routeExpanded
                                ? "Collapse journey"
                                : "Expand journey"
                            }
                          >
                            {routeExpanded ? (
                              <ChevronUpIcon />
                            ) : (
                              <ChevronDownIcon />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* JOURNEY DETAILS */}

                      {routeExpanded && (
                        <div
                          style={
                            styles.detailSection
                          }
                        >
                          {stopsVisible ? (
                            <ExpandedTimeline
                              connection={
                                connection
                              }
                              index={
                                index
                              }
                              stops={
                                stops
                              }
                            />
                          ) : (
                            <CompactTimeline
                              connection={
                                connection
                              }
                              index={
                                index
                              }
                              stops={
                                stops
                              }
                            />
                          )}

                          {/* BOTTOM SAVE */}

                          <div
                            style={
                              styles.saveArea
                            }
                          >
                            {saved ? (
                              <button
                                type="button"
                                style={
                                  styles.savedFullButton
                                }
                                onClick={() =>
                                  saveJourney(
                                    connection
                                  )
                                }
                                title="Click to unsave"
                              >
                                <CheckIcon />
                                Journey Saved
                              </button>
                            ) : (
                              <button
                                type="button"
                                style={
                                  styles.saveFullButton
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
                      )}
                    </div>
                  );
                }
              )}
          </section>
        )}
      </div>
    </div>
  );
}

export default PlanJourney;