'use client'

import { ModelType } from '@/types/Types'
import { NextPage } from 'next'
import { useEffect, useMemo, useRef, useState, useTransition } from 'react'

import { GetModels } from '@/database/actions/models/GetModels'
import { compactChipSx, compactMenuPaperSx, compactSearchFieldSx, compactSelectSx, dashboardChipSx, dashboardMenuPaperSx, dashboardSearchFieldSx, dashboardSelectSx } from '@/components/selectorStyles'

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
    uiVariant?: 'default' | 'compact'
}

const SelectModel: NextPage<Props> = ({ selectedModels, setSelectedModels, uiVariant = 'default' }) => {

    const [models, setModels] = useState<ModelType[]>([])
    const [search, setSearch] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const searchInputRef = useRef<HTMLInputElement | null>(null)

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

    const selectSx = uiVariant === 'compact' ? compactSelectSx : dashboardSelectSx
    const menuPaperSx = uiVariant === 'compact' ? compactMenuPaperSx : dashboardMenuPaperSx
    const searchFieldSx = uiVariant === 'compact' ? compactSearchFieldSx : dashboardSearchFieldSx
    const chipSx = uiVariant === 'compact' ? compactChipSx : dashboardChipSx

    return (
        <Box>

            <Select
                multiple
                fullWidth
                value={selectedModels.map((m) => m._id)}
                displayEmpty
                open={isOpen}
                onOpen={() => setIsOpen(true)}
                onClose={() => setIsOpen(false)}
                renderValue={(selected) => {
                    const values = selected as string[]
                    return values.length === 0 ? 'Seleccionar modelos' : `${values.length} modelos seleccionados`
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
                        sx: { ...menuPaperSx, maxHeight: 350 }
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
                        placeholder="Buscar modelo..."
                        fullWidth
                        sx={searchFieldSx}
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
                        sx={chipSx}
                    />
                ))}
            </Box>

        </Box>
    )
}

export default SelectModel