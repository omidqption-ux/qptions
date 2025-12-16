import { useSelector, useDispatch } from 'react-redux'
import { setDepositHistory } from '../../redux/slices/depositSlice'
import { useEffect, useState } from 'react'
import axiosInstance from '../../network/axios'
import Pagination from '@mui/material/Pagination'
import LinearProgress from '@mui/material/LinearProgress'
import { Divider, Box, Fade, Select, MenuItem, InputBase } from '@mui/material'
import { formatDateTime } from '../../utils/timeAgo'
import DownIcon from '@mui/icons-material/KeyboardArrowDown'
import UpIcon from '@mui/icons-material/KeyboardArrowUp'

const DepositHistory = () => {
     const dispatch = useDispatch()
     const { depositHistory } = useSelector((store) => store.deposit)
     const [loading, setloading] = useState(false)
     const [total, setTotal] = useState(0)
     const [sortColumn, setSortColumn] = useState('createdAt')
     const [sortDirection, setSortDirection] = useState('desc')
     const [searchColumns, setSearchColumn] = useState([])
     const [searchChange, setSearchChange] = useState(false)
     const [openSelect, setOpenSelect] = useState(null)

     const getDepositList = async (page = 1) => {
          try {
               setloading(true)
               const response = await axiosInstance.get(
                    '/deposit/userDepositHistory',
                    {
                         params: {
                              page,
                              limit: 10,
                              sortColumn,
                              sortDirection,
                              searchColumns,
                         },
                    }
               )
               setTotal(response.count)
               dispatch(
                    setDepositHistory({ depositHistory: response.deposits })
               )
          } catch (e) {
          } finally {
               setTimeout(() => {
                    setloading(false)
               }, 500)
          }
     }
     useEffect(() => {
          getDepositList()
     }, [sortColumn, sortDirection, searchChange])
     const handleSort = (column) => {
          if (sortColumn === column) {
               setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
          } else {
               setSortColumn(column)
               setSortDirection('asc')
          }
     }
     const handleSearchColumnChange = (columnName, newValue) => {
          setSearchColumn((prevState) => {
               const existingIndex = prevState.findIndex(
                    (item) => item.column === columnName
               )
               if (existingIndex !== -1) {
                    const updatedSearchColumns = prevState.map((item) =>
                         item.column === columnName
                              ? { ...item, value: newValue }
                              : item
                    )
                    return updatedSearchColumns
               }
               return [...prevState, { column: columnName, value: newValue }]
          })
          setSearchChange(!searchChange)
     }
     return (
          <Fade
               in={true}
               timeout={500}
          >
               <div className='bg-gradient-to-b from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl overflow-x-scroll thin-scrollbar'>
                    <div className='text-lg font-medium  w-full p-6 rounded-t-sm  text-green-700'>
                         Deposit History
                    </div>
                    <div className='grid grid-cols-4 place-items-center py-3 text-green-500 min-w-[1010px] text-xs lg:text-sm'>
                         <span
                              className='cursor-pointer'
                              onClick={() => handleSort('amount')}
                         >
                              Amount
                              {sortColumn === 'amount' &&
                                   (sortDirection === 'asc' ? (
                                        <UpIcon fontSize='small' />
                                   ) : (
                                        <DownIcon fontSize='small' />
                                   ))}
                         </span>
                         <span
                              className='cursor-pointer'
                              onClick={() => handleSort('paidCurrency')}
                         >
                              Paid Currency
                              {sortColumn === 'paidCurrency' &&
                                   (sortDirection === 'asc' ? (
                                        <UpIcon fontSize='small' />
                                   ) : (
                                        <DownIcon fontSize='small' />
                                   ))}
                         </span>
                         <span
                              className='cursor-pointer items-center'
                              onClick={() => handleSort('createdAt')}
                         >
                              Created At
                              {sortColumn === 'createdAt' &&
                                   (sortDirection === 'asc' ? (
                                        <UpIcon fontSize='small' />
                                   ) : (
                                        <DownIcon fontSize='small' />
                                   ))}
                         </span>
                         <span className='cursor-pointer'>
                              <span
                                   onClick={() =>
                                        setOpenSelect('payment_status')
                                   }
                              >
                                   status
                              </span>
                              <Select
                                   labelId='result-select-label'
                                   open={openSelect === 'payment_status'}
                                   onOpen={() =>
                                        setOpenSelect('payment_status')
                                   }
                                   onClose={() => setOpenSelect(null)}
                                   renderValue={() => null}
                                   onChange={(e) => {
                                        handleSearchColumnChange(
                                             'payment_status',
                                             e.target.value
                                        )
                                   }}
                                   input={<InputBase disableUnderline />}
                                   className='text-sm lg:text-md'
                                   sx={{
                                        color: 'rgba(255,255,255,0.7)',
                                        borderRadius: 1,

                                        // Remove the outlined border in all states
                                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                        '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },

                                        // Also catch the native fieldset selector
                                        '& fieldset': { border: 'none' },

                                        // Remove any focus ring/outline
                                        '& .MuiSelect-select:focus': { outline: 'none' },
                                        '& .MuiSelect-select': {
                                             color: '#22c55e', // green-500
                                             py: 0,
                                             px: 0,
                                             borderRadius: 1,
                                        },
                                        '& .MuiSelect-icon': {
                                             color: '#86efac',            // Tailwind green-300
                                        },
                                        // optional: keep it green on hover/focus too
                                        '&.Mui-focused .MuiSelect-icon, &:hover .MuiSelect-icon': {
                                             color: '#86efac',
                                        },

                                   }}
                                   MenuProps={{
                                        PaperProps: {
                                             sx: {
                                                  // DROPDOWN PANEL background
                                                  backgroundImage:
                                                       'linear-gradient(to bottom, rgba(18,52,51), rgba(16,41,47))',
                                                  bgcolor: 'transparent',
                                                  backdropFilter: 'blur(64px)',           // optional: matches backdrop-blur-3xl
                                                  WebkitBackdropFilter: 'blur(64px)',
                                                  border: '1px solid rgba(34,197,94,0.20)',
                                                  boxShadow: '0 12px 28px rgba(0,0,0,0.35)',
                                                  color: 'rgba(255,255,255,0.9)',
                                                  // item styles
                                                  '& .MuiMenuItem-root': {
                                                       '&:hover': {
                                                            backgroundColor: 'rgba(34,197,94,0.12)',
                                                       },
                                                       '&.Mui-selected, &.Mui-selected:hover': {
                                                            backgroundColor: 'rgba(34,197,94,0.18)',
                                                       },
                                                  },
                                             },
                                        },
                                   }}
                              >
                                   <MenuItem
                                        value={null}
                                        className='text-xs xl:text-sm text-gray-300'
                                   >
                                        All
                                   </MenuItem>
                                   <MenuItem
                                        value={'waiting'}
                                        className='text-xs xl:text-sm text-gray-300'
                                   >
                                        waiting
                                   </MenuItem>
                                   <MenuItem
                                        value={'confirmed'}
                                        className='text-xs xl:text-sm text-green-500'
                                   >
                                        confirmed
                                   </MenuItem>
                                   <MenuItem
                                        value={'sending'}
                                        className='text-xs xl:text-sm text-blue-200'
                                   >
                                        sending
                                   </MenuItem>
                                   <MenuItem
                                        value={'finished'}
                                        className='text-xs xl:text-sm text-green-500'
                                   >
                                        finished
                                   </MenuItem>
                                   <MenuItem
                                        value={'refunded'}
                                        className='text-xs xl:text-sm text-red-500'
                                   >
                                        refunded
                                   </MenuItem>
                                   <MenuItem
                                        value={'expired'}
                                        className={`text-xs xl:text-sm text-red-500`}
                                   >
                                        expired
                                   </MenuItem>
                              </Select>
                         </span>
                    </div>
                    {loading ? (
                         <Box className='w-full'>
                              <LinearProgress color='success' className='text-green-300 bg-green-800 mx-5 h-0.5' />
                         </Box>
                    ) : (
                         <Divider className='bg-green-800 mx-5 w-full' />
                    )}
                    <Fade
                         timeout={500}
                         in={!loading}
                    >
                         <div className='min-w-[1010px] text-xs lg:text-sm' >
                              {depositHistory && depositHistory.length > 0 ? (
                                   depositHistory.map((history) => (
                                        <div key={history.createdAt}  >
                                             <div className='text-gray-300 grid grid-cols-4 place-items-center py-4   '>
                                                  <span  >
                                                       {history.amount}&nbsp;
                                                       {history.amountCurrency}
                                                  </span>
                                                  <span  >
                                                       {
                                                            history.paidCurrencyTitle
                                                       }
                                                  </span>
                                                  <span >
                                                       {formatDateTime(
                                                            history.createdAt
                                                       )}
                                                  </span>
                                                  <span>
                                                       {history.payment_status}
                                                  </span>
                                             </div>
                                             <Divider className='bg-green-800' />
                                        </div>
                                   ))
                              ) : (
                                   <span className=' flex justify-center text-center w-full text-gray-400 py-4'>
                                        No deposit has been found!
                                   </span>
                              )}
                         </div>
                    </Fade>
                    <Pagination
                         onChange={(event, page) => getDepositList(page)}
                         count={Math.ceil(total / 10)}
                         shape='rounded'
                         className='mx-auto [&>ul>li>button.MuiPaginationItem-root]:text-menuTxt'
                    />
               </div>
          </Fade>
     )
}
export default DepositHistory
