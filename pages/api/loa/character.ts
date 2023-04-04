import type { NextApiRequest, NextApiResponse } from "next";
import { basicFetch } from "@/utils/basicFetch";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, type } = req.query;
  const baseUrl = `/armories/characters/${name}/${type}`;

  const data = await basicFetch(baseUrl, "GET")
    .then((res) => res)
    .catch((err) => console.error(err));

  res.status(200).json(data);
}
