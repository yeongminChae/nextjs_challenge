import { NextApiRequest, NextApiResponse } from "next";

import { withApiSession } from "@libs/server/withSession";
import db from "@libs/server/db";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method != "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end();
  } else {
    const {
      body: { title, content },
      session: { user },
    } = req;

    try {
      const newTweet = await db.tweet.create({
        data: {
          title,
          content,
          author: {
            connect: {
              id: user?.id,
            },
          },
        },
      });

      return res.status(201).json({ newTweet, ok: true });
    } catch {
      return res.status(500).json({ message: "트윗생성에 실패했습니다." });
    }
  }
}

export default withApiSession(handler);
