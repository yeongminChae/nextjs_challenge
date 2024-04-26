import { NextApiRequest, NextApiResponse } from "next";

import { withApiSession } from "@libs/server/withSession";
import db from "@libs/server/db";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method != "GET") {
    res.setHeader("Allow", ["GET"]);

    return res.status(405).end().json({ ok: false });
  } else {
    try {
      const tweets = await db.tweet.findMany({
        include: {
          _count: {
            select: {
              favs: true,
            },
          },
        },
      });

      if (!tweets) {
        return res.status(404).json({ ok: false });
      }

      return res.status(200).json({ tweets, ok: true });
    } catch (error) {
      return res.status(500).json({ message: "data가 없습니다", ok: false });
    }
  }
}

export default withApiSession(handler);
