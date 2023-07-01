import { UserInterface } from "@/interface/user";
import { Grid, Stack, Typography } from "@mui/material";
import { useSession } from "next-auth/react";

export default function Profile() {
  const { status, data} = useSession();
  const user = data?.user as UserInterface;
  console.log(user);
  return (
    <Grid
      container
      spacing={2}
      sx={{
        display: "flex",
        margin: "auto",
      }}
    >
      <Grid item xs={12} md={6}>
        <img
          src={user.image}
          alt="profile"
          style={{
            display: "flex",
            margin: "auto",
          }}
        />
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Stack direction="row" spacing={2}>
          <Typography variant="h4" sx={{ my: "auto" }}>
            Name: {user.name}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Typography variant="h4" sx={{ my: "auto" }}>
            Email: {user.email}
          </Typography>
        </Stack>
      </Grid>
    </Grid>
  );
}
