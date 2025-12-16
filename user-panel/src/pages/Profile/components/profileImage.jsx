import { useState } from 'react'
import styles from '../IdentityInformation.module.css'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import { Avatar } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { compressImage } from '../../../utils/convertFiletoBase64'
import axiosInstance from '../../../network/axios'
import { IconButton } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'

const ProfileImage = ({ getUserInfo, userProfile }) => {
    const [loadingImg, setLoadingImg] = useState(false)
    const [errorUploader, setErrorUploader] = useState('')
    const allowedExtensions = ['jpg', 'jpeg', 'png']
    const maxSizeInBytes = 6 * 1024 * 1024 // 6 MB
    function validateFile(file) {
        const fileExtension = file.name.split('.').pop().toLowerCase()
        if (!allowedExtensions.includes(fileExtension)) {
            return {
                valid: false,
                error: 'Unsupported file extension.',
            }
        }
        if (file.size > maxSizeInBytes) {
            return { valid: false, error: 'File size exceeds 6 MB.' }
        }
        return { valid: true }
    }
    const uploadProfileImage = async (file) => {
        try {
            setLoadingImg(true)
            const res = validateFile(file)

            if (res.valid) {
                const base64 = await compressImage(file)
                await axiosInstance.put('/users/profile/upload', {
                    photo: base64,
                })
                setErrorUploader('')
                getUserInfo()
            } else {
                setErrorUploader(res.error)
            }
        } catch (error) {
        } finally {
            setTimeout(() => {
                setLoadingImg(false)
            }, 1000)
        }
    }

    return (
        <div className={styles.avatarSection}>
            <div className={styles.avatarContainer + " flex flex-col items-center"}>
                {/* Existing upload-from-gallery */}
                <IconButton component="label" htmlFor="profile-image-upload" className={styles.uploadButton} size="small" disabled={loadingImg}>
                    <Avatar
                        src={
                            userProfile?.profileImage
                                ? (userProfile.profileImage.startsWith('https://')
                                    ? userProfile.profileImage
                                    : `data:image/jpeg;base64,${userProfile.profileImage}`)
                                : '/default-avatar.png'
                        }
                        className={styles.avatar + ' w-[120px] h-[120px] mt-4 '}
                    />
                    {loadingImg && <CircularProgress size={130} className={styles.avatarLoadingOverlay} />}
                    <CloudUploadIcon className={styles.uploadIcon} />
                    <input
                        id="profile-image-upload"
                        type="file"
                        className={styles.hiddenInput}
                        accept="image/jpeg,image/png"
                        onChange={(e) => {
                            if (e.target.files?.[0]) uploadProfileImage(e.target.files[0])
                            e.target.value = ''
                        }}
                        disabled={loadingImg}
                    />
                </IconButton>
                <IconButton component="label" htmlFor="profile-selfie-capture" size="small" disabled={loadingImg} >
                    <CameraAltIcon className='text-gray-300 hover:text-gray-950' />
                    <input
                        id="profile-selfie-capture"
                        type="file"
                        className={styles.hiddenInput}
                        accept="image/*"
                        capture="user"             // <— key hint for mobile front camera
                        onChange={(e) => {
                            if (e.target.files?.[0]) uploadProfileImage(e.target.files[0])
                            e.target.value = ''
                        }}
                        disabled={loadingImg}
                    />
                </IconButton>
            </div>

            {errorUploader && <p className={styles.uploaderError}>{errorUploader}</p>}
            <p className={styles.uploadHint + ' text-blue-100'}>Max 6MB (JPG, PNG)</p>
        </div>

    )
}
export default ProfileImage