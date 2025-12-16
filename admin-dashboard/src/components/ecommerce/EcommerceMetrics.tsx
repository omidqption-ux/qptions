import { Dispatch, SetStateAction, useEffect, useState } from "react"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../icons"
import Badge from "../ui/badge/Badge"
import Spinner from "../common/Spinner"
import axiosInstance from "../../network/axios"
import AddCardIcon from '@mui/icons-material/AddCard'
import MoneyOffIcon from '@mui/icons-material/MoneyOff'
import Button from "../ui/button/Button"
import CandlestickChartIcon from '@mui/icons-material/CandlestickChart'
import SortIcon from '@mui/icons-material/Sort';
export default function EcommerceMetrics(props: { setChartType: Dispatch<SetStateAction<"orders" | "deposits" | "withdrawals" | "customers">> }) {
  const { setChartType } = props
  const tz =
    (typeof Intl !== 'undefined' &&
      Intl.DateTimeFormat().resolvedOptions().timeZone) ||
    'UTC'

  const [usersCountLoading, setUserCountLoading] = useState(false)
  const [tradeLoading, setTradeLoading] = useState(false)
  const [depositLoading, setDepositLoading] = useState(false)
  const [withdrawLoading, setWithdrawloading] = useState(false)

  const [tradeInfo, setTradeInfo] = useState({
    totalOrders: 0,
    addedToday: 0,
    addedThisMonth: 0,
    growth: {
      dayPct: 0,
      monthPct: 0
    }
  })
  const [withdrawalsInfo, setWithdrawalsInfo] = useState({
    totalWithdrawals: 0,
    addedToday: 0,
    addedThisMonth: 0,
    growth: {
      dayPct: 0,
      monthPct: 0
    }
  })
  const [depositInfo, setDeposit] = useState({
    totalDeposits: 0,
    addedToday: 0,
    addedThisMonth: 0,
    growth: {
      dayPct: 0,
      monthPct: 0
    }
  })

  const [usersCountinfo, setUsersCountinfo] = useState({
    totalUsers: 0,
    addedToday: 0,
    addedThisMonth: 0,
    growth: {
      dayPct: 0,
      monthPct: 0
    }
  })



  const getDepositInfo = async () => {
    try {
      setDepositLoading(true)
      const res = await axiosInstance.get('/deposits/usersDepositsInformation', { params: { tz } })
      setDeposit(res.data)
    } catch (e) { }
    finally {
      setDepositLoading(false)
    }
  }
  const getUsersCountInfo = async () => {
    try {
      setUserCountLoading(true)
      const res = await axiosInstance.get('/users/usersCountInformation', { params: { tz } })
      setUsersCountinfo(res.data)
    } catch (e) { }
    finally {
      setUserCountLoading(false)
    }
  }
  const getTradeInfo = async () => {
    try {
      setTradeLoading(true)
      const res = await axiosInstance.get('/admins/tradesInformation', { params: { mode: 'real', tz } })
      setTradeInfo(res.data)
    } catch (e) { }
    finally {
      setTradeLoading(false)
    }
  }
  const getWithdrawalsInfo = async () => {
    try {
      setWithdrawloading(true)
      const res = await axiosInstance.get('/withdrawals/usersWithdrawalsInformation', { params: { mode: 'real', tz } })
      setWithdrawalsInfo(res.data)
    } catch (e) { }
    finally {
      setWithdrawloading(false)
    }
  }
  useEffect(() => {
    getUsersCountInfo()
    getTradeInfo()
    getDepositInfo()
    getWithdrawalsInfo()
  }, [])
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex w-full justify-between" >
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <div className="flex flex-col items-start gap-1 text-gray-500" >
            <span>Today</span>
            <div className="flex justify-center items-center gap-1" >
              <span>{usersCountinfo.addedToday}</span>
              <Badge color={usersCountinfo.growth.dayPct > 0 ? 'success' : 'error'}>
                <>
                  {
                    usersCountLoading ? <Spinner /> :
                      usersCountinfo.growth.dayPct > 0 ?
                        <ArrowUpIcon />
                        :
                        <ArrowDownIcon />
                  }
                  {usersCountinfo.growth.dayPct}</>
              </Badge>
            </div>
          </div>
          <div className="flex flex-col items-start gap-1 text-gray-500" >
            <span>This Month</span>
            <div className="flex justify-center items-center gap-1" >
              <span>{usersCountinfo.addedThisMonth}</span>
              <Badge color={usersCountinfo.growth.monthPct > 0 ? 'success' : 'error'}>
                <>
                  {
                    usersCountLoading ? <Spinner /> :
                      usersCountinfo.growth.monthPct > 0 ?
                        <ArrowUpIcon />
                        :
                        <ArrowDownIcon />
                  }
                  {usersCountinfo.growth.monthPct}</>
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-end justify-between mt-5">
          <div className="flex flex-col items-start justify-center mt-5 w-full" >
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Customers
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90 mx-2">
              {usersCountLoading ? <Spinner /> : usersCountinfo.totalUsers}
            </h4>

          </div>
          <Button variant="outline" className="mx-1" >
            <SortIcon fontSize="small" />
            Customers
          </Button>
          <Button size="sm" startIcon={<CandlestickChartIcon />} variant="outline" onClick={() => setChartType('customers')}   >Statistic</Button>
        </div>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex justify-between w-full" >
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <div className="flex flex-col items-start gap-1 text-gray-500" >
            <span>Today</span>
            <div className="flex justify-center items-center gap-1" >
              <span>{tradeInfo.addedToday}</span>
              <Badge color={tradeInfo.growth.dayPct > 0 ? 'success' : 'error'}>
                <>
                  {
                    tradeLoading ? <Spinner /> :
                      tradeInfo.growth.dayPct > 0 ?
                        <ArrowUpIcon />
                        :
                        <ArrowDownIcon />
                  }
                  {tradeInfo.growth.dayPct}</>
              </Badge>
            </div>
          </div>
          <div className="flex flex-col items-start gap-1 text-gray-500" >
            <span>This Month</span>
            <div className="flex justify-center items-center gap-1" >
              <span>{tradeInfo.growth.monthPct}</span>
              <Badge color={tradeInfo.growth.monthPct > 0 ? 'success' : 'error'}>
                <>
                  {
                    tradeLoading ? <Spinner /> :
                      tradeInfo.growth.monthPct > 0 ?
                        <ArrowUpIcon />
                        :
                        <ArrowDownIcon />
                  }
                  {tradeInfo.growth.monthPct}</>
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-end justify-between mt-10">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Placed Orders
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {tradeLoading ? <Spinner /> : tradeInfo.totalOrders}
            </h4>
          </div>
          <div className="flex" >
            <Button variant="outline" className="mx-1" >
              <SortIcon fontSize="small" />
              Orders
            </Button>
            <Button size="sm" startIcon={<CandlestickChartIcon />} variant="outline" onClick={() => setChartType('orders')}   >Statistic</Button>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex justify-between w-full" >
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <AddCardIcon className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <div className="flex flex-col items-start gap-1 text-gray-500" >
            <span>Today</span>
            <div className="flex justify-center items-center gap-1" >
              <span>{depositInfo.addedToday}</span>
              <Badge color={depositInfo.growth.dayPct > 0 ? 'success' : 'error'}>
                <>
                  {
                    depositLoading ? <Spinner /> :
                      depositInfo.growth.dayPct > 0 ?
                        <ArrowUpIcon />
                        :
                        <ArrowDownIcon />
                  }
                  {depositInfo.growth.dayPct}</>
              </Badge>
            </div>
          </div>
          <div className="flex flex-col items-start gap-1 text-gray-500" >
            <span>This Month</span>
            <div className="flex justify-center items-center gap-1" >
              <span>{depositInfo.growth.monthPct}</span>
              <Badge color={depositInfo.growth.monthPct > 0 ? 'success' : 'error'}>
                <>
                  {
                    depositLoading ? <Spinner /> :
                      depositInfo.growth.monthPct > 0 ?
                        <ArrowUpIcon />
                        :
                        <ArrowDownIcon />
                  }
                  {depositInfo.growth.monthPct}</>
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Deposits
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {tradeLoading ? <Spinner /> : depositInfo.totalDeposits}
            </h4>
          </div>
          <div className="flex" >
            <Button variant="outline" className="mx-1" >
              <SortIcon fontSize="small" />
              Deposits
            </Button>
            <Button size="sm" startIcon={<CandlestickChartIcon />} onClick={() => setChartType('deposits')} variant="outline"   >Statistic</Button>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex justify-between w-full" >
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <MoneyOffIcon className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <div className="flex flex-col items-start gap-1 text-gray-500" >
            <span>Today</span>
            <div className="flex justify-center items-center gap-1" >
              <span>{withdrawalsInfo.addedToday}</span>
              <Badge color={withdrawalsInfo.growth.dayPct > 0 ? 'success' : 'error'}>
                <>
                  {
                    withdrawLoading ? <Spinner /> :
                      withdrawalsInfo.growth.dayPct > 0 ?
                        <ArrowUpIcon />
                        :
                        <ArrowDownIcon />
                  }
                  {withdrawalsInfo.growth.dayPct}</>
              </Badge>
            </div>
          </div>
          <div className="flex flex-col items-start gap-1 text-gray-500" >
            <span>This Month</span>
            <div className="flex justify-center items-center gap-1" >
              <span>{withdrawalsInfo.growth.monthPct}</span>
              <Badge color={withdrawalsInfo.growth.monthPct > 0 ? 'success' : 'error'}>
                <>
                  {
                    withdrawLoading ? <Spinner /> :
                      withdrawalsInfo.growth.monthPct > 0 ?
                        <ArrowUpIcon />
                        :
                        <ArrowDownIcon />
                  }
                  {withdrawalsInfo.growth.monthPct}</>
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Withdrawals
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {tradeLoading ? <Spinner /> : withdrawalsInfo.totalWithdrawals}
            </h4>
          </div>
          <div className="flex" >
            <Button variant="outline" className="mx-1" >
              <SortIcon fontSize="small" />
              Withdrawals
            </Button>
            <Button size="sm" startIcon={<CandlestickChartIcon />} variant="outline" onClick={() => setChartType('withdrawals')}   >Statistic</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
