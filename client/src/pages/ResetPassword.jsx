import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { useContext, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true

function ResetPassword() {
  const navigate = useNavigate(AppContext);
  const {backendUrl} = useContext(AppContext)

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState(0);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const inputRefs = useRef([]);

  const handleInput = (e, index) => {
    e.preventDefault();
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    if (e.key === "ArrowRight" && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  const handlePaste = (e) => {
    e.preventDefault();

    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((element, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = element;
      }
    });
    const lastIndex = Math.min(pasteArray.length, inputRefs.current.length - 1);
    if (inputRefs.current[lastIndex]) {
      inputRefs.current[lastIndex].focus();
    }
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault()
    try {
      const {data} = await axios.post(backendUrl + '/api/auth/send-reset-otp', {email})
      data.success ? toast.success(data.message) : toast.error(data.message)
      data.success && setIsEmailSent(true)
    } catch (error) {
      toast.error(error.message)
    }
  }
  const onSubmitOtp = async (e) => {
    e.preventDefault()
    const otpArray = inputRefs.current.map(e => e.value)
    setOtp(otpArray.join(''))
    setIsOtpSubmitted(true)
  }

  const onSubmitNewPassword = async (e) => {
    e.preventDefault()
    try {
      const {data} = await axios.post(backendUrl + '/api/auth/reset-password', {email, otp, newPassword})
      data.success ? toast.success(data.message) : toast.error(data.message)
      data.success && navigate('/login')
    } catch (error) {
      toast.error(error.message)
    }
  }
  return (
    <div>
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-200 to-purple-400">
        <img
          src={assets.logo}
          alt="logo"
          onClick={() => navigate("/")}
          className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
        />
        {!isEmailSent && (
          <form onSubmit={onSubmitEmail} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
            <h1 className="text-white text-2xl font-semibold text-center mb-4">
              Reset Password
            </h1>
            <p className="text-center mb-6 text-indigo-300">
              Enter your register email address.
            </p>
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <label htmlFor="email">
                <img src={assets.mail_icon} alt="" />
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="w-full bg-transparent outline-none text-gray-100"
                type="email"
                placeholder="Email id"
                name="email"
                id="email"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-full bg-linear-to-r from-indigo-500 to-indigo-900 text-white font-medium cursor-pointer"
            >
              Submit
            </button>
          </form>
        )}
        {isEmailSent && !isOtpSubmitted && (
          <form
            className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
            onSubmit={onSubmitOtp}
          >
            <h1 className="text-white text-2xl font-semibold text-center mb-4">
              Password Reset OTP
            </h1>
            <p className="text-center mb-6 text-indigo-300">
              Enter the 6 digit code sent to your email id.
            </p>
            <div className="flex justify-evenly mb-8 " onPaste={handlePaste}>
              {Array(6)
                .fill()
                .map((_, index) => (
                  <input
                    type="text"
                    maxLength="1"
                    key={index}
                    ref={(e) => (inputRefs.current[index] = e)}
                    onChange={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    required
                    className="w-10 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
                  />
                ))}
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-linear-to-r from-indigo-500 to-indigo-900 text-white rounded-full inline-block text-center cursor-pointer"
            >
              Submit
            </button>
          </form>
        )}
        {isEmailSent && isOtpSubmitted && (
          <form onSubmit={onSubmitNewPassword} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
            <h1 className="text-white text-2xl font-semibold text-center mb-4">
              New Password
            </h1>
            <p className="text-center mb-6 text-indigo-300">
              Enter your new password.
            </p>
            <div className=" mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <label htmlFor="newPassword">
                <img src={assets.lock_icon} alt="" />
              </label>
              <input
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
                className="w-full bg-transparent outline-none text-gray-100"
                type="newPassword"
                placeholder="New Password"
                name="newPassword"
                id="newPassword"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-full bg-linear-to-r from-indigo-500 to-indigo-900 text-white font-medium cursor-pointer"
            >
              Submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
