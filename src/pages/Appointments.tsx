import {useAuthUser} from "../contexts/AuthUserContext";
import {Box, Card, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import { useState } from "react";
import {Appointment} from "../models/Slot.ts";
import {getAppointments} from "../rest/queries.ts";
import Button from "@mui/material/Button";
import PlaceIcon from "@mui/icons-material/Place";

function Home() {
    const authUser = useAuthUser();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState<Appointment[] | null>(null);

    if (!authUser.user) {
        navigate("/login");
    }

    if (appointments === null) {
        if (authUser.type === "user") {
            getAppointments(authUser.user?.id, undefined).then((response) => {
                if (response.responseCode === 200) {
                    if (response.data) {
                        setAppointments(response.data);
                    }
                } else {
                    console.log("Error while fetching appointments: " + response.errorMessage);
                }
            });
        } else {
            getAppointments(undefined, authUser.user?.id).then((response) => {
                if (response.responseCode === 200) {
                    if (response.data) {
                        setAppointments(response.data);
                    }
                } else {
                    console.log("Error while fetching appointments: " + response.errorMessage);
                }
            });
        }
    }

    return (
        <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", width: "100%", minHeight: '80vh'}}>
            <Typography variant={'h4'} sx={{mb: 2}}>Liste des rendez-vous</Typography>
            {appointments?.sort(
                (a, b) =>
                    new Date(a.time).getTime() - new Date(b.time).getTime()
            )
                .map((appointment) => (
                    <Card sx={{padding: 2, mb: 2, width: "100%", borderRadius:3, display:"flex", flexDirection:"column", alignItems:'flex-start'}} elevation={3}
                    >
                        <Typography variant={"h5"} fontWeight={"bold"} sx={{mt: 1, ml: 0.5}}>
                            <b>{new Date(appointment.time).toLocaleDateString() + " - " + new Date(appointment.time).toLocaleTimeString()}</b>
                        </Typography>
                        <Box display={"flex"} sx={{mt: 0.5}}>
                            <PlaceIcon color={"disabled"}/>
                            <Typography color={"textDisabled"} variant={"subtitle1"} >
                                {appointment.practitioner.address}
                            </Typography>
                        </Box>
                        <Typography sx={{mt: 0.5, ml: 0.5}}>Nom du {authUser.type === "practitioner" ?
                            "patient : " + appointment.user.firstName + " " + appointment.user.lastName
                            : "praticien : " + appointment.practitioner.firstName + " " + appointment.practitioner.lastName}
                        </Typography>
                        {authUser.type === "user" && (
                            <Typography sx={{mt: 0.5, ml: 0.5}}>
                                Spécialité : <b>{appointment.practitioner.speciality}</b>
                            </Typography>
                        )}
                        <Box display="flex" justifyContent="flex-end" width="100%" sx={{marginTop:1}}>
                            <Button
                                variant="contained"
                                color="error"
                                sx={{
                                    mt: 2
                                }}
                            >
                                Annuler le rendez-vous
                            </Button>
                        </Box>
                    </Card>
                ))}
        </Box>
    );
}

export default Home;