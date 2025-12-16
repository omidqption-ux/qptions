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
import { setUsersList, User } from "../../store/slices/users"
import { RootState } from "../../store"
import { Dropdown } from "../../components/ui/dropdown/Dropdown"
import { DropdownItem } from "../../components/ui/dropdown/DropdownItem"
import { CheckCircleIcon, ErrorHexaIcon, MoreDotIcon } from "../../icons"
import Badge from "../../components/ui/badge/Badge"
import { Switch, TablePagination } from "@mui/material"

export default function BasicTableOne() {
    const dispatch = useDispatch()
    const [isOpen, setIsOpen] = useState('')
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)

    const { usersList } = useSelector((store: RootState) => store.user)

    useEffect(() => {
        getUsersList()
    }, [limit, page])
    const getUsersList = async () => {
        try {
            setLoading(true)
            const res = await axiosInstance.get('/users/list', { params: { page, limit } })
            setTotal(res.data.total)
            setPage(res.data.page)
            setLimit(res.data.limit)
            dispatch(setUsersList(res.data.data.map((user: User) => ({
                _id: user._id,
                username: user.username,
                email: user.email,
                balance: {
                    amount: user.balance.amount,
                    bonus: user.balance.bonus,
                    demo: user.balance.demo
                },
                profileImage: user.profileImage || undefined,
                isEmailVerified: user.isEmailVerified,
                isIDVerified: user.isIDVerified,
                isPhoneVerified: user.isPhoneVerified,
            })
            )))
        } catch (e) { }
        finally {
            setLoading(false)
        }
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
    const verifyUserEmail = async ({ isEmailVerified, userId }: { isEmailVerified: boolean, userId: string }) => {
        try {
            await axiosInstance.put('users/verifyUserEmail', { userId, isVerify: !isEmailVerified })
            getUsersList()
        } catch (e) { }
    }
    const verifyUserPhone = async ({ isPhoneVerified, userId }: { isPhoneVerified: boolean, userId: string }) => {
        try {
            await axiosInstance.put('users/verifyUserPhone', { userId, isVerify: !isPhoneVerified })
            getUsersList()
        } catch (e) { }
    }
    return (
        <div className="w-full rounded-xl border border-gray-200 bg-white dark:text-gray-300 dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="w-full overflow-x-auto">
                {loading && (
                    <LinearProgress color="info" />
                )}
                <Table>
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] w-full">
                        <TableRow>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                username
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                email
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                balance
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                is EmailVerified
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                is PhoneVerified
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                is IDVerified
                            </TableCell>

                        </TableRow>
                    </TableHeader>
                    {/* Table Body */}
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {usersList?.map((user) => (
                            <TableRow key={user.username}>
                                <TableCell className="px-5 py-4 sm:px-6 text-start dark:text-gray-300">
                                    <div className="flex justify-start items-center gap-1" >
                                        <img
                                            width={40}
                                            height={40}
                                            src={user.profileImage ? `data:image/jpeg;base64,${user.profileImage}` : '/defaultavatar.jpg'}
                                        />
                                        {user.username}
                                    </div>
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {user.email}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    <div className="relative inline-block">
                                        <button className="dropdown-toggle" onClick={() => toggleDropdown(user._id)}>
                                            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
                                        </button>
                                        <Dropdown
                                            isOpen={isOpen === user._id}
                                            onClose={closeDropdown}
                                            className="w-40 p-2"
                                        >
                                            <DropdownItem

                                                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                                            >
                                                {user.balance.amount.toFixed(2)} Real
                                            </DropdownItem>
                                            <DropdownItem
                                                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                                            >
                                                {user.balance.demo.toFixed(2)} Demo
                                            </DropdownItem>
                                            <DropdownItem
                                                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                                            >
                                                {user.balance.bonus.toFixed(2)} Bonus
                                            </DropdownItem>
                                        </Dropdown>
                                    </div>

                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start cursor-pointer">
                                    <div className="flex justify-start" onClick={() => verifyUserEmail({ isEmailVerified: user.isEmailVerified, userId: user._id })} >
                                        <Badge

                                            size="sm"
                                            color={
                                                user.isEmailVerified
                                                    ? "success"
                                                    : "error"
                                            }
                                        >
                                            <Switch checked={user.isEmailVerified} />
                                        </Badge>
                                    </div>
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start cursor-pointer">
                                    <div className="flex justify-start" onClick={() => verifyUserPhone({ isPhoneVerified: user.isPhoneVerified, userId: user._id })} >
                                        <Badge
                                            size="sm"
                                            color={
                                                user.isPhoneVerified
                                                    ? "success"
                                                    : "error"
                                            }
                                        >
                                            <Switch checked={user.isPhoneVerified} />
                                        </Badge>
                                    </div>
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start cursor-pointer">
                                    <div className="flex justify-start"  >
                                        <Badge
                                            size="sm"
                                            color={
                                                user.isIDVerified
                                                    ? "success"
                                                    : "error"
                                            }
                                        >
                                            {user.isIDVerified ? <CheckCircleIcon /> : <ErrorHexaIcon />}
                                        </Badge>
                                    </div>
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
