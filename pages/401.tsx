import { Box, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";

const Unauthorized = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        height: `calc(100vh - 70px)`,
      }}
    >
      <Image src="/error_401.png" alt="unauthorized" width={800} height={600} />

      <Typography
        variant="h5"
        sx={{
          fontWeight: "600",
          textAlign: "center",
        }}
      >
        Unauthorized
      </Typography>

      <Typography
        variant="body1"
        sx={{
          textAlign: "center",
        }}
      >
        You do not have permission to access this page
      </Typography>
    </Box>
  );
};

export default Unauthorized;
