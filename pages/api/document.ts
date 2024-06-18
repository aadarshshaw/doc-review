import type { NextApiRequest, NextApiResponse } from "next";
import Document from "../../models/document";
import dbConnect from "../../utils/dbConnect";
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
      if (req.query.id) {
        const { id } = req.query;
        Document.findById(id)
          .then((doc: any) => {
            return res.status(200).json({ document: doc });
          })
          .catch((err: any) => {
            return res.status(500).json({ error: "Something went wrong" });
          });
      }
      if (req.query.user) {
        const { user } = req.query;
        Document.find({ user })
          .then((docs: any) => {
            return res.status(200).json({ documents: docs });
          })
          .catch((err: any) => {
            return res.status(500).json({ error: "Something went wrong" });
          });
      }

      if (req.query.reviewer) {
        const { reviewer } = req.query;
        Document.find({ reviewers: { $in: reviewer } })
          .then((docs: any) => {
            return res.status(200).json({ documents: docs });
          })
          .catch((err: any) => {
            return res.status(500).json({ error: "Something went wrong" });
          });
      }
      break;

    case "POST":
      const { title, url, user, reviewers } = req.body;
      const document = new Document({
        title,
        url,
        user,
        reviewers,
      });
      document
        .save()
        .then((doc: any) => {
          return res.status(200).json({ document: doc });
        })
        .catch((err: any) => {
          return res.status(500).json({ error: "Something went wrong" });
        });

      break;

    case "PUT":
      if (req.query.id && req.query.reviewer) {
        const { id, reviewer } = req.query;
        Document.findByIdAndUpdate(
          id,
          { $push: { reviewers: reviewer } },
          { new: true }
        )
          .then((doc: any) => {
            return res.status(200).json({ document: doc });
          })
          .catch((err: any) => {
            return res.status(500).json({ error: "Something went wrong" });
          });
      }
      if (req.query.doc_id && req.query.note_id) {
        const { doc_id, note_id } = req.query;
        Document.findByIdAndUpdate(
          doc_id,
          { $push: { notes: note_id } },
          { new: true }
        )
          .then((doc: any) => {
            return res.status(200).json({ document: doc });
          })
          .catch((err: any) => {
            return res.status(500).json({ error: "Something went wrong" });
          });
      }
      break;

    case "PATCH":
      if (req.body.id && req.body.title && req.body.reviewers) {
        const { id, title, reviewers } = req.body;
        Document.findByIdAndUpdate(id, { title, reviewers }, { new: true })
          .then((doc: any) => {
            return res.status(200).json({ document: doc });
          })
          .catch((err: any) => {
            return res.status(500).json({ error: "Something went wrong" });
          });
      }
      break;

    case "DELETE":
      if (req.query.id && req.query.reviewer) {
        const { id, reviewer } = req.query;
        Document.findByIdAndUpdate(
          id,
          { $pull: { reviewers: reviewer } },
          { new: true }
        )
          .then((doc: any) => {
            return res.status(200).json({ document: doc });
          })
          .catch((err: any) => {
            return res.status(500).json({ error: "Something went wrong" });
          });
      } else {
        const { id: deleteId } = req.query;
        Document.findByIdAndDelete(deleteId)
          .then((doc: any) => {
            return res.status(200).json({ document: doc });
          })
          .catch((err: any) => {
            return res.status(500).json({ error: "Something went wrong" });
          });
      }
      break;
    default:
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
