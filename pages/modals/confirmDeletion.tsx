import { Box, Stack, Typography, Button, DialogContent } from "@mui/material";
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
const ConfirmDeletion = React.forwardRef(
  (
    {
      handleCloseDeleteConfirmationModal,
      handleDelete,
    }: {
      handleCloseDeleteConfirmationModal: () => void;
      handleDelete: () => void;
    },
    ref
  ) => {
    return (
      <DialogContent>
        <Box sx={style} ref={ref}>
          <Stack spacing={2}>
            <Typography variant="h5">Confirm Deletion</Typography>
            <Stack direction={"row"} spacing={2}>
              <Button
                variant="contained"
                color="error"
                onClick={handleDelete}
                fullWidth
              >
                Yes
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={handleCloseDeleteConfirmationModal}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </Box>
      </DialogContent>
    );
  }
);

export default ConfirmDeletion;
