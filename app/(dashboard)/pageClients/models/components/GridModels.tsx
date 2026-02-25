'use client'
import { GridToolbar } from '@mui/x-data-grid/components/toolbar'
import { NextPage } from 'next'
import ColumnsModels from '../data/Scheme'
import { DataGrid } from '@mui/x-data-grid/DataGrid'

interface Props { models: any[] }

const GridModels: NextPage<Props> = ({ models }) => {
    return <DataGrid
        rows={models}
        columns={ColumnsModels}
        showToolbar
        checkboxSelection
        disableRowSelectionOnClick
        rowHeight={120}
        pageSizeOptions={[100, 200, 500]}
        initialState={{
            pagination: {
                paginationModel: { pageSize: 100, page: 0 },
            },
        }}
        slots={{
            toolbar: GridToolbar,
        }}
    />
}

export default GridModels