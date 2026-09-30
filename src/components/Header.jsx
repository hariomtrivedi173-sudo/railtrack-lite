function Header({
  currentPage,
  savedJourneys,
  onNavigation,
}) {
  const styles = {
    header: {
      minHeight: "64px",
      background: "rgba(255, 255, 255, 0.92)",
      borderBottom: "1px solid #e2e8f0",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 32px",
      boxSizing: "border-box",
      position: "sticky",
      top: 0,
      zIndex: 20,
      backdropFilter: "blur(10px)",
    },

breadcrumb: {
  color: "#94a3b8",
  fontSize: "12px",
  fontWeight: 600,
  marginBottom: "2px",
},

breadcrumbActive: {
  color: "#475569",
  fontWeight: 700,
},

pageTitle: {
  margin: 0,
  fontSize: "18px",
  fontWeight: 800,
  color: "#0f172a",
},

headerActions: {
  display: "flex",
  alignItems: "center",
  gap: "12px",
},

storageBadge: {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  border: "1px solid #a7f3d0",
  background: "#ecfdf5",
  color: "#065f46",
  padding: "6px 12px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: 700,
},

greenDot: {
  width: "8px",
  height: "8px",
  background: "#10b981",
  borderRadius: "50%",
},

countCircle: {
  minWidth: "22px",
  height: "22px",
  padding: "0 6px",
  borderRadius: "999px",
  background: "#d1fae5",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "11px",
  fontWeight: 800,
},

actionButton: {
  border: "1px solid #dbe3ec",
  background: "#ffffff",
  color: "#334155",
  padding: "8px 14px",
  borderRadius: "12px",
  fontSize: "12px",
  fontWeight: 700,
  cursor: "pointer",
},

primaryButton: {
  border: "none",
  background: "#902D41",
  color: "#ffffff",
  padding: "8px 14px",
  borderRadius: "12px",
  fontSize: "12px",
  fontWeight: 700,
  cursor: "pointer",
},
  };

  const handleAction = () => {
    if (!onNavigation) {
      return;
    }

if (currentPage === "Plan Journey") {
  onNavigation("My Journeys");
  return;
}

onNavigation("Plan Journey");
  };

  const isPlanJourney =
    currentPage === "Plan Journey";

  const buttonText = isPlanJourney
    ? Saved Trips (${savedJourneys.length})
    : "Plan Journey";

  return (
    <header style={styles.header}>
      <div>
        <div style={styles.breadcrumb}>
          Railtrack  /  

      <span
        style={styles.breadcrumbActive}
      >
        {currentPage}
      </span>
    </div>

    <h1 style={styles.pageTitle}>
      {currentPage}
    </h1>
  </div>

  <div style={styles.headerActions}>
    <div style={styles.storageBadge}>
      <span style={styles.greenDot} />

      <span>
        LocalStorage
      </span>

      <span style={styles.countCircle}>
        {savedJourneys.length}
      </span>
    </div>

    <button
      type="button"
      style={
        isPlanJourney
          ? styles.actionButton
          : styles.primaryButton
      }
      onClick={handleAction}
    >
      {buttonText}
    </button>
  </div>
</header>
  );
}

export default Header;