import {useAuthUser} from "../contexts/AuthUserContext";
import {Box, Card, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import { useState } from "react";
import {Slot} from "../models/Slot.ts";
import {getSlots, postSlot} from "../rest/queries.ts";
import Button from "@mui/material/Button";
import {DateTimePicker} from "@mui/x-date-pickers";
import toast from "react-hot-toast";

function Home() {
    const authUser = useAuthUser();
    const navigate = useNavigate();
    const [slots, setSlots] = useState<Slot[] | null>(null);
    const [date, setDate] = useState<Date>(new Date());

    if (!authUser.user) {
        navigate("/login");
    }

    if (authUser.type === "user") {
        navigate("/");
    }

    if (slots === null) {
        if (authUser.user?.id) {
            getSlots(authUser.user?.id).then((response) => {
                if (response.responseCode === 200) {
                    if (response.data) {
                        setSlots(response.data);
                    }
                } else {
                    console.log("Error while fetching slots: " + response.errorMessage);
                }
            });
        }
    }

    return (
        <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", width: "100%", minHeight: '80vh'}}>
        {/*  afficher les slots sur maxSlots columns  */}
            <Typography variant={'h4'} sx={{mb: 2}}>Ajouter un créneau</Typography>
            <DateTimePicker
                label="Date et heure"
                value={date}
                onChange={(date) => {
                    if (date)
                        setDate(date);
                }}
                minDateTime={new Date()}
                sx={{ width: 300, mt: 2 }}
            />
            <Button
                variant="contained"
                color="primary"
                sx={{ width: 300, mt: 2 }}
                onClick={() => {
                    if (authUser.user?.id) {
                        const dateCopy = new Date(date);
                        dateCopy.setSeconds(0);
                        dateCopy.setMilliseconds(0);
                        postSlot(authUser.user?.id, dateCopy).then((response) => {
                            if (response.responseCode === 201) {
                                if (response.data) {
                                    if (slots) {
                                        setSlots([...slots, response.data]);
                                    } else {
                                        setSlots([response.data]);
                                    }
                                }
                            } else {
                                toast.error("Erreur lors de l'ajout du créneau : " + response.errorMessage);
                            }
                        });
                    }
                }}
            >
                Ajouter un créneau
            </Button>
            <Typography variant={'h4'} sx={{mb: 2, mt: 5}}>Liste des créneaux</Typography>
            <Box sx={{display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 2}}>
                {slots?.map((slot) => (
                    <Card key={slot.id} sx={{
                        padding: 2,
                        mb: 2,
                        width: "200px",
                        borderRadius:3,
                        display:"flex",
                        flexDirection:"column",
                        alignItems:'flex-start',
                        border: 2,
                        borderColor: slot.status === "free" ? "success.main" : "error.main"
                    }} elevation={3}>
                        <Typography variant={"subtitle1"}>
                            <b>{new Date(slot.time).toLocaleDateString() + " - " + new Date(slot.time).toLocaleTimeString()}</b>
                        </Typography>
                        <Box display={"flex"}>
                            <Typography> Statut :</Typography>
                            <Typography sx={{ml: 0.5, fontWeight: "bold"}}
                                        color={slot.status === "free" ? "success.main" : "error.main"}>{slot.status === "free" ? "Libre" : "Réservé"}
                            </Typography>
                        </Box>
                    </Card>
                ))}
            </Box>
        </Box>
    );
}

export default Home;