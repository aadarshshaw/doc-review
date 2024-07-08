import { DocumentInterface } from "@/interface/document";
import axios from "axios";
import { enqueueSnackbar } from "notistack";

interface Props {
  title: string;
  name: string;
  reviewers: string[];
  handleCloseReminderModal: () => void;
}


const content = (sender: string, title: string) => `<div>
    <h1>Hi!</h1>
    <p>
      You have been invited by ${sender} to review the following document: ${title}
    </p>
    <p>Please go to docreview.vercel.app to review.</p>

    <p>Thank you!</p>

    <p>DocReview Team</p>
  </div>`;


const handleReminders = async (props: Props): Promise<any> => {
  axios
    .post("/api/mail", {
      subject: `Request to Review ${props.title}`,
      content: content(props.name, props.title),
      emails: props.reviewers,
    })
    .then(() => {
      enqueueSnackbar("Reminder sent successfully", {
        variant: "success",
      });
    })
    .catch((err) => {
      enqueueSnackbar(err, {
        variant: "error",
      });
    });
  props.handleCloseReminderModal();
};
export default handleReminders;
