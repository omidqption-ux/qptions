import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge"
import { MoreDotIcon } from "../../icons"
import { useEffect, useState } from "react"
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Dropdown } from "../ui/dropdown/Dropdown";
import axiosInstance from "../../network/axios";

interface tableData {
  name: string;
  username: string;
  country: string;
  totalTrade: number;
  totalWin: number;
  profit: number;
}
type Period = 'This-24H' | 'This-Month' | 'This-Year' | 'All-The-Time';
type Top = 'Winner' | 'Loser' | 'Profitable'
export default function RecentOrders() {
  const periods: Period[] = ['This-24H', 'This-Month', 'This-Year', 'All-The-Time']
  const tops: Top[] = ['Winner', 'Loser', 'Profitable']

  const [isOpen, setIsOpen] = useState(false)
  const [isOpenTop, setIsOpenTop] = useState(false)
  const [topMode, setTopMode] = useState('Profitable');
  const [period, setPeriod] = useState('This-24H');

  const chooseTopMode = (top: Top) => {
    setTopMode(top)
    closeDropdownTop()
  }
  const [tableData, setTableData] = useState<{ topProfitable: tableData[], topWinners: tableData[], topLosers: tableData[] }>({
    topProfitable: [{
      name: '',
      username: '',
      country: '',
      totalTrade: 0,
      totalWin: 0,
      profit: 0
    }],
    topWinners: [{
      name: '',
      username: '',
      country: '',
      totalTrade: 0,
      totalWin: 0,
      profit: 0
    }],
    topLosers: [{
      name: '',
      username: '',
      country: '',
      totalTrade: 0,
      totalWin: 0,
      profit: 0
    }],
  })
  const getTopCustomers = async () => {
    try {
      const res = await axiosInstance.get<{ topProfitable: tableData[], topWinners: tableData[], topLosers: tableData[] }>('/users/mostProfitableCustumersVolumeCount', { params: { period } })
      setTableData({ topProfitable: res.data.topProfitable, topLosers: res.data.topLosers, topWinners: res.data.topWinners })
    } catch (e) { }

  }

  useEffect(() => {
    getTopCustomers()
  }, [period])

  function toggleDropdownTop() {
    setIsOpenTop(!isOpen);
  }
  function closeDropdownTop() {
    setIsOpenTop(false);

  }
  function toggleDropdown() {
    setIsOpen(!isOpen);
  }
  function closeDropdown() {
    setIsOpen(false);
  }
  const choosePeriod = (v: Period) => {
    setPeriod(v)
    closeDropdown()
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-lg font-semibold text-gray-800 dark:text-white/90">
            <div className="relative inline-block">
              <div className="flex items-center" >
                Most {topMode} Customer
                <button className="dropdown-toggle" onClick={toggleDropdownTop}>
                  <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
                </button>
              </div>
              <Dropdown
                isOpen={isOpenTop}
                onClose={closeDropdownTop}
                className="w-40 p-2"
              >
                {tops.map((top: Top) => (
                  <DropdownItem
                    onItemClick={() => chooseTopMode(top)}
                    className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                  >
                    {top}
                  </DropdownItem>
                ))}
              </Dropdown>
            </div>
          </div>
        </div>

        <div className="relative inline-block">
          <button className="dropdown-toggle" onClick={toggleDropdown}>
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-40 p-2"
          >
            {periods.map((p: Period) => (
              <DropdownItem
                onItemClick={() => choosePeriod(p)}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                {p.replace(/-/g, ' ')}
              </DropdownItem>
            ))}
          </Dropdown>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto min-h-[140px]">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Username
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                FullName
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Country
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Total Trade
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Total Win
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {
              topMode === 'Profitable' ? (
                tableData.topProfitable.map((customer) => (
                  <TableRow key={customer.username} >
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {customer.username}
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {customer.name}
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {customer.country}
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {customer.totalTrade}
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      <Badge
                        size="sm"
                        color={
                          customer.profit > 0
                            ? "success"
                            : "error"
                        }
                      >
                        {customer.profit}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
                )
              ) :
                topMode === 'Loser' ? (
                  tableData.topLosers.map((customer) => (
                    <TableRow key={customer.username} >
                      <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        {customer.username}
                      </TableCell>
                      <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        {customer.name}
                      </TableCell>
                      <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        {customer.country}
                      </TableCell>
                      <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        {customer.totalTrade}
                      </TableCell>
                      <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        <Badge
                          size="sm"
                          color={
                            customer.profit > 0
                              ? "success"
                              : "error"
                          }
                        >
                          {customer.profit}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                  )
                ) :
                  (
                    tableData.topProfitable.map((customer) => (
                      <TableRow key={customer.username} >
                        <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                          {customer.username}
                        </TableCell>
                        <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                          {customer.name}
                        </TableCell>
                        <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                          {customer.country}
                        </TableCell>
                        <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                          {customer.totalTrade}
                        </TableCell>
                        <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                          <Badge
                            size="sm"
                            color={
                              customer.profit > 0
                                ? "success"
                                : "error"
                            }
                          >
                            {customer.profit}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                    )
                  )
            }
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
