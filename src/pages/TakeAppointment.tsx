import {useAuthUser} from "../contexts/AuthUserContext";
import {Box, Select, Typography} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import {useState} from "react";
import {Slot} from "../models/Slot.ts";
import {createAppointment, getFreeSlots, getPractitioner, getSlots} from "../rest/queries.ts";
import {Practitioner} from "../models/User.ts";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import toast from "react-hot-toast";

function TakeAppointment() {
    const authUser = useAuthUser();
    const { practitionerId } = useParams();
    const [freeSlots, setFreeSlots] = useState<Slot[] | null>(null);
    const [practitioner, setPractitioner] = useState<Practitioner | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
    const navigate = useNavigate();

    if (!authUser.user) {
        navigate("/login");
    }

    if (authUser.type === "practitioner") {
        navigate("/");
    }

    if (practitionerId === undefined) {
        navigate("/practitioners");
    } else {
        if (freeSlots === null) {
            getFreeSlots(practitionerId).then((response) => {
                if (response.responseCode === 200) {
                    // @ts-ignore
                    setFreeSlots(response.data);
                } else {
                    console.log("Error while getting slots: " + response.errorMessage);
                }
            });
        }
        if (practitioner === null) {
            getPractitioner(practitionerId).then((response) => {
                if (response.responseCode === 200) {
                    // @ts-ignore
                    setPractitioner(response.data);
                } else {
                    console.log("Error while getting practitioner: " + response.errorMessage);
                }
            });
        }
    }

    return (
        <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", width: "100%", minHeight: '80vh'}}>
            <Typography variant={'h4'} sx={{mb: 2}}>Rendez-vous :</Typography>
            <Typography>
                Vous allez prendre un rendez-vous avec le praticien {practitioner?.firstName} {practitioner?.lastName}
            </Typography>
            <Typography sx={{mt: 2}}>
                Choisissez un créneau disponible :
            </Typography>
            <Select
                variant={"outlined"}
                sx={{width: 500, mt: 2}}
                title={"Choisissez un créneau"}
                value={selectedSlot}
                onChange={(event) => setSelectedSlot(event.target.value)}
            >
                {freeSlots?.sort((a, b) =>
                    new Date(a.time).getTime() - new Date(b.time).getTime()
                )
                    .map((slot) => (
                        <MenuItem key={slot.id} value={slot}>
                            {
                                new Date(slot.time).toLocaleDateString() + " - " + new Date(slot.time).toLocaleTimeString()
                            }
                        </MenuItem>
                    ))}
            </Select>
            <Button variant="contained" color="primary" sx={{mt: 2}} onClick={() => {
                if (selectedSlot !== null) {
                    if (authUser.user && authUser.user.id && practitionerId) {
                        createAppointment({
                            userId: authUser.user.id,
                            practitionerId: parseInt(practitionerId),
                            datetime: selectedSlot.time
                        }).then(r => {
                            if (r.responseCode === 201) {
                                toast.success("Rendez-vous pris avec succès");
                                navigate("/");
                            } else {
                                toast.error("Erreur lors de la prise de rendez-vous: " + r.errorMessage);
                            }
                        });
                    }
                }
            }}>
                Prendre rendez-vous
            </Button>
        </Box>
    );
}

export default TakeAppointment;