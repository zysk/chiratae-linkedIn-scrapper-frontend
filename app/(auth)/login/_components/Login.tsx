import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import LoginButton from "./LoginButton";
import { BsMicrosoft } from "react-icons/bs";

const AuthLogin = () => {
  const [password, setpassword] = useState("");
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [email, setEmail] = useState("");
  // const dispatch = useDispatch();
  const handleSubmit = (e:any) => {
    e.preventDefault();
    let obj = {
      email,
      password: Buffer.from(password).toString("base64"),
    };
    console.log(obj);
    // dispatch(loginUser(obj));
  };
  return (
    <div className="max-w-[360px] mx-auto">
      <h2 className="font-semibold text-3xl leading-[44px] text-center">Login</h2>
      <section className="flex flex-col items-center justify-center gap-y-4 mt-8 mb-6">
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 ">
          <div className="mb-3">
            <label className="block text-[#919EAB] text-sm mb-2">Enter Email Or Phone No</label>
            <div className="form-input">
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="name" value={email} onChange={(event) => setEmail(event.target.value)} type="text" />
          </div>
          </div>
          <div className="mb-3">
            <label className="block text-[#919EAB] text-sm mb-2">Password</label>
            <div className="form-input password-input">
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="email" value={password} type={isPasswordHidden ? "password":"text"} onChange={(event) => setpassword(event.target.value)} />
              <i className={isPasswordHidden ? "ion-eye" :"ion-eye-disabled"} onClick={()=>setIsPasswordHidden(!isPasswordHidden)}></i>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <button className="bg-[#D68594] hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={handleSubmit}>Submit</button>
          </div>
      </form>
      </section>
    </div>
  );
};

export default AuthLogin;
