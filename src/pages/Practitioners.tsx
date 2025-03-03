import {useAuthUser} from "../contexts/AuthUserContext";
import {Box, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {getPractitioners} from "../rest/queries.ts";
import { useState } from "react";
import {Practitioner} from "../models/User.ts";
import PractitionerCard from "../components/PractitionerCard.tsx";

function Home() {
    const authUser = useAuthUser();
    const navigate = useNavigate();
    const [practitioners, setPractitioners] = useState<Practitioner[] | null>(null);

    if (!authUser.user) {
        navigate("/login");
    }

    if (authUser.type === "practitioner") {
        navigate("/");
    }

    if (practitioners === null) {
        getPractitioners().then((response) => {
            if (response.responseCode === 200) {
                // @ts-ignore
                setPractitioners(response.data?.member);
            } else {
                console.log("Error while getting practitioners: " + response.errorMessage);
            }
        });
    }

    return (
        <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", width: "100%", minHeight: '80vh'}}>
            <Typography variant={'h4'} sx={{mb: 2}}>Liste des praticiens</Typography>
            {practitioners === null ?
                <Typography>Loading</Typography>
                : (practitioners.map((practitioner) => (
                    <PractitionerCard practitioner={practitioner} />
                )))}
        </Box>
    );
}

export default Home;