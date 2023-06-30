import type { NextApiRequest, NextApiResponse } from "next";
import Document from "../../models/document";
import dbConnect from "../../utils/dbConnect";

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
        Document.findById(id, (err: any, doc: any) => {
          if (err) {
            res.status(500).json({ error: "Something went wrong" });
          } else {
            res.status(200).json({ document: doc });
          }
          
        });
      }
      if (req.query.user) {
        const { user } = req.query;
        Document.find({ user })
          .then((docs: any) => {
            res.status(200).json({ documents: docs });
          })
          .catch((err: any) => {
            res.status(500).json({ error: "Something went wrong" });
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
          res.status(200).json({ document: doc });
        })
        .catch((err: any) => {
          res.status(500).json({ error: "Something went wrong" });
        });

      break;
    case "DELETE":
      const { id: deleteId } = req.query;
      Document.findByIdAndDelete(deleteId, (err: any, doc: any) => {
        if (err) {
          res.status(500).json({ error: "Something went wrong" });
        } else {
          res.status(200).json({ document: doc });
        }
      });
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
