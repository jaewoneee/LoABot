import { API_KEY, API_URL } from "../config/constants";

export const basicFetch = async (endpoint: string, method = "GET") => {
  const URL = API_URL + endpoint;
  const bearer = `bearer ${API_KEY}`;

  try {
    const data = await fetch(URL, {
      method,
      headers: {
        Authorization: bearer,
      },
    });
    return data.json();
  } catch (error) {
    console.error(error);
  }
};
