import { NextApiRequest, NextApiResponse } from "next";

import { withApiSession } from "@libs/server/withSession";
import db from "@libs/server/db";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method != "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end();
  } else {
    try {
      const favTweets = await db.fav.findMany({
        where: {
          userId: req.session.user?.id,
        },
        include: {
          tweet: {
            include: {
              author: {
                select: { name: true },
              },
              _count: {
                select: { favs: true },
              },
            },
          },
        },
      });

      const tweets = favTweets.map((fav) => fav.tweet);
      return res.status(200).json({ tweets, ok: true });
    } catch {
      return res.status(500).json({ message: "트윗조회에 실패했습니다." });
    }
  }
}

export default withApiSession(handler);
