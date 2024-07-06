import { DocumentInterface } from "@/interface/document";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import handleReminders from "./handleReminders";

interface Props {
  modalFile: File | null;
  modalTitle: string;
  userEmail: string;
  modalReviewers: string[];
  setDocuments: React.Dispatch<React.SetStateAction<DocumentInterface[]>>;
  clearModal: () => void;
  setOpenCreateModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const handleSubmit = async (props: Props): Promise<any> => {
  if (!props.modalFile) {
    return;
  }
  if (!props.modalTitle) {
    return;
  }
  const formData = new FormData();
  formData.append("file", props.modalFile as File);
  formData.append("upload_preset", "pbr-files");
  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/dqf3db9zz/image/upload`,
    formData
  );

  axios
    .post("/api/document", {
      title: props.modalTitle,
      url: response.data.url,
      user: props.userEmail,
      reviewers: props.modalReviewers,
    })
    .then((res) => res.data)
    .then((data) => {
      handleReminders({
        title: props.modalTitle,
        name: props.userEmail,
        reviewers: props.modalReviewers,
        handleCloseReminderModal: () => {},
      })
        .then(() => {
          props.setDocuments((prev) => [...prev, data.document]);
          enqueueSnackbar("Document created successfully", {
            variant: "success",
          });
          props.clearModal();
        })
        .catch((err) => {
          enqueueSnackbar(err, { variant: "error" });
        });
    });
  props.setOpenCreateModal(false);
};
export default handleSubmit;
