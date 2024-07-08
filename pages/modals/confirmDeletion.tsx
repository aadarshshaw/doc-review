import { Box, Stack, Typography, Button } from "@mui/material";
import React from "react";

const style = {
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
    );
  }
);

ConfirmDeletion.displayName = "ConfirmDeletion";

export default ConfirmDeletion;
