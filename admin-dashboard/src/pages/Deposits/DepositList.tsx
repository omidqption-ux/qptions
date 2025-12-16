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
import { IconButton, TablePagination } from "@mui/material"
import { Deposit, setDepositList } from "../../store/slices/deposits"
import { MoreDotIcon } from "../../icons"
import { normalizeDate } from "../../utils/normalizedate"
import PreviewIcon from '@mui/icons-material/Preview';
import { useModal } from "../../hooks/useModal"
import DepositModal from "./DepositModal"

export default function BasicTableOne() {
    const [isOpen, setIsOpen] = useState('')
    const [selectedDepositId, setselectedDepositId] = useState('')
    const dispatch = useDispatch()
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [payment_status, setPayment_status] = useState('')
    const [loading, setLoading] = useState(false)
    const { depositList } = useSelector((store: RootState) => store.deposit)
    const { isOpen: modalIsOpen, openModal, closeModal } = useModal();

    const getDepoList = async () => {
        try {
            setLoading(true)
            const res = await axiosInstance.get('deposits/list', {
                params: {
                    page,
                    limit,
                    sortBy: 'createdAt',
                    sortOrder: 'desc',
                    payment_status,
                }
            })
            dispatch(setDepositList(res.data.data.map((dep: Deposit) => ({
                username: dep.username,
                _id: dep._id,
                userId: dep.userId,
                amount: dep.amount,
                amountCurrency: dep.amountCurrency,
                paidCurrency: dep.paidCurrency,
                createdAt: dep.createdAt,
                payment_status: dep.payment_status,
                expectedPayAmountCrypto: dep.expectedPayAmountCrypto
            }))))
            setTotal(res.data.meta.total)
        } catch (e) { }
        finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        getDepoList()
    }, [limit, page, payment_status])
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
    const openDepoModal = (id: string) => {
        setselectedDepositId(id)
        openModal()
    }
    const closeDepoModal = () => {
        setselectedDepositId("")
        closeModal()
    }
    return (
        <div className="w-full rounded-xl border border-gray-200 bg-white dark:text-gray-300 dark:border-white/[0.05] dark:bg-white/[0.03]">
            <DepositModal isOpen={modalIsOpen} closeModal={closeDepoModal} selectedDepositId={selectedDepositId} />
            <div className="w-full overflow-x-auto">
                {loading && (
                    <LinearProgress color="info" />
                )}
                <Table>
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] w-full">
                        <TableRow>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium  text-start text-theme-xs dark:text-gray-400"
                            >
                                Username
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium  text-start text-theme-xs dark:text-gray-400"
                            >
                                Amount in currency
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium  text-start text-theme-xs dark:text-gray-400"
                            >
                                <div className="flex items-center" >
                                    Amount In paidCurrency
                                </div>
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium  text-start text-theme-xs dark:text-gray-400"
                            >
                                <div className="flex items-center" >
                                    Status
                                    <div className="relative inline-block">
                                        <button className="dropdown-toggle" onClick={() => toggleDropdown('payment_status')}>
                                            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
                                        </button>
                                        <Dropdown
                                            isOpen={isOpen === 'payment_status'}
                                            onClose={closeDropdown}
                                            className="w-40 p-2"
                                        >
                                            <DropdownItem
                                                onClick={() => setPayment_status('')}
                                                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                                            >
                                                All
                                            </DropdownItem>
                                            <DropdownItem
                                                onClick={() => setPayment_status('waiting')}
                                                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                                            >
                                                waiting
                                            </DropdownItem>
                                            <DropdownItem
                                                onClick={() => setPayment_status('finished')}
                                                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                                            >
                                                credited
                                            </DropdownItem>
                                            <DropdownItem
                                                onClick={() => setPayment_status('sending')}
                                                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                                            >
                                                sending
                                            </DropdownItem>
                                            <DropdownItem
                                                onClick={() => setPayment_status('refunded')}
                                                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                                            >
                                                refunded
                                            </DropdownItem>
                                            <DropdownItem
                                                onClick={() => setPayment_status('expired')}
                                                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                                            >
                                                expired
                                            </DropdownItem>
                                        </Dropdown>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                createdAt
                            </TableCell>
                            <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                Preview
                            </TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {depositList?.map((deposit: Deposit) => (
                            <TableRow key={deposit._id}>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {deposit.username}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {deposit.amount}-{deposit.amountCurrency || 'USD'}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {deposit.expectedPayAmountCrypto} {deposit.paidCurrency}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start cursor-pointer">
                                    <div className="flex justify-start" >
                                        <Badge
                                            size="sm"
                                            color={
                                                deposit.payment_status === 'finished'
                                                    ? "success"
                                                    : "error"
                                            }
                                        >
                                            {deposit.payment_status === 'finished' ? "Credited" : deposit.payment_status}
                                        </Badge>
                                    </div>
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start cursor-pointer">
                                    {normalizeDate(deposit.createdAt)}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    <IconButton onClick={() => openDepoModal(deposit._id)} >
                                        <PreviewIcon className="cursor-pointer text-green-800 hover:text-green-500" />
                                    </IconButton>
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
