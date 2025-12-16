"use client"
import { useEffect, useState } from 'react';
import axiosInstance from '../../network/axios';

const VerifyPage = () => {
  const [queryParams, setQueryParams] = useState({ token: null });
  const [isSuccess,setIsSuccess] = useState(false)
  const [errorMessage,seterrorMessage] = useState("")
  useEffect(() => {
    // Parse query parameters from the URL
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('token');

    // Update state with query parameters
    setQueryParams({ token });
  }, []); // Run only once on mount

  const callVerifyEmail = async()=>{
    try{
     if(queryParams.token){
      await axiosInstance.put('/api/auth/verifyEmail',queryParams)      
      seterrorMessage("")      
     }
    }catch(e){
      seterrorMessage(e.response.data.message+". please get new verification from client cabinet") 
    }
  }
  useEffect(()=>{
    callVerifyEmail()
  },[queryParams.token])


  return (
    <div className='bg-darkEnd flex justify-center p-5 items-center w-full h-[400px]' >
      <div className="p-4 rounded shadow text-OffWhite">
            <span className="text-lg font-semibold">{errorMessage === "" ? <span className='text-tetGreen' >You are verified successfully</span>:<span className='text-googleRed' >{errorMessage}</span>}</span>           
        </div>
    </div>
  );
};

export default VerifyPage;
