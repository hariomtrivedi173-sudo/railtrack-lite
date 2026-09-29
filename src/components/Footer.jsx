function TrainLogoIcon() {
  return (
    <svg
      width="24"
      height="24"
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
    </svg>
  );
}

function Footer({
  currentPage,
  onNavigation,
}) {
  const styles = {
    footer: {
      minHeight: "75px",
      background: "#ffffff",
      borderTop:
        "1px solid #e1e7ef",
      display: "flex",
      alignItems: "center",
      justifyContent:
        "space-between",
      padding: "0 42px",
      boxSizing: "border-box",
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
      color: "#a72e49",
      fontWeight: 700,
    },
  };

  return (
    <footer
      style={
        styles.footer
      }
    >
      <div
        style={
          styles.footerLeft
        }
      >
        <TrainLogoIcon />

        <strong>
          Railtrack
        </strong>

        <span>•</span>

        <span>
          © 2026 Train Journey Planner
        </span>
      </div>

      <div
        style={
          styles.footerRight
        }
      >
        <button
          type="button"
          style={{
            ...styles.footerButton,

            ...(currentPage ===
            "Plan Journey"
              ? styles.footerActive
              : {}),
          }}
          onClick={() =>
            onNavigation(
              "Plan Journey"
            )
          }
        >
          Plan Journey
        </button>

        <span>•</span>

        <button
          type="button"
          style={{
            ...styles.footerButton,

            ...(currentPage ===
            "My Journeys"
              ? styles.footerActive
              : {}),
          }}
          onClick={() =>
            onNavigation(
              "My Journeys"
            )
          }
        >
          My Journeys
        </button>

        <span>•</span>

        <button
          type="button"
          style={{
            ...styles.footerButton,

            ...(currentPage ===
            "Travel Stats"
              ? styles.footerActive
              : {}),
          }}
          onClick={() =>
            onNavigation(
              "Travel Stats"
            )
          }
        >
          Travel Stats
        </button>

        <span>•</span>

        <button
          type="button"
          style={
            styles.footerButton
          }
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
  );
}

export default Footer;