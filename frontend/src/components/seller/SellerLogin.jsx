import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";


const SellerLogin = () => {
  const { isSeller, setIsSeller, navigate, axios } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();
      if(!email || !password) {
        toast.error("Please fill in all fields.");
        
        return;
      }else{
        
        
      }
      const {data} = await axios.post('/api/seller/login', {email, password})
      if(data.success){
        setIsSeller(true)
        navigate('/seller')
      }else{
        toast.error(data.message)
        console.log("error");
        
      }
    } catch (error) {
        toast.error(error.message)
     
      
   
    }
  };

  useEffect(() => {
    navigate("/seller");
  }, [isSeller]);

  return !isSeller &&
   <form onSubmit={onSubmitHandler} className="min-h-screen flex items-center text-sm text-gray-600">
    <div className="flex flex-col gap-5 m-auto items-start p-8 py-12 min-w-80 sm:min-w-88
    rounded-lg shadow-xl border border-gray-200">
        <p className="text-2xl font-medium m-auto"><span className="text-primery ">Seller</span> Login</p>
        <div className="w-full">
            <p>Email</p>
            <input onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="enter your email"
            className="border border-gray-200 rounded w-full outline-primery p-2 mt-1"/>
        </div>
        <div className="w-full">
            <p>password</p>
            <input onChange={(e)=>setPassword(e.target.value)} type="password" required placeholder="enter your password"
            className="border border-gray-200 rounded w-full outline-primery p-2 mt-1"/>
        </div>
        <button className="bg-primery text-white w-full py-2 rounded-md cursor-pointer">Login</button>
    </div>
  </form>;
};

export default SellerLogin;
