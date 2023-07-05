import { Box, Stack, Typography } from "@mui/material";
import React from "react";

const HomeFeature = ({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) => {
  return (
    <Stack
      sx={{
        borderRadius: 2,
        padding: 2,
        height: "100%",
        textAlign: "center",
        alignItems: "center",
      }}
    >
      {icon}
      <Typography
        variant="h5"
        sx={{
          fontWeight: "600",
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontWeight: "400",
          color: "grey"
        }}
      >
        {description}
      </Typography>
    </Stack>
  );
};

export default HomeFeature;
