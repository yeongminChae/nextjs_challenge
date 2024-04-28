import { NextApiRequest, NextApiResponse } from "next";

import { withApiSession } from "@libs/server/withSession";
import db from "@libs/server/db";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method == "GET") {
    try {
      const profile = await db.user.findUnique({
        where: {
          id: req.session.user?.id,
        },
      });

      if (!profile) {
        return res.status(404).json({ ok: false });
      }

      return res.status(200).json({ profile, ok: true });
    } catch (error) {
      return res.status(500).json({ message: "data가 없습니다", ok: false });
    }
  } else if (req.method == "POST") {
    try {
      req.session.destroy();
      return res.status(200).json({ ok: true });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "로그아웃 중 에러가 발생했습니다.", ok: false });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end().json({ ok: false });
  }
}

export default withApiSession(handler);
