import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import './phone.css'
const Phone = ({
     value,                // string | undefined  -> current phone value (E.164 like "+15551234567")
     setFieldValue,        // (field, val) => void (Formik)
     setFieldTouched,      // (field, touched) => void (Formik)
     country,              // string | undefined  -> ISO2 default country, e.g. "US", "BG"
     disabled = false,
     inputStyle = '',
     onChange,             // optional external handler (val) => void
     onCountryChange,      // optional external handler (iso2) => void
     name = 'phone',       // optional field name (defaults to 'phone')
     countryField = 'country', // optional field name for country code (defaults to 'country')
}) => {
     return (
          <PhoneInput
               dir="ltr"
               disabled={disabled}
               className={inputStyle}
               value={value || undefined}
               onChange={(val) => {
                    // push value to Formik if provided
                    if (setFieldValue) setFieldValue(name, val || '')
                    // bubble to external handler if provided
                    if (onChange) onChange(val)
               }}
               onCountryChange={(iso2) => {
                    // keep country ISO code in form if provided
                    if (setFieldValue) setFieldValue(countryField, iso2 || '')
                    if (onCountryChange) onCountryChange(iso2)
               }}
               onBlur={() => {
                    if (setFieldTouched) setFieldTouched(name, true)
               }}
               name={name}
               id={name}
               placeholder="Enter phone number"
               defaultCountry={country || 'US'}
               international
               countryCallingCodeEditable={false}
          />
     )
}

export default Phone
