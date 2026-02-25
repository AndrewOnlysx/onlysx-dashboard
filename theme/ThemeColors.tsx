'use client'
import { createTheme } from '@mui/material/styles'
import { PRIMARYCOLOR, PRIMARYCOLORTransparent, PAPER, GRAY, GRAYTEXT, Background } from './Colors'

export const theme = createTheme({
    palette: {
        mode: 'dark', // 🔥 fuerza dark mode
        primary: {
            main: PRIMARYCOLOR,
        },
        background: {
            default: Background,
            paper: PAPER,
        },
        text: {
            primary: '#ffffff',
            secondary: GRAYTEXT,
        },
        divider: 'rgba(255,255,255,0.08)',

        action: {
            hover: 'rgba(255,80,164,0.06)',
            selected: 'rgb(255, 217, 80)',
            focus: 'rgba(112, 255, 80, 0.22)',
            active: '#cecece',
        },
    },

    typography: {
        fontFamily: 'Inter, sans-serif',
        h1: { fontWeight: 700 },
        h2: { fontWeight: 600 },
        h3: { fontWeight: 600 },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },

    shape: {
        borderRadius: 12,
    },

    components: {
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    marginBottom: 4,
                    '&.Mui-selected': {
                        color: PRIMARYCOLOR,
                        borderRadius: 0,
                        backgroundColor: 'rgba(255, 80, 165, 0.06)',
                        borderLeft: `3px solid ${PRIMARYCOLOR}`,
                    },
                },
            },
        },

        MuiDrawer: {
            styleOverrides: {
                paper: {
                    //   backgroundColor: '#222222',
                    borderRight: '1px solid rgba(255,255,255,0.06)',
                },
            },
        },
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: Background,
                },
                '*::-webkit-scrollbar': {
                    width: '8px',
                },
                '*::-webkit-scrollbar-thumb': {
                    backgroundColor: PRIMARYCOLORTransparent,
                    borderRadius: '8px',
                },
            },
        },

        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: PAPER,
                },
            },
        },

        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: PAPER,
                    border: '1px solid rgba(255,255,255,0.05)',
                    boxShadow: 'none',
                },
            },
        },

        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: PAPER,
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    boxShadow: 'none',
                },
            },
        },

        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    padding: '8px 16px',
                },
                containedPrimary: {
                    backgroundColor: PRIMARYCOLOR,
                    '&:hover': {
                        backgroundColor: PRIMARYCOLORTransparent,
                    },
                },
                outlinedPrimary: {
                    borderColor: PRIMARYCOLOR,
                    color: PRIMARYCOLOR,
                    '&:hover': {
                        borderColor: PRIMARYCOLOR,
                        backgroundColor: 'rgba(255,80,164,0.08)',
                    },
                },
            },
        },

        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    color: '#ffffff',
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: GRAY,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: PRIMARYCOLOR,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: PRIMARYCOLOR,
                    },
                },
                input: {
                    color: '#ffffff',
                },
            },
        },

        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: GRAYTEXT,
                    '&.Mui-focused': {
                        color: PRIMARYCOLOR,
                    },
                },
            },
        },

        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: 'rgba(255,255,255,0.05)',
                },
            },
        },
    },
})