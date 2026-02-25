import { Box } from '@mui/material'
import { NextPage } from 'next'

interface Props {
    children: React.ReactNode
}

const ContainerPage: NextPage<Props> = ({ children }) => {
    return <Box p={4} style={{

        height: '100%',
        overflow: 'auto',
    }}>{children}</Box>
}

export default ContainerPage