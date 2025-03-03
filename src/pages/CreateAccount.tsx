import { useState, ChangeEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import {Box, Switch, Typography} from "@mui/material";
import {Practitioner, User} from "../models/User";
import {createAccount, createPractitionerAccount} from "../rest/queries";
import { useAuthUser } from "../contexts/AuthUserContext";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import toast from "react-hot-toast";

function CreateAccount() {
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [birthDate, setBirthDate] = useState<Date>(new Date());
    const [phoneNumber, setPhoneNumber] = useState(0);
    const [secuNumber, setSecuNumber] = useState(0);

    const [isPractitioner, setIsPractitioner] = useState(false);
    const [description, setDescription] = useState("");
    const [speciality, setSpeciality] = useState("");
    const [address, setAddress] = useState("");

    const navigate = useNavigate();
    const authUser = useAuthUser();

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        switch (name) {
            case "email":
                setEmail(value);
                break;
            case "firstName":
                setFirstName(value);
                break;
            case "lastName":
                setLastName(value);
                break;
            case "password":
                setPassword(value);
                break;
            case "phoneNumber":
                setPhoneNumber(parseInt(value));
                break;
            case "secuNumber":
                if (value.length <= 13) {
                    setSecuNumber(parseInt(value));
                }
                break;
            default:
                break;
        }
    };

    const handleSubmit = () => {
        if (!firstName || !lastName || !password || !email) {
            setError("Veuillez remplir tous les champs.");
            return;
        }

        setError("");

        const user: User = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            birthDate: birthDate,
            phoneNumber: phoneNumber,
            secuNumber: secuNumber
        }

        const practitioner: Practitioner = {
            ...user,
            description: description,
            speciality: speciality,
            address: address
        }

        if (isPractitioner) {
            createPractitionerAccount(practitioner)
                .then((response) => {
                    if (response.responseCode === 201) {
                        toast.success("Votre compte a été créé avec succès !");
                        navigate('/login');
                    } else {
                        toast.error("Une erreur est survenue lors de la création de votre compte: '" + response.errorMessage + "'");
                    }
                })
                .catch((error) => {
                    console.log(error);
                    toast.error("Une erreur est survenue lors de la création de votre compte: '" + error + "'");
                });
            return;
        } else {
            createAccount(user)
                .then((response) => {
                    if (response.responseCode === 201) {
                        toast.success("Votre compte a été créé avec succès !");
                        navigate('/login');
                    } else {
                        toast.error("Une erreur est survenue lors de la création de votre compte: '" + response.errorMessage + "'");
                    }
                })
                .catch((error) => {
                    console.log(error);
                    toast.error("Une erreur est survenue lors de la création de votre compte: '" + error + "'");
                });
        }
    };

    const commonTextFieldStyle = {
        width: '20%',
        minWidth: 350,
        height: 50,
        marginBottom: 3,
    };

    function disableCreateAccount() {
        return !firstName || !lastName || !password || !email;

    }

    return (
        <>
            {authUser.token ? (
                <Navigate to={"/"} />
            ) : (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", minHeight: "80vh" }}>
                    <h1>Création de votre compte</h1>
                    <TextField
                        name="email"
                        label="Email"
                        variant="outlined"
                        sx={commonTextFieldStyle}
                        value={email}
                        onChange={handleChange}
                    />
                    <TextField
                        name="password"
                        label="Mot de passe"
                        variant="outlined"
                        type="password"
                        sx={commonTextFieldStyle}
                        value={password}
                        onChange={handleChange}
                    />
                    <TextField
                        name="firstName"
                        label="Prénom"
                        variant="outlined"
                        sx={commonTextFieldStyle}
                        value={firstName}
                        onChange={handleChange}
                    />
                    <TextField
                        name="lastName"
                        label="Nom de famille"
                        variant="outlined"
                        sx={commonTextFieldStyle}
                        value={lastName}
                        onChange={handleChange}
                    />
                    <DatePicker
                        label="Date de naissance"
                        value={birthDate}
                        onChange={(date) => {
                            if (date) {
                                setBirthDate(date);
                            }
                        }}
                        sx={commonTextFieldStyle}
                        format={"dd/MM/yyyy"}
                    />
                    <TextField
                        name="phoneNumber"
                        label="Numéro de téléphone"
                        variant="outlined"
                        sx={commonTextFieldStyle}
                        value={phoneNumber}
                        onChange={handleChange}
                        type="number"
                    />
                    <TextField
                        name="secuNumber"
                        label="Numéro de sécurité sociale"
                        variant="outlined"
                        sx={commonTextFieldStyle}
                        value={secuNumber}
                        onChange={handleChange}
                        type="number"
                    />

                    <Box sx={{ display: "flex", alignItems: "center", marginBottom: 3 }}>
                        <Typography fontSize={20}>Profesionnel de santé ?</Typography>
                        <Switch checked={isPractitioner} onChange={() => setIsPractitioner(!isPractitioner)} />
                    </Box>

                    {isPractitioner && (
                        <>
                            <TextField
                                name="description"
                                label="Description"
                                variant="outlined"
                                sx={{
                                    width: '20%',
                                    minWidth: 350,
                                    marginBottom: 3,
                                }}
                                value={description}
                                onChange={(event) => setDescription(event.target.value)}
                                multiline
                                rows={4}
                            />
                            <TextField
                                name="speciality"
                                label="Spécialité"
                                variant="outlined"
                                sx={commonTextFieldStyle}
                                value={speciality}
                                onChange={(event) => setSpeciality(event.target.value)}
                            />
                            <TextField
                                name="address"
                                label="Addresse"
                                variant="outlined"
                                sx={commonTextFieldStyle}
                                value={address}
                                onChange={(event) => setAddress(event.target.value)}
                            />
                        </>
                    )}

                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <Button variant="contained" onClick={handleSubmit} disabled={disableCreateAccount()}>Créer votre compte</Button>

                    <div style={{ display: "flex", alignItems: "center", marginTop: 10 }}>
                        <p style={{ fontSize: 13, marginRight: 5 }}>Vous avez déjà un compte ?</p>
                        <Link variant="body2" sx={{
                            '&:hover': {
                                cursor: 'pointer',
                            },
                        }} onClick={() => navigate('/login')}>
                            Se connecter
                        </Link>
                    </div>
                </Box>
            )}
        </>
    );
}

export default CreateAccount;
