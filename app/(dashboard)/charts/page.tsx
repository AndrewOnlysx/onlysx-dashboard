'use client'

import * as React from 'react'
import { Box, Grid, Paper, Typography, Switch, FormControlLabel, Slider, Select, MenuItem } from '@mui/material'
import LineChart from './components/LineChart'


export default function Page() {

    // =========================
    // GLOBAL DATASETS
    // =========================
    const datasetA = [10, 40, 25, 60, 35]
    const datasetB = [5, 20, 15, 30, 18]

    // =========================
    // BAR CHART STATE
    // =========================
    const [barHeight, setBarHeight] = React.useState(300)
    const [barColor, setBarColor] = React.useState('#FF50A4')
    const [barGrid, setBarGrid] = React.useState(true)
    const [barDataset, setBarDataset] = React.useState<'A' | 'B'>('A')

    // =========================
    // LINE CHART STATE
    // =========================
    // Datos
    const [lineDataset, setLineDataset] = React.useState<'A' | 'B'>('A')

    // Dimensiones
    const [lineHeight, setLineHeight] = React.useState(300)
    const [lineWidth, setLineWidth] = React.useState(600)

    // Ejes
    const [xAxisScaleType, setXAxisScaleType] = React.useState<'linear' | 'band' | 'time'>('band')
    const [yAxisScaleType, setYAxisScaleType] = React.useState<'linear' | 'log' | 'symlog'>('linear')
    const [yAxisDomainMin, setYAxisDomainMin] = React.useState<number | undefined>(undefined)
    const [yAxisDomainMax, setYAxisDomainMax] = React.useState<number | undefined>(undefined)

    // Aspectos del gráfico
    const [showGridHorizontal, setShowGridHorizontal] = React.useState(true)
    const [showGridVertical, setShowGridVertical] = React.useState(false)
    const [showLegend, setShowLegend] = React.useState(true)
    const [showArea, setShowArea] = React.useState(false)
    const [curveType, setCurveType] = React.useState<'linear' | 'monotoneX' | 'step' | 'natural'>('linear')
    const [connectNulls, setConnectNulls] = React.useState(false)
    const [baseline, setBaseline] = React.useState<'min' | 'max' | number | undefined>(undefined)
    const [skipAnimation, setSkipAnimation] = React.useState(false)
    const [colorPalette, setColorPalette] = React.useState<string>('#FF50A4')

    // Eventos
    const [onLineClickEnabled, setOnLineClickEnabled] = React.useState(false)
    const [onMarkClickEnabled, setOnMarkClickEnabled] = React.useState(false)

    // Interacción con ejes
    const [axisHighlightX, setAxisHighlightX] = React.useState<'none' | 'line' | 'band'>('line')
    const [axisHighlightY, setAxisHighlightY] = React.useState<'none' | 'line' | 'band'>('none')


    const datasetALine = [
        { month: 'Jan', value: 10 },
        { month: 'Feb', value: 18 },
        { month: 'Mar', value: 25 },
        { month: 'Apr', value: 32 },
        { month: 'May', value: 45 },
        { month: 'Jun', value: 55 },
        { month: 'Jul', value: 60 },
        { month: 'Aug', value: 72 },
        { month: 'Sep', value: 80 },
        { month: 'Oct', value: 95 },
        { month: 'Nov', value: 110 },
        { month: 'Dec', value: 130 },
    ]
    const datasetBLine = [
        { month: 'Jan', value: 50 },
        { month: 'Feb', value: null },
        { month: 'Mar', value: 30 },
        { month: 'Apr', value: 70 },
        { month: 'May', value: null },
        { month: 'Jun', value: 40 },
        { month: 'Jul', value: 85 },
        { month: 'Aug', value: 20 },
        { month: 'Sep', value: null },
        { month: 'Oct', value: 95 },
        { month: 'Nov', value: 60 },
        { month: 'Dec', value: 100 },
    ]
    // =========================
    // PIE CHART STATE
    // =========================
    const [pieHeight, setPieHeight] = React.useState(300)
    const [pieInnerRadius, setPieInnerRadius] = React.useState(40)
    const [pieDataset, setPieDataset] = React.useState<'A' | 'B'>('A')

    return (
        <Box p={4}>
            <Typography variant="h4" mb={4}>Charts Playground</Typography>

            {/* ========================= BAR CHART ========================= */}
            <Grid size={12}>
                <LineChart
                />

            </Grid>
        </Box>
    )
}