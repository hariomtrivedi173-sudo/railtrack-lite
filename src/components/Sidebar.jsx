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
      <circle
        cx="12"
        cy="12"
        r="9"
      />

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
      <rect
        x="4"
        y="4"
        width="6"
        height="6"
        rx="1"
      />

      <rect
        x="14"
        y="4"
        width="6"
        height="6"
        rx="1"
      />

      <rect
        x="4"
        y="14"
        width="6"
        height="6"
        rx="1"
      />

      <rect
        x="14"
        y="14"
        width="6"
        height="6"
        rx="1"
      />
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
        fill="#A72E49"
      />

      <path
        d="M10 9.5C10 8.12 11.12 7 12.5 7h7C20.88 7 22 8.12 22 9.5v8.8c0 1.49-1.21 2.7-2.7 2.7h-6.6c-1.49 0-2.7-1.21-2.7-2.7V9.5Z"
        fill="white"
      />

      <path
        d="M12.5 10h7v5h-7v-5Z"
        fill="#5B8DB8"
      />

      <circle
        cx="13"
        cy="18.5"
        r="1.2"
        fill="#A72E49"
      />

      <circle
        cx="19"
        cy="18.5"
        r="1.2"
        fill="#A72E49"
      />

      <path
        d="M12 22.5 9.5 25M20 22.5l2.5 2.5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Sidebar({
  currentPage,
  savedJourneys,
  onNavigation,
  onReset,
}) {
  const styles = {
    sidebar: {
      width: "315px",
      background: "#ffffff",
      borderRight:
        "1px solid #e3e8ef",
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
      borderBottom:
        "1px solid #f0f2f5",
    },

    logoIcon: {
      width: "34px",
      height: "34px",
      borderRadius: "8px",
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
      borderTop:
        "1px solid #e8edf3",
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
  };

  const getNavStyle = (
    page
  ) => {
    return {
      ...styles.navButton,

      ...(currentPage === page
        ? {
            background:
              "#fff0f3",

            color:
              "#a52e49",

            fontWeight:
              700,
          }
        : {}),
    };
  };

  return (
    <aside
      style={
        styles.sidebar
      }
    >
      <div
        style={
          styles.logoArea
        }
      >
        <div
          style={
            styles.logoIcon
          }
        >
          <TrainLogoIcon />
        </div>

        <span
          style={
            styles.logoText
          }
        >
          railtrack
        </span>

        <span
          style={
            styles.lite
          }
        >
          Lite
        </span>
      </div>

      <nav
        style={
          styles.nav
        }
      >
        <button
          type="button"
          style={getNavStyle(
            "Plan Journey"
          )}
          onClick={() =>
            onNavigation(
              "Plan Journey"
            )
          }
        >
          <span
            style={
              styles.navIcon
            }
          >
            <PlanIcon />
          </span>

          <span>
            Plan Journey
          </span>
        </button>

        <button
          type="button"
          style={getNavStyle(
            "My Journeys"
          )}
          onClick={() =>
            onNavigation(
              "My Journeys"
            )
          }
        >
          <span
            style={
              styles.navIcon
            }
          >
            <JourneysIcon />
          </span>

          <span>
            My Journeys
          </span>

          <span
            style={
              styles.navBadge
            }
          >
            {savedJourneys.length}
          </span>
        </button>

        <button
          type="button"
          style={getNavStyle(
            "Travel Stats"
          )}
          onClick={() =>
            onNavigation(
              "Travel Stats"
            )
          }
        >
          <span
            style={
              styles.navIcon
            }
          >
            <StatsIcon />
          </span>

          <span>
            Travel Stats
          </span>
        </button>

        <button
          type="button"
          style={getNavStyle(
            "Dashboard"
          )}
          onClick={() =>
            onNavigation(
              "Dashboard"
            )
          }
        >
          <span
            style={
              styles.navIcon
            }
          >
            <DashboardIcon />
          </span>

          <span>
            Dashboard
          </span>
        </button>
      </nav>

      <div
        style={
          styles.resetArea
        }
      >
        <button
          type="button"
          style={
            styles.resetButton
          }
          onClick={
            onReset
          }
        >
          <TrashIcon />

          <span>
            Reset Local Trips
          </span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;