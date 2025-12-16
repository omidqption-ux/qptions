import Verification from '../models/Verification.js'
import { createNotification } from '../utils/notifications.js'

export const uploadIDDocBack = async (req, res) => {
     const user = req.user
     const { photo } = req.body
     if (!photo) {
          return res.status(400).json({ message: 'No document provided!' })
     }
     try {
          let verification = await Verification.findOne({ userId: user._id })

          if (verification) {
               verification.documentBackImage = photo
               verification.updatedAt = Date.now()
          } else {
               verification = new Verification({
                    userId: user._id,
                    documentBackImage: photo,
               })
          }

          await verification.save()

          res.status(201).json({
               message: 'Document Back image uploaded successfully!',
               verification,
          })
     } catch (error) {
          return res.status(500).json({
               success: false,
               message: 'File upload failed.',
          })
     }
}
export const uploadIDDoc = async (req, res) => {
     const user = req.user
     const { photo } = req.body
     if (!photo) {
          return res.status(400).json({ message: 'No document provided!' })
     }
     try {
          let verification = await Verification.findOne({ userId: user._id })

          if (verification) {
               verification.documentImage = photo
               verification.updatedAt = Date.now()
          } else {
               verification = new Verification({
                    userId: user._id,
                    documentImage: photo,
               })
          }

          await verification.save()

          res.status(201).json({
               message: 'Document image uploaded successfully!',
               verification,
          })
     } catch (error) {
          return res.status(500).json({
               success: false,
               message: 'File upload failed.',
          })
     }
}

export const uploadSelfie = async (req, res) => {
     const user = req.user

     try {
          const body = req.body || {}

          let photo = null

          if (typeof body.photo === 'string') {
               photo = body.photo.trim()
          }
          if (!photo) {
               return res
                    .status(400)
                    .json({ message: 'No valid selfie provided!' })
          }

          let verification = await Verification.findOne({ userId: user._id })

          if (verification) {
               verification.selfieImage = photo
               verification.updatedAt = Date.now()
          } else {
               verification = new Verification({
                    userId: user._id,
                    selfieImage: photo,
               })
          }

          await verification.save()

          return res.status(201).json({
               message: 'Selfie uploaded successfully!',
               verification,
          })
     } catch (error) {
          console.error('uploadSelfie error:', error)
          return res.status(500).json({
               success: false,
               message: 'Selfie upload failed.',
          })
     }
}
export const getVerification = async (req, res) => {
     const user = req.user
     try {
          const verification = await Verification.findOne({ userId: user._id })
          res.status(201).json({
               verification,
          })
     } catch (error) {
          return res.status(500).json({
               message: 'Selfie upload failed.',
          })
     }
}
export const saveDocType = async (req, res) => {
     const user = req.user
     const { issuingCountry, documentType } = req.body
     try {
          let verification = await Verification.findOne({ userId: user._id })
          if (verification) {
               verification.issuingCountry = issuingCountry
               verification.documentType = documentType
               verification.updatedAt = Date.now()
          } else {
               verification = new Verification({
                    userId: user._id,
                    issuingCountry,
                    documentType,
               })
          }

          await verification.save()

          res.status(201).json({
               verification,
          })
     } catch (error) {
          return res.status(500).json({
               message: error.message,
          })
     }
}
export const changeStatus = async (req, res) => {
     const user = req.user
     const { status, rejectReason } = req.body
     try {
          let verification = await Verification.findOne({ userId: user._id })
          if (verification) {
               verification.status = status
               verification.rejectionReason = rejectReason ?? ''
               verification.verificationDate = Date.now()
          }
          await verification.save()
          await createNotification({
               userId: user._id,
               category: 'verification',
               title:
                    status === 'pending'
                         ? 'Verification'
                         : status === 'Rejected'
                              ? 'Verification Rejection'
                              : 'Verification Approval',
               body:
                    status === 'pending'
                         ? 'Your verification is under review.'
                         : status === 'rejected'
                              ? rejectReason.slice(0, 34) + '...'
                              : 'Your verification has been approved.',
          })
          res.status(201).json({
               verification,
          })
     } catch (error) {
          return res.status(500).json({
               message: error.message,
          })
     }
}
export const getUserVerificationStatus = async (req, res) => {
     const user = req.user
     try {
          const verification = await Verification.findOne({ userId: user._id })
          res.status(201).json({
               status: verification ? verification.status : 'notRequested',
          })
     } catch (error) {
          return res.status(500).json({
               message: 'Selfie upload failed.',
          })
     }
}