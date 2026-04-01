import type { SxProps, Theme } from '@mui/material/styles'

export const dashboardSelectSx: SxProps<Theme> = {
    minHeight: 56,
    borderRadius: '18px',
    backgroundColor: 'rgba(255,255,255,0.03)',
    color: '#f5f7fb',
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(255,255,255,0.08)'
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(255,80,164,0.22)'
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(255,80,164,0.42)',
        boxShadow: '0 0 0 4px rgba(255,80,164,0.12)'
    },
    '& .MuiSvgIcon-root': {
        color: 'rgba(255,255,255,0.58)'
    },
    '& .MuiSelect-select': {
        display: 'flex',
        alignItems: 'center',
        minHeight: '24px',
        padding: '16px'
    }
}

export const dashboardMenuPaperSx: SxProps<Theme> = {
    marginTop: 1,
    borderRadius: '18px',
    border: '1px solid rgba(255,255,255,0.08)',
    backgroundColor: '#171b22',
    color: '#f5f7fb',
    boxShadow: '0 24px 60px rgba(0,0,0,0.32)',
    overflowY: 'auto',
    overscrollBehavior: 'contain',
    '& .MuiList-root': {
        padding: '8px'
    },
    '& .MuiListSubheader-root': {
        backgroundColor: '#171b22',
        padding: '8px',
        marginBottom: '4px'
    },
    '& .MuiMenuItem-root': {
        borderRadius: '14px',
        marginBottom: '2px',
        minHeight: 48,
        transition: 'background-color 0.2s ease'
    },
    '& .MuiMenuItem-root:hover': {
        backgroundColor: 'rgba(255,255,255,0.05)'
    },
    '& .Mui-selected': {
        backgroundColor: 'rgba(255,80,164,0.12) !important'
    }
}

export const dashboardSearchFieldSx: SxProps<Theme> = {
    '& .MuiOutlinedInput-root': {
        borderRadius: '14px',
        backgroundColor: 'rgba(255,255,255,0.03)',
        color: '#f5f7fb',
        '& fieldset': {
            borderColor: 'rgba(255,255,255,0.08)'
        },
        '&:hover fieldset': {
            borderColor: 'rgba(255,80,164,0.22)'
        },
        '&.Mui-focused fieldset': {
            borderColor: 'rgba(255,80,164,0.42)'
        }
    },
    '& .MuiInputBase-input::placeholder': {
        color: 'rgba(143,151,168,0.9)',
        opacity: 1
    }
}

export const dashboardChipSx: SxProps<Theme> = {
    height: 32,
    borderRadius: '999px',
    border: '1px solid rgba(255,80,164,0.2)',
    backgroundColor: 'rgba(255,80,164,0.1)',
    color: '#ffd2e8',
    '& .MuiChip-deleteIcon': {
        color: 'rgba(255,210,232,0.72)'
    },
    '& .MuiChip-deleteIcon:hover': {
        color: '#ffd2e8'
    }
}

export const compactSelectSx: SxProps<Theme> = {
    minHeight: 44,
    borderRadius: '6px',
    backgroundColor: '#0f1218',
    color: '#f5f7fb',
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#303640'
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#ff50a4'
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#ff50a4'
    },
    '& .MuiSvgIcon-root': {
        color: '#8f97a8'
    },
    '& .MuiSelect-select': {
        display: 'flex',
        alignItems: 'center',
        minHeight: '20px',
        padding: '10px 12px',
        fontSize: '14px',
        fontWeight: 400
    }
}

export const compactMenuPaperSx: SxProps<Theme> = {
    marginTop: 1,
    borderRadius: '6px',
    border: '1px solid #303640',
    backgroundColor: '#171b22',
    color: '#f5f7fb',
    boxShadow: '0 12px 24px rgba(15, 23, 42, 0.08)',
    overflowY: 'auto',
    overscrollBehavior: 'contain',
    '& .MuiList-root': {
        padding: '6px'
    },
    '& .MuiListSubheader-root': {
        backgroundColor: '#171b22',
        padding: '6px',
        marginBottom: '4px'
    },
    '& .MuiMenuItem-root': {
        borderRadius: '6px',
        marginBottom: '2px',
        minHeight: 42,
        transition: 'background-color 0.2s ease'
    },
    '& .MuiMenuItem-root:hover': {
        backgroundColor: '#1e232c'
    },
    '& .Mui-selected': {
        backgroundColor: '#27111e !important'
    }
}

export const compactSearchFieldSx: SxProps<Theme> = {
    '& .MuiOutlinedInput-root': {
        borderRadius: '6px',
        backgroundColor: '#0f1218',
        color: '#f5f7fb',
        '& fieldset': {
            borderColor: '#303640'
        },
        '&:hover fieldset': {
            borderColor: '#ff50a4'
        },
        '&.Mui-focused fieldset': {
            borderColor: '#ff50a4'
        }
    },
    '& .MuiInputBase-input': {
        fontSize: '14px',
        fontWeight: 400
    },
    '& .MuiInputBase-input::placeholder': {
        color: '#6f7888',
        opacity: 1
    }
}

export const compactChipSx: SxProps<Theme> = {
    height: 28,
    borderRadius: '6px',
    border: '1px solid #303640',
    backgroundColor: '#171b22',
    color: '#d7ddea',
    fontSize: '12px',
    fontWeight: 500,
    '& .MuiChip-deleteIcon': {
        color: '#8f97a8'
    },
    '& .MuiChip-deleteIcon:hover': {
        color: '#f5f7fb'
    }
}