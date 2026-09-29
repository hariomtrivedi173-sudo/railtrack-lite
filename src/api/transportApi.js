import axios from "axios";

const API_BASE_URL = "https://transport.opendata.ch/v1";

// Search stations
export const searchStations = async (query) => {
  const response = await axios.get(
    `${API_BASE_URL}/locations?query=${encodeURIComponent(query)}`
  );

  return response.data;
};

// Search journeys
export const searchConnections = async (
  from,
  to,
  date,
  time
) => {
  const response = await axios.get(
    `${API_BASE_URL}/connections`,
    {
      params: {
        from: from,
        to: to,
        date: date,
        time: time,
      },
    }
  );

  return response.data;
};