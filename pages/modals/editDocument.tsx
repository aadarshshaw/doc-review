import { UserInterface } from "@/interface/user";
import TitleCase from "@/utils/titleCase";
import { Box, Stack, Typography, TextField, Autocomplete } from "@mui/material";
import { Button } from "@mui/material";
import React, { useState } from "react";

const style = {
  bgcolor: "#f2f7fa",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const EditDocument = React.forwardRef(
  (
    {
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
    },
    ref
  ) => {
    const [selectedReviewers, setSelectedReviewers] = useState<UserInterface[]>(
      userOptions.filter((user) => modalReviewers.includes(user.email))
    );
    return (
      <Box sx={style} ref={ref}>
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
          <Button variant="contained" onClick={handleEdit}>
            Edit
          </Button>
        </Stack>
      </Box>
    );
  }
);

EditDocument.displayName = "EditDocument";

export default EditDocument;
