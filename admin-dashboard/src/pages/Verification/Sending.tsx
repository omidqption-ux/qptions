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
import { setSendingVerificationList, Verification } from "../../store/slices/verification"
import { useModal } from "../../hooks/useModal";
import PreviewIcon from '@mui/icons-material/Preview';
import SendingModal from "./SendingModal"
import { normalizeDate } from "../../utils/normalizedate"
const Approved = ({ setLoading }: { setLoading: Dispatch<SetStateAction<boolean>> }) => {
    const dispatch = useDispatch()
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [selectedVerificationId, setSelectedVerificationId] = useState('')
    const { isOpen, openModal, closeModal } = useModal();


    const { verificationSendingList } = useSelector((store: RootState) => store.verification)
    const getList = async () => {
        try {
            setLoading(true)
            const res = await axiosInstance.get('/verifications/sending', {
                params: {
                    page,
                    limit,
                    sortBy: 'createdAt',
                    sortOrder: 'desc',
                }
            })
            dispatch(setSendingVerificationList(res.data.data.map((verification: Verification) => ({
                _id: verification._id,
                userId: verification.userId,
                issuingCountry: verification.issuingCountry,
                documentType: verification.documentType,
                documentImage: verification.documentImage,
                documentBackImage: verification.documentBackImage,
                selfieImage: verification.selfieImage,
                createdAt: verification.createdAt

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
    const openVerificationModal = (id: string) => {
        setSelectedVerificationId(id)
        openModal()
    }
    return (
        <div className="w-full rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <SendingModal isOpen={isOpen} closeModal={closeModal} selectedVerificationId={selectedVerificationId} />
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
                                Issuing Country
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Document Type
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Created At
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
                        {verificationSendingList?.map((verification: Verification) => (
                            <TableRow key={verification._id}>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {verification.userId.username}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {verification.issuingCountry}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {verification.documentType}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {normalizeDate(verification.createdAt)}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start" >
                                    <IconButton onClick={() => openVerificationModal(verification._id)} >
                                        <PreviewIcon className="cursor-pointer text-green-800" />
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
export default Approved