import { useEffect, useState } from "react"
import { Routes, Route } from "react-router-dom"
import SignIn from "./pages/AuthPages/SignIn"
import NotFound from "./pages/OtherPage/NotFound"
import UserProfiles from "./pages/UserProfiles"
import AppLayout from "./layout/AppLayout"
import Home from "./pages/Dashboard/Home"
import Admins from "./pages/Admins/Admins"
import Users from "./pages/Users/Users"
import Trades from "./pages/Trades/Trades"
import { useDispatch } from "react-redux"
import axiosInstance from "./network/axios"
import Deposits from "./pages/Deposits/Deposits"
import { setAdmin } from "./store/slices/admins"
import Withdrawals from "./pages/Withdraw/Withdraw"
import Verification from "./pages/Verification/verification"
import { ScrollToTop } from "./components/common/ScrollToTop"
import Notification from "./pages/notifications/NotificationsPage"
import Loading from "./components/Loading/Loading"
export default function App() {
  const dispatch = useDispatch()
  // null = not checked yet, true = logged in, false = not logged in
  const [isLogin, setIsLogin] = useState<boolean | null>(null)

  const getProfile = async () => {
    try {
      const res = await axiosInstance.get('/admins/getProfile')
      if (!res.data.isActive) {
        await axiosInstance.post('/auth/logoutAdmin')
        window.location.href = '/signin'
        return
      }
      dispatch(setAdmin({
        fullName: res.data.fullName,
        username: res.data.username,
        role: res.data.role,
        isActive: res.data.isActive,
      }))
    } catch (e) {
      // optional: handle error
    }
  }

  const isLoginF = async () => {
    try {
      const res = await axiosInstance.post('/auth/isLoginAdmin')
      if (res.data.isLogin) {
        setIsLogin(true)
      } else {
        setIsLogin(false)
      }
    } catch {
      setIsLogin(false)
    }
  }

  useEffect(() => {
    isLoginF()
    return () => setIsLogin(null)
  }, [])

  useEffect(() => {
    if (isLogin) getProfile()
  }, [isLogin])

  if (isLogin === null) {
    return <Loading />
  }

  return (
    <>
      <ScrollToTop />
      <Routes>
        {isLogin ? (
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/deposits" element={<Deposits />} />
            <Route path="/withdrawals" element={<Withdrawals />} />
            <Route path="/admins" element={<Admins />} />
            <Route path="/users" element={<Users />} />
            <Route path="/verification" element={<Verification />} />
            <Route path="/trades" element={<Trades />} />
            <Route path="/notifications" element={<Notification />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        ) : (
          <>
            <Route path="/signin" element={<SignIn />} />
            <Route path="*" element={<SignIn />} />
          </>
        )}
      </Routes>
    </>
  )
}
