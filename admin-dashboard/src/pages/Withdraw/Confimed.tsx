import { Dispatch, SetStateAction, useState, useEffect } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../components/ui/table"
import axiosInstance from "../../network/axios"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../store"
import { IconButton, TablePagination } from "@mui/material"
import { setApprovedWithList, Withdraw } from "../../store/slices/withdraw"
import { useModal } from "../../hooks/useModal"
import WaitingModal from "./WaitingModal"
import PreviewIcon from '@mui/icons-material/Preview';
import { normalizeDate } from "../../utils/normalizedate"

const Pending = ({ setLoading }: { setLoading: Dispatch<SetStateAction<boolean>> }) => {
    const dispatch = useDispatch()
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const { isOpen, openModal, closeModal } = useModal();
    const [selectedWithdrawId, setSelectedWithdrawId] = useState('')


    const { approvedList } = useSelector((store: RootState) => store.withdraw)
    const getList = async () => {
        try {
            setLoading(true)
            const res = await axiosInstance.get('/withdrawals/list', {
                params: {
                    page,
                    limit,
                    sortBy: 'createdAt',
                    sortOrder: 'desc',
                    status: 'confirmed',
                }
            })
            dispatch(setApprovedWithList(res.data.data.map((witdraw: Withdraw) => ({
                _id: witdraw._id,
                username: witdraw.username,
                userId: witdraw.userId,
                amount: witdraw.amount,
                method: {
                    title: witdraw.method.title,
                    code: witdraw.method.code,
                },
                status: witdraw.status,
                createdAt: witdraw.createdAt
            }))))
            setTotal(res.data.meta.total)
        } catch (e) { }
        finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        getList()
    }, [limit, page])

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
    const openWithModal = (id: string) => {
        setSelectedWithdrawId(id)
        openModal()
    }
    const closeWithModal = () => {
        setSelectedWithdrawId("")
        closeModal()
    }
    return (
        <div className="w-full rounded-xl border border-gray-200 bg-white dark:text-gray-300 dark:border-white/[0.05] dark:bg-white/[0.03]">
            <WaitingModal isOpen={isOpen} closeModal={closeWithModal} selectedWithdrawId={selectedWithdrawId} isWaiting={false} />

            <div className="w-full overflow-x-auto">
                <Table  >
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] w-full">
                        <TableRow>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Username
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Amount
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Method
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Status
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                CreatedAt
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Preview
                            </TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {approvedList?.map((withdraw: Withdraw) => (
                            <TableRow key={withdraw._id}>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {withdraw.username}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {withdraw.amount}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {withdraw.method.title}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {withdraw.status}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {normalizeDate(withdraw.createdAt)}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    <IconButton onClick={() => openWithModal(withdraw._id)} >
                                        <PreviewIcon className="cursor-pointer text-green-800 hover:text-green-500" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>))}
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
        </div>
    )
}
export default Pending