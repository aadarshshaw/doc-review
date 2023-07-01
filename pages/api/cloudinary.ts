import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { generateSHA1, generateSignature } from "@/utils/generateSignature";
import getPublicIdFromUrl from "@/utils/getPublicIdFromUrl";
import cloudinary from "@/config/cloudinary";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const formData = new FormData();
  switch (method) {
    case "POST":
      formData.append("file", req.body.file);
      formData.append("upload_preset", "pbr-files");
      cloudinary.uploader
        .upload(req.body.file, req.body.upload_preset)
        .then((result: any) => {
          return res.status(200).json({ result });
        });
      break;

    case "DELETE":
      const { url } = req.query;
      const publicId = getPublicIdFromUrl(url as string);
      const signature = generateSHA1(
        generateSignature(
          publicId as string,
          process.env.CLOUDINARY_API_SECRET as string
        )
      );
      formData.append("public_id", publicId as string);
      formData.append("upload_preset", "pbr-files");
      formData.append("signature", signature);
      formData.append("api_key", process.env.CLOUDINARY_API_KEY as string);
      formData.append("timestamp", new Date().getTime().toString());
      cloudinary.uploader.destroy(publicId as string).then((result: any) => {
        return res.status(200).json({ result });
      });
      break;
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}
