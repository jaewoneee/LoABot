import { NOTICE } from "@/config/constants";
import type { NextApiRequest, NextApiResponse } from "next";
import { basicFetch } from "@/utils/basicFetch";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { type } = req.query;
  const baseUrl = `/news/${type}`;

  const data = await basicFetch(baseUrl, "GET")
    .then((res) => (type === NOTICE ? res.slice(0, 5) : res))
    .catch((err) => console.error(err));

  res.status(200).json(data);
}
