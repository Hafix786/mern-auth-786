import { useContext, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true;

const EmailVerify = () => {
  const navigate = useNavigate();
  const { backendUrl, isLoggedin, userData, getUserData } =
    useContext(AppContext);
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
  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map(e => e.value);
      const otp = otpArray.join('');
      const { data } = await axios.post(backendUrl + '/api/auth/verify-account', {
        otp,
      });

      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    isLoggedin && userData && userData.isAccountVerified && navigate('/')
  }, [isLoggedin, userData, navigate])
  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-200 to-purple-400">
      <img
        src={assets.logo}
        alt="logo"
        onClick={() => navigate("/")}
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />
      <form
        className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        onSubmit={onSubmitHandler}
      >
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Email Verify OTP
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
          Verify Email
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;
