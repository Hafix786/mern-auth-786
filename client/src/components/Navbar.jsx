import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

export const Navbar = () => {
  const navigate = useNavigate();
  const { userData, setUserData, backendUrl, setIsLoggedin } =
    useContext(AppContext);

    const sendVerificationOtp = async () => {
        try {
            axios.defaults.withCredentials = true
            const {data} = await axios.post(backendUrl + '/api/auth/send-verify-otp')
            if (data.success) {
                navigate('/email-verify')
                toast.success(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const logout = async () => {
        try {
            axios.defaults.withCredentials = true
            const {data} = await axios.post(backendUrl + '/api/auth/logout')
            data.success && setIsLoggedin(false)
            data.success && setUserData(false)
            navigate('/')
        } catch (error) {
            toast.error(error.message)
        }
    }

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
      <img src={assets.logo} alt="" className="W-28 sm:W-32" />
      {userData ? (
        <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group cursor-pointer">
          {userData.name[0].toUpperCase()}
          <div className="hidden w-max absolute top-0 right-0 group-hover:block z-10 text-black rounded pt-10">
            <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
              {!userData.isAccountVerified && (
                <li onClick={sendVerificationOtp} className="py-1 px-2 hover:bg-gray-200 cursor-pointer">
                  Verify Email
                </li>
              )}

              <li onClick={logout} className="py-1 px-2 hover:bg-gray-200 cursor-pointer">
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Login
          <img src={assets.arrow_icon} />
        </button>
      )}
    </div>
  );
};
