import { Button } from "@mui/material"
import { Modal } from "../../components/ui/modal"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "../../store"
import { setVerificationsCount, Verification } from "../../store/slices/verification"
import Label from "../../components/form/Label"
import formatISO from "../../utils/formatISo"
import axiosInstance from "../../network/axios"
import { useEffect, useState } from "react"
import Input from "../../components/form/input/InputField"

const PendingModal = ({ isOpen, closeModal, getList, selectedVerificationId }: { isOpen: boolean, closeModal: () => void, getList: () => void, selectedVerificationId: string }) => {
    const dispatch = useDispatch()
    const { verificationPendingList, pendingCount, approvedCount, rejectedCount, sendingCount } = useSelector((store: RootState) => store.verification)
    const verification = verificationPendingList.find((veri: Verification) => veri._id === selectedVerificationId)
    const [reason, setReason] = useState('')
    const [error, setError] = useState('')
    const reject: () => void = async () => {
        try {
            if (!reason) {
                setError('Reason is rquired')
                return
            }
            await axiosInstance.put(`/verifications/${verification?._id}/reject`, { reason })
            dispatch(setVerificationsCount({ pendingCount: pendingCount - 1, rejectedCount: rejectedCount + 1, approvedCount, sendingCount }))
            closeModal()
        } finally {
            getList()
        }
    }
    const verify: () => void = async () => {
        try {
            await axiosInstance.put(`/verifications/${verification?._id}/verify`)
            dispatch(setVerificationsCount({ pendingCount: pendingCount - 1, rejectedCount: rejectedCount, approvedCount: approvedCount + 1, sendingCount }))
        } finally {
            closeModal()
            getList()
        }
    }
    useEffect(() => {
        return () => {
            setReason('')
            setError('')
        }
    }, [])
    return (
        <Modal isOpen={isOpen} onClose={closeModal} className="min-h-screen">
            <div className="no-scrollbar relative font-normal w-full  overflow-y-auto  bg-white p-4 dark:bg-gray-900 lg:p-11">
                <div className="px-2 text-left text-lg text-gray-300 ">
                    <h4 className="mb-2 text-lg  ">
                        ID Verification for: {verification?.userId.username}
                    </h4>
                    <h6 className="mb-2 text-lg ">
                        Document Type : {verification?.documentType}
                    </h6>
                    <h6 className="mb-2 text-lg">
                        Created date : {formatISO(verification?.createdAt || new Date)}
                    </h6>
                </div>
                <form className="flex flex-col">
                    <div className="mt-7 grid grid-cols-1 lg:grid-cols-3 items-start justify-center ">
                        {verification?.documentType === 'passport' ? (
                            <div className="flex flex-col">
                                <Label>Passport</Label>
                                <img alt="Document"
                                    style={{ maxWidth: 300, height: 'auto' }} src={`data:image/jpeg;base64,${verification.documentImage}`} />
                            </div>
                        ) : (
                            <div className="flex w-full justify-between" >
                                <div className="flex flex-col">
                                    <Label>Document Front</Label>
                                    <img
                                        alt="Document"
                                        style={{ maxWidth: 300, height: 'auto' }}
                                        src={`data:image/jpeg;base64,${verification?.documentImage}`} />
                                </div>
                                <div className="flex flex-col ">
                                    <Label>Document Back</Label>
                                    <img alt="Document"
                                        style={{ maxWidth: 300, height: 'auto' }} src={`data:image/jpeg;base64,${verification?.documentBackImage}`} />
                                </div>
                            </div>
                        )}
                        <div className="flex flex-col justify-center items-center ">
                            <Label>Selfie Image</Label>
                            <img alt="Document"
                                style={{ maxWidth: 300, height: 'auto' }} src={`data:image/jpeg;base64,${verification?.selfieImage}`} />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 px-2 mt-6 justify-start">
                        <Label>Reason:</Label>
                        <Input value={reason} className="min-w-[400px]" placeholder="Reject reason*" onChange={(e: any) => setReason(e.target.value)} />
                        <Button color="error" variant="contained" onClick={reject}>
                            Reject
                        </Button>
                        <Button color="success" variant="contained" onClick={verify}>
                            Approve
                        </Button>
                    </div>
                    <span className="text-red-500" >{error}</span>
                </form>
            </div>
        </Modal>
    )
}
export default PendingModal