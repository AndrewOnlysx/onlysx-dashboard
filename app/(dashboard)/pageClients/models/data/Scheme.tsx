import { GridColDef } from "@mui/x-data-grid"
import { IconButton } from "@mui/material"
import { HugeiconsIcon } from '@hugeicons/react'
import { Edit04Icon } from '@hugeicons-pro/core-stroke-standard';
import Link from "next/link";

const ColumnsModels: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
        field: 'image', headerAlign: 'center', headerName: 'Image', width: 160, renderCell: (params) => {
            const imageUrl = params.value as string
            return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>

                <img src={imageUrl} alt="Model Image" style={{ width: '80px', borderRadius: 4 }} />
            </div>
        }
    },
    { field: 'name', headerName: 'Name', flex: 1, editable: true },
    { field: 'totalVideos', headerName: 'Videos', width: 150 },
    { field: 'totalGaleries', headerName: 'Galeries', width: 150 },
    {
        field: 'actions', headerName: 'Actions', width: 150, renderCell: (params) => {
            return <Link href={`/pageClients/models/${params.row._id}`}>
                <IconButton >
                    <HugeiconsIcon

                        icon={Edit04Icon}
                        size={24}
                        color="currentColor"
                        strokeWidth={1.5}
                    /></IconButton>
            </Link>

        }
    },

]

export default ColumnsModels
