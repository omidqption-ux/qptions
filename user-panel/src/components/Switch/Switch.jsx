import * as React from 'react';
import { styled } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';



const Android12Switch = styled(Switch)(() => ({
  padding: 8,
  '& .css-161ms7l-MuiButtonBase-root-MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track':{
    background:'#024d2a'
  },
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    '&::before, &::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16,
    },
    '&::before': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="white" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    '&::after': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="white" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,      
    },
  },
  '& .Mui-checked .MuiSwitch-thumb': {
    background:'#07a75e',
  },
  '& .MuiSwitch-thumb': {    
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2,
  },
}));


export default function CustomizedSwitches({checked,onClick}) {
  return (
      <FormControlLabel
        onClick={onClick}
        control={<Android12Switch checked={checked}  />}
      />
  )
}
