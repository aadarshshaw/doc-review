import dbConnect from "@/utils/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";
import Document from "@/models/document";
export const config = {
  api: {
    externalResolver: true,
  },
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();
  const { method } = req;
  switch (method) {
    case "PUT":
      const { doc_id, content, quote, highlightAreas, addedBy } = req.body;
      const newNote = {
        content,
        quote,
        highlightAreas,
        addedBy,
      };
      Document.findByIdAndUpdate(doc_id)
        .then((doc: any) => {
          doc.notes.push(newNote);
          doc
            .save()
            .then((doc: any) => {
              return res.status(200).json({ document: doc });
            })
            .catch((err: any) => {
              return res.status(500).json({ error: err });
            });
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
