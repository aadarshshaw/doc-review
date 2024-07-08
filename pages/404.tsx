import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";

const NotFound = () => {
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
      <Image
        src="/error_404.png"
        alt="unauthorized"
        width={800}
        height={500}
        unoptimized
      />

      <Typography
        variant="h5"
        sx={{
          fontWeight: "600",
          textAlign: "center",
        }}
      >
        Page Not Found
      </Typography>

      <Typography
        variant="body1"
        sx={{
          textAlign: "center",
        }}
      >
        The page you are looking for does not exist
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          window.location.href = "/home";
        }}
      >
        Go Home
      </Button>
    </Box>
  );
};

export default NotFound;
