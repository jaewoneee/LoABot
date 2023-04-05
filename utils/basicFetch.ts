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

  return await response.json();
};
