import {
  Box,
  Stack,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import React, { useState } from "react";
import handleReminders from "../../callbacks/home/handleReminders";

const style = {
  bgcolor: "#f2f7fa",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const SendReminders = React.forwardRef(
  (
    {
      author,
      title,
      reviewers,
      handleCloseReminderModal,
    }: {
      author: string;
      title: string;
      reviewers: string[];
      handleCloseReminderModal: () => void;
    },
    ref
  ) => {
    const [selectedEmails, setSelectedEmails] = useState<string[]>([]);

    return (
      <Box sx={style} ref={ref}>
        <Stack spacing={2}>
          <Typography variant="h5">Send Reminders</Typography>
          <FormGroup>
            {reviewers &&
              reviewers.map((reviewer) => (
                <FormControlLabel
                  key={reviewer}
                  control={<Checkbox />}
                  label={reviewer}
                  onChange={(e) => {
                    if ((e.target as HTMLInputElement).checked) {
                      setSelectedEmails([...selectedEmails, reviewer]);
                    } else {
                      setSelectedEmails(
                        selectedEmails.filter((email) => email !== reviewer)
                      );
                    }
                  }}
                />
              ))}
          </FormGroup>
          <Stack direction={"row"} spacing={2}>
            <Button
              variant="outlined"
              fullWidth
              onClick={handleCloseReminderModal}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="info"
              fullWidth
              onClick={() =>
                handleReminders({
                  name: author,
                  reviewers: selectedEmails,
                  handleCloseReminderModal,
                  title,
                })
              }
              disabled={selectedEmails.length === 0}
            >
              Send
            </Button>
          </Stack>
        </Stack>
      </Box>
    );
  }
);

SendReminders.displayName = "SendReminders";

export default SendReminders;
