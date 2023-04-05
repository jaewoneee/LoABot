import { API_KEY, API_URL } from "../config/constants";

export const basicFetch = async (endpoint: string, method = "GET") => {
  const URL = API_URL + endpoint;
  const bearer = `bearer ${API_KEY}`;

  const response = await fetch(URL, {
    method,
    headers: {
      Authorization: bearer,
    },
  });

  if (!response.ok) {
    const error = {
      status: response.status,
      statusText: response.statusText,
      message: "Failed to fetch data",
    };

    try {
      const responseData = await response.json();
      error.message = responseData.message || error.message;
    } catch (e) {
      console.error("Failed to parse response data as JSON", e);
    }

    throw error;
  }

  return await response.json();
};
