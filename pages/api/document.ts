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
  const { method, query, body } = req;
  switch (method) {
    case "GET": {
      const { id, reviewer, user } = query;
      getDocuments(id as string, reviewer as string, user as string, res);
      break;
    }

    case "POST": {
      const { title, url, user, reviewers } = body;
      createDocument(title, url, user, reviewers, res);
      break;
    }

    case "PUT": {
      const { doc_id, reviewer, note_id } = query;
      updateDocuments(
        doc_id as string,
        reviewer as string,
        note_id as string,
        res
      );
      break;
    }

    case "PATCH": {
      const {
        id: documentId,
        title: updatedTitle,
        reviewers: updatedReviewers,
      } = body;
      patchDocument(documentId, updatedTitle, updatedReviewers, res);
      break;
    }

    case "DELETE": {
      const { id: deleteId, reviewer: deleteReviewer } = query;
      deleteDocument(deleteId as string, deleteReviewer as string, res);
      break;
    }

    default:
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function getDocuments(
  id: string,
  reviewer: string,
  user: string,
  res: NextApiResponse
) {
  try {
    if (id && reviewer) {
      const document = await Document.findById(id);
      if (!document.reviewers.includes(reviewer)) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      return res.status(200).json({ document });
    }
    if (user) {
      const documents = await Document.find({ user });
      return res.status(200).json({ documents });
    }
    if (reviewer) {
      const documents = await Document.find({ reviewers: { $in: reviewer } });
      return res.status(200).json({ documents });
    }
  } catch (err) {
    return res.status(500).json({ error: err });
  }
}

async function createDocument(
  title: string,
  url: string,
  user: string,
  reviewers: string[],
  res: NextApiResponse
) {
  try {
    const document = new Document({ title, url, user, reviewers });
    const createdDocument = await document.save();
    return res.status(200).json({ document: createdDocument });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
}

async function updateDocuments(
  doc_id: string,
  reviewer: string,
  note_id: string,
  res: NextApiResponse
) {
  try {
    if (reviewer) {
      const updatedDocument = await Document.findByIdAndUpdate(
        doc_id,
        { $push: { reviewers: reviewer } },
        { new: true }
      );
      return res.status(200).json({ document: updatedDocument });
    }
    if (note_id) {
      const updatedDocument = await Document.findByIdAndUpdate(
        doc_id,
        { $push: { notes: note_id } },
        { new: true }
      );
      return res.status(200).json({ document: updatedDocument });
    }
  } catch (err) {
    return res.status(500).json({ error: err });
  }
}

async function patchDocument(
  documentId: string,
  updatedTitle: string,
  updatedReviewers: string[],
  res: NextApiResponse
) {
  try {
    const updatedDocument = await Document.findByIdAndUpdate(
      documentId,
      { title: updatedTitle, reviewers: updatedReviewers },
      { new: true }
    );
    return res.status(200).json({ document: updatedDocument });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
}

async function deleteDocument(
  deleteId: string,
  deleteReviewer: string,
  res: NextApiResponse
) {
  try {
    if (deleteReviewer) {
      const updatedDocument = await Document.findByIdAndUpdate(
        deleteId,
        { $pull: { reviewers: deleteReviewer } },
        { new: true }
      );
      return res.status(200).json({ document: updatedDocument });
    } else {
      const deletedDocument = await Document.findByIdAndDelete(deleteId);
      return res.status(200).json({ document: deletedDocument });
    }
  } catch (err) {
    return res.status(500).json({ error: err });
  }
}
