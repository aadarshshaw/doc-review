import { DocumentInterface } from "@/interface/document";
import axios from "axios";
import { enqueueSnackbar } from "notistack";

interface Props {
  modalTitle: string;
  modalReviewers: string[];
  setDocuments: React.Dispatch<React.SetStateAction<DocumentInterface[]>>;
  clearModal: () => void;
  setOpenEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  docId: string;
}

const handleEdit = async (props: Props) => {
  if (!props.modalTitle) {
    return;
  }
  axios
    .patch("/api/document", {
      id: props.docId,
      title: props.modalTitle,
      reviewers: props.modalReviewers,
    })
    .then((res) => {
      props.setDocuments((prev) => {
        const newDocuments = [...prev];
        const index = newDocuments.findIndex((doc) => doc._id === props.docId);
        newDocuments[index] = res.data.document;
        return newDocuments;
      });
      enqueueSnackbar("Document edited successfully", {
        variant: "success",
      });
      props.clearModal();
    })
    .catch((err) => {
      enqueueSnackbar(err, {
        variant: "error",
      });
    });
  props.setOpenEditModal(false);
};

export default handleEdit;
