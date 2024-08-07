import { UserInterface } from "@/interface/user";
import { Box, Stack, Typography, TextField, Autocomplete } from "@mui/material";
import { Button } from "@mui/material";
import React, { useState } from "react";
import TitleCase from "@/utils/titleCase";

const style = {
  bgcolor: "#f2f7fa",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const CreateDocument = React.forwardRef(
  (
    {
      modalTitle,
      setModalTitle,
      setModalReviewers,
      setModalFile,
      handleSubmit,
      userOptions,
    }: {
      modalTitle: string;
      setModalTitle: React.Dispatch<React.SetStateAction<string>>;
      setModalReviewers: React.Dispatch<React.SetStateAction<string[]>>;
      setModalFile: React.Dispatch<React.SetStateAction<File | null>>;
      handleSubmit: () => void;
      userOptions: UserInterface[];
    },
    ref
  ) => {
    const [selectedReviewers, setSelectedReviewers] = useState<UserInterface[]>(
      []
    );
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
            value={selectedReviewers}
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option.email
            }
            renderOption={(props, option) => (
              <li {...props}>
                <Typography>
                  <span>{TitleCase(option.name)}</span>
                  <br></br>
                  <span
                    style={{
                      fontSize: 12,
                      opacity: 0.7,
                    }}
                  >
                    {option.email}
                  </span>
                </Typography>
              </li>
            )}
            onChange={(e, value) => {
              setSelectedReviewers(value as UserInterface[]);
              setModalReviewers(
                value.map((item) =>
                  typeof item === "string" ? item : item.email
                )
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Reviewers"
                required
              />
            )}
          />
          <Typography
            sx={{
              fontStyle: "italic",
              opacity: 0.5,
              fontSize: 12,
            }}
          >
            All reviewers will be notified by email
          </Typography>
          <Typography variant="h6">Upload File</Typography>
          <Button variant="contained" component="label">
            <input
              type="file"
              accept="application/pdf"
              style={{
                alignSelf: "center",
              }}
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
