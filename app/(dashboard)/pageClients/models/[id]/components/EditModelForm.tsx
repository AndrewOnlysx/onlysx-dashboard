"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useDropzone } from "react-dropzone"
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Stack,
    CircularProgress
} from "@mui/material"

interface Props {
    model: {
        _id: string
        name: string
        image?: string
    }
}

export default function EditModelForm({ model }: Props) {
    const router = useRouter()

    const [name, setName] = useState(model.name)
    const [preview, setPreview] = useState<string>(model.image || "")
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [imageError, setImageError] = useState(false)

    /* =============================
       DROPZONE
    ============================== */

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const selectedFile = acceptedFiles[0]
        if (!selectedFile) return

        setFile(selectedFile)
        setImageError(false)

        const objectUrl = URL.createObjectURL(selectedFile)
        setPreview(objectUrl)
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        maxFiles: 1
    })

    /* =============================
       SAVE
    ============================== */

    const handleSave = async () => {
        setLoading(true)

        try {
            const formData = new FormData()
            formData.append("name", name)
            formData.append("id", model._id)
            if (file) {
                formData.append("image", file)
            }

            const response = await fetch(`/api/models/editModel/`, {
                method: "PUT",
                body: formData
            })

            console.log("Response from API:", response)
            router.back()
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)

        }
    }

    /* =============================
       UI
    ============================== */

    return (
        <Box maxWidth={500} mx="auto" mt={8} px={2}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>

                <Typography variant="h5" fontWeight={600} mb={4}>
                    Editar Modelo
                </Typography>

                <Stack spacing={3}>

                    {/* DROPZONE */}
                    <Box
                        {...getRootProps()}
                        sx={{
                            border: "2px dashed",
                            borderColor: isDragActive ? "primary.main" : "grey.400",
                            borderRadius: 3,
                            height: 500,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            overflow: "hidden",
                            position: "relative",
                            transition: "0.2s"
                        }}
                    >
                        <input {...getInputProps()} />

                        {preview ? (
                            <Box
                                component="img"
                                src={!imageError ? preview : "/placeholder-model.png"}
                                onError={() => setImageError(true)}
                                sx={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover"
                                }}
                            />
                        ) : (
                            <Typography color="text.secondary">
                                {isDragActive
                                    ? "Suelta la imagen aquí..."
                                    : "Arrastra una imagen o haz click"}
                            </Typography>
                        )}

                        {loading && (
                            <Box
                                sx={{
                                    position: "absolute",
                                    inset: 0,
                                    background: "rgba(0,0,0,0.4)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                <CircularProgress />
                            </Box>
                        )}
                    </Box>

                    {/* NAME FIELD */}
                    <TextField
                        label="Nombre"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        required
                    />

                    {/* BUTTONS */}
                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                        <Button
                            variant="outlined"
                            onClick={() => router.back()}
                            disabled={loading}
                        >
                            Back
                        </Button>

                        <Button
                            variant="contained"
                            onClick={handleSave}
                            disabled={loading}
                        >
                            {loading ? "Guardando..." : "Guardar"}
                        </Button>
                    </Stack>

                </Stack>

            </Paper>
        </Box>
    )
}