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
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ReviewsIcon from '@mui/icons-material/Reviews';
import TimelineIcon from '@mui/icons-material/Timeline';
import ShieldIcon from '@mui/icons-material/Shield';
import Image from "next/image";
import { signIn } from "next-auth/react";
import HomeFeature from "./components/home_features";

export default function Landing() {
  const theme = useTheme();
  const matches = theme.breakpoints.up("sm");
  return (
    <Box
      sx={{
        padding: 2,
        px: { md: 10, xs: 2 },
        height: "100vh",
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
                color: "grey",
              }}
            >
              DocReview is a web app that allows you to upload documents and
              have them reviewed by your peers.
            </Typography>
            <Stack
              direction={"row"}
              spacing={2}
              sx={{
                marginTop: 2,
                justifyContent: { xs: "center", md: "flex-start" },
              }}
            >
              <Button
                variant="contained"
                color="info"
                sx={{
                  width: 200,
                  fontWeight: "600",
                  borderRadius: 0,
                  backgroundColor: "#4944cd",
                  alignSelf: { xs: "center", md: "flex-start" },
                }}
                onClick={() => signIn("google", { callbackUrl: "/home" })}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                color="info"
                sx={{
                  width: 200,
                  borderRadius: 0,
                  border: "2px solid #4944cd",
                  fontWeight: "600",
                  color: "#4944cd",
                  alignSelf: { xs: "center", md: "flex-start" },
                  ":hover": {
                    border: "2px solid #7b52ff",
                  },
                }}
                onClick={() => signIn("google", { callbackUrl: "/home" })}
              >
                Learn More
              </Button>
            </Stack>
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
      <Typography
        variant="h4"
        sx={{
          fontWeight: "800",
          marginTop: 10,
          textAlign: "center",
        }}
      >
        Features
      </Typography>
      <Grid
        container
        spacing={2}
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: 2,
          backgroundColor: "#f2f7fa",
        }}
      >
        <Grid item md={3} sm={6} xs={12}>
          <HomeFeature
            title="Upload Documents"
            description="Upload documents in the cloud and have them available anywhere and at anytime"
            icon={
              <div
                style={{
                  borderRadius: "50%",
                }}
              >
                <CloudUploadIcon
                  sx={{ fontSize: 60, color: "#4944cd" }}
                ></CloudUploadIcon>
              </div>
            }
          />
        </Grid>
        <Grid item md={3} sm={6} xs={12}>
          <HomeFeature
            title="Review Documents"
            description="Examine the files that were posted by your colleagues and offer input on them"
            icon={
              <ReviewsIcon
                sx={{ fontSize: 60, color: "#4944cd" }}
              ></ReviewsIcon>
            }
          />
        </Grid>
        <Grid item md={3} sm={6} xs={12}>
          <HomeFeature
            title="Track Progress"
            description="Keep an eye on your progress and count how many papers you've already gone through"
            icon={
              <TimelineIcon
                sx={{ fontSize: 60, color: "#4944cd" }}
              ></TimelineIcon>
            }
          />
        </Grid>
        <Grid item md={3} sm={6} xs={12}>
          <HomeFeature
            title="Secure Sharing"
            description="All documents are shared only to those whom you choose to share them with"
            icon={
              <ShieldIcon
                sx={{ fontSize: 60, color: "#4944cd" }}
              ></ShieldIcon>
            }
          />
        </Grid>
      </Grid>
    </Box>
  );
}
