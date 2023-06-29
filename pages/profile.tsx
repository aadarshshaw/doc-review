import { Grid, Stack, Typography } from "@mui/material";

const user = {
  firstName: "Aadarsh",
  lastName: "Shaw",
  username: "aadarshshaw",
  email: "aadarsh@gmail.com",
  avatar: "https://avatars.githubusercontent.com/u/56132786?v=4",
};
export default function Profile() {
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
          src={user.avatar}
          alt={user.username}
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
            First Name: {user.firstName}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Typography variant="h4" sx={{ my: "auto" }}>
            Last Name: {user.lastName}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Typography variant="h4" sx={{ my: "auto" }}>
            Username: {user.username}
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
