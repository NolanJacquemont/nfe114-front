import {Box, Card,Typography} from "@mui/material";
import PlaceIcon from '@mui/icons-material/Place';
import {Practitioner} from "../models/User.ts";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";

interface PractitionerCardProps {
    practitioner: Practitioner
}

function PractitionerCard({practitioner}: PractitionerCardProps) {
    const navigate = useNavigate();

    return (
        <Card sx={{padding: 2, mb: 2, width: 500, borderRadius:3, display:"flex", flexDirection:"column", alignItems:'flex-start'}} elevation={3}>
            <Typography variant={"h5"} fontWeight={"bold"} sx={{mt: 1, ml: 0.5}}>
                {practitioner.firstName} {practitioner.lastName}
            </Typography>
            <Box display={"flex"} sx={{mt: 0.5}}>
                <PlaceIcon color={"disabled"}/>
                <Typography color={"textDisabled"} variant={"subtitle1"} >
                    {practitioner.address}
                </Typography>
            </Box>
            <Typography sx={{mt: 0.5, ml: 0.5}}>
                Spécialité : <b>{practitioner.speciality}</b>
            </Typography>
            <Typography sx={{mt: 2, ml: 0.5}}>
                Description:
            </Typography>
            <Card variant={"outlined"} sx={{ width:"100%", height:60, overflow:"auto"}}>
                <Typography variant={"body2"} sx={{margin:1,textAlign: 'left', textJustify: 'inter-word'}} >{practitioner.description}</Typography>
            </Card>
            <Box display="flex" justifyContent="flex-end" width="100%" sx={{marginTop:1}}>
                <Button variant="contained" color="primary" onClick={() => {
                    navigate(`/appointment/${practitioner.id}`)
                }}
                >Prendre rendez-vous</Button>
            </Box>
        </Card>
    )
}

export default PractitionerCard