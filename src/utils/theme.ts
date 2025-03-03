import {createTheme} from "@mui/material";
import {useDarkMode} from "usehooks-ts";
import {useEffect, useState} from "react";

const darkTheme = createTheme( {
    palette: {
        mode: 'dark',
        primary: {
            main: '#FFA500',
        },
        secondary: {
            main: '#6c006c',
        },
        background: {
            default: '#121212',
            paper: '#1e1e1e',
        }
    },
})

const lightTheme = createTheme( {
    palette: {
        mode: 'light',
        primary: {
            main: '#6c006c',
        },
        secondary: {
            main: '#FFA500',
        },
        background: {
            default: '#eeeeee',
            paper: '#ffffff',
        }
    },
})

export const useTheme = () =>{
    const { isDarkMode } = useDarkMode()
    const [theme, setTheme] = useState(isDarkMode ? darkTheme : lightTheme);

    useEffect(() => {
        setTheme(isDarkMode ? darkTheme : lightTheme)
    }, [isDarkMode]);

    return theme
}

