import ContainerPage from '@/components/Layout/Layouts'
import { GetActivityMetrics } from '@/database/actions/activity/GetActivityMetrics'

import ActivityAnalyticsScreen from './components/ActivityAnalyticsScreen'

export const dynamic = 'force-dynamic'

const Page = async () => {
    const result = await GetActivityMetrics(30)

    return (
        <ContainerPage
            eyebrow="Activity"
            title="Metricas y analisis"
            description="Lectura operativa del comportamiento de navegacion a partir del modelo Activity, preparada para exploracion cliente con refresco por rango."
        >
            <ActivityAnalyticsScreen initialMetrics={result.data} />
        </ContainerPage>
    )
}

export default Page