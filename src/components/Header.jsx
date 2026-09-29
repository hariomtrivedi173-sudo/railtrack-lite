function Header({
  currentPage,
  savedJourneys,
}) {
  const styles = {
    header: {
      minHeight: "86px",
      background: "#ffffff",
      borderBottom:
        "1px solid #e3e8ef",
      display: "flex",
      alignItems: "center",
      justifyContent:
        "space-between",
      padding: "0 42px",
      boxSizing: "border-box",
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
      color: "#111827",
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
      border:
        "1px solid #9ce7ca",
      background: "#edfff7",
      color: "#08754f",
      padding:
        "10px 17px",
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
      border:
        "1px solid #dbe3ec",
      background: "#ffffff",
      color: "#273952",
      padding:
        "11px 19px",
      borderRadius: "24px",
      fontSize: "15px",
      fontWeight: 700,
      cursor: "pointer",
    },
  };

  const handleSavedTrips = () => {
    document
      .getElementById("results")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  return (
    <header
      style={styles.header}
    >
      <div>
        <div
          style={
            styles.breadcrumb
          }
        >
          Railtrack&nbsp; / &nbsp;

          <span
            style={
              styles.breadcrumbActive
            }
          >
            {currentPage}
          </span>
        </div>

        <h1
          style={
            styles.pageTitle
          }
        >
          {currentPage}
        </h1>
      </div>

      <div
        style={
          styles.headerActions
        }
      >
        <div
          style={
            styles.storageBadge
          }
        >
          <span
            style={
              styles.greenDot
            }
          />

          LocalStorage

          <span
            style={
              styles.countCircle
            }
          >
            {savedJourneys.length}
          </span>
        </div>

        <button
          type="button"
          style={
            styles.savedTripsButton
          }
          onClick={
            handleSavedTrips
          }
        >
          Saved Trips (
          {savedJourneys.length}
          )
        </button>
      </div>
    </header>
  );
}

export default Header;