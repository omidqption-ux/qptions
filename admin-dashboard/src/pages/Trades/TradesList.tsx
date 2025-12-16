import { useEffect, useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../components/ui/table"
import LinearProgress from '@mui/material/LinearProgress'
import axiosInstance from "../../network/axios"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../store"
import { Dropdown } from "../../components/ui/dropdown/Dropdown"
import { DropdownItem } from "../../components/ui/dropdown/DropdownItem"
import Badge from "../../components/ui/badge/Badge"
import { TablePagination } from "@mui/material"
import { Trade, setTradeList } from "../../store/slices/trades"
import { CheckCircleIcon, ErrorHexaIcon, MoreDotIcon } from "../../icons"
import { formatEpoch } from "../../utils/epochTodate"
export default function BasicTableOne() {
    const [isOpen, setIsOpen] = useState('')
    const dispatch = useDispatch()
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [isWin, setIsWin] = useState<'true' | 'false' | undefined>(undefined)
    const [buyOrSell, setBuyOrSell] = useState<'buy' | 'sell' | undefined>(undefined)
    const [mode, setMode] = useState<'real' | 'bonus' | 'demo' | undefined>(undefined)
    const [loading, setLoading] = useState(false)
    const { tradeList } = useSelector((store: RootState) => store.trade)

    const getTradesList = async () => {
        try {
            setLoading(true)
            const res = await axiosInstance.get('/trades/list', {
                params: {
                    page,
                    limit,
                    sortBy: 'createdAt',
                    sortOrder: 'desc',
                    isWin,
                    buyOrSell,
                    mode
                }
            })
            dispatch(setTradeList(res.data.data.map((trade: Trade) => ({
                tradeId: trade.tradeId,
                username: trade.username,
                userId: trade.userId,
                amount: trade.amount,
                status: trade.status,
                roomMode: trade.roomMode,
                percentage: trade.percentage,
                pair: trade.pair,
                openTime: trade.openTime,
                closeTime: trade.closeTime,
                netProfit: trade.netProfit,
                isWin: trade.isWin,
                initialPrice: trade.initialPrice,
                finalPrice: trade.finalPrice,
                buyOrSell: trade.buyOrSell
            }))))
            setTotal(res.data.meta.total)
        } catch (e) { }
        finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        getTradesList()
    }, [limit, page, isWin, buyOrSell, mode])
    const handleChangePage = (
        _event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setLimit(parseInt(event.target.value, 10))
        setPage(0)
    }
    function toggleDropdown(v: string) {
        if (isOpen)
            setIsOpen('')
        else
            setIsOpen(v)
    }
    function closeDropdown() {
        setIsOpen('');
    }
    return (
        <div className="w-full rounded-xl border border-gray-200 bg-white dark:text-gray-300 dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="w-full overflow-x-auto">
                {loading && (
                    <LinearProgress color="info" />
                )}
                <Table  >
                    {/* Table Header */}
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] w-full">
                        <TableRow>
                            <TableCell
                                isHeader
                                className="px-1 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Username
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-1 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Amount
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-1 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                <div className="flex items-center" >
                                    RoomMode
                                    <div className="relative inline-block">
                                        <button className="dropdown-toggle" onClick={() => toggleDropdown('RoomMode')}>
                                            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
                                        </button>
                                        <Dropdown
                                            isOpen={isOpen === 'RoomMode'}
                                            onClose={closeDropdown}
                                            className="w-40 p-2"
                                        >
                                            <DropdownItem
                                                onClick={() => setMode(undefined)}
                                                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                                            >
                                                All
                                            </DropdownItem>
                                            <DropdownItem
                                                onClick={() => setMode('real')}
                                                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                                            >
                                                Real
                                            </DropdownItem>
                                            <DropdownItem
                                                onClick={() => setMode('demo')}
                                                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                                            >
                                                Demo
                                            </DropdownItem>
                                            <DropdownItem
                                                onClick={() => setMode('bonus')}
                                                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                                            >
                                                Bonus
                                            </DropdownItem>
                                        </Dropdown>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-1 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                percentage
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-1 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                pair
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-1 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Open Time
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-1 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Close Time
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-1 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Net Profit
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-1 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                <div className="flex items-center" >
                                    Is Win
                                    <div className="relative inline-block">
                                        <button className="dropdown-toggle" onClick={() => toggleDropdown('isWin')}>
                                            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
                                        </button>
                                        <Dropdown
                                            isOpen={isOpen === 'isWin'}
                                            onClose={closeDropdown}
                                            className="w-40 p-2"
                                        >
                                            <DropdownItem
                                                onClick={() => setIsWin(undefined)}
                                                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                                            >
                                                All
                                            </DropdownItem>
                                            <DropdownItem
                                                onClick={() => setIsWin('true')}
                                                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                                            >
                                                Win
                                            </DropdownItem>
                                            <DropdownItem
                                                onClick={() => setIsWin('false')}
                                                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                                            >
                                                Lose
                                            </DropdownItem>
                                        </Dropdown>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-1 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Initial Price /
                                Final Price
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-1 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                <div className="flex items-center" >
                                    Buy Or Sell
                                    <div className="relative inline-block">
                                        <button className="dropdown-toggle" onClick={() => toggleDropdown('buyOrSell')}>
                                            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
                                        </button>
                                        <Dropdown
                                            isOpen={isOpen === 'buyOrSell'}
                                            onClose={closeDropdown}
                                            className="w-40 p-2"
                                        >
                                            <DropdownItem
                                                onClick={() => setBuyOrSell(undefined)}
                                                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                                            >
                                                All
                                            </DropdownItem>
                                            <DropdownItem
                                                onClick={() => setBuyOrSell('buy')}
                                                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                                            >
                                                Buy
                                            </DropdownItem>
                                            <DropdownItem
                                                onClick={() => setBuyOrSell('sell')}
                                                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                                            >
                                                Sell
                                            </DropdownItem>
                                        </Dropdown>
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {tradeList?.map((trade: Trade) => (
                            <TableRow key={trade.tradeId}>
                                <TableCell className="px-1 py-4 sm:px-6 text-start">
                                    {trade.username}
                                </TableCell>
                                <TableCell className="px-1 py-4 sm:px-6 text-start">
                                    <span className="text-xs text-blue-400">{trade.amount}$</span>
                                </TableCell>
                                <TableCell className="px-1 py-4 sm:px-6 text-start">
                                    <span className={`${trade.roomMode === 'real' ? 'text-blue-500' : trade.roomMode === 'demo' ? 'text-orange-500' : 'text-green-500'}`} >{trade.roomMode}</span>
                                </TableCell>
                                <TableCell className="px-1 py-4 sm:px-6 text-start cursor-pointer">
                                    {trade.percentage}
                                </TableCell>
                                <TableCell className="px-1 py-4 sm:px-6 text-start cursor-pointer">
                                    {trade.pair}
                                </TableCell>
                                <TableCell className="px-1 py-4 sm:px-6 text-start cursor-pointer">
                                    {formatEpoch(trade.openTime)}
                                </TableCell>
                                <TableCell className="px-1 py-4 sm:px-6 text-start cursor-pointer">
                                    {formatEpoch(trade.closeTime)}
                                </TableCell>
                                <TableCell className="px-1 py-4 sm:px-6 text-start cursor-pointer">
                                    {trade.netProfit}
                                </TableCell>
                                <TableCell className="px-1 py-4 sm:px-6 text-start cursor-pointer">
                                    <div className="flex justify-start" >
                                        <Badge
                                            size="sm"
                                            color={
                                                trade.isWin
                                                    ? "success"
                                                    : "error"
                                            }
                                        >
                                            {trade.isWin ? <CheckCircleIcon /> : <ErrorHexaIcon />}
                                        </Badge>
                                    </div>
                                </TableCell>
                                <TableCell className="px-1 py-4 sm:px-6 text-start cursor-pointer">
                                    {trade.initialPrice} /
                                    {trade.finalPrice}
                                </TableCell>
                                <TableCell className="px-1 py-4 sm:px-6 text-start cursor-pointer">
                                    <span className={`${trade.buyOrSell === 'buy' ? 'text-green-400' : 'text-red-400'}`} >{trade.buyOrSell}</span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TablePagination
                        className="my-14"
                        component="div"
                        count={total}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={limit}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        sx={{
                            // whole bar text
                            "& .MuiTablePagination-toolbar": {
                                color: "#E5E7EB", // gray-200
                            },
                            // "Rows per page:" label + numbers
                            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                                color: "#E5E7EB",
                            },
                            // dropdown text
                            "& .MuiTablePagination-input": {
                                color: "#E5E7EB",
                            },
                            // arrows color
                            "& .MuiTablePagination-actions .MuiSvgIcon-root": {
                                color: "#E5E7EB",
                            },
                        }}
                    />
                </Table>
            </div>
        </div >
    )
}
