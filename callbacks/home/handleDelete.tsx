import { DocumentInterface } from "@/interface/document";
import axios from "axios";
import { enqueueSnackbar } from "notistack";

interface Props {
  documents: DocumentInterface[];
  setDocuments: React.Dispatch<React.SetStateAction<DocumentInterface[]>>;
  clearModal: () => void;
  setOpenDeleteConfirmationModal: React.Dispatch<React.SetStateAction<boolean>>;
  docId: string;
}

const handleDelete = async (props: Props) => {
  const document = props.documents.find(
    (doc) => doc._id === props.docId
  ) as DocumentInterface;
  const newDocuments = props.documents.filter((doc) => doc._id !== props.docId);
  axios
    .delete("/api/cloudinary", { params: { url: document.url } })
    .then(() => {
      axios
        .delete("/api/document", { params: { id: props.docId } })
        .then(() => {
          props.setDocuments(newDocuments);
          enqueueSnackbar("Document deleted successfully", {
            variant: "warning",
          });
        })
        .catch((err) => {
          enqueueSnackbar(err, {
            variant: "error",
          });
        });
    })
    .catch((err) => {
      enqueueSnackbar(err, {
        variant: "error",
      });
    });
  props.setOpenDeleteConfirmationModal(false);
};

export default handleDelete;
