import React, { useRef } from 'react'
import * as Yup from 'yup'
import { Formik } from 'formik'
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer'
import {
     Button,
     Divider,
     Box,
     LinearProgress,
     Tooltip,
     Fade,
     Modal,
} from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CancelIcon from '@mui/icons-material/Close'
import DoneIcon from '@mui/icons-material/Done'
import { compressImage } from '../../utils/convertFiletoBase64'
import { useEffect, useState } from 'react'
import axiosInstance from '../../network/axios'
import { useSelector } from 'react-redux'
import Pagination from '@mui/material/Pagination'
import PendingIcon from '@mui/icons-material/Pending'
import MarkChatReadIcon from '@mui/icons-material/MarkChatRead'
import { useDispatch } from 'react-redux'
import { setTickets } from '../../redux/slices/ticketSlice'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import PersonIcon from '@mui/icons-material/Person'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import ContactSupportIcon from '@mui/icons-material/ContactSupport'
import Backdrop from '@mui/material/Backdrop'
import SendIcon from '@mui/icons-material/Send'
import MarkChatUnreadIcon from '@mui/icons-material/MarkChatUnread'

const style = {
     position: 'absolute',
     top: '50%',
     left: '50%',
     transform: 'translate(-50%, -50%)',
     width: 400,
     bgcolor: '#22293D',
     boxShadow: 24,
     p: 4,
}
const validationSchemaTicket = Yup.object().shape({
     title: Yup.string().required('Title is required'),
     body: Yup.string().required('Body is required'),
})
const validationSchemaNote = Yup.object().shape({
     note: Yup.string().required('Note is required'),
})

const Support = () => {
     const dispatch = useDispatch()
     const { tickets, ticketsCount } = useSelector((store) => store.ticket)
     const [loading, setLoading] = useState(false)
     const [page, setPage] = useState(1)
     const [noteModal, setNoteModal] = useState(false)
     const [selectedTicketId, setSelectedTicketId] = useState('')
     const ticketList = useRef(null)
     const getUserTickets = async () => {
          try {
               setLoading(true)
               const response = await axiosInstance.get(
                    '/tickets/getAllUserTicketsByUser',
                    { params: { page, limit: 10 } }
               )
               dispatch(
                    setTickets({
                         tickets: response.tickets,
                         count: response.count,
                    })
               )
          } catch (e) {
          } finally {
               setTimeout(() => setLoading(false), 1000)
          }
     }
     useEffect(() => {
          getUserTickets()
     }, [page])

     const createATicket = async (values) => {
          try {
               setLoading(true)
               await axiosInstance.post('/tickets/createATicket', values)
               getUserTickets()
               ticketList.current.scrollIntoView()
          } catch (e) {
          } finally {
               setTimeout(() => setLoading(false), 1000)
          }
     }
     const [expanded, setExpanded] = React.useState(false)

     const handleChange = (panel) => (event, isExpanded) => {
          setExpanded(isExpanded ? panel : false)
     }

     const openNote = (ticketId) => {
          setSelectedTicketId(ticketId)
          setNoteModal(true)
     }
     const closeNote = () => {
          setSelectedTicketId('')
          setNoteModal(false)
     }
     const addNote = async (values) => {
          try {
               setLoading(true)
               await axiosInstance.post('/tickets/sendResponseByUser', {
                    ticket: {
                         response: { body: values.note },
                         id: selectedTicketId,
                    },
               })
               getUserTickets()
          } catch (e) {
          } finally {
               setTimeout(() => setLoading(false), 1000)
               closeNote()
          }
     }
     return (
          <div className='w-full'>
               <div className='grid grid-cols-1 2xl:grid-cols-2 items-center my-4 w-full gap-4 '>
                    <Modal
                         open={noteModal}
                         onClose={closeNote}
                         closeAfterTransition
                         slots={{ backdrop: Backdrop }}
                         slotProps={{
                              backdrop: {
                                   timeout: 500,
                              },
                         }}
                    >
                         <Fade in={noteModal}>
                              <Box sx={style}>
                                   <Formik
                                        enableReinitialize
                                        validationSchema={validationSchemaNote}
                                        onSubmit={(values, actions) => {
                                             addNote(values)
                                             actions.setSubmitting(false)
                                        }}
                                        initialValues={{
                                             note: '',
                                        }}
                                   >
                                        {(props) => (
                                             <form
                                                  className='m-2 text-sm flex flex-col gap-4 p-4'
                                                  onSubmit={props.handleSubmit}
                                             >
                                                  <div className='flex flex-col items-start justify-center text-menuTxt'>
                                                       <span className='w-[140px] flex justify-start'>
                                                            Note
                                                       </span>
                                                       <div className='flex relative '>
                                                            <div className='flex justify-between'>
                                                                 <textarea
                                                                      rows={15}
                                                                      type='text'
                                                                      className={`bg-darkEnd  p-2 rounded-xs  focus:outline-none w-[280px] text-xs rounded-lg`}
                                                                      autoComplete='off'
                                                                      name='note'
                                                                      id='note'
                                                                      onChange={
                                                                           props.handleChange
                                                                      }
                                                                      onBlur={
                                                                           props.handleBlur
                                                                      }
                                                                      value={
                                                                           props
                                                                                .values
                                                                                .note
                                                                      }
                                                                 />
                                                            </div>
                                                       </div>
                                                  </div>
                                                  <div className='flex my-4 gap-4 justify-end items-center w-[322px] '>
                                                       <Button
                                                            onClick={() => {
                                                                 props.resetForm()
                                                                 closeNote()
                                                            }}
                                                            variant='outlined'
                                                            className='bg-darkStart text-xs'
                                                       >
                                                            <CancelIcon fontSize='small' />
                                                            Cancel
                                                       </Button>
                                                       <Button
                                                            type='submit'
                                                            variant='contained'
                                                            className='bg-darkEnd text-xs '
                                                       >
                                                            <SendIcon fontSize='small' />
                                                            Send
                                                       </Button>
                                                  </div>
                                                  <div className='flex my-4 gap-4 justify-end items-center w-[322px] '>
                                                       {props.touched.note &&
                                                            props.errors
                                                                 .note && (
                                                                 <span
                                                                      className='text-xs text-googleRed mx-auto absolute top-[26px] left-5'
                                                                      id='feedbacknote'
                                                                 >
                                                                      {
                                                                           props
                                                                                .errors
                                                                                .note
                                                                      }
                                                                 </span>
                                                            )}
                                                  </div>
                                             </form>
                                        )}
                                   </Formik>
                              </Box>
                         </Fade>
                    </Modal>
                    <div className='flex-col justify-center items-center w-full border border-LightNavy rounded-sm shadow  '>
                         <div className='text-md font-medium bg-LightNavy w-full px-2 py-1 rounded-t-sm '>
                              <QuestionAnswerIcon fontSize='small' />
                              Create a ticket
                         </div>
                         <Formik
                              enableReinitialize
                              validationSchema={validationSchemaTicket}
                              onSubmit={(values, actions) => {
                                   createATicket(values)
                                   actions.setSubmitting(false)
                                   actions.resetForm()
                              }}
                              initialValues={{
                                   title: '',
                                   body: '',
                                   photo: '',
                              }}
                         >
                              {(props) => (
                                   <form
                                        className='m-2 text-sm flex flex-col gap-4 p-4 justify-center items-center'
                                        onSubmit={props.handleSubmit}
                                   >
                                        <div className='flex flex-col items-start justify-center'>
                                             <span className='w-[100px] flex justify-start'>
                                                  Title
                                             </span>
                                             <div className='flex relative'>
                                                  <div className='flex justify-between'>
                                                       <input
                                                            type='text'
                                                            className={`bg-[#20293E]  px-2 rounded-xs  
                                                    focus:outline-none h-[28px] w-[270px] text-xs rounded-lg`}
                                                            autoComplete='off'
                                                            name='title'
                                                            id='title'
                                                            onChange={
                                                                 props.handleChange
                                                            }
                                                            onBlur={
                                                                 props.handleBlur
                                                            }
                                                            value={
                                                                 props.values
                                                                      .title
                                                            }
                                                       />
                                                  </div>
                                             </div>
                                        </div>
                                        <div className='flex flex-col items-start justify-center'>
                                             <span className='w-[100px] flex justify-start'>
                                                  Description
                                             </span>
                                             <div className='flex relative'>
                                                  <div className='flex justify-between items-center'>
                                                       <textarea
                                                            rows={15}
                                                            type='text'
                                                            className={`bg-[#20293E]  px-2 rounded-xs  focus:outline-none w-[270px] text-xs rounded-lg`}
                                                            autoComplete='off'
                                                            name='body'
                                                            id='body'
                                                            onChange={
                                                                 props.handleChange
                                                            }
                                                            onBlur={
                                                                 props.handleBlur
                                                            }
                                                            value={
                                                                 props.values
                                                                      .body
                                                            }
                                                       />
                                                  </div>
                                             </div>
                                        </div>
                                        <div className='flex flex-col items-start justify-center'>
                                             <span className='w-[100px] flex justify-start'>
                                                  Attachment
                                             </span>
                                             <div className='flex relative'>
                                                  <div className='flex justify-between items-center flex-col'>
                                                       <Button
                                                            component='label'
                                                            role={undefined}
                                                            variant='contained'
                                                            tabIndex={-1}
                                                            startIcon={
                                                                 <CloudUploadIcon />
                                                            }
                                                            className='w-[270px] bg-LightNavy'
                                                       >
                                                            Upload
                                                            <input
                                                                 style={{
                                                                      clip: 'rect(0 0 0 0)',
                                                                      clipPath:
                                                                           'inset(50%)',
                                                                      height: 1,
                                                                      overflow:
                                                                           'hidden',
                                                                      position:
                                                                           'absolute',
                                                                      bottom: 0,
                                                                      left: 0,
                                                                      whiteSpace:
                                                                           'nowrap',
                                                                      width: 1,
                                                                 }}
                                                                 accept='image/*'
                                                                 type='file'
                                                                 className={`bg-LightNavy  px-2 rounded-xs focus:outline-none h-[28px] w-[170px] text-xs rounded-lg `}
                                                                 autoComplete='off'
                                                                 name='photo'
                                                                 id='photo'
                                                                 onChange={async (
                                                                      event
                                                                 ) => {
                                                                      const file =
                                                                           event
                                                                                .target
                                                                                .files[0]
                                                                      const base64 =
                                                                           await compressImage(
                                                                                file
                                                                           )
                                                                      props.setFieldValue(
                                                                           'photo',
                                                                           base64
                                                                      )
                                                                 }}
                                                                 onBlur={
                                                                      props.handleBlur
                                                                 }
                                                            />
                                                       </Button>
                                                       {props.values.photo && (
                                                            <img
                                                                 src={`data:image/jpeg;base64,${props.values.photo}`}
                                                                 alt='Preview'
                                                                 width='180'
                                                                 height='160'
                                                                 className='my-3'
                                                            />
                                                       )}
                                                  </div>
                                             </div>
                                        </div>
                                        <div className='flex my-4 gap-4 justify-end items-center w-[270px] '>
                                             <Button
                                                  onClick={() => {
                                                       props.resetForm()
                                                  }}
                                                  variant='outlined'
                                                  className='bg-darkStart text-xs'
                                             >
                                                  <CancelIcon fontSize='small' />
                                                  Cancel
                                             </Button>
                                             <Button
                                                  type='submit'
                                                  variant='contained'
                                                  className='bg-darkEnd text-xs '
                                             >
                                                  <DoneIcon fontSize='small' />
                                                  confirm
                                             </Button>
                                        </div>
                                        <div className='flex flex-col w-[322px] text-center gap-3'>
                                             {props.touched.body &&
                                                  props.errors.body && (
                                                       <span
                                                            className='text-xs text-googleRed mx-auto'
                                                            id='feedbackbody'
                                                       >
                                                            {props.errors.body}
                                                       </span>
                                                  )}
                                             {props.touched.title &&
                                                  props.errors.title && (
                                                       <span
                                                            className='text-xs text-googleRed mx-auto'
                                                            id='feedbacknewtitle'
                                                       >
                                                            {props.errors.title}
                                                       </span>
                                                  )}
                                        </div>
                                   </form>
                              )}
                         </Formik>
                    </div>
                    <div className='flex-col justify-center items-start w-full border border-LightNavy rounded-sm shadow'>
                         <div className='text-md font-medium bg-LightNavy w-full px-2 py-1 rounded-t-sm '>
                              <MarkChatUnreadIcon fontSize='small' />
                              Live Chat
                         </div>
                         <div className='w-full h-[480px] border-none'>
                              <iframe
                                   src='https://tawk.to/chat/6733bc964304e3196ae12ceb/1ich1hbj1'
                                   style={{
                                        width: '100%',
                                        height: '100%',
                                        border: 'none',
                                   }}
                                   allow='microphone; camera'
                                   title='Tawk.to Chat'
                              ></iframe>
                         </div>
                    </div>
               </div>
               <div className='flex flex-col justify-center items-start w-full border border-LightNavy rounded-sm shadow  relative'>
                    <div
                         ref={ticketList}
                         className='text-md font-medium bg-LightNavy w-full px-2 py-1 rounded-t-sm '
                    >
                         <QuestionAnswerIcon fontSize='small' />
                         Tickets
                    </div>
                    {loading && (
                         <Box className='w-full absolute top-10'>
                              <LinearProgress color='inherit' />
                         </Box>
                    )}
                    <div className='grid grid-cols-3 place-items-center place-content-center py-2 text-darkGrey'>
                         <span className='w-[60px] flex justify-start'>
                              Title
                         </span>
                         <span className='w-[140px] flex justify-start '>
                              Description
                         </span>
                         <span className='w-[60px] flex justify-end'>
                              isAnswered
                         </span>
                    </div>
                    <Divider />
                    {tickets.map((ticket, index) => (
                         <Accordion
                              key={ticket.createdAt}
                              className='bg-darkStart text-menuTxt w-full'
                              expanded={expanded === index}
                              onChange={handleChange(index)}
                         >
                              <AccordionSummary>
                                   <div className='grid grid-cols-3 place-items-center place-content-center w-full'>
                                        <div className='overflow-hidden text-ellipsis w-[60px] flex justify-start'>
                                             {ticket.title}
                                        </div>
                                        <div className='overflow-hidden  text-ellipsis w-[140px]  justify-start'>
                                             {ticket.body}
                                        </div>
                                        <div className='w-[60px] flex justify-end '>
                                             {ticket.isResponded ? (
                                                  <Tooltip
                                                       title='Responded'
                                                       placement='top-end'
                                                       arrow
                                                       className='cursor-pointer'
                                                  >
                                                       <MarkChatReadIcon fontSize='small' />
                                                  </Tooltip>
                                             ) : (
                                                  <Tooltip
                                                       title='Pending'
                                                       placement='top-end'
                                                       arrow
                                                  >
                                                       <PendingIcon fontSize='small' />
                                                  </Tooltip>
                                             )}
                                             <Tooltip
                                                  arrow
                                                  placement='top-start'
                                                  title='Add a note'
                                             >
                                                  <ContactSupportIcon
                                                       onClick={(e) => {
                                                            e.stopPropagation()
                                                            openNote(ticket._id)
                                                       }}
                                                       fontSize='small'
                                                       className='mx-2'
                                                  />
                                             </Tooltip>
                                        </div>
                                   </div>
                              </AccordionSummary>
                              {ticket.isResponded &&
                                   ticket.response.map((response) => (
                                        <AccordionDetails>
                                             <Card className='w-full bg-darkEnd '>
                                                  <CardContent className='flex flex-col'>
                                                       <div className='flex items-center text-menuTxt'>
                                                            <PersonIcon fontSize='small' />
                                                            <span>
                                                                 {response.adminName ??
                                                                      'Your Note'}
                                                            </span>
                                                            <FormatQuoteIcon />
                                                       </div>
                                                       <div className='flex'>
                                                            <span className='text-menuTxt'>
                                                                 {
                                                                      response.title
                                                                 }
                                                            </span>
                                                       </div>
                                                       <div className='flex'>
                                                            <span className='text-menuTxt'>
                                                                 {response.body}
                                                            </span>
                                                       </div>
                                                       <div className='flex items-center'>
                                                            <span className='text-menuTxt'>
                                                                 {response.photo && (
                                                                      <img
                                                                           src={`data:image/jpeg;base64,${response.photo}`}
                                                                           alt='Preview'
                                                                           width='180'
                                                                           height='160'
                                                                           className='my-3 mx-auto'
                                                                      />
                                                                 )}
                                                            </span>
                                                       </div>
                                                  </CardContent>
                                             </Card>
                                        </AccordionDetails>
                                   ))}
                         </Accordion>
                    ))}
                    <Pagination
                         onChange={(event, page) => setPage(page)}
                         count={ticketsCount / 10}
                         shape='rounded'
                         className='mx-auto [&>ul>li>button.MuiPaginationItem-root]:text-menuTxt'
                    />
               </div>
          </div>
     )
}
export default Support
