'use client'

import { useEffect, useState, useTransition } from 'react'
import { Avatar, Box, Checkbox, Chip, CircularProgress, ListSubheader, MenuItem, Select, TextField, Typography } from '@mui/material'

import { GetAllGalery } from '@/database/actions/galeries/GetAllGallery'
import { dashboardChipSx, dashboardMenuPaperSx, dashboardSearchFieldSx, dashboardSelectSx } from '@/components/selectorStyles'
import { GalleryType } from '@/types/Types'

interface Props {
    selectedGaleries: GalleryType[]
    setSelectedGaleries: React.Dispatch<React.SetStateAction<GalleryType[]>>
}

const SelectGallery = ({ selectedGaleries, setSelectedGaleries }: Props) => {
    const [galeries, setGaleries] = useState<GalleryType[]>([])
    const [search, setSearch] = useState('')
    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        startTransition(async () => {
            const { galeries } = await GetAllGalery()
            setGaleries(galeries)
        })
    }, [])

    const filteredGaleries = galeries.filter((gallery) =>
        gallery.name.toLowerCase().includes(search.toLowerCase())
    )

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

    return (
        <Box>
            <Select
                multiple
                fullWidth
                value={selectedGaleries.map((gallery) => gallery._id)}
                displayEmpty
                renderValue={(selected) => {
                    const values = selected as string[]
                    return values.length === 0 ? 'Seleccionar galerias' : `${values.length} galerias seleccionadas`
                }}
                sx={dashboardSelectSx}
                MenuProps={{
                    PaperProps: {
                        sx: { ...dashboardMenuPaperSx, maxHeight: 360 }
                    }
                }}
            >
                <ListSubheader>
                    <TextField
                        size="small"
                        autoFocus
                        fullWidth
                        placeholder="Buscar galeria..."
                        sx={dashboardSearchFieldSx}
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
                        sx={dashboardChipSx}
                    />
                ))}
            </Box>
        </Box>
    )
}

export default SelectGallery
