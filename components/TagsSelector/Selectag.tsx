'use client'

import { NextPage } from 'next'
import { useEffect, useMemo, useRef, useState, useTransition } from 'react'

import { GetTags } from '@/database/actions/Tags/GetTags'
import { compactChipSx, compactMenuPaperSx, compactSearchFieldSx, compactSelectSx, dashboardChipSx, dashboardMenuPaperSx, dashboardSearchFieldSx, dashboardSelectSx } from '@/components/selectorStyles'

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
    uiVariant?: 'default' | 'compact'
}

const SelectTag: NextPage<Props> = ({ selectedTags, setSelectedTags, uiVariant = 'default' }) => {

    const [tags, setTags] = useState<TagType[]>([])
    const [search, setSearch] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const searchInputRef = useRef<HTMLInputElement | null>(null)

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

    const selectSx = uiVariant === 'compact' ? compactSelectSx : dashboardSelectSx
    const menuPaperSx = uiVariant === 'compact' ? compactMenuPaperSx : dashboardMenuPaperSx
    const searchFieldSx = uiVariant === 'compact' ? compactSearchFieldSx : dashboardSearchFieldSx
    const chipSx = uiVariant === 'compact' ? compactChipSx : dashboardChipSx

    return (
        <Box>


            <Select
                multiple
                fullWidth
                value={selectedTags.map((t) => t._id)}
                displayEmpty
                open={isOpen}
                onOpen={() => setIsOpen(true)}
                onClose={() => setIsOpen(false)}
                renderValue={(selected) => {
                    const values = selected as string[]
                    return values.length === 0 ? 'Seleccionar tags' : `${values.length} tags seleccionados`
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
                        placeholder="Buscar tag..."
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
                        sx={chipSx}
                    />
                ))}
            </Box>
        </Box>
    )
}

export default SelectTag