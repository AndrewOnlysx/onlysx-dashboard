'use client'
import { GridToolbar } from '@mui/x-data-grid/components/toolbar'
import { NextPage } from 'next'
import ColumnsModels from '../data/Scheme'
import { DataGrid } from '@mui/x-data-grid/DataGrid'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
interface Props { models: any[] }

const GridModels: NextPage<Props> = ({ models }) => {
    const router = useRouter()
    return <DataGrid
        rows={models}
        columns={ColumnsModels}
        showToolbar

        disableRowSelectionOnClick
        rowHeight={120}

        onCellClick={(params) => {
            router.push(`/pageClients/models/view/${params.row._id}`)
        }}
        pageSizeOptions={[100, 200, 500]}
        initialState={{
            pagination: {
                paginationModel: { pageSize: 100, page: 0 },
            },
        }}

    />
}

export default GridModels