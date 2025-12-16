import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { Box, InputAdornment, TextField } from '@mui/material'
import { useEffect, useRef } from 'react'
const SearchBox = ({ value, handleOnChnage }) => {
     const inputRef = useRef(null)
     useEffect(() => {
          if (inputRef.current) {
               inputRef.current.focus()
          }
          return () => {
               inputRef.current = null
          }
     }, [])
     return (
          <Box className='w-full'>
               <TextField
                    inputRef={inputRef}
                    type='text'
                    value={value}
                    onChange={(e) => handleOnChnage(e.target.value)}
                    placeholder={`Seach a ticker`}
                    sx={{
                         width: '100%',
                         bgcolor: '#20293E',
                         borderRadius: 1,
                         '& .MuiOutlinedInput-root': {
                              '& .MuiOutlinedInput-input': {
                                   padding: '8px 4px',
                              },
                              color: '#9DA9BD',
                              borderRadius: 1,
                              fontSize: 12,
                              '& fieldset': {
                                   boxShadow: '1px'
                              },
                              '&:hover fieldset': {
                                   borderColor: '#20293E',
                              },
                              '&.Mui-focused fieldset': {
                                   borderColor: '#20293E',
                              },
                         },
                    }}
                    slotProps={{
                         input: {
                              startAdornment: (
                                   <InputAdornment position='start'>
                                        <SearchRoundedIcon fontSize='small' className='text-gray-500' />
                                   </InputAdornment>
                              ),
                         },
                    }}
               />
          </Box>
     )
}
export default SearchBox
