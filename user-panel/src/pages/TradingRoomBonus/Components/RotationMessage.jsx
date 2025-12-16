import { Box, Typography } from '@mui/material'
import ScreenRotationIcon from '@mui/icons-material/ScreenRotation'



const RotationMessage = () => {

     return (
          <Box
               sx={{
                    display: { xs: 'flex', md: 'none' },
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.95)',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    padding: '20px',
                    textAlign: 'center',
                    backdropFilter: 'blur(5px)',
               }}
          >
               <Box
                    sx={{
                         display: 'flex',
                         flexDirection: 'column',
                         alignItems: 'center',
                         gap: '20px',
                         maxWidth: '300px',
                    }}
               >
                    <ScreenRotationIcon
                         sx={{
                              fontSize: '64px',
                              color: 'white',
                              animation: 'rotate 2s infinite linear',
                              '@keyframes rotate': {
                                   from: { transform: 'rotate(0deg)' },
                                   to: { transform: 'rotate(90deg)' },
                              },
                         }}
                    />
                    <Typography
                         variant="h6"
                         sx={{
                              color: 'white',
                              fontWeight: 'bold',
                         }}
                    >
                         Rotate Your Device
                    </Typography>
                    <Typography
                         variant="body1"
                         sx={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              lineHeight: 1.5,
                         }}
                    >
                         For the best trading experience, please rotate your device to landscape mode
                    </Typography>
               </Box>
          </Box>
     )
}

export default RotationMessage 