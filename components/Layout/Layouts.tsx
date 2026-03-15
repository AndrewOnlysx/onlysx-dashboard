import { Box, Typography } from '@mui/material'

import { cn } from '@/lib/utils'

interface Props {
    children: React.ReactNode
    title?: string
    description?: string
    eyebrow?: string
    actions?: React.ReactNode
    className?: string
}

const ContainerPage = ({ children, title, description, eyebrow, actions, className }: Props) => {
    return (
        <Box className={cn('page-shell', className)} sx={{ height: '100%', overflow: 'auto' }}>
            {(title || description || eyebrow || actions) && (
                <Box className="page-shell__header">
                    <Box>
                        {eyebrow && <span className="page-shell__eyebrow">{eyebrow}</span>}
                        {title && (
                            <Typography component="h1" className="page-shell__title" sx={{ mt: eyebrow ? 2 : 0 }}>
                                {title}
                            </Typography>
                        )}
                        {description && (
                            <Typography component="p" className="page-shell__description">
                                {description}
                            </Typography>
                        )}
                    </Box>
                    {actions && <Box className="page-shell__actions">{actions}</Box>}
                </Box>
            )}
            {children}
        </Box>
    )
}

export default ContainerPage