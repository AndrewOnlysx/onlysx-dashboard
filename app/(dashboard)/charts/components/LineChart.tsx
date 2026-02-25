'use client'

import { NextPage } from 'next'
import * as React from 'react'
import {
    Box,
    Grid,
    Paper,
    Typography,
    Switch,
    FormControlLabel,
    Slider,
    Select,
    MenuItem,
} from '@mui/material'
import { LineChart as MuiLineChart } from '@mui/x-charts'

interface Props { }

const LineChartPage: NextPage<Props> = ({ }) => {
    // =========================
    // DATASETS
    // =========================
    const datasetA = [
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

    const datasetB = [
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

    const datasetC = [
        { month: 'Jan', value: 5 },
        { month: 'Feb', value: 20 },
        { month: 'Mar', value: 100 },
        { month: 'Apr', value: 500 },
        { month: 'May', value: 2000 },
        { month: 'Jun', value: 10000 },
        { month: 'Jul', value: 5000 },
        { month: 'Aug', value: 2500 },
        { month: 'Sep', value: 1500 },
        { month: 'Oct', value: 800 },
        { month: 'Nov', value: 300 },
        { month: 'Dec', value: 50 },
    ]

    // =========================
    // STATES DE CONTROL
    // =========================
    const [lineDataset, setLineDataset] = React.useState<'A' | 'B' | 'C'>('A')

    // Dimensiones
    const [lineHeight, setLineHeight] = React.useState(300)
    const [lineWidth, setLineWidth] = React.useState(800)

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

    // =========================
    // DATASET SELECCIONADO
    // =========================
    const selectedDataset =
        lineDataset === 'A' ? datasetA : lineDataset === 'B' ? datasetB : datasetC



    // =========================
    // Puntos (marks)
    const [showMarks, setShowMarks] = React.useState(true)
    const [markSize, setMarkSize] = React.useState(6)
    const [markOutlined, setMarkOutlined] = React.useState(true)

    // Area con shade
    const [areaGradient, setAreaGradient] = React.useState(true)
    const [areaGradientFrom, setAreaGradientFrom] = React.useState('rgba(255,80,164,0.6)')
    const [areaGradientTo, setAreaGradientTo] = React.useState('rgba(255,80,164,0.05)')

    // Labels de los ejes
    const [showXAxisTicks, setShowXAxisTicks] = React.useState(true)
    const [showYAxisTicks, setShowYAxisTicks] = React.useState(true)
    const [xAxisTickColor, setXAxisTickColor] = React.useState('#CBCBCB')
    const [yAxisTickColor, setYAxisTickColor] = React.useState('#CBCBCB')
    const [xAxisTickFontSize, setXAxisTickFontSize] = React.useState(12)
    const [yAxisTickFontSize, setYAxisTickFontSize] = React.useState(12)
    const [xAxisShowLine, setXAxisShowLine] = React.useState(true)
    const [yAxisShowLine, setYAxisShowLine] = React.useState(true)

    const dataset = [
        { date: new Date('2024-01-01'), v5: 5000, v6: 10000, v7: 15000 },
        { date: new Date('2024-02-01'), v5: 10000, v6: 15000, v7: 20000 },
        { date: new Date('2024-03-01'), v5: 20000, v6: 25000, v7: 30000 },
        // ... más meses
    ]
    return (
        <Box p={4}>
            <Typography variant="h4" mb={4}>
                Line Chart Playground
            </Typography>

            <Grid container spacing={4}>
                {/* ============== GRÁFICO ============== */}
                <Grid size={8}>
                    <Paper sx={{ p: 2 }}>
                        <MuiLineChart
                            dataset={selectedDataset}
                            height={lineHeight}
                            width={lineWidth}
                            xAxis={[
                                {
                                    dataKey: 'month',
                                    scaleType: xAxisScaleType,
                                    //  showTicks: showXAxisTicks,
                                    //  tickLine: xAxisShowLine,
                                    //  tickStyle: { fontSize: xAxisTickFontSize, fill: xAxisTickColor },
                                },
                            ]}
                            yAxis={[
                                {
                                    dataKey: 'value',
                                    scaleType: yAxisScaleType,
                                    //     domain: [yAxisDomainMin, yAxisDomainMax],
                                    //    showTicks: showYAxisTicks,
                                    //    tickLine: yAxisShowLine,
                                    //   tickStyle: { fontSize: yAxisTickFontSize, fill: yAxisTickColor },
                                },
                            ]}
                            series={[
                                {
                                    dataKey: 'value',
                                    label: 'Revenue',
                                    color: colorPalette,
                                    area: showArea,
                                    //  areaGradient: areaGradient
                                    //     ? { from: areaGradientFrom, to: areaGradientTo }
                                    //     : undefined,
                                    curve: curveType,
                                    connectNulls,
                                    baseline,
                                    showMark: showMarks,
                                    //     markSize,
                                    //   markStyle: markOutlined
                                    //       ? { stroke: colorPalette, strokeWidth: 2, fill: 'white' }
                                    //       : { fill: colorPalette },
                                },
                            ]}
                            grid={{ horizontal: showGridHorizontal, vertical: showGridVertical }}
                            //        legend={showLegend ? { position: 'top' } : undefined}
                            axisHighlight={{ x: axisHighlightX, y: axisHighlightY }}
                            skipAnimation={skipAnimation}
                            onLineClick={onLineClickEnabled ? (event, params) => console.log('Line clicked', params) : undefined}
                            onMarkClick={onMarkClickEnabled ? (event, params) => console.log('Mark clicked', params) : undefined}

                        />
                        {/*
                        <MuiLineChart
                            dataset={dataset}
                            height={400}
                            width={800}
                            xAxis={[
                                { dataKey: 'date', scaleType: 'time', format: (d) => d.toLocaleDateString() }
                            ]}
                            yAxis={[{ dataKey: 'value', scaleType: 'linear' }]}
                            series={[
                                {
                                    dataKey: 'v5',
                                    label: 'v5',
                                    color: 'rgba(66, 133, 244, 1)',
                                    area: true,
                                    areaColor: 'rgba(66, 133, 244, 0.3)',
                                    curve: 'monotoneX',
                                },
                                {
                                    dataKey: 'v6',
                                    label: 'v6',
                                    color: 'rgba(251, 188, 5, 1)',
                                    area: true,
                                    areaColor: 'rgba(251, 188, 5, 0.3)',
                                    curve: 'monotoneX',
                                },
                                {
                                    dataKey: 'v7',
                                    label: 'v7',
                                    color: 'rgba(234, 67, 53, 1)',
                                    area: true,
                                    areaColor: 'rgba(234, 67, 53, 0.3)',
                                    curve: 'monotoneX',
                                },
                            ]}
                            legend={{ position: 'top' }}
                            tooltip
                        />*/}
                    </Paper>
                </Grid>

                {/* ============== PANEL DE CUSTOMIZACIÓN ============== */}
                <Grid size={4}>
                    <Paper sx={{ p: 2 }}>
                        <FormControlLabel
                            control={<Switch checked={showMarks} onChange={(e) => setShowMarks(e.target.checked)} />}
                            label="Show Marks"
                        />

                        <Typography gutterBottom mt={2}>Mark Size</Typography>
                        <Slider min={2} max={20} value={markSize} onChange={(e, v) => setMarkSize(v as number)} />

                        <FormControlLabel
                            control={<Switch checked={markOutlined} onChange={(e) => setMarkOutlined(e.target.checked)} />}
                            label="Mark Outlined"
                        />

                        <FormControlLabel
                            control={<Switch checked={areaGradient} onChange={(e) => setAreaGradient(e.target.checked)} />}
                            label="Area Gradient"
                        />

                        <Typography gutterBottom mt={2}>Area Gradient From</Typography>
                        <input type="color" value={areaGradientFrom} onChange={(e) => setAreaGradientFrom(e.target.value)} />
                        <Typography gutterBottom mt={2}>Area Gradient To</Typography>
                        <input type="color" value={areaGradientTo} onChange={(e) => setAreaGradientTo(e.target.value)} />

                        <FormControlLabel
                            control={<Switch checked={showXAxisTicks} onChange={(e) => setShowXAxisTicks(e.target.checked)} />}
                            label="Show X Axis Ticks"
                        />
                        <FormControlLabel
                            control={<Switch checked={xAxisShowLine} onChange={(e) => setXAxisShowLine(e.target.checked)} />}
                            label="Show X Axis Tick Lines"
                        />
                        <Typography gutterBottom mt={2}>X Axis Tick Font Size</Typography>
                        <Slider min={8} max={24} value={xAxisTickFontSize} onChange={(e, v) => setXAxisTickFontSize(v as number)} />

                        <FormControlLabel
                            control={<Switch checked={showYAxisTicks} onChange={(e) => setShowYAxisTicks(e.target.checked)} />}
                            label="Show Y Axis Ticks"
                        />
                        <FormControlLabel
                            control={<Switch checked={yAxisShowLine} onChange={(e) => setYAxisShowLine(e.target.checked)} />}
                            label="Show Y Axis Tick Lines"
                        />
                        <Typography gutterBottom mt={2}>Y Axis Tick Font Size</Typography>
                        <Slider min={8} max={24} value={yAxisTickFontSize} onChange={(e, v) => setYAxisTickFontSize(v as number)} />
                        <Typography variant="h6">Line Chart Settings</Typography>

                        {/* Dataset */}
                        <Typography gutterBottom mt={2}>
                            Dataset
                        </Typography>
                        <Select fullWidth value={lineDataset} onChange={(e) => setLineDataset(e.target.value as any)}>
                            <MenuItem value="A">Dataset A</MenuItem>
                            <MenuItem value="B">Dataset B</MenuItem>
                            <MenuItem value="C">Dataset C</MenuItem>
                        </Select>

                        {/* Dimensiones */}
                        <Typography gutterBottom mt={2}>
                            Height
                        </Typography>
                        <Slider min={200} max={800} value={lineHeight} onChange={(e, v) => setLineHeight(v as number)} />

                        <Typography gutterBottom mt={2}>
                            Width
                        </Typography>
                        <Slider min={300} max={1200} value={lineWidth} onChange={(e, v) => setLineWidth(v as number)} />

                        {/* Colores */}
                        <Typography gutterBottom mt={2}>
                            Color Palette
                        </Typography>
                        <Select fullWidth value={colorPalette} onChange={(e) => setColorPalette(e.target.value)}>
                            <MenuItem value="#FF50A4">Primary</MenuItem>
                            <MenuItem value="#4CAF50">Success</MenuItem>
                            <MenuItem value="#2196F3">Info</MenuItem>
                            <MenuItem value="#FF9800">Warning</MenuItem>
                            <MenuItem value="#F44336">Error</MenuItem>
                        </Select>

                        {/* Grid */}
                        <FormControlLabel
                            control={<Switch checked={showGridHorizontal} onChange={(e) => setShowGridHorizontal(e.target.checked)} />}
                            label="Show Horizontal Grid"
                        />
                        <FormControlLabel
                            control={<Switch checked={showGridVertical} onChange={(e) => setShowGridVertical(e.target.checked)} />}
                            label="Show Vertical Grid"
                        />

                        {/* Area */}
                        <FormControlLabel
                            control={<Switch checked={showArea} onChange={(e) => setShowArea(e.target.checked)} />}
                            label="Show Area"
                        />

                        {/* Curve */}
                        <Typography gutterBottom mt={2}>
                            Curve Type
                        </Typography>
                        <Select fullWidth value={curveType} onChange={(e) => setCurveType(e.target.value as any)}>
                            <MenuItem value="linear">Linear</MenuItem>
                            <MenuItem value="monotoneX">Monotone</MenuItem>
                            <MenuItem value="step">Step</MenuItem>
                            <MenuItem value="natural">Natural</MenuItem>
                        </Select>

                        {/* Connect Nulls */}
                        <FormControlLabel
                            control={<Switch checked={connectNulls} onChange={(e) => setConnectNulls(e.target.checked)} />}
                            label="Connect Nulls"
                        />

                        {/* Legend */}
                        <FormControlLabel
                            control={<Switch checked={showLegend} onChange={(e) => setShowLegend(e.target.checked)} />}
                            label="Show Legend"
                        />

                        {/* Animation */}
                        <FormControlLabel
                            control={<Switch checked={skipAnimation} onChange={(e) => setSkipAnimation(e.target.checked)} />}
                            label="Skip Animation"
                        />

                        {/* Axis Highlight */}
                        <Typography gutterBottom mt={2}>
                            Axis Highlight X
                        </Typography>
                        <Select fullWidth value={axisHighlightX} onChange={(e) => setAxisHighlightX(e.target.value as any)}>
                            <MenuItem value="none">None</MenuItem>
                            <MenuItem value="line">Line</MenuItem>
                            <MenuItem value="band">Band</MenuItem>
                        </Select>

                        <Typography gutterBottom mt={2}>
                            Axis Highlight Y
                        </Typography>
                        <Select fullWidth value={axisHighlightY} onChange={(e) => setAxisHighlightY(e.target.value as any)}>
                            <MenuItem value="none">None</MenuItem>
                            <MenuItem value="line">Line</MenuItem>
                            <MenuItem value="band">Band</MenuItem>
                        </Select>

                        {/* Eventos */}
                        <FormControlLabel
                            control={<Switch checked={onLineClickEnabled} onChange={(e) => setOnLineClickEnabled(e.target.checked)} />}
                            label="Enable Line Click"
                        />
                        <FormControlLabel
                            control={<Switch checked={onMarkClickEnabled} onChange={(e) => setOnMarkClickEnabled(e.target.checked)} />}
                            label="Enable Mark Click"
                        />
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    )
}

export default LineChartPage