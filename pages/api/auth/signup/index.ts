import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

import db from "@libs/server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end();
  } else {
    const { email, name, password } = req.body;

    try {
      const existUser = await db.user.findUnique({
        where: {
          email,
        },
      });

      if (existUser) {
        return res.status(409).json({ message: "이미 존재하는 이메일입니다." });
      }

      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await db.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
        },
      });

      return res.status(201).json({ newUser, ok: true });
    } catch {
      return res.status(500).json({ message: "회원가입에 실패했습니다." });
    }
  }
}
