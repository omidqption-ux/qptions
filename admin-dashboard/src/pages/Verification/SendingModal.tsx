import { Modal } from "../../components/ui/modal"
import { useSelector } from "react-redux"
import { RootState } from "../../store"
import { Verification } from "../../store/slices/verification"
import Label from "../../components/form/Label"
import formatISO from "../../utils/formatISo"
const SendingModal = ({ isOpen, closeModal, selectedVerificationId }: { isOpen: boolean, closeModal: () => void, selectedVerificationId: string }) => {
    const { verificationSendingList } = useSelector((store: RootState) => store.verification)
    const verification = verificationSendingList.find((veri: Verification) => veri._id === selectedVerificationId)

    return (
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[800px] m-4">
            <div className="no-scrollbar relative w-full max-w-[800px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                <div className="px-2 text-left ">
                    <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
                        ID Verification for: {verification?.userId.username}
                    </h4>
                    <h6 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
                        Document Type : {verification?.documentType}
                    </h6>
                    <h6 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
                        Created date : {formatISO(verification?.createdAt || new Date)}
                    </h6>
                </div>
                <form className="flex flex-col">
                    <div className="custom-scrollbar h-[480px] overflow-y-auto px-2 pb-3">
                        <div className="mt-7">
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
                            <div className="flex flex-col justify-center items-center my-5">
                                <Label>Selfie Image</Label>
                                <img alt="Document"
                                    style={{ maxWidth: 300, height: 'auto' }} src={`data:image/jpeg;base64,${verification?.selfieImage}`} />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </Modal>
    )
}
export default SendingModal