import { UserInterface } from "@/interface/user";
import { Box, Stack, Typography, TextField, Autocomplete } from "@mui/material";
import { Button } from "@mui/material";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#f2f7fa",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default function EditDocument({
  modalTitle,
  setModalTitle,
  modalReviewers,
  setModalReviewers,
  userOptions,
  handleEdit,
}: {
  modalTitle: string;
  setModalTitle: (title: string) => void;
  modalReviewers: string[];
  setModalReviewers: (reviewers: string[]) => void;
  userOptions: UserInterface[];
  handleEdit: () => void;
}) {
  return (
    <Box sx={style}>
      <Stack spacing={2}>
        <Typography variant="h5">Edit Document</Typography>
        <TextField
          required
          id="outlined-basic"
          label="Title"
          variant="standard"
          value={modalTitle}
          onChange={(e) => setModalTitle(e.target.value)}
        />
        <Autocomplete
          multiple
          id="tags-standard"
          options={userOptions}
          defaultValue={[]}
          freeSolo
          value={modalReviewers}
          onChange={(e, value) => setModalReviewers(value as string[])}
          renderInput={(params) => (
            <TextField {...params} variant="standard" label="Reviewers" />
          )}
        />
        <Button variant="contained" onClick={handleEdit}>
          Edit
        </Button>
      </Stack>
    </Box>
  );
}
