import { useEffect, useState } from "react"
import { Button } from "@mui/material"
import { Modal } from "../../components/ui/modal"
import Label from "../../components/form/Label"
import { normalizeDate } from "../../utils/normalizedate"
import axiosInstance from "../../network/axios"
import Input from "../../components/form/input/InputField"
import {
    Card,
    CardContent,
    CardHeader,
    Divider,
    Typography,
    Box,
    Stack,
    Chip,
    Tooltip,
} from '@mui/material'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import PaymentsIcon from '@mui/icons-material/Payments'

const WaitingModal = ({ isOpen, closeModal, selectedWithdrawId, isWaiting }: { isOpen: boolean, closeModal: () => void, selectedWithdrawId: string, isWaiting: boolean }) => {
    const [loading, setLoading] = useState(false)
    const [reason, setReason] = useState("")
    const [error, setError] = useState("")
    const [withItem, setWithItem] = useState({
        amount: 0,
        createdAt: '',
        method: '',
        walletAddress: ''
    })

    const getWithById = async () => {
        try {
            const res = await axiosInstance.get("/withdrawals/getById", { params: { id: selectedWithdrawId } })
            setWithItem({
                amount: res.data.data.amount,
                createdAt: res.data.data.createdAt,
                method: res.data.data.method.code + "(" + res.data.data.method.title + ")",
                walletAddress: res.data.data.walletAddress
            })
        } catch (e) {
            setWithItem({
                amount: 0,
                createdAt: '',
                method: '',
                walletAddress: ''
            })
        }
    }
    useEffect(() => {
        if (!isOpen) return
        getWithById()
        return () => {
            setError("")
            setReason("")
            setWithItem({
                amount: 0,
                createdAt: '',
                method: '',
                walletAddress: ''
            })
        }
    }, [selectedWithdrawId])
    const reject = async () => {
        if (!reason.trim()) {
            setError("Reject reason is required")
            return
        }
        setError("")
        setLoading(true)
        try {
            await axiosInstance.post("/withdrawals/reject", {
                id: selectedWithdrawId,
                reason: reason.trim(),
            })
            closeModal()
        } catch (e: any) {
            setError(e?.response?.data?.message || "Failed to reject withdrawal")
        } finally {
            setLoading(false)
        }
    }

    const verify = async () => {
        setError("")
        setLoading(true)
        try {
            await axiosInstance.post("/withdrawals/approve", {
                id: selectedWithdrawId,
            })
            closeModal()
        } catch (e: any) {
            setError(e?.response?.data?.message || "Failed to approve withdrawal")
        } finally {
            setLoading(false)
        }
    }
    return (
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[850px]">
            <div className="no-scrollbar relative w-full  overflow-y-auto  p-4  lg:p-11">
                <div className="p-2 text-center ">
                    Withdraw Request
                </div>
                <form className="flex flex-col">
                    <Card
                        elevation={6}
                        sx={{
                            borderRadius: 3,
                            overflow: 'hidden',
                        }}
                    >
                        <CardHeader
                            avatar={<PaymentsIcon color='primary' />}
                            title='Withdrawal Details'
                            subheader='Summary of your withdrawal request'
                            sx={{
                                '& .MuiCardHeader-title': {
                                    fontWeight: 600,
                                },
                                '& .MuiCardHeader-subheader': {
                                    fontSize: 13,
                                },
                            }}
                        />

                        <Divider />

                        <CardContent>
                            <Stack spacing={2.5}>
                                {/* Amount */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                                        <AccountBalanceWalletIcon fontSize='small' color='primary' />
                                        <Typography variant='body2' color='text.secondary'>
                                            Amount
                                        </Typography>
                                    </Box>
                                    <Typography variant='h6' sx={{ fontWeight: 600 }}>
                                        {withItem.amount.toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}{' '}
                                        USDT
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Typography variant='body2' color='text.secondary'>
                                        Method
                                    </Typography>
                                    <Chip
                                        label={withItem.method || '-'}
                                        size='small'
                                        color='primary'
                                        variant='outlined'
                                        sx={{ fontWeight: 500 }}
                                    />
                                </Box>
                                <Box>
                                    <Typography
                                        variant='body2'
                                        color='text.secondary'
                                        sx={{ mb: 0.5 }}
                                    >
                                        Wallet address
                                    </Typography>
                                    <Tooltip title={withItem.walletAddress || ''} placement='top'>
                                        <Typography
                                            variant='body2'
                                            sx={{
                                                fontFamily: 'monospace',
                                                fontSize: 13,
                                                bgcolor: 'action.hover',
                                                p: 1,
                                                borderRadius: 1.5,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {withItem.walletAddress || '-'}
                                        </Typography>
                                    </Tooltip>
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                                        <CalendarMonthIcon fontSize='small' color='action' />
                                        <Typography variant='body2' color='text.secondary'>
                                            Requested at
                                        </Typography>
                                    </Box>
                                    <Typography variant='body2' sx={{ fontWeight: 500 }}>
                                        {normalizeDate(withItem.createdAt)}
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                    {isWaiting && (
                        <div className="flex items-center gap-3 px-2 mt-6 justify-start">
                            <Label>Reason:</Label>
                            <Input value={reason} className="min-w-[400px]" placeholder="Reject reason*" onChange={(e: any) => setReason(e.target.value)} />
                            <Button color="error" variant="contained" onClick={reject} loading={loading} >
                                Reject
                            </Button>
                            <Button color="success" variant="contained" onClick={verify} loading={loading} >
                                Approve
                            </Button>
                        </div>
                    )}
                    <span className="text-red-500" >{error}</span>
                </form>
            </div>
        </Modal>
    )
}
export default WaitingModal