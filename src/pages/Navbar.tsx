import React from "react";
import {AppBar, Box, Button, IconButton, Menu, Switch, Toolbar, Typography} from "@mui/material";
import { useDarkMode } from 'usehooks-ts'
import { Healing } from "@mui/icons-material";
import {useLocation, useNavigate} from "react-router-dom";
import { useAuthUser } from "../contexts/AuthUserContext";
import MenuItem from "@mui/material/MenuItem";
import toast from "react-hot-toast";

function Navbar() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const { isDarkMode, toggle } = useDarkMode()
    const navigate = useNavigate()
    const authUser = useAuthUser();
    const location = useLocation()

    const pages = [
        {name: "Accueil", path: "/", isVisible: true},
        {name: "Liste des praticiens", path: "/practitioners", isVisible: authUser.type === "user"},
        {name: "Liste des rendez-vous", path: "/appointments", isVisible: authUser.user},
        {name: "Gérer vos créneaux", path: "/slots", isVisible: authUser.type === "practitioner"},
    ]

    const handleClose = () => {
        setAnchorEl(null);
    };

    function handleDisconnect() {
        authUser.disconnect()
        setAnchorEl(null)
        toast.success('Déconnexion réussie');
        navigate('/')
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={() => navigate('/')}
                    >
                        <Healing />
                    </IconButton>
                    {authUser.type ? (<Typography sx={{
                        mr: 3,
                        fontWeight: 'bold'
                    }} variant="h6" component="div">
                        Vue {authUser.type === "user" ? "Utilisateur" : "Praticien"}
                    </Typography>) : <></>}

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {/*Filtrage des pages selon le filtre "isVisible" */}
                        {pages.filter(page => page.isVisible).map((page) =>(
                            <Button
                                key={page.name}
                                sx={{ my: 2, color: location.pathname === page.path ? 'primary.main' : 'white', display: 'block' }}
                                onClick={() => navigate(page.path)}
                            >
                                {page.name}
                            </Button>
                        ))}
                    </Box>
                    <Switch checked={isDarkMode} onChange={toggle} />
                    <Box hidden={!!authUser.token}> <Button color="inherit" onClick={() => navigate('/login')}>Login</Button> </Box>
                    {authUser.token &&
                        <Box sx={{ display: "flex" }}>
                            <Button color="inherit" onClick={(event) => setAnchorEl(event.currentTarget)}>{authUser.user?.email}</Button>
                            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                                {/*<MenuItem onClick={() => {navigate('/profile'); handleClose()}}>Profile</MenuItem>*/}
                                <MenuItem onClick={() => handleDisconnect()}>Déconnexion</MenuItem>
                            </Menu>
                        </Box>
                    }
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default Navbar;