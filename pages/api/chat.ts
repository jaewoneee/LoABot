/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest } from "next";
import { BASE_URL } from "../../config/constants";

export default async function handler(req: NextApiRequest, res: any) {
  const { msg, stage, select } = req.body;

  res?.socket?.server?.io?.emit("message", msg);
  res.status(201).json(msg);
}
