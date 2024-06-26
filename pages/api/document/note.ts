import dbConnect from "@/utils/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";
import Document from "@/models/document";

export const config = {
  api: {
    externalResolver: true,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  switch (method) {
    case "POST":
      await Post(req, res);
      break;
    case "PUT":
      await Put(req, res);
      break;
    case "DELETE":
      await Delete(req, res);
      break;
    default:
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

export async function Post(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const { doc_id, content, quote, highlightAreas, addedBy } = req.body;
  const newNote = {
    content,
    quote,
    highlightAreas,
    addedBy,
    resolved: false,
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
}

export async function Put(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const { document_id, note_id, resolved } = req.body;
  Document.findByIdAndUpdate(document_id)
    .then((doc: any) => {
      doc.notes = doc.notes.map((note: any) => {
        if (note._id == note_id) {
          note.resolved = resolved;
        }
        return note;
      });
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
}

export async function Delete(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const { document_id, note_id } = req.query;
  Document.findByIdAndUpdate(document_id)
    .then((doc: any) => {
      doc.notes = doc.notes.filter((note: any) => note._id != note_id);
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
}
