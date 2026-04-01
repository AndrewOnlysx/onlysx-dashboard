'use client'

import { useEffect, useMemo, useRef, useState, useTransition } from 'react'
import { Avatar, Box, Checkbox, Chip, CircularProgress, ListSubheader, MenuItem, Select, TextField, Typography } from '@mui/material'

import { GetAllGalery } from '@/database/actions/galeries/GetAllGallery'
import { compactChipSx, compactMenuPaperSx, compactSearchFieldSx, compactSelectSx, dashboardChipSx, dashboardMenuPaperSx, dashboardSearchFieldSx, dashboardSelectSx } from '@/components/selectorStyles'
import { GalleryType } from '@/types/Types'

interface Props {
    selectedGaleries: GalleryType[]
    setSelectedGaleries: React.Dispatch<React.SetStateAction<GalleryType[]>>
    uiVariant?: 'default' | 'compact'
}

const SelectGallery = ({ selectedGaleries, setSelectedGaleries, uiVariant = 'default' }: Props) => {
    const [galeries, setGaleries] = useState<GalleryType[]>([])
    const [search, setSearch] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const searchInputRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        startTransition(async () => {
            const { galeries } = await GetAllGalery()
            setGaleries(galeries)
        })
    }, [])

    const filteredGaleries = useMemo(() => galeries.filter((gallery) =>
        gallery.name.toLowerCase().includes(search.toLowerCase())
    ), [galeries, search])

    const handleToggle = (gallery: GalleryType) => {
        const exists = selectedGaleries.find((item) => item._id === gallery._id)

        if (exists) {
            setSelectedGaleries(selectedGaleries.filter((item) => item._id !== gallery._id))
            return
        }

        setSelectedGaleries([...selectedGaleries, gallery])
    }

    const handleDelete = (galleryId: string) => {
        setSelectedGaleries(selectedGaleries.filter((item) => item._id !== galleryId))
    }

    const selectSx = uiVariant === 'compact' ? compactSelectSx : dashboardSelectSx
    const menuPaperSx = uiVariant === 'compact' ? compactMenuPaperSx : dashboardMenuPaperSx
    const searchFieldSx = uiVariant === 'compact' ? compactSearchFieldSx : dashboardSearchFieldSx
    const chipSx = uiVariant === 'compact' ? compactChipSx : dashboardChipSx

    return (
        <Box>
            <Select
                multiple
                fullWidth
                value={selectedGaleries.map((gallery) => gallery._id)}
                displayEmpty
                open={isOpen}
                onOpen={() => setIsOpen(true)}
                onClose={() => setIsOpen(false)}
                renderValue={(selected) => {
                    const values = selected as string[]
                    return values.length === 0 ? 'Seleccionar galerias' : `${values.length} galerias seleccionadas`
                }}
                sx={selectSx}
                MenuProps={{
                    autoFocus: false,
                    disableAutoFocusItem: true,
                    MenuListProps: {
                        autoFocusItem: false,
                    },
                    TransitionProps: {
                        onEntered: () => {
                            searchInputRef.current?.focus()
                        }
                    },
                    PaperProps: {
                        sx: { ...menuPaperSx, maxHeight: 360 }
                    }
                }}
            >
                <ListSubheader
                    disableSticky
                    onMouseDown={(event) => event.stopPropagation()}
                    onClick={(event) => event.stopPropagation()}
                >
                    <TextField
                        size="small"
                        inputRef={searchInputRef}
                        value={search}
                        fullWidth
                        placeholder="Buscar galeria..."
                        sx={searchFieldSx}
                        onChange={(event) => setSearch(event.target.value)}
                        onKeyDown={(event) => event.stopPropagation()}
                    />
                </ListSubheader>

                {isPending && (
                    <MenuItem disabled>
                        <CircularProgress size={20} />
                    </MenuItem>
                )}

                {filteredGaleries.map((gallery) => {
                    const isSelected = selectedGaleries.some((item) => item._id === gallery._id)
                    const cover = gallery.images?.[0]?.url

                    return (
                        <MenuItem key={gallery._id} onClick={() => handleToggle(gallery)}>
                            <Checkbox checked={isSelected} />

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                                <Avatar src={cover} variant="rounded" sx={{ width: 32, height: 32 }} />
                                <Box>
                                    <Typography variant="body2">{gallery.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {gallery.images?.length ?? 0} imagenes
                                    </Typography>
                                </Box>
                            </Box>
                        </MenuItem>
                    )
                })}
            </Select>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {selectedGaleries.map((gallery) => (
                    <Chip
                        key={gallery._id}
                        color="primary"
                        avatar={<Avatar src={gallery.images?.[0]?.url} variant="rounded" />}
                        label={gallery.name}
                        onDelete={() => handleDelete(gallery._id)}
                        sx={chipSx}
                    />
                ))}
            </Box>
        </Box>
    )
}

export default SelectGallery
