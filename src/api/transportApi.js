import axios from "axios";

const API_BASE_URL = "https://transport.opendata.ch/v1";

export const searchStations = async (query) => {
  const response = await axios.get(
    `${API_BASE_URL}/locations`,
    {
      params: {
        query: query,
        type: "station",
      },
    }
  );

  return response.data;
};

export const searchConnections = async (
  from,
  to,
  date,
  time,
  isArrivalTime = false
) => {
  const response = await axios.get(
    `${API_BASE_URL}/connections`,
    {
      params: {
        from,
        to,
        date,
        time,
        isArrivalTime: isArrivalTime ? 1 : 0,
      },
    }
  );

  return response.data;
};