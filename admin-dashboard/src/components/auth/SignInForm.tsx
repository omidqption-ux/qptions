import { useEffect, useState } from "react";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import Spinner from "../../components/common/Spinner"
import axiosInstance from "../../network/axios"
import { useNavigate } from 'react-router-dom'

export default function SignInForm() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setloading] = useState(false)
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: ''
  })
  const onChange = (val: string, type: "email" | "password") => {
    if (type === 'email')
      setLoginInfo(prev => ({ ...prev, email: val }))
    else
      setLoginInfo(prev => ({ ...prev, password: val }))
  }

  const login = async () => {
    try {
      setloading(true)
      if (!loginInfo.email || !loginInfo.password) setError('Username and password are required')
      const res = await axiosInstance.post('/auth/login', loginInfo)
      if (res.data.isLogin) window.location.href = '/'

    } catch (e: any) {
      setError(e.message)
    } finally {
      setloading(false)
    }
  }

  const isLogin = async () => {
    try {
      const res = await axiosInstance.post('/auth/isLoginAdmin')
      if (res.data.isLogin) {
        navigate('/', { replace: true })
      }
    } catch (e: any) {
      console.log(e.message)
    }
  }
  useEffect(() => {
    isLogin()
  }, [])


  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your username and password to sign in!
            </p>
          </div>
          <div>
            <div className="space-y-6">
              <div>
                <Label>
                  Email <span className="text-error-500">*</span>
                </Label>
                <Input onChange={(e: any) => onChange(e.target.value, "email")} value={loginInfo.email} placeholder="info@gmail.com" />
              </div>
              <div>
                <Label>
                  Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    onChange={(e: any) => onChange(e.target.value, "password")}
                    type={showPassword ? "text" : "password"}
                    value={loginInfo.password}
                    placeholder="Enter your password"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center" >
                <Button onClick={login} className="w-full" size="sm">
                  {loading && (
                    <Spinner />
                  )}
                  Sign in
                </Button>
                <span className="text-error-500 text-sm" >{error}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
