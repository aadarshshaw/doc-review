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
      if (req.query.emails) {
        const emails: string[] = (await JSON.parse(
          req.query.emails as string
        )) as string[];
        User.find({ email: { $in: emails } })
          .then((users: any) => {
            const data = users.map((user: any) => {
              return {
                name: user.name,
                email: user.email,
                image: user.image,
              };
            });
            return res.status(200).json({ data });
          })
          .catch((err: any) => {
            return res.status(500).json({ error: err });
          });
        break;
      }
      if (req.query.all) {
        User.find({}).sort({ name: 1 })
          .then((users: any) => {
            return res.status(200).json({ users });
          })
          .catch((err: any) => {
            return res.status(500).json({ error: err });
          });
        break;
      }
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
