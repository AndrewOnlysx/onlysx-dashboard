
import GetModelById from '@/database/actions/models/GetModelById'
import {
    Box,
    Container,
    Avatar,
    Typography,
    Tabs,
    Tab,
    Button,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Stack
} from '@mui/material'
import Image from 'next/image'
import VideosViewer from '@/components/VideosViewer'
import { VideoType } from '@/types/Types'
import GaleryView from '@/components/GaleryView'

interface Props {
    params: { id: string },
    searchParams?: { tab?: string }
}

const Page = async ({ params, searchParams }: Props) => {
    const { id } =  params
    const tab = searchParams?.tab || 'videos'

    const { model, stats, videos, galeries } = await GetModelById(id)
    console.log({ model, stats, videos, galeries })
    const isVideos = tab === 'videos'

    return (
        <Box sx={{ bgcolor: '#0f0f0f', color: 'white' }}>

            {/* 🔥 Banner */}
            <Box
                sx={{
                    width: '100%',
                    height: 260,
                    position: 'relative',
                    backgroundColor: '#181818',
                    overflow: 'hidden'
                }}
            >
                {model.banner && (
                    <Image
                        src={model.banner}
                        alt="banner"
                        fill
                        style={{ objectFit: 'cover' }}
                    />
                )}
            </Box>

            <Container maxWidth="xl">

                {/* 🔥 Header */}
                <Box sx={{ mt: -8, position: 'relative', zIndex: 2 }}>
                    <Stack direction="row" spacing={4} alignItems="flex-end">

                        <Avatar
                            src={model.image}
                            sx={{
                                width: 140,
                                height: 140,
                                border: '4px solid #0f0f0f'
                            }}
                        />

                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h4" fontWeight={700}>
                                {model.name}
                            </Typography>

                            <Typography variant="body2" sx={{ color: '#aaa', mt: 1 }}>
                                {(stats as any).totalVideos} videos • {(stats as any).totalGaleries} galerías • {(stats as any).totalViews?.toLocaleString()} views
                            </Typography>
                        </Box>

                        <Button
                            variant="contained"
                            sx={{
                                bgcolor: 'white',
                                color: 'black',
                                borderRadius: 20,
                                px: 3,
                                textTransform: 'none',
                                fontWeight: 600,
                                '&:hover': { bgcolor: '#e5e5e5' }
                            }}
                        >
                            Suscribirse
                        </Button>
                    </Stack>
                </Box>

                {/* 🔥 Tabs */}
                <Box sx={{ mt: 6, borderBottom: '1px solid #222' }}>
                    <Tabs
                        value={tab}
                        textColor="inherit"
                        indicatorColor="secondary"
                        sx={{
                            '& .MuiTabs-indicator': {
                                backgroundColor: 'white'
                            }
                        }}
                    >
                        <Tab
                            label="Videos"
                            value="videos"
                            href={`?tab=videos`}
                            sx={{ textTransform: 'none' }}
                        />
                        <Tab
                            label="Galerías"
                            value="galeries"
                            href={`?tab=galeries`}
                            sx={{ textTransform: 'none' }}
                        />
                    </Tabs>
                </Box>

                {/* 🔥 Contenido */}
                <Box sx={{ mt: 4 }}>


                    {isVideos ?
                        <VideosViewer videos={videos as VideoType[]} /> :
                        <GaleryView galeries={galeries as any} />
                    }

                </Box>
            </Container>
        </Box>
    )
}

export default Page