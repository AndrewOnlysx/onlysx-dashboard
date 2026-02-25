'use client'

import * as React from 'react'
import {
  Typography,
  Box,
  Grid,
  Button,
  Card,
  CardContent,
  TextField,
  Alert,
  Chip,
  Switch,
  Checkbox,
  Radio,
  RadioGroup,
  FormControlLabel,
  Tabs,
  Tab,
  Slider,
  LinearProgress,
  CircularProgress,
  Divider,
  Avatar,
  Badge,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  Snackbar,
} from '@mui/material'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { PageContainer } from '@toolpad/core/PageContainer'

export default function HomePage() {
  const [tab, setTab] = React.useState(0)
  const [openDialog, setOpenDialog] = React.useState(false)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [openSnackbar, setOpenSnackbar] = React.useState(false)

  return (
    <PageContainer>
      <Box p={4} display="flex" flexDirection="column" gap={4}>
        <Typography variant="h4">Material UI Theme Test</Typography>

        {/* BUTTONS */}
        <Card>
          <CardContent>
            <Typography variant="h6">Buttons</Typography>
            <Grid container spacing={2} mt={1}>
              {['primary', 'success', 'warning', 'error', 'info'].map((color) => (
                <Grid size={4} key={color}>
                  <Button variant="contained" color={color as any}>
                    Contained {color}
                  </Button>
                </Grid>
              ))}
              {['primary', 'success', 'warning', 'error', 'info'].map((color) => (
                <Grid size={4} key={color + 'outlined'}>
                  <Button variant="outlined" color={color as any}>
                    Outlined {color}
                  </Button>
                </Grid>
              ))}
              {['primary', 'success', 'warning', 'error', 'info'].map((color) => (
                <Grid size={4} key={color + 'text'}>
                  <Button variant="text" color={color as any}>
                    Text {color}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* INPUTS */}
        <Card>
          <CardContent>
            <Typography variant="h6">Inputs</Typography>
            <Grid container spacing={2} mt={1}>
              <Grid size={4}>
                <TextField fullWidth label="Outlined" variant="outlined" />
              </Grid>
              <Grid size={4}>
                <TextField fullWidth label="Filled" variant="filled" />
              </Grid>
              <Grid size={4}>
                <TextField fullWidth label="Standard" variant="standard" />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* ALERTS */}
        <Card>
          <CardContent>
            <Typography variant="h6">Alerts</Typography>
            <Box display="flex" flexDirection="column" gap={2} mt={1}>
              <Alert severity="success">Success alert</Alert>
              <Alert severity="info">Info alert</Alert>
              <Alert severity="warning">Warning alert</Alert>
              <Alert severity="error">Error alert</Alert>
            </Box>
          </CardContent>
        </Card>

        {/* CHIPS */}
        <Card>
          <CardContent>
            <Typography variant="h6">Chips</Typography>
            <Box display="flex" gap={2} mt={1}>
              <Chip label="Primary" color="primary" />
              <Chip label="Success" color="success" />
              <Chip label="Warning" color="warning" />
              <Chip label="Error" color="error" />
              <Chip label="Info" color="info" />
            </Box>
          </CardContent>
        </Card>

        {/* SWITCH / CHECKBOX / RADIO */}
        <Card>
          <CardContent>
            <Typography variant="h6">Selection Controls</Typography>
            <Box display="flex" gap={4} mt={1}>
              <Switch defaultChecked />
              <Checkbox defaultChecked />
              <Radio defaultChecked />
            </Box>
          </CardContent>
        </Card>

        {/* TABS */}
        <Card>
          <CardContent>
            <Typography variant="h6">Tabs</Typography>
            <Tabs value={tab} onChange={(e, v) => setTab(v)}>
              <Tab label="Tab 1" />
              <Tab label="Tab 2" />
            </Tabs>
          </CardContent>
        </Card>

        {/* PROGRESS */}
        <Card>
          <CardContent>
            <Typography variant="h6">Progress</Typography>
            <Box display="flex" gap={4} mt={2}>
              <LinearProgress sx={{ width: 200 }} />
              <CircularProgress />
            </Box>
          </CardContent>
        </Card>

        {/* TABLE */}
        <Card>
          <CardContent>
            <Typography variant="h6">Table</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Role</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Joel</TableCell>
                  <TableCell>Admin</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* ACCORDION */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Accordion
          </AccordionSummary>
          <AccordionDetails>
            Content inside accordion
          </AccordionDetails>
        </Accordion>

        {/* DIALOG */}
        <Button onClick={() => setOpenDialog(true)}>Open Dialog</Button>
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogContent>Dialog content</DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* MENU */}
        <Button onClick={(e) => setAnchorEl(e.currentTarget)}>Open Menu</Button>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          <MenuItem onClick={() => setAnchorEl(null)}>Profile</MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)}>Logout</MenuItem>
        </Menu>

        {/* SNACKBAR */}
        <Button onClick={() => setOpenSnackbar(true)}>Open Snackbar</Button>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          message="This is a snackbar"
        />
      </Box>
    </PageContainer>
  )
}