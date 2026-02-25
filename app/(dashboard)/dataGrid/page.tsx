'use client'

import * as React from 'react'
import { Box, Chip } from '@mui/material'
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid'

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
    return (
        <Box p={4} height="80vh">
            <DataGrid
                rows={rows}
                columns={columns}
                showToolbar
                checkboxSelection
                disableRowSelectionOnClick
                pageSizeOptions={[5, 10, 20]}
                initialState={{
                    pagination: {
                        paginationModel: { pageSize: 5, page: 0 },
                    },
                }}
                slots={{
                    toolbar: GridToolbar,
                }}
            />
        </Box>
    )
}