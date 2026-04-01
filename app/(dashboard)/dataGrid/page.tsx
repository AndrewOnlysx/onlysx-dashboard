'use client'

import * as React from 'react'
import { Chip } from '@mui/material'
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid'
import { useDropzone } from 'react-dropzone'
import ContainerPage from '@/components/Layout/Layouts'

const rows = [
    { id: 1, name: 'Joel', email: 'joel@test.com', status: 'active', role: 'Admin', age: 28 },
    { id: 2, name: 'Maria', email: 'maria@test.com', status: 'inactive', role: 'User', age: 24 },
    { id: 3, name: 'Carlos', email: 'carlos@test.com', status: 'pending', role: 'Editor', age: 32 },
]

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },

    { field: 'name', headerName: 'Name', flex: 1, editable: true },

    { field: 'email', headerName: 'Email', flex: 1 },

    {
        field: 'status',
        headerName: 'Status',
        flex: 1,
        renderCell: (params) => {
            const value = params.value

            const color =
                value === 'active'
                    ? 'success'
                    : value === 'inactive'
                        ? 'error'
                        : 'warning'

            return <Chip label={value} color={color as any} size="small" />
        },
    },

    { field: 'role', headerName: 'Role', flex: 1 },

    { field: 'age', headerName: 'Age', type: 'number', width: 100 },
]

export default function Page() {
    const [videoFile, setVideoFile] = React.useState<File | null>(null)
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (acceptedFiles) => {
            console.log('Archivos aceptados:', acceptedFiles)
            if (acceptedFiles.length > 0) {
                setVideoFile(acceptedFiles[0])
            }


        },
        onDropRejected: (fileRejections) => {
            console.log('Archivos rechazados:', fileRejections)
        },
        maxFiles: 1,
        accept: {
            'video/mp4': ['.mp4', '.ts', '.mkv', '.avi'],
            'video/webm': ['.webm'],
            'video/quicktime': ['.mov'],
        },
    })

    return (
        <ContainerPage
            eyebrow="Operations"
            title="Data grid corporativo"
            description="Ejemplo operativo de tablas con toolbar, seleccion multiple y estados consistentes con el nuevo sistema visual."
        >
            <div {...getRootProps()} className={`mb-4 flex h-32 items-center justify-center rounded-lg border-2 border-dashed ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}`}>
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p className="text-blue-500">Suelta los archivos aquí...</p>
                ) : (
                    <video className="h-full w-auto" controls>
                        <source src={videoFile ? URL.createObjectURL(videoFile) : '/sample-video.mp4'} type="video/mp4" />
                        Tu navegador no soporta la etiqueta de video.
                    </video>
                )}
            </div>
        </ContainerPage>
    )
}