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
    subject: `Request to review ${req.body.title}`,
    text: "",
    html: `<div>
    <h1>Hi!</h1>
    <p>
      You have been invited by ${req.body.sender} to review the following document: ${req.body.title}
    </p>
    <p>Please go to docreview.vercel.app to review.</p>

    <p>Thank you!</p>

    <p>DocReview Team</p>
  </div>`,
  });

  console.log("Message sent: %s", info.messageId);
  res.status(200).json({ message: "Email Sent" });
};
