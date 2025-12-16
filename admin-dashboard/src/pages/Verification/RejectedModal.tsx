import { Modal } from "../../components/ui/modal"
import { useSelector } from "react-redux"
import { RootState } from "../../store"
import { Verification } from "../../store/slices/verification"
import Label from "../../components/form/Label"
import formatISO from "../../utils/formatISo"
const RejectedModal = ({ isOpen, closeModal, selectedVerificationId }: { isOpen: boolean, closeModal: () => void, selectedVerificationId: string }) => {
    const { verificationRejectedList } = useSelector((store: RootState) => store.verification)
    const verification = verificationRejectedList.find((veri: Verification) => veri._id === selectedVerificationId)

    return (
        <Modal isOpen={isOpen} onClose={closeModal} className="min-h-screen">
            <div className="no-scrollbar text-red-500 relative w-full  overflow-y-auto  bg-white p-4 dark:bg-gray-900 lg:p-11">
                <span className="text-xl " >Rejected </span>
                <div className="px-2 text-left ">
                    <h4 className="mb-2 text-lg font-semibold ">
                        ID Verification for: <span className="text-gray-400" >{verification?.userId.username}</span>
                    </h4>
                    <h6 className="mb-2 text-lg font-semibold ">
                        Document Type : <span className="text-gray-400" >{verification?.documentType}</span>
                    </h6>
                    <h6 className="mb-2 text-lg font-semibold ">
                        Created date : <span className="text-gray-400" >{formatISO(verification?.createdAt || new Date)}</span>
                    </h6>
                </div>
                <form className="flex flex-col">
                    <div className="mt-7 grid grid-cols-1 lg:grid-cols-3 gap-2 items-start justify-center ">
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
                        <div className="flex flex-col justify-center items-center">
                            <Label>Selfie Image</Label>
                            <img alt="Document"
                                style={{ maxWidth: 300, height: 'auto' }} src={`data:image/jpeg;base64,${verification?.selfieImage}`} />
                        </div>
                    </div>
                </form>
            </div>
        </Modal>
    )
}
export default RejectedModal