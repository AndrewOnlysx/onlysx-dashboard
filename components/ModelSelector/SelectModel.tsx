'use client'

import { ModelType } from '@/types/Types'
import { NextPage } from 'next'
import { useEffect, useState, useTransition, useMemo } from 'react'

import { GetModels } from '@/database/actions/models/GetModels'
import { dashboardChipSx, dashboardMenuPaperSx, dashboardSearchFieldSx, dashboardSelectSx } from '@/components/selectorStyles'

import {
    Select,
    MenuItem,
    Checkbox,
    Avatar,
    Box,
    Typography,
    TextField,
    ListSubheader,
    CircularProgress,
    Chip
} from '@mui/material'

interface Props {
    selectedModels: ModelType[]
    setSelectedModels: React.Dispatch<React.SetStateAction<ModelType[]>>
}

const SelectModel: NextPage<Props> = ({ selectedModels, setSelectedModels }) => {

    const [models, setModels] = useState<ModelType[]>([])
    const [search, setSearch] = useState('')
    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        startTransition(async () => {
            const { models } = await GetModels()
            setModels(models)
        })
    }, [])

    const filteredModels = useMemo(() => {
        if (!search) return models

        return models.filter((model) =>
            model.name.toLowerCase().includes(search.toLowerCase())
        )
    }, [models, search])

    const handleToggle = (model: ModelType) => {
        const exists = selectedModels.find((m) => m._id === model._id)

        if (exists) {
            setSelectedModels(selectedModels.filter((m) => m._id !== model._id))
        } else {
            setSelectedModels([...selectedModels, model])
        }
    }

    const handleDelete = (id: string) => {
        setSelectedModels(selectedModels.filter((m) => m._id !== id))
    }

    return (
        <Box>

            <Select
                multiple
                fullWidth
                value={selectedModels.map((m) => m._id)}
                displayEmpty
                renderValue={(selected) => {
                    const values = selected as string[]
                    return values.length === 0 ? 'Seleccionar modelos' : `${values.length} modelos seleccionados`
                }}
                sx={dashboardSelectSx}
                MenuProps={{
                    PaperProps: {
                        sx: { ...dashboardMenuPaperSx, maxHeight: 350 }
                    }
                }}
            >

                <ListSubheader>
                    <TextField
                        size="small"
                        autoFocus
                        placeholder="Buscar modelo..."
                        fullWidth
                        sx={dashboardSearchFieldSx}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.stopPropagation()}
                    />
                </ListSubheader>

                {isPending && (
                    <MenuItem disabled>
                        <CircularProgress size={20} />
                    </MenuItem>
                )}

                {filteredModels.map((model) => {
                    const selected = selectedModels.some(
                        (m) => m._id === model._id
                    )

                    return (
                        <MenuItem
                            key={model._id}
                            onClick={() => handleToggle(model)}
                        >
                            <Checkbox checked={selected} />

                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}
                            >
                                <Avatar
                                    src={model.image}
                                    sx={{ width: 28, height: 28 }}
                                />

                                <Typography variant="body2">
                                    {model.name}
                                </Typography>
                            </Box>
                        </MenuItem>
                    )
                })}
            </Select>

            {/* Chips seleccionados */}
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    mt: 1
                }}
            >
                {selectedModels.map((model) => (
                    <Chip
                        color={'primary'}
                        key={model._id}
                        avatar={<Avatar src={model.image} />}
                        label={model.name}
                        onDelete={() => handleDelete(model._id)}
                        sx={dashboardChipSx}
                    />
                ))}
            </Box>

        </Box>
    )
}

export default SelectModel