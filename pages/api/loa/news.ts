import { NOTICE } from "@/config/constants";
import type { NextApiRequest, NextApiResponse } from "next";
import { basicFetch } from "@/utils/basicFetch";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { type } = req.query;
    const baseUrl = `/news/${type}`;
    let data = await basicFetch(baseUrl, "GET");

    if (type === NOTICE) {
      data = data.slice(0, 5);
    }
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "로스트아크 점검중입니다" });
  }
}
