'use client'

import { Grid, Typography } from '@mui/material'

import ContainerPage from '@/components/Layout/Layouts'
import LineChart from './components/LineChart'


export default function Page() {
    return (
        <ContainerPage
            eyebrow="Analytics"
            title="Exploracion de graficas"
            description="Sandbox interno para validar configuraciones de graficas bajo el mismo sistema corporativo del dashboard."
        >
            <div className="surface-panel p-6">
                <Typography variant="h6" mb={1}>Line chart playground</Typography>
                <Typography variant="body2" mb={4}>
                    Configura datasets, comportamiento y estilos sin salir del entorno visual estandarizado de la plataforma.
                </Typography>

                <Grid size={12}>
                    <LineChart />
                </Grid>
            </div>
        </ContainerPage>
    )
}