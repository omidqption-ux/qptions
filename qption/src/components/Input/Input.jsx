const Input = ({
     placeHolder,
     error = false,
     handleChange,
     className,
     type,
     name,
     data,
}) => {
     const handleValueChange = (value) => {
          handleChange(value)
     }
     return (
          <input
               autoComplete={type === 'password' ? 'new-password' : 'off'}
               type={type ?? 'text'}
               onChange={(e) => handleValueChange(e.target.value)}
               className={`bg-[#20293E]  placeholder-gray-400 p-3 rounded-md  focus:outline-none h-[38px]
                    ${
                         error
                              ? 'border border-[#A13E66] text-[#A13E66]'
                              : 'text-white'
                    } ${className} `}
               placeholder={placeHolder ?? ''}
               value={data[name]}
          />
     )
}
export default Input
