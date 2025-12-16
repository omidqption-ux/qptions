import { Formik } from "formik";
import React from "react";
const OtpInput = React.memo(()=>{
    return (
    
    <Formik                                            
        initialValues={{
            otpInput:""
        }}
        onSubmit={(values, actions) => {
            actions.setSubmitting(false);
        }}
    >
    {props => (
        <form autoComplete="off"  onSubmit={props.handleSubmit}>
            <input 
                name='otpInput'
                id='otpInput'
                type="text"                                               
                className="bg-[#20293E] placeholder:text-xs placeholder-gray-400 p-3 rounded-md  focus:outline-none h-[38px] text-white w-[85px] mx-2"
                placeholder="6-digits"   
                onChange={props.handleChange}   
                value={props.values.otpInput}
            />                                        
        </form>
     )}
    </Formik>
    )
})
export default OtpInput