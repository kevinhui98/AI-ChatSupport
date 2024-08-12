'use client'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline, IconButton } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { createContext, useContext, useState } from 'react';
import { GlobalStyles } from '@mui/system';

// Define the themes
const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
        background: {
            default: '#ffffff',
            paper: '#ffffff',
        },
        text: {
            primary: '#000000', // Light mode text color
        },
    },
});

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#90caf9',
        },
        background: {
            default: '#121212',
            paper: '#121212',
        },
        text: {
            primary: '#ffffff', // Dark mode text color
        },
    },
});

// Create a context for the theme
const ThemeContext = createContext();

// Create a provider component
export const ThemeProviderWithToggle = ({ children }) => {
    const [darkMode, setDarkMode] = useState(false);

    const theme = darkMode ? darkTheme : lightTheme;

    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };

    return (
        <ThemeContext.Provider value={{ toggleTheme }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <GlobalStyles
                    styles={{
                        body: {
                            backgroundColor: theme.palette.background.default,
                            color: theme.palette.text.primary,
                        },
                    }}
                />
                <IconButton onClick={toggleTheme} color="inherit" style={{ position: 'absolute', right: 16, top: 16 }}>
                    {darkMode ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};

// Custom hook to use the ThemeContext
export const useThemeToggle = () => {
    return useContext(ThemeContext);
};
