import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home.tsx";
import {AuthUserProvider} from "./contexts/AuthUserContext.tsx";
import {Box, CssBaseline, ThemeProvider} from "@mui/material";
import {Toaster} from "react-hot-toast";
import {useTheme} from "./utils/theme.ts";
import Navbar from "./pages/Navbar.tsx";
import Login from "./pages/Login.tsx";
import CreateAccount from "./pages/CreateAccount.tsx";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFnsV3";
import Practitioners from "./pages/Practitioners.tsx";
import TakeAppointment from "./pages/TakeAppointment.tsx";
import Appointments from "./pages/Appointments.tsx";
import Slots from "./pages/Slots.tsx";
import { fr } from "date-fns/locale";

function App() {
    const theme = useTheme()

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
            <ThemeProvider theme={theme}>
                <Toaster />
                <AuthUserProvider>
                    <CssBaseline />
                    <Box sx={{ marginTop: '80px' }}>
                        <BrowserRouter>
                            <Navbar />
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/createAccount" element={<CreateAccount />} />
                                <Route path="/practitioners" element={<Practitioners />} />
                                <Route path="/appointment/:practitionerId" element={<TakeAppointment />} />
                                <Route path="/appointments" element={<Appointments />} />
                                <Route path="/slots" element={<Slots />} />
                            </Routes>
                        </BrowserRouter>
                    </Box>
                </AuthUserProvider>
            </ThemeProvider>
        </LocalizationProvider>
    )
}

export default App
