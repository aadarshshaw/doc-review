import { DocumentInterface } from "@/interface/document";
import axios from "axios";
import { enqueueSnackbar } from "notistack";

interface Props {
  title: string;
  name: string;
  reviewers: string[];
  handleCloseReminderModal: () => void;
}

const handleReminders = async (props: Props): Promise<any> => {
  axios
    .post("/api/mail", {
      title: props.title,
      sender: props.name,
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
