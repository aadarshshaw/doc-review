import axios from "axios";
import { enqueueSnackbar } from "notistack";

interface Props {
  title: string;
  reviewer: string;
  author: string;
}

const content = (reviewer: string, title: string) => `<div>
    <h1>Hi!</h1>
    <p>
      Your document titled <b>${title}</b> has been reviewed by ${reviewer}!
    </p>

    <p>Warm Regards,</p>

    <p>DocReview Team</p>
  </div>`;

const handleAuthorNotify = async (props: Props): Promise<any> => {
  axios
    .post("/api/mail", {
      subject: `Reviewed document ${props.title}`,
      content: content(props.reviewer, props.title),
      emails: props.author,
    })
    .then(() => {
      enqueueSnackbar("Notification sent", {
        variant: "success",
      });
    })
    .catch((err) => {
      enqueueSnackbar(err, {
        variant: "error",
      });
    });
};
export default handleAuthorNotify;
