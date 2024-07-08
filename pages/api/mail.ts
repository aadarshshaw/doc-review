import type { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const nodemailer = require("nodemailer");

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  const info = await transporter.sendMail({
    from: "DocReview Team <aadarshshaw13@gmail.com>",
    to: req.body.emails,
    subject: req.body.subject,
    text: "",
    html: req.body.content,
  });

  console.log("Message sent: %s", info.messageId);
  res.status(200).json({ message: "Email Sent" });
};
