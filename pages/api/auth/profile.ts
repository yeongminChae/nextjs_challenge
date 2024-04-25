import { NextApiRequest, NextApiResponse } from "next";

import { withApiSession } from "@libs/withSession";
import db from "@libs/db";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method != "GET") {
    res.setHeader("Allow", ["GET"]);

    return res.status(405).end().json({ ok: false });
  } else {
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
  }
}

export default withApiSession(handler);
