"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useDropzone } from "react-dropzone"
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Paper,
    Stack,
    TextField,
    Typography
} from "@mui/material"

interface ModelFormData {
    _id: string
    name: string
    image?: string
}

interface Props {
    mode: "create" | "edit"
    model?: ModelFormData | null
}

const ModelForm = ({ mode, model }: Props) => {
    const router = useRouter()
    const previewUrlRef = useRef<string | null>(null)
    const isEdit = mode === "edit" && Boolean(model?._id)

    const [name, setName] = useState(model?.name ?? "")
    const [preview, setPreview] = useState<string>(model?.image ?? "")
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [imageError, setImageError] = useState(false)
    const [formError, setFormError] = useState("")

    useEffect(() => {
        return () => {
            if (previewUrlRef.current) {
                URL.revokeObjectURL(previewUrlRef.current)
            }
        }
    }, [])

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const selectedFile = acceptedFiles[0]

        if (!selectedFile) {
            return
        }

        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current)
        }

        const objectUrl = URL.createObjectURL(selectedFile)
        previewUrlRef.current = objectUrl

        setFile(selectedFile)
        setPreview(objectUrl)
        setImageError(false)
        setFormError("")
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        maxFiles: 1
    })

    const handleSave = async () => {
        const trimmedName = name.trim()

        if (!trimmedName) {
            setFormError("El nombre del modelo es obligatorio.")
            return
        }

        if (!preview && !file) {
            setFormError("Debes cargar una imagen para el modelo.")
            return
        }

        setLoading(true)
        setFormError("")

        try {
            const formData = new FormData()
            formData.append("name", trimmedName)

            if (isEdit && model?._id) {
                formData.append("id", model._id)
            }

            if (file) {
                formData.append("image", file)
            }

            const response = await fetch("/api/models/editModel", {
                method: isEdit ? "PUT" : "POST",
                body: formData
            })

            const payload = await response.json().catch(() => null)

            if (!response.ok || !payload?.ok || !payload?.model?._id) {
                throw new Error(payload?.message || "No se pudo guardar el modelo.")
            }

            router.refresh()
            router.push(`/pageClients/models/view/${payload.model._id}`)
        } catch (error) {
            setFormError(error instanceof Error ? error.message : "No se pudo guardar el modelo.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box maxWidth={640} mx="auto" px={2}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 1 }}>
                <Typography variant="h5" fontWeight={600} mb={1}>
                    {isEdit ? "Editar modelo" : "Crear nuevo modelo"}
                </Typography>

                <Typography variant="body2" color="text.secondary" mb={4}>
                    {isEdit
                        ? "Actualiza el nombre y la imagen principal del perfil."
                        : "Carga la imagen principal y publica un perfil nuevo para que aparezca en el selector de modelos."}
                </Typography>

                <Stack spacing={3}>
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
                                    ? "Suelta la imagen aqui..."
                                    : "Arrastra una imagen o haz click para cargarla"}
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

                    <TextField
                        label="Nombre"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        fullWidth
                        required
                    />

                    {formError && <Alert severity="error">{formError}</Alert>}

                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                        <Button
                            variant="outlined"
                            onClick={() => router.back()}
                            disabled={loading}
                        >
                            Volver
                        </Button>

                        <Button
                            variant="contained"
                            onClick={handleSave}
                            disabled={loading}
                        >
                            {loading
                                ? isEdit ? "Guardando..." : "Creando..."
                                : isEdit ? "Guardar cambios" : "Crear modelo"}
                        </Button>
                    </Stack>
                </Stack>
            </Paper>
        </Box>
    )
}

export default ModelForm