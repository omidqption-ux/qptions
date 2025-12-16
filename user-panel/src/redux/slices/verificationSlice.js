import { createSlice } from '@reduxjs/toolkit'

const initialState = {
     issuingCountry: '',
     documentType: 'ID',
     documentImage: null,
     documentBackImage: null,
     selfieImage: null,
}

export const verificationSlice = createSlice({
     name: 'verification',
     initialState,
     reducers: {
          setVerification: (state, action) => {
               state.issuingCountry = action.payload.issuingCountry
               state.documentType = action.payload.documentType
               state.documentImage = action.payload.documentImage
               state.selfieImage = action.payload.selfieImage
               state.documentBackImage = action.payload.documentBackImage
          },
          setIssuingCountry: (state, action) => {
               state.issuingCountry = action.payload
          },
          setDocumentType: (state, action) => {
               state.documentType = action.payload
          },
          setDocumentBase64: (state, action) => {
               state.documentImage = action.payload
          },
          setDocumentBackImage64: (state, action) => {
               state.documentBackImage = action.payload
          },
          setSelfieImage: (state, action) => {
               state.selfieImage = action.payload
          },
     },
})

export const {
     setVerification,
     setIssuingCountry,
     setDocumentType,
     setDocumentBase64,
     setSelfieImage,
     setDocumentBackImage64,
} = verificationSlice.actions

export default verificationSlice.reducer
