import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
// import Background from '@assets/login2.png'
// import Victory from '@assets/victory.png'
import { useRegisterUserMutation, useLoginUserMutation } from '../../redux/ApiSlice/Auth.slice.js'
import { useDispatch, useSelector } from 'react-redux'
import { LoginSetToken } from '../../redux/ApiSlice/Token.slice.js'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import Logo from '../../assets/Logo.png'
import { toast } from "sonner"



function Auth() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setconfirmPassword] = useState('')
  const [registerUser] = useRegisterUserMutation();
  const [loginUser] = useLoginUserMutation();
  const dispatch = useDispatch()
  const navigate = useNavigate()


  const handleLogin = async () => {
    try {
      const response = await loginUser({ email: email, password: password })
console.log(response,"afd");

      const datas = {
        token: response?.data?.data?.accessTokenGenerate,
        data: response?.data?.data?.user
      }
      dispatch(LoginSetToken(datas))
      setEmail('')
      setPassword('')
      Cookies.set('token', response?.data?.data?.accessTokenGenerate)
      toast(response?.data?.message)
      console.log(response?.data);
    

      if (response?.data?.data?.accessTokenGenerate) {
        navigate('/profile')
      }

    } catch (error) {
      toast("Eroor occur.",error)

      console.log(error);

    }
  }

  const handleSignup = async () => {
    
    
    try {
     
      await registerUser({ email: email, password: password })
       console.log("clicked");
      setEmail('')
      setPassword('')
      setconfirmPassword('')

    } catch (error) {
      console.log(error);

    }
  }

  return (
    <div className='h-[100vh] w-[100vw] flex items-center justify-center  bg-[#1f1d1d]'>
      <div className='h-[80vh]  bg-[#282828] border-1 text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[90vw] xl:w-[60vw] grid xl:grid-col-2' >
        <div className='flex flex-col justify-center items-center gap-10'>
          <div className='flex flex-col justify-center items-center'>
            <div className='flex  justify-center items-center gap-5'>
              <h1 className='text-5xl font-bold md:text-6xl text-yellow-300'>Welcome</h1>
              {/* <img src="" alt="victory" className='h-[100px]' /> */}
              <img src={Logo} alt="Background" className='h-[100px]' />

            </div>
            <p className='font-medium text-center text-yellow-300'> Fill in the detail to get started with chat app</p>
          </div>

          <div className="flex item-center  justify-center w-full text-white">
            <Tabs className="w-3/4" defaultValue="Login">
              <TabsList className="bg-transparent rounded-none w-full text-yellow-300 ">
                <TabsTrigger value="Login" className="data-[state=active]:bg-transparent text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-yellow-400 data-[state=active]:font-semibold data-[state=active]:border-b-yellow-500 p-3 transition-all duration-300 cursor-pointer" >Login </TabsTrigger>

                <TabsTrigger value="Signup" className="data-[state=active]:bg-transparent text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-yellow-400 data-[state=active]:font-semibold data-[state=active]:border-b-yellow-500 p-3 transition-all duration-300 cursor-pointer" >Sign up</TabsTrigger>
              </TabsList>
              <TabsContent className="flex flex-col gap-5 mt-5" value="Login">
                <Input placeholder="Email" className="rounded-full p-6" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input placeholder="Password" className="rounded-full p-6" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button variant="outline" className="bg-yellow-300 rounded-full text-black cursor-pointer p-6" onClick={handleLogin}>Login</Button>


              </TabsContent>
              <TabsContent value="Signup" className="flex flex-col gap-5 mt-5" >
                <Input placeholder="Email" className="rounded-full p-6" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input placeholder="Password" className="rounded-full p-6" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Input placeholder="Confirm Password" className="rounded-full p-6" value={confirmPassword} onChange={(e) => setconfirmPassword(e.target.value)} />
                <Button variant="outline" className="bg-yellow-300 rounded-full text-black cursor-pointer p-6" onClick={handleSignup}>Sign up</Button>

              </TabsContent>
            </Tabs>
          </div>

        </div>
        <div className='hidden xl:flex justify-center items-center'>
          {/* <img src={Logo} alt="Background" /> */}
        </div>
      </div>
    </div>

  )
}

export default Auth