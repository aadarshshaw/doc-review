import dbConnect from "@/utils/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";
import User from "@/models/user";

export const config = {
  api: {
    externalResolver: true,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();
  const { method } = req;
  switch (method) {
    case "GET":
      User.find({})
        .then((users: any) => {
          return res.status(200).json({ users });
        })
        .catch((err: any) => {
          return res.status(500).json({ error: err });
        });
      break;
    case "POST":
      const { name, email, image } = req.body;
      const newUser = new User({
        name,
        email,
        image,
      });
      newUser
        .save()
        .then((user: any) => {
          return res.status(200).json({ user });
        })
        .catch((err: any) => {
          return res.status(500).json({ error: err });
        });
      break;
    default:
      res.status(400).json({ message: "Invalid method" });
      break;
  }
}
