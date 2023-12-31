import { UserInterface } from "@/interface/user";
import { Box, Stack, Typography, TextField, Autocomplete } from "@mui/material";
import { Button } from "@mui/material";
import React from "react";

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

const CreateDocument = React.forwardRef(
  ({
    modalTitle,
    setModalTitle,
    modalReviewers,
    setModalReviewers,
    setModalFile,
    handleSubmit,
    userOptions,
  }: {
    modalTitle: string;
    setModalTitle: React.Dispatch<React.SetStateAction<string>>;
    modalReviewers: string[];
    setModalReviewers: React.Dispatch<React.SetStateAction<string[]>>;
    setModalFile: React.Dispatch<React.SetStateAction<File | null>>;
    handleSubmit: () => void;
    userOptions: UserInterface[];
  }, ref) => {
    return (
      <Box sx={style} ref={ref}>
        <Stack spacing={2}>
          <Typography variant="h5">New Document</Typography>
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
          <Typography variant="h6">Upload File</Typography>
          <Button variant="contained" component="label">
            <input
              type="file"
              accept="pdf"
              onChange={(e) =>
                setModalFile(e.target.files ? e.target.files[0] : null)
              }
            />
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            Create
          </Button>
        </Stack>
      </Box>
    );
  }
);

CreateDocument.displayName = "CreateDocument";

export default CreateDocument;
