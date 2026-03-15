import GetModelById from '@/database/actions/models/GetModelById'
import { Avatar, Box, Typography } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'

import ContainerPage from '@/components/Layout/Layouts'
import VideosViewer from '@/components/VideosViewer'
import { VideoType } from '@/types/Types'
import GaleryView from '@/components/Gallery/GaleryView'

type PageProps = {
    params: Promise<{ id: string }>
    searchParams?: Promise<{ tab?: string }>
}

const Page = async ({ params, searchParams }: PageProps) => {
    const { id } = await params
    const tab = searchParams ? (await searchParams).tab : 'videos'

    const { model, stats, videos, galeries } = await GetModelById(id)
    const isVideos = tab === 'videos'

    return (
        <ContainerPage
            eyebrow="Model profile"
            title={model.name}
            description={`${(stats as any).totalVideos} videos · ${(stats as any).totalGaleries} galerias · ${(stats as any).totalViews?.toLocaleString()} views acumuladas`}
            actions={<Link href={`/pageClients/models/${model._id}`} className="primary-action">Editar modelo</Link>}
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

                        <div className="mt-6 grid gap-3">
                            <div className="rounded-[22px] border border-[var(--border)] bg-white/[0.02] p-4">
                                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Videos</p>
                                <p className="mt-2 text-2xl font-semibold text-white">{(stats as any).totalVideos}</p>
                            </div>
                            <div className="rounded-[22px] border border-[var(--border)] bg-white/[0.02] p-4">
                                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Galerias</p>
                                <p className="mt-2 text-2xl font-semibold text-white">{(stats as any).totalGaleries}</p>
                            </div>
                            <div className="rounded-[22px] border border-[var(--border)] bg-white/[0.02] p-4">
                                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Views</p>
                                <p className="mt-2 text-2xl font-semibold text-white">{(stats as any).totalViews?.toLocaleString()}</p>
                            </div>
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