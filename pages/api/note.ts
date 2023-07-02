import note from "@/models/note";
import dbConnect from "@/utils/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();
  const { method } = req;
  switch (method) {
    case "GET":
      if (req.query.id) {
        const { id } = req.query;
        note
          .findById(id)
          .then((note: any) => {
            return res.status(200).json({ note: note });
          })
          .catch((err: any) => {
            return res.status(500).json({ error: err });
          });
      } else {
        return res.status(400).json({ message: "Invalid method" });
      }
      break;
    case "POST":
      const { content, quote, highlightAreas, addedBy } = req.body;
      const newNote = new note({
        content,
        quote,
        highlightAreas,
        addedBy,
      });
      newNote
        .save()
        .then((note: any) => {
          return res.status(200).json({ note: note });
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
