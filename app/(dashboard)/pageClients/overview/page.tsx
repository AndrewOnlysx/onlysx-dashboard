import Link from 'next/link'

import ContainerPage from '@/components/Layout/Layouts'
import { GetAllGalery } from '@/database/actions/galeries/GetAllGallery'
import { GetModels } from '@/database/actions/models/GetModels'
import { GetVideos } from '@/database/actions/videos/GetVideos'

const Page = async () => {
    const [{ models }, { galeries }, { summary }] = await Promise.all([
        GetModels(),
        GetAllGalery(),
        GetVideos()
    ])

    const statCards = [
        {
            label: 'Videos activos',
            value: summary.totalVideos,
            helper: `${summary.totalWithGalleryLinks} enlazados a galerias`
        },
        {
            label: 'Views acumuladas',
            value: summary.totalViews.toLocaleString(),
            helper: 'Base para priorizacion editorial'
        },
        {
            label: 'Modelos',
            value: models.length,
            helper: 'Talento disponible en catalogo'
        },
        {
            label: 'Galerias',
            value: galeries.length,
            helper: `${summary.totalDumpReady} videos con dump listo`
        }
    ]

    const areas = [
        {
            title: 'Videos',
            href: '/pageClients/videos',
            description: 'Gestiona metadata, assets, relaciones y calidad editorial.',
            metric: `${summary.totalVideos} registros`
        },
        {
            title: 'Modelos',
            href: '/pageClients/models',
            description: 'Mantiene perfiles, banners y relacion con videos y galerias.',
            metric: `${models.length} perfiles`
        },
        {
            title: 'Galerias',
            href: '/pageClients/galeries',
            description: 'Organiza imagenes, visibilidad y vinculacion con videos.',
            metric: `${galeries.length} colecciones`
        }
    ]

    return (
        <ContainerPage
            eyebrow="Overview"
            title="Operacion editorial"
            description="Vista ejecutiva del dashboard con acceso directo a las areas operativas y un resumen de volumen sobre videos, modelos y galerias."
        >
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {statCards.map((card) => (
                    <article key={card.label} className="surface-metric p-5">
                        <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">{card.label}</p>
                        <p className="mt-4 text-3xl font-semibold text-white">{card.value}</p>
                        <p className="mt-2 text-sm text-[var(--muted-foreground)]">{card.helper}</p>
                    </article>
                ))}
            </section>

            <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)]">
                <div className="surface-panel p-6">
                    <div className="mb-5 flex items-center justify-between gap-3">
                        <div>
                            <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Areas</p>
                            <h2 className="mt-2 text-2xl font-semibold">Modulos principales</h2>
                        </div>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-3">
                        {areas.map((area) => (
                            <Link key={area.href} href={area.href} className="interactive-card p-5">
                                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">{area.metric}</p>
                                <h3 className="mt-4 text-xl font-semibold text-white">{area.title}</h3>
                                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">{area.description}</p>
                                <span className="mt-5 inline-flex text-sm font-semibold text-[var(--primary)]">Abrir modulo</span>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="surface-panel p-6">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Actividad</p>
                    <h2 className="mt-2 text-2xl font-semibold">Resumen rapido</h2>

                    <div className="mt-6 space-y-4">
                        <div className="rounded-[22px] border border-[var(--border)] bg-white/[0.02] p-4">
                            <p className="text-sm font-semibold text-white">Promedio de duracion</p>
                            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                                {Math.round(summary.averageDurationInSeconds / 60)} min por video en promedio.
                            </p>
                        </div>
                        <div className="rounded-[22px] border border-[var(--border)] bg-white/[0.02] p-4">
                            <p className="text-sm font-semibold text-white">Cobertura de galerias</p>
                            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                                {summary.totalWithGalleryLinks} videos ya tienen relacion editorial con una galeria.
                            </p>
                        </div>
                        <div className="rounded-[22px] border border-[var(--border)] bg-white/[0.02] p-4">
                            <p className="text-sm font-semibold text-white">Capacidad operativa</p>
                            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                                Usa esta vista como punto de entrada para altas, edicion y control de calidad.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </ContainerPage>
    )
}

export default Page