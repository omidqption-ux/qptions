import { useEffect, useLayoutEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import axios from './network/axios'
import Layout from './Layout'
import LayoutTradingRoom from './LayoutTradingRoom'
import LayoutTradingRoomDemo from './LayoutTradingRoomDemo'
import LayoutTradingRoomBonus from './LayoutTradingRoomBonus'
import Profile from './pages/Profile/Profile'
import Setings from './pages/Setings/Settings'
import Support from './pages/Support/Support'
import News from './pages/News/News'
import Trading from './pages/Trading/Trading'
import Affiliate from './pages/Affiliate/Affiliate'
import Deposit from './pages/Deposit/Deposit'
import Withdrawal from './pages/Withdrawal/Withdrawal'
import TradingRoom from './pages/TradingRoom/TradingRoom'
import TradingRoomDemo from './pages/TradingRoomDemo/TradingRoom'
import TradingRoomBonus from './pages/TradingRoomBonus/TradingRoom'
import { setIsLogin } from './redux/slices/userSlice'
import { useSelector, useDispatch } from 'react-redux'
import { socketBonus, socketDemo, socketReal, socketNotifications } from './network/socket'
import { addNotification } from './redux/slices/notificationSlice'

function App() {
     const dispatch = useDispatch()
     const { isLogin } = useSelector((store) => store.user)
     const [userId, setUserId] = useState(null)
     const chckIsLogin = async () => {
          try {
               const res = await axios.post('/auth/isLogin')
               dispatch(setIsLogin(res.isLogin))
               if (!res.isLogin) {
                    setUserId(null)
                    window.location.replace(
                         process.env.NODE_ENV !== 'development'
                              ? 'https://www.qption.com'
                              : 'http://localhost:3000'
                    )
               }
               setUserId(res.userId)
          } catch (err) {
               dispatch(setIsLogin(false))
               setUserId(null)
               window.location.replace(
                    process.env.NODE_ENV !== 'development'
                         ? 'https://www.qption.com'
                         : 'http://localhost:3000'
               )
          }
     }
     useLayoutEffect(() => {
          chckIsLogin()
     }, [isLogin])
     useEffect(() => {
          socketNotifications.connect()

          socketNotifications.on('joinedNotifications', () => { })

          socketNotifications.on('notification', (_payload) => {
               dispatch(addNotification())
          })

          return () => {
               socketNotifications.off('joinedNotifications')
               socketNotifications.off('notification')
               socketNotifications.disconnect()
          }
     }, [])
     return (
          isLogin && (
               <Router>
                    <Routes>
                         <Route
                              path='/'
                              element={<Layout />}
                         >
                              <Route
                                   index
                                   element={<Trading />}
                              />
                              <Route
                                   path='/Profile'
                                   element={<Profile />}
                              />
                              <Route
                                   path='/Affiliate'
                                   element={<Affiliate />}
                              />
                              <Route
                                   path='/Settings'
                                   element={<Setings />}
                              />
                              <Route
                                   path='/Support'
                                   element={<Support />}
                              />
                              <Route
                                   path='/News'
                                   element={<News />}
                              />
                              <Route
                                   path='/Deposit'
                                   element={<Deposit />}
                              />
                              <Route
                                   path='/Trading'
                                   element={<Trading />}
                              />
                              <Route
                                   path='/Withdrawal'
                                   element={<Withdrawal />}
                              />
                         </Route>

                         <Route
                              path='/TradingRoom'
                              element={<LayoutTradingRoom socket={socketReal} />}
                         >
                              <Route
                                   index
                                   element={<TradingRoom socket={socketReal} />}
                              />
                         </Route>
                         <Route
                              path='/TradingRoomDemo'
                              element={<LayoutTradingRoomDemo socket={socketDemo} />}
                         >
                              <Route
                                   index
                                   element={<TradingRoomDemo socket={socketDemo} />}
                              />
                         </Route>
                         <Route
                              path='/TradingRoomBonus'
                              element={<LayoutTradingRoomBonus socket={socketBonus} />}
                         >
                              <Route
                                   index
                                   element={<TradingRoomBonus socket={socketBonus} />}
                              />
                         </Route>
                    </Routes>
               </Router>
          )
     )
}

export default App
