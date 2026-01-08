import { useState, useEffect, useRef } from 'react'
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Slider,
  Paper,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import StopIcon from '@mui/icons-material/Stop'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'

const Teleprompter = () => {
  const [text, setText] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(50)
  const [fontSize, setFontSize] = useState(28)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const displayRef = useRef(null)
  const fullscreenRef = useRef(null)
  const animationRef = useRef(null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  // 滾動動畫
  useEffect(() => {
    if (isPlaying && displayRef.current) {
      const container = displayRef.current
      const maxScroll = container.scrollHeight - container.clientHeight
      const scrollSpeed = (speed / 100) * 2 // 調整速度倍率

      const animate = () => {
        setScrollPosition((prev) => {
          const next = prev + scrollSpeed
          if (next >= maxScroll) {
            setIsPlaying(false)
            return maxScroll
          }
          return next
        })
        animationRef.current = requestAnimationFrame(animate)
      }

      animationRef.current = requestAnimationFrame(animate)
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    } else if (!isPlaying && animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
  }, [isPlaying, speed])

  // 同步滾動位置
  useEffect(() => {
    if (displayRef.current) {
      displayRef.current.scrollTop = scrollPosition
    }
  }, [scrollPosition])

  // 鍵盤快捷鍵
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault()
        setIsPlaying((prev) => !prev)
      } else if (e.code === 'KeyR' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault()
        handleStop()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev)
  }

  const handleStop = () => {
    setIsPlaying(false)
    setScrollPosition(0)
    if (displayRef.current) {
      displayRef.current.scrollTop = 0
    }
  }

  const handleFullscreen = () => {
    if (!isFullscreen) {
      if (fullscreenRef.current?.requestFullscreen) {
        fullscreenRef.current.requestFullscreen()
      } else if (fullscreenRef.current?.webkitRequestFullscreen) {
        fullscreenRef.current.webkitRequestFullscreen()
      } else if (fullscreenRef.current?.msRequestFullscreen) {
        fullscreenRef.current.msRequestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('msfullscreenchange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('msfullscreenchange', handleFullscreenChange)
    }
  }, [])

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      {/* 頂部標題列 */}
      <Box
        sx={{
          width: '100%',
          height: '56px',
          backgroundColor: '#111827',
          color: '#F9FAFB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          sx={{
            fontSize: '18px',
            fontWeight: 'bold',
            fontFamily: 'Inter, Segoe UI, sans-serif',
          }}
        >
          提詞器
        </Typography>
      </Box>

      {/* 主視覺區 */}
      <Container
        maxWidth="lg"
        sx={{
          mt: 3,
          mb: 3,
          px: { xs: 2, md: 3 },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            backgroundColor: '#F9FAFB',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            p: { xs: 2, md: 3 },
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3,
            mb: 3,
          }}
        >
          {/* 左側文字編輯區 */}
          <Box
            sx={{
              width: { xs: '100%', md: '45%' },
              height: '320px',
            }}
          >
            <TextField
              multiline
              fullWidth
              rows={12}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="請輸入您的演講稿..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E5E7EB',
                  color: '#111827',
                  fontFamily: 'Menlo, Consolas, monospace',
                  fontSize: '16px',
                  '& fieldset': {
                    borderColor: '#E5E7EB',
                  },
                  '&:hover fieldset': {
                    borderColor: '#E5E7EB',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#2563EB',
                  },
                },
                '& .MuiInputBase-input': {
                  caretColor: '#2563EB',
                },
                height: '100%',
                '& .MuiInputBase-root': {
                  height: '100%',
                },
                '& textarea': {
                  height: '100% !important',
                  overflow: 'auto !important',
                },
              }}
            />
          </Box>

          {/* 右側提詞顯示區 */}
          <Box
            ref={fullscreenRef}
            sx={{
              width: { xs: '100%', md: '55%' },
              height: '320px',
              backgroundColor: '#0B1220',
              color: '#FFFFFF',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <Box
              ref={displayRef}
              sx={{
                p: 3,
                fontSize: `${fontSize}px`,
                fontWeight: 'bold',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                height: '100%',
                overflow: 'auto',
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
                scrollbarWidth: 'none',
              }}
            >
              {text || '請在左側輸入您的演講稿...'}
            </Box>
          </Box>
        </Paper>

        {/* 控制面板容器 */}
        <Paper
          elevation={0}
          sx={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E7EB',
            p: 3,
            borderRadius: 1,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 3,
              alignItems: { xs: 'stretch', sm: 'center' },
              flexWrap: 'wrap',
            }}
          >
            {/* 速度調節滑桿 */}
            <Box sx={{ width: { xs: '100%', sm: '220px' } }}>
              <Typography
                sx={{
                  fontSize: '14px',
                  color: '#111827',
                  mb: 1,
                }}
              >
                速度: {speed}%
              </Typography>
              <Slider
                value={speed}
                onChange={(e, newValue) => setSpeed(newValue)}
                min={10}
                max={100}
                sx={{
                  color: '#2563EB',
                  '& .MuiSlider-track': {
                    backgroundColor: '#2563EB',
                  },
                  '& .MuiSlider-rail': {
                    backgroundColor: '#E5E7EB',
                  },
                  '& .MuiSlider-thumb': {
                    backgroundColor: '#2563EB',
                  },
                }}
              />
            </Box>

            {/* 字體大小調節滑桿 */}
            <Box sx={{ width: { xs: '100%', sm: '220px' } }}>
              <Typography
                sx={{
                  fontSize: '14px',
                  color: '#111827',
                  mb: 1,
                }}
              >
                字體大小: {fontSize}px
              </Typography>
              <Slider
                value={fontSize}
                onChange={(e, newValue) => setFontSize(newValue)}
                min={16}
                max={48}
                sx={{
                  color: '#2563EB',
                  '& .MuiSlider-track': {
                    backgroundColor: '#2563EB',
                  },
                  '& .MuiSlider-rail': {
                    backgroundColor: '#E5E7EB',
                  },
                  '& .MuiSlider-thumb': {
                    backgroundColor: '#2563EB',
                  },
                }}
              />
            </Box>

            {/* 開始/暫停按鈕 */}
            <Button
              variant="contained"
              onClick={handlePlayPause}
              startIcon={isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
              sx={{
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                width: '120px',
                height: '44px',
                fontSize: '15px',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#1D4ED8',
                },
              }}
            >
              {isPlaying ? '暫停' : '開始'}
            </Button>

            {/* 停止/重置按鈕 */}
            <Button
              variant="outlined"
              onClick={handleStop}
              startIcon={<StopIcon />}
              sx={{
                backgroundColor: '#E5E7EB',
                color: '#111827',
                borderColor: '#E5E7EB',
                width: '120px',
                height: '44px',
                fontSize: '15px',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#D1D5DB',
                  borderColor: '#D1D5DB',
                },
              }}
            >
              重置
            </Button>

            {/* 全屏切換按鈕 */}
            <IconButton
              onClick={handleFullscreen}
              sx={{
                width: '44px',
                height: '44px',
                color: '#111827',
                '&:hover': {
                  color: '#2563EB',
                  backgroundColor: 'transparent',
                },
              }}
            >
              {isFullscreen ? (
                <FullscreenExitIcon sx={{ fontSize: '20px' }} />
              ) : (
                <FullscreenIcon sx={{ fontSize: '20px' }} />
              )}
            </IconButton>
          </Box>

          {/* 鍵盤快捷提示 */}
          <Box
            sx={{
              mt: 3,
              pt: 2,
              borderTop: '1px solid #E5E7EB',
            }}
          >
            <Typography
              sx={{
                fontSize: '13px',
                color: '#6B7280',
                fontFamily: 'monospace',
              }}
            >
              快捷鍵：空白鍵「開始/暫停」、R 鍵「重置」
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default Teleprompter

