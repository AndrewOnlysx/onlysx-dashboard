'use client'

import { NextPage } from 'next'
import { useEffect, useMemo, useState, useTransition } from 'react'

import { GetTags } from '@/database/actions/Tags/GetTags'
import { dashboardChipSx, dashboardMenuPaperSx, dashboardSearchFieldSx, dashboardSelectSx } from '@/components/selectorStyles'

import {
    Select,
    MenuItem,
    Checkbox,
    Box,
    Typography,
    TextField,
    ListSubheader,
    Chip,
    CircularProgress
} from '@mui/material'

interface TagType {
    _id: string
    name: string
}

interface Props {
    selectedTags: TagType[]
    setSelectedTags: React.Dispatch<React.SetStateAction<TagType[]>>
}

const SelectTag: NextPage<Props> = ({ selectedTags, setSelectedTags }) => {

    const [tags, setTags] = useState<TagType[]>([])
    const [search, setSearch] = useState('')
    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        startTransition(async () => {
            const { tags } = await GetTags()
            setTags(tags)
        })
    }, [])

    const filteredTags = useMemo(() => {
        if (!search) return tags

        return tags.filter((tag) =>
            tag.name.toLowerCase().includes(search.toLowerCase())
        )
    }, [tags, search])

    const handleToggle = (tag: TagType) => {
        const exists = selectedTags.find((t) => t._id === tag._id)

        if (exists) {
            setSelectedTags(selectedTags.filter((t) => t._id !== tag._id))
        } else {
            setSelectedTags([...selectedTags, tag])
        }
    }

    const handleDelete = (id: string) => {
        setSelectedTags(selectedTags.filter((t) => t._id !== id))
    }

    return (
        <Box>


            <Select
                multiple
                fullWidth
                value={selectedTags.map((t) => t._id)}
                displayEmpty
                renderValue={(selected) => {
                    const values = selected as string[]
                    return values.length === 0 ? 'Seleccionar tags' : `${values.length} tags seleccionados`
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
                        placeholder="Buscar tag..."
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

                {filteredTags.map((tag) => {
                    const selected = selectedTags.some(
                        (t) => t._id === tag._id
                    )

                    return (
                        <MenuItem
                            key={tag._id}
                            onClick={() => handleToggle(tag)}
                        >
                            <Checkbox checked={selected} />

                            <Typography variant="body2">
                                {tag.name}
                            </Typography>
                        </MenuItem>
                    )
                })}
            </Select>

            {/* Chips */}
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    mt: 1
                }}
            >
                {selectedTags.map((tag) => (
                    <Chip
                        key={tag._id}
                        color='primary'
                        label={tag.name}
                        onDelete={() => handleDelete(tag._id)}
                        sx={dashboardChipSx}
                    />
                ))}
            </Box>
        </Box>
    )
}

export default SelectTag