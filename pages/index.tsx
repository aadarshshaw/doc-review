import {
  AppBar,
  Box,
  Button,
  Grid,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import Image from "next/image";
import { signIn } from "next-auth/react";

export default function Landing() {
  const theme = useTheme();
  const matches = theme.breakpoints.up("sm");
  return (
    <Box
      sx={{
        padding: 2,
        px: { md: 10, xs: 2 },
        height: "102vh",
        backgroundColor: "#f2f7fa",
      }}
    >
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: "transparent",
          shadow: "none !important",
        }}
      >
        <Stack direction={"row"} spacing={2}>
          <IconButton>
            <ArticleIcon
              style={{
                fontSize: 40,
                color: "#4944cd",
              }}
            />
            DocReview
          </IconButton>
          <Button
            variant="contained"
            color="info"
            sx={{
              borderRadius: 0,
              marginLeft: "auto !important",
              backgroundColor: "#4944cd",
              textTransform: "none",
              px: 5,
            }}
            onClick={() => signIn("google", { callbackUrl: "/home" })}
          >
            Sign In
          </Button>
        </Stack>
      </AppBar>
      <Grid
        container
        spacing={2}
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: { xs: 2, md: 10, lg: "auto" },
        }}
      >
        <Grid item xs={12}></Grid>
        <Grid
          item
          md={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            textAlign: { xs: "center", md: "left" },
            alignContent: "center",
          }}
        >
          <Stack direction={"column"} spacing={2}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: "800",
              }}
            >
              Document Reviewing Made Easy
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "400",
              }}
            >
              DocReview is a web app that allows you to upload documents and
              have them reviewed by your peers.
            </Typography>
            <Button
              variant="contained"
              color="info"
              sx={{
                width: 200,
                borderRadius: 0,
                backgroundColor: "#4944cd",
                alignSelf: { xs: "center", md: "flex-start" },
              }}
              onClick={() => signIn("google", { callbackUrl: "/home" })}
            >
              Get Started
            </Button>
          </Stack>
        </Grid>
        {matches && (
          <Grid item md={6} xs={12}>
            <Image
              src="/landing.png"
              alt="landing page image"
              width={583}
              height={428}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
