import { motion } from 'framer-motion'
import './styles.css'
import { Box } from '@mui/material'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import PeopleIcon from '@mui/icons-material/People'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
const Tournament = () => {
     const tournamentData = [
          {
               id: 1,
               title: 'Weekly Trading Challenge',
               prize: '$5,000',
               participants: '1,234',
               startDate: '2024-04-25',
               endDate: '2024-05-02',
               status: 'Starting Soon',
          },
     ]
     return (
          <Box>
               <div className='header'>
                    <h3 className='title'>
                         <EmojiEventsIcon className='icon' />
                         Tournaments
                    </h3>
               </div>

               <div>
                    {tournamentData.map((tournament) => (
                         <motion.div
                              key={tournament.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 }}
                              className='tournamentCard'
                         >
                              <div className='cardHeader'>
                                   <h4 className='cardTitle'>
                                        {tournament.title}
                                   </h4>
                                   <span className='status'>
                                        {tournament.status}
                                   </span>
                              </div>

                              <div className='infoRow'>
                                   <EmojiEventsIcon className='icon' />
                                   <span>Prize: {tournament.prize}</span>
                              </div>

                              <div className='infoRow'>
                                   <PeopleIcon className='iconBlue' />
                                   <span>{tournament.participants}</span>
                              </div>

                              <div className='infoRow'>
                                   <EventAvailableIcon className='iconBlue' />
                                   <span>{tournament.startDate}</span>
                              </div>

                              <motion.button
                                   whileHover={{ scale: 1.02 }}
                                   whileTap={{ scale: 0.98 }}
                                   className='joinButton'
                              >
                                   Join
                              </motion.button>
                         </motion.div>
                    ))}
               </div>
          </Box>
     )
}
export default Tournament
