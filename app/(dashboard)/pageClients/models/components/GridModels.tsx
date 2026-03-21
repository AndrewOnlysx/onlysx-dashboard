'use client'
import { NextPage } from 'next'
import ColumnsModels from '../data/Scheme'
import { DataGrid } from '@mui/x-data-grid/DataGrid'
import { useRouter } from 'next/navigation'

interface Props { models: any[] }

const GridModels: NextPage<Props> = ({ models }) => {
    const router = useRouter()

    return <div className="surface-panel data-grid-shell p-4" style={{ height: 'calc(100dvh - 320px)', minHeight: '560px', maxHeight: 'calc(100dvh - 280px)' }}>
        <DataGrid
            rows={models}
            columns={ColumnsModels}
            showToolbar
            disableRowSelectionOnClick
            rowHeight={120}
            sx={{ height: '100%' }}
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
    </div>
}

export default GridModels