import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import { useState, ChangeEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {login, loginPractitioner} from "../rest/queries";
import { useAuthUser } from "../contexts/AuthUserContext";
import toast from "react-hot-toast";
import {Box, Switch, Typography} from "@mui/material";

function CreateFormPage() {
    //Mise des valeurs par défauts
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isPractitioner, setIsPractitioner] = useState(false);

    const navigate = useNavigate();
    const authUser = useAuthUser();

    const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    //Gère la soumission lors de l'envoie du formulaire
    const handleSubmit = () => {
        if (isPractitioner) {
            loginPractitioner(email, password).then((response) => {
                if (response.responseCode === 200) {
                    if (response.data) {
                        toast.success('Connexion réussie');
                        authUser.updateToken(response.data.token);
                        authUser.defineType("practitioner")
                        authUser.refreshUser();
                    }
                    navigate("/");
                } else {
                    console.log("Error while logging in: " + response.errorMessage);
                    toast.error('Le nom d\'utilisateur ou le mot de passe est incorrect');
                }
            });
        } else {
            login(email, password).then((response) => {
                if (response.responseCode === 200) {
                    if (response.data) {
                        toast.success('Connexion réussie');
                        authUser.updateToken(response.data.token);
                        authUser.defineType("user");
                        authUser.refreshUser();
                    }
                    navigate("/");
                } else {
                    console.log("Error while logging in: " + response.errorMessage);
                    toast.error('Le nom d\'utilisateur ou le mot de passe est incorrect');
                }
            });
        }
    };

    return (
        <>
            {authUser.token ? (
                <Navigate to={"/"}/>
            ) : (
                <div style={{display: "flex", flexDirection: "column", alignItems: "center", height: "80vh"}}>
                    <h1>Connexion à l'application</h1>
                    <TextField
                        label="Adresse email"
                        variant="outlined"
                        sx={{
                            width: '20%',
                            minWidth: 350,
                            height: 50,
                            marginBottom: 3,
                        }}
                        value={email}
                        onChange={handleEmailChange}
                    />
                    <TextField
                        label="Mot de passe"
                        variant="outlined"
                        type="password"
                        sx={{
                            width: '20%',
                            minWidth: 350,
                            height: 50,
                            marginBottom: 3,
                        }}
                        value={password}
                        onChange={handlePasswordChange}
                    />

                    <Box sx={{ display: "flex", alignItems: "center", marginBottom: 3 }}>
                        <Typography fontSize={20}>Profesionnel de santé ?</Typography>
                        <Switch checked={isPractitioner} onChange={() => setIsPractitioner(!isPractitioner)} />
                    </Box>

                    <Button variant="contained" onClick={handleSubmit} disabled={email.trim().length<1||password.length<1}>Se connecter</Button>

                    <div style={{display: "flex", alignItems: "center", marginTop: 10}}>
                        <p style={{fontSize: 13, marginRight: 5}}>Vous n'avez pas de compte ?</p>
                        <Link variant="body2" sx={{
                            '&:hover': {
                                cursor: 'pointer',
                            },
                        }} onClick={() => navigate('/createAccount')}>
                            Créer un compte
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
}

export default CreateFormPage;
