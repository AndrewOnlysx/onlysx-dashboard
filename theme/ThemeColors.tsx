'use client'
import { alpha, createTheme } from '@mui/material/styles'
import {
    BACKGROUND,
    BORDER,
    GRAY,
    GRAYTEXT,
    PAPER,
    PRIMARYCOLOR,
    PRIMARYCOLORStrong,
    PRIMARYCOLORTransparent,
    SURFACE_ELEVATED,
    SURFACE_SOFT,
    TEXTMUTED,
    TEXTPRIMARY
} from './Colors'

export const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: PRIMARYCOLOR,
            contrastText: '#FFFFFF'
        },
        secondary: {
            main: '#7D8798',
            contrastText: '#FFFFFF'
        },
        background: {
            default: BACKGROUND,
            paper: PAPER,
        },
        text: {
            primary: TEXTPRIMARY,
            secondary: GRAYTEXT,
        },
        divider: BORDER,
        success: {
            main: '#3BB273'
        },
        warning: {
            main: '#E5A94D'
        },
        info: {
            main: '#6F89B3'
        },
        error: {
            main: '#D96767'
        },

        action: {
            hover: PRIMARYCOLORTransparent,
            selected: PRIMARYCOLOR,
            focus: PRIMARYCOLORStrong,
            active: TEXTPRIMARY,
        },
    },

    typography: {
        fontFamily: 'Inter, system-ui, sans-serif',
        h1: { fontWeight: 700, letterSpacing: '-0.03em' },
        h2: { fontWeight: 700, letterSpacing: '-0.02em' },
        h3: { fontWeight: 600, letterSpacing: '-0.02em' },
        h4: { fontWeight: 600, letterSpacing: '-0.02em' },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
        body1: { lineHeight: 1.6 },
        body2: { color: GRAYTEXT, lineHeight: 1.55 },
        button: {
            textTransform: 'none',
            fontWeight: 600,
            letterSpacing: '0.01em'
        },
    },

    shape: {
        borderRadius: 16,
    },

    components: {
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: 14,
                    marginBottom: 4,
                    paddingInline: 14,
                    minHeight: 46,
                    '&.Mui-selected': {
                        color: TEXTPRIMARY,
                        backgroundColor: alpha(PRIMARYCOLOR, 0.12),
                        borderLeft: `3px solid ${PRIMARYCOLOR}`,
                    },
                    '&:hover': {
                        backgroundColor: alpha('#FFFFFF', 0.04)
                    },
                },
            },
        },

        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#10141B',
                    borderRight: `1px solid ${BORDER}`,
                },
            },
        },
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: BACKGROUND,
                    backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0) 100%)',
                    color: TEXTPRIMARY,
                },
                '*::-webkit-scrollbar': {
                    width: '8px',
                },
                '*::-webkit-scrollbar-thumb': {
                    backgroundColor: alpha(PRIMARYCOLOR, 0.28),
                    borderRadius: '8px',
                },
                '::selection': {
                    backgroundColor: alpha(PRIMARYCOLOR, 0.28)
                }
            },
        },

        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: PAPER,
                    border: `1px solid ${BORDER}`
                },
            },
        },

        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: PAPER,
                    border: `1px solid ${BORDER}`,
                    boxShadow: '0 24px 70px rgba(0, 0, 0, 0.22)',
                },
            },
        },

        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: alpha(PAPER, 0.92),
                    backdropFilter: 'blur(18px)',
                    borderBottom: `1px solid ${BORDER}`,
                    boxShadow: 'none',
                },
            },
        },

        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 999,
                    padding: '10px 18px',
                    boxShadow: 'none'
                },
                containedPrimary: {
                    backgroundColor: PRIMARYCOLOR,
                    color: '#FFFFFF',
                    '&:hover': {
                        backgroundColor: '#E84494',
                        boxShadow: '0 18px 36px rgba(255, 80, 164, 0.22)'
                    },
                },
                outlinedPrimary: {
                    borderColor: PRIMARYCOLOR,
                    color: PRIMARYCOLOR,
                    '&:hover': {
                        borderColor: PRIMARYCOLOR,
                        backgroundColor: PRIMARYCOLORTransparent,
                    },
                },
                text: {
                    color: TEXTPRIMARY
                }
            },
        },

        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    color: TEXTPRIMARY,
                    backgroundColor: alpha('#FFFFFF', 0.02),
                    borderRadius: 14,
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
                    color: TEXTPRIMARY,
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
                    borderColor: BORDER,
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    minHeight: 42,
                    color: TEXTMUTED,
                    '&.Mui-selected': {
                        color: TEXTPRIMARY
                    }
                }
            }
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 999,
                    border: `1px solid ${alpha(PRIMARYCOLOR, 0.18)}`
                }
            }
        },
        MuiAccordion: {
            styleOverrides: {
                root: {
                    backgroundColor: SURFACE_ELEVATED,
                    border: `1px solid ${BORDER}`,
                    borderRadius: 20,
                    boxShadow: 'none',
                    '&:before': {
                        display: 'none'
                    }
                }
            }
        },
        MuiContainer: {
            styleOverrides: {
                root: {
                    paddingLeft: 0,
                    paddingRight: 0
                }
            }
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: `1px solid ${BORDER}`
                },
                head: {
                    color: TEXTPRIMARY,
                    fontWeight: 600,
                    backgroundColor: SURFACE_SOFT
                }
            }
        }
    },
})