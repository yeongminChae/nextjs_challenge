import { NextApiRequest, NextApiResponse } from "next";

import { withApiSession } from "@libs/server/withSession";
import db from "@libs/server/db";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method != "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end();
  } else {
    const {
      query: { id },
      session: { user },
    } = req;

    try {
      const tweets = await db.tweet.findUnique({
        where: {
          id: Number(id),
        },
        include: {
          _count: {
            select: {
              favs: true,
            },
          },
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      const isLiked = Boolean(
        await db.fav.findFirst({
          where: {
            tweetId: Number(id),
            userId: user?.id,
          },
          select: {
            id: true,
          },
        })
      );

      return res.status(200).json({ tweets, isLiked, ok: true });
    } catch {
      return res.status(500).json({ message: "트윗조회에 실패했습니다." });
    }
  }
}

export default withApiSession(handler);
