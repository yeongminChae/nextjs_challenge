import { NextApiRequest, NextApiResponse } from "next";

import bcrypt from "bcrypt";

import { withApiSession } from "@libs/server/withSession";
import db from "@libs/server/db";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method != "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end();
  } else {
    const { email, password } = req.body;

    try {
      const user = await db.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        return res.status(404).json({ message: "존재하지 않는 사용자입니다." });
      }

      const pwComparison = await bcrypt.compare(password, user.password);
      if (!pwComparison) {
        return res
          .status(401)
          .json({ message: "비밀번호가 일치하지 않습니다." });
      }

      req.session.user = {
        id: user.id,
      };
      await req.session.save();

      return res.status(200).json({ user, ok: true });
    } catch {
      return res.status(500).json({ message: "로그인에 실패했습니다." });
    }
  }
}

export default withApiSession(handler);
