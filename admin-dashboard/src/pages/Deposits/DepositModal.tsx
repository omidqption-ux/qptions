import { useEffect, useState } from "react"
import { Modal } from "../../components/ui/modal"
import { normalizeDate } from "../../utils/normalizedate"
import axiosInstance from "../../network/axios"
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

type DepositModalProps = {
    isOpen: boolean
    closeModal: () => void
    selectedDepositId: string
}

const DepositModal = ({ isOpen, closeModal, selectedDepositId }: DepositModalProps) => {
    const [error, setError] = useState("")

    const [depItem, setDepItem] = useState({
        amount: 0,
        amountCurrency: '',
        createdAt: '',
        payAddress: '',
        paidCurrency: '',
        paidCurrencyTitle: '',
        payment_status: '',
    })

    const getDepById = async () => {
        try {
            const res = await axiosInstance.get("/deposits/getById", {
                params: { id: selectedDepositId },
            })

            const d = res.data.data

            setDepItem({
                amount: d.amount ?? 0,
                amountCurrency: d.amountCurrency ?? '',
                createdAt: d.createdAt ?? '',
                payAddress: d.pay_address ?? '',
                paidCurrency: d.paidCurrency ?? '',
                paidCurrencyTitle: d.paidCurrencyTitle ?? '',
                payment_status: d.payment_status ?? '',
            })
        } catch (e: any) {
            setDepItem({
                amount: 0,
                amountCurrency: '',
                createdAt: '',
                payAddress: '',
                paidCurrency: '',
                paidCurrencyTitle: '',
                payment_status: '',
            })
            setError(e?.response?.data?.message || "Failed to load deposit")
        }
    }

    useEffect(() => {
        if (!isOpen || !selectedDepositId) return
        getDepById()
        return () => {
            setError("")
            setDepItem({
                amount: 0,
                amountCurrency: '',
                createdAt: '',
                payAddress: '',
                paidCurrency: '',
                paidCurrencyTitle: '',
                payment_status: '',
            })
        }
    }, [isOpen, selectedDepositId])


    const methodLabel =
        (depItem.paidCurrency
            ? depItem.paidCurrency.toUpperCase()
            : '') +
        (depItem.paidCurrencyTitle
            ? ` (${depItem.paidCurrencyTitle})`
            : '')

    return (
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[850px]">
            <div className="no-scrollbar relative w-full  overflow-y-auto  p-4  lg:p-11">
                <div className="p-2 text-center ">
                    Deposit Details
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
                            title='Deposit Details'
                            subheader='Summary of this deposit'
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
                                        {depItem.amount.toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}{' '}
                                        {depItem.amountCurrency || 'USD'}
                                    </Typography>
                                </Box>

                                {/* Paid currency */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Typography variant='body2' color='text.secondary'>
                                        Paid currency
                                    </Typography>
                                    <Chip
                                        label={methodLabel || '-'}
                                        size='small'
                                        color='primary'
                                        variant='outlined'
                                        sx={{ fontWeight: 500 }}
                                    />
                                </Box>

                                {/* Pay address */}
                                <Box>
                                    <Typography
                                        variant='body2'
                                        color='text.secondary'
                                        sx={{ mb: 0.5 }}
                                    >
                                        Payment address
                                    </Typography>
                                    <Tooltip title={depItem.payAddress || ''} placement='top'>
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
                                            {depItem.payAddress || '-'}
                                        </Typography>
                                    </Tooltip>
                                </Box>

                                {/* Status */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Typography variant='body2' color='text.secondary'>
                                        Status
                                    </Typography>
                                    <Chip
                                        label={depItem.payment_status || '-'}
                                        size='small'
                                        color={
                                            depItem.payment_status === 'finished'
                                                ? 'success'
                                                : depItem.payment_status === 'rejected'
                                                    ? 'error'
                                                    : 'warning'
                                        }
                                        variant='filled'
                                        sx={{ textTransform: 'capitalize' }}
                                    />
                                </Box>

                                {/* Created at */}
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
                                            Created at
                                        </Typography>
                                    </Box>
                                    <Typography variant='body2' sx={{ fontWeight: 500 }}>
                                        {normalizeDate(depItem.createdAt)}
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                    <span className="text-red-500">{error}</span>
                </form>
            </div>
        </Modal>
    )
}

export default DepositModal
