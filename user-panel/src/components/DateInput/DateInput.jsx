import React, { useState, useEffect } from 'react'

const DateInput = ({ formikprops }) => {
     const { values, setFieldValue, setFieldError } = formikprops
     const [year, setYear] = useState('')
     const [month, setMonth] = useState('')
     const [day, setDay] = useState('')

     useEffect(() => {
          if (values.dateOfBirth) {
               const [y, m, d] = values.dateOfBirth.split('-')
               setYear(y || '')
               setMonth(m || '')
               setDay(d || '')
          }
     }, [values.dateOfBirth])

     const pad = (val) => (val.length === 1 ? '0' + val : val)

     const validateAndSetDate = () => {
          const y = parseInt(year, 10)
          const m = parseInt(month, 10)
          const d = parseInt(day, 10)
          const now = new Date()
          const currentYear = now.getFullYear()

          const paddedMonth = pad(month)
          const paddedDay = pad(day)

          setMonth(paddedMonth)
          setDay(paddedDay)

          if (!y || y < 1900 || y > currentYear) {
               setFieldError(
                    'dateOfBirth',
                    'Year must be valid and 1900 or later.'
               )
               return
          }

          const age = currentYear - y
          if (age < 18) {
               setFieldError(
                    'dateOfBirth',
                    'You must be at least 18 years old.'
               )
               return
          }

          if (!m || m < 1 || m > 12) {
               setFieldError('dateOfBirth', 'Month must be between 01 and 12.')
               return
          }

          if (!d || d < 1 || d > 31) {
               setFieldError('dateOfBirth', 'Day must be between 01 and 31.')
               return
          }

          const dob = `${y}-${pad(m)}-${pad(d)}`
          setFieldValue('dateOfBirth', dob)
          setFieldError('dateOfBirth', '')
     }
     return (
          <div className='flex w-[280px] items-center justify-start'>
               <input
                    type='number'
                    maxLength='4'
                    placeholder='YYYY'
                    value={year}
                    onChange={(e) => setYear(e.target.value.replace(/\D/g, ''))}
                    onBlur={validateAndSetDate}
                    className={`bg-[#20293E]  px-2 rounded-xs  
                         focus:outline-none h-[28px] w-[50px] text-xs rounded-lg`}
               />
               <span className='text-lightGrey mx-1'> / </span>

               <input
                    type='number'
                    maxLength='2'
                    placeholder='MM'
                    value={month}
                    onChange={(e) =>
                         setMonth(e.target.value.replace(/\D/g, ''))
                    }
                    onBlur={validateAndSetDate}
                    className={`bg-[#20293E]  px-2 rounded-xs  
                         focus:outline-none h-[28px] w-[40px] text-xs rounded-lg`}
               />
               <span className='text-lightGrey mx-1'> / </span>

               <input
                    type='number'
                    maxLength='2'
                    placeholder='DD'
                    value={day}
                    onChange={(e) => setDay(e.target.value.replace(/\D/g, ''))}
                    onBlur={validateAndSetDate}
                    className={`bg-[#20293E]  px-2 rounded-xs  
                         focus:outline-none h-[28px] w-[40px] text-xs rounded-lg`}
               />
          </div>
     )
}

export default DateInput
