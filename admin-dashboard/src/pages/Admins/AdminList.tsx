import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../components/ui/table"
import { CheckCircleIcon, ErrorHexaIcon, PlusIcon } from "../../icons";
import { useDispatch, useSelector } from "react-redux";
import Badge from "../../components/ui/badge/Badge";
import { useEffect, useState } from "react";
import axiosInstance from "../../network/axios";
import { changeAdminName, changeRole, NewAdminState, Role, setAdminList } from "../../store/slices/admins";
import { RootState } from "../../store";
import Spinner from "../../components/common/Spinner";
import Select from "../../components/form/Select";
import Input from "../../components/form/input/InputField";
import Switch from "../../components/form/switch/Switch";
import Button from "../../components/ui/button/Button";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import { Button as MuiButton } from "@mui/material";
const roleOptions = [
    {
        value: 'admin',
        label: 'admin'
    },
    {
        value: 'support',
        label: 'support'
    },
]
export default function BasicTableOne() {
    const { isOpen, openModal, closeModal } = useModal();
    const [dirty, setDirty] = useState('')
    const [password, setPassword] = useState([{
        username: '', password: ''
    }])
    const [passwordDirty, setPasswordDirty] = useState('')
    const [newAdmin, setNewAdmin] = useState<NewAdminState>({
        role: 'superAdmin',
        fullName: '',
        username: '',
        isActive: false,
        password: '',
    })
    const [fullnameLoading, setfullnameLoading] = useState('')
    const [passwordLoading, setPasswordLoading] = useState('')
    const [activationLoading, setActivationLoading] = useState('')
    const [roleLoading, setRoleLoading] = useState('')
    const dispatch = useDispatch()
    const { adminList } = useSelector((store: RootState) => store.admin)
    const getAdminList = async () => {
        try {
            const res = await axiosInstance.get('/admins/getAllAdmins', { params: { page: 1, limit: 20 } })
            dispatch(setAdminList({ adminList: res.data.adminsList }))
        } catch (e) {

        } finally {

        }
    }
    useEffect(() => {
        getAdminList()
    }, [])

    const toggleActivation = async (username: string, isActive: boolean) => {
        try {
            setActivationLoading(username) /// spin only the desired row
            await axiosInstance.put('/admins/deActivate', { active: !isActive, username })
            getAdminList()
        } catch (e) { }
        finally {
            setActivationLoading('')
        }
    }
    const changeAdminRol = async (username: string, role: string) => {
        try {
            setRoleLoading(username)
            await axiosInstance.put('admins/updateAdminRole', { username, role })
            dispatch(changeRole({ username, role }))
        } catch (e) {
        } finally {
            setRoleLoading('')
        }
    }

    const saveFullName = async ({ username, fullName }: { username: string, fullName: string }) => {
        try {
            setfullnameLoading(username)
            await axiosInstance.put('admins/updateName', { username, fullName })
        } catch (e) { }
        finally {
            setfullnameLoading('')
            setDirty('')
        }
    }
    const handleSave: (e: any) => void = async (e: any) => {
        e.preventDefault()
        try {
            if (!newAdmin.password || !newAdmin.username) return
            await axiosInstance.post('/admins/newAdmin', { admin: newAdmin })
            getAdminList()
            closeModal()
        } catch (_e) {
        }
    }
    const savePassword: (username: string) => void = async (username: string) => {
        try {
            if (!password) return
            const pss = password.find(ps => ps.username === username)
            await axiosInstance.put('/admins/changePassword', { username, password: pss?.password || '' })
        } finally {
            setPasswordDirty('')
            setPasswordLoading('')
        }
    }
    const setUserPassword = (username: string, pass: string) => {
        const pssIndex = password.findIndex(ps => ps.username === username)
        if (pssIndex > 0) {
            password[pssIndex].password = pass
            setPassword([...password])
        }
        else {
            password.push({ username, password: pass })
            setPassword(password)
        }
    }
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:text-gray-300 dark:border-white/[0.05] dark:bg-white/[0.03]">
            <Modal
                isOpen={isOpen}
                onClose={closeModal}
                className="max-w-[700px] m-4"

            >
                <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Add Admin
                        </h4>
                    </div>
                    <form className="flex flex-col">
                        <div className="custom-scrollbar h-[280px] overflow-y-auto px-2 pb-3">
                            <div className="mt-7">
                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                    <div className="col-span-2 lg:col-span-1 items-start flex flex-col">
                                        <Label>username</Label>
                                        <Input type="text" onChange={(e) => setNewAdmin((prev: NewAdminState) => ({ ...prev, username: e.target.value }))} />
                                    </div>
                                    <div className="col-span-2 lg:col-span-1 items-start flex flex-col">
                                        <Label>password</Label>
                                        <Input type="password" onChange={(e) => setNewAdmin((prev: NewAdminState) => ({ ...prev, password: e.target.value }))} />
                                    </div>
                                    <div className="col-span-2 lg:col-span-1 items-start flex flex-col">
                                        <Label>Role</Label>
                                        <Select options={roleOptions} onChange={(v) => setNewAdmin((prev: NewAdminState) => ({ ...prev, role: v as Role }))} className="max-w-[240px]" />
                                    </div>
                                    <div className="col-span-2 lg:col-span-1 items-start flex flex-col">
                                        <Label>Full Name</Label>
                                        <Input type="text" onChange={(e) => setNewAdmin((prev: NewAdminState) => ({ ...prev, fullName: e.target.value }))} />
                                    </div>
                                    <div className="col-span-2 lg:col-span-1 items-start flex flex-col">
                                        <Label>IsActive</Label>
                                        <Switch label="" onChange={(v) => setNewAdmin((prev: NewAdminState) => ({ ...prev, isActive: v }))} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <MuiButton variant="text" onClick={closeModal}>
                                Close
                            </MuiButton>
                            <MuiButton variant="contained" onClick={handleSave}>
                                Save Changes
                            </MuiButton>
                        </div>
                    </form>
                </div>
            </Modal>
            <div className="w-full flex justify-end p-4" >
                <Button onClick={openModal} variant="outline"   >
                    <PlusIcon />Add Admin
                </Button>
            </div>
            <div className="max-w-full overflow-x-auto">
                <Table>
                    {/* Table Header */}
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                        <TableRow>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium  text-start text-theme-xs dark:text-gray-400"
                            >
                                username
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium  text-start text-theme-xs dark:text-gray-400"
                            >
                                fullName
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium  text-start text-theme-xs dark:text-gray-400"
                            >
                                role
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium  text-start text-theme-xs dark:text-gray-400"
                            >
                                isActive
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium  text-start text-theme-xs dark:text-gray-400"
                            >
                                password
                            </TableCell>
                        </TableRow>
                    </TableHeader>
                    {/* Table Body */}
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {adminList?.map((order) => (
                            <TableRow key={order.username}>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {order.username}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-start text-theme-sm dark:text-gray-400">
                                    <div className="flex items-center justify-start" >
                                        {fullnameLoading === order.username ? <Spinner /> : (
                                            <Input
                                                onChange={(e) => {
                                                    dispatch(changeAdminName({ username: order.username, fullName: e.target.value }))
                                                    setDirty(order.username)
                                                }}
                                                value={order.fullName}
                                                className="max-w-[160px] rounded-r-none max-h-10"
                                            />
                                        )}
                                        {dirty === order.username && (
                                            <Button onClick={() => saveFullName({ username: order.username, fullName: order.fullName })} className="h-10 rounded-l-none" >save</Button>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="px-4 py-3  text-start text-theme-sm dark:text-gray-400">
                                    {roleLoading === order.username ? (
                                        <Spinner />
                                    ) : (
                                        <Select defaultValue={order.role} options={roleOptions} onChange={(e) => changeAdminRol(order.username, e)} className="max-w-[110px]" />
                                    )}

                                </TableCell>
                                <TableCell
                                    className="px-4 py-3  text-start text-theme-sm dark:text-gray-400 cursor-pointer">
                                    <div className="w-full flex items-center justify-start" onClick={() => toggleActivation(order.username, order.isActive)}  >
                                        {activationLoading === order.username ? (
                                            <Spinner />
                                        ) : (
                                            <Badge
                                                size="sm"
                                                color={
                                                    order.isActive
                                                        ? "success"
                                                        : "error"
                                                }
                                            >
                                                {order.isActive ? <CheckCircleIcon /> : <ErrorHexaIcon />}
                                            </Badge>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="px-4 py-3  text-start text-theme-sm dark:text-gray-400">
                                    <div className="flex items-center justify-start" >
                                        {passwordLoading === order.username ? <Spinner /> : (
                                            <Input
                                                onChange={(e) => {
                                                    setPasswordDirty(order.username)
                                                    setUserPassword(order.username, e.target.value)
                                                }}
                                                value={password.find(ps => ps.username === order.username)?.password ?? "*****"}
                                                className="max-w-[160px] rounded-r-none max-h-10"
                                                type="password"
                                            />
                                        )}
                                        {passwordDirty === order.username && (
                                            <Button onClick={() => savePassword(order.username)} className="h-10 rounded-l-none" >save</Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div >
    )
}
