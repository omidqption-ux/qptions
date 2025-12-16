import React, { useEffect } from 'react'
import { MenuItem } from '@mui/material'
import axiosInstance from '../../network/axios'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import Badge from '@mui/material/Badge'
import { setNotificationsCount } from '../../redux/slices/notificationSlice'
import { setNotifications } from '../../redux/slices/notificationSlice'
const Notifications = () => {
     const dispatch = useDispatch()
     const [readNotifications, setReadNotifications] = React.useState([])
     const { notifications, notificationsCount } = useSelector(
          (state) => state.notification
     )
     const getUnreadNotifications = async () => {
          try {
               const response = await axiosInstance.get(
                    '/notifications/getUnreadNotifications'
               )
               dispatch(setNotifications(response.notifications))
          } catch (error) {}
     }
     const markAsRead = async (notificationId) => {
          try {
               await axiosInstance.post('/notifications/markAsRead', {
                    notificationId,
               })
               setReadNotifications((prev) => {
                    return [...prev, notificationId]
               })
               dispatch(setNotificationsCount(notificationsCount - 1))
          } catch (error) {}
     }

     useEffect(() => {
          getUnreadNotifications()
          return () => {
               setReadNotifications([])
               dispatch(setNotifications([]))
          }
     }, [])
     return (
          <>
               {notifications.length > 0 &&
                    notifications.map((notification) => {
                         return (
                              <MenuItem
                                   key={notification._id}
                                   onClick={() => {
                                        markAsRead(notification._id)
                                   }}
                              >
                                   <Badge
                                        className={`${
                                             readNotifications.includes(
                                                  notification._id
                                             )
                                                  ? 'text-silver '
                                                  : 'text-lightGrey bg-darkGrey'
                                        }
text-xs  flex flex-col items-start  hover:bg-darkEnd rounded-md p-2 m-1'`}
                                        color={
                                             readNotifications.includes(
                                                  notification._id
                                             )
                                                  ? ''
                                                  : 'primary'
                                        }
                                        variant='dot'
                                   >
                                        {notification.title}
                                        <sub className='mt-1 px-1 pb-2'>
                                             {notification.body.length > 50
                                                  ? notification.body.slice(
                                                         0,
                                                         50
                                                    ) + '...'
                                                  : notification.body}
                                        </sub>
                                   </Badge>
                              </MenuItem>
                         )
                    })}
          </>
     )
}
export default Notifications
