import type { NextApiRequest, NextApiResponse } from "next";
import { basicFetch } from "@/utils/basicFetch";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { name, type } = req.query;
    const baseUrl = `/armories/characters/${name}/${type}`;
    const data = await basicFetch(baseUrl, "GET");
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "로스트아크 점검중입니다" });
  }
}
