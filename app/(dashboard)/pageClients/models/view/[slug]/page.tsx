import GetModelById from '@/database/actions/models/GetModelById'
import { Avatar, Box, Typography } from '@mui/material'
import { HugeiconsIcon } from '@hugeicons/react'
import { Album01Icon, Film01Icon, ViewIcon } from '@hugeicons-pro/core-solid-rounded'
import Image from 'next/image'
import Link from 'next/link'

import ContainerPage from '@/components/Layout/Layouts'
import VideosViewer from '@/components/VideosViewer'
import { VideoType } from '@/types/Types'
import GaleryView from '@/components/Gallery/GaleryView'

type PageProps = {
    params: Promise<{ slug: string }>
    searchParams?: Promise<{ tab?: string }>
}

const Page = async ({ params, searchParams }: PageProps) => {
    const { slug } = await params
    const tab = searchParams ? (await searchParams).tab : 'videos'

    const { model, stats, videos, galeries } = await GetModelById(slug)
    const isVideos = tab === 'videos'
    const metricCards = [
        {
            label: 'Videos',
            value: (stats as any).totalVideos,
            icon: Film01Icon,
            strokeWidth: 0
        },
        {
            label: 'Galerias',
            value: (stats as any).totalGaleries,
            icon: Album01Icon,
            strokeWidth: 0
        },
        {
            label: 'Views',
            value: (stats as any).totalViews?.toLocaleString(),
            icon: ViewIcon,
            strokeWidth: 0
        }
    ]

    return (
        <ContainerPage
            eyebrow="Model profile"
            title={model.name}
            description={`${(stats as any).totalVideos} videos · ${(stats as any).totalGaleries} galerias · ${(stats as any).totalViews?.toLocaleString()} views acumuladas`}
            actions={<Link href={`/pageClients/models/${model.slug}`} className="primary-action">Editar modelo</Link>}
        >
            <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
                <section className="surface-panel overflow-hidden">
                    <div className="relative h-44 w-full bg-[rgba(255,255,255,0.03)]">
                        {model.banner ? (
                            <Image
                                src={model.banner}
                                alt="banner"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        ) : null}
                    </div>

                    <div className="p-6">
                        <Avatar
                            src={model.image}
                            sx={{
                                width: 120,
                                height: 120,
                                marginTop: '-72px',
                                marginBottom: 3,
                                border: '4px solid #171B22'
                            }}
                        />

                        <Typography variant="h5" fontWeight={700}>{model.name}</Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            Perfil editorial con acceso centralizado a activos audiovisuales y galerias asociadas.
                        </Typography>

                        <div className="mt-6 gap-3 flex">
                            {metricCards.map((metric) => (
                                <div
                                    key={metric.label}
                                    style={{ alignItems: 'center', gap: 4 }}
                                    className='flex '
                                >
                                    <div
                                        className="flex h-10 w-10 items-center justify-center rounded-[12px]   text-[var(--primary)]"
                                    >
                                        <HugeiconsIcon
                                            icon={metric.icon}
                                            size={20}
                                            color="currentColor"
                                            strokeWidth={metric.strokeWidth}
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="mt-1 text-md  text-white">{metric.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="surface-panel p-6">
                    <div className="mb-6 flex flex-wrap gap-3 border-b border-[var(--border)] pb-5">
                        <Link href={`?tab=videos`} className={isVideos ? 'accent-pill' : 'muted-pill'}>Videos</Link>
                        <Link href={`?tab=galeries`} className={!isVideos ? 'accent-pill' : 'muted-pill'}>Galerias</Link>
                    </div>

                    <Box>
                        {isVideos ?
                            <VideosViewer videos={videos as VideoType[]} /> :
                            <GaleryView galeries={galeries as any} />
                        }
                    </Box>
                </section>
            </div>
        </ContainerPage>
    )
}

export default Page