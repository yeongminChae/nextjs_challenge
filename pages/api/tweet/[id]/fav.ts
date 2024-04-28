import { NextApiRequest, NextApiResponse } from "next";

import { withApiSession } from "@libs/server/withSession";
import db from "@libs/server/db";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method != "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end();
  } else {
    const {
      query: { id },
      session: { user },
    } = req;

    try {
      const favoritesSoFar = await db.fav.findFirst({
        where: {
          tweetId: Number(id),
          userId: user?.id,
        },
      });

      if (favoritesSoFar) {
        await db.fav.delete({
          where: {
            id: favoritesSoFar.id,
          },
        });
      } else {
        await db.fav.create({
          data: {
            user: {
              connect: {
                id: user?.id,
              },
            },
            tweet: {
              connect: {
                id: Number(id),
              },
            },
          },
        });
      }

      res
        .status(200)
        .json({ message: "좋아요가 업데이트 되었습니다", ok: true });
    } catch {
      return res.status(500).json({ message: "트윗조회에 실패했습니다." });
    }
  }
}

export default withApiSession(handler);
