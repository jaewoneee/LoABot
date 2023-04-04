/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest } from "next";

export default async function handler(req: NextApiRequest, res: any) {
  const { msg, id, data, shared } = req.body;

  res?.socket?.server?.io?.emit("message", { id, msg, data, shared });
  res.status(201).json({ id, msg, data });
}
