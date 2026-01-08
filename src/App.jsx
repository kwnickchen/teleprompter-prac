import { useState, useEffect, useRef } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Teleprompter from './components/Teleprompter'

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563EB',
    },
    background: {
      default: '#F9FAFB',
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Teleprompter />
    </ThemeProvider>
  )
}

export default App

