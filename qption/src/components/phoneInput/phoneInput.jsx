import 'react-phone-number-input/style.css'
import PhoneInput, { parsePhoneNumber } from 'react-phone-number-input'

const Phone = ({ formikprops }) => {

     return (
          <div dir="ltr" className='w-full' >
               <PhoneInput

                    value={formikprops.values.phone || undefined}
                    onChange={(val) => {
                         formikprops.setFieldValue('phone', val || '')
                         if (val) {
                              try {
                                   const p = parsePhoneNumber(val)
                                   formikprops.setFieldValue('country', p.country || '')
                              } catch { }
                         } else {
                              formikprops.setFieldValue('country', '')
                         }
                    }}
                    onBlur={() => formikprops.setFieldTouched('phone', true)}
                    name="phone"
                    id="phone"
                    placeholder="Enter phone number"
                    defaultCountry="US"
                    international
                    countryCallingCodeEditable={false}
                    className="bg-[#20293E] text-gray-300 rounded-md h-[38px] px-3 focus:outline-none w-full"
               />
          </div>
     )
}

export default Phone
