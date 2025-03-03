import {useAuthUser} from "../contexts/AuthUserContext";
import {Box, Typography} from "@mui/material";

function Home() {
  const authUser = useAuthUser();

  return (
    <Box sx={{m:2}}>
      <Typography variant={'h4'}>Accueil</Typography>
      <Typography variant={'h6'}>Bienvenu·e {authUser.user?.firstName} {authUser.user?.lastName}</Typography>
    </Box>
  );
}

export default Home;