import { useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContext);

  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true;
      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/auth/register", {
          name,
          email,
          password,
        });
        if (data.success ) {
          setIsLoggedin(true);
          getUserData();
          navigate("/");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/auth/login", {
          email,
          password,
        });
        if (data.success ) {
          setIsLoggedin(true);
          getUserData();
          navigate("/");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-linear-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </h2>
        <p className="text-center text-sm mb-6">
          {state === "Sign Up"
            ? "Create your account"
            : "Login to your account!"}
        </p>
        <form onSubmit={submitHandler}>
          {state === "Sign Up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <label htmlFor="name">
                <img src={assets.person_icon} alt="" />
              </label>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="autofill:shadow-[inset_0_0_0_1000px_#333A5C] w-full bg-transparent outline-none text-gray-100"
                type="text"
                placeholder="Full Name" 
                name="name"
                id="name"
                required
              />
            </div>
          )}

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
          <div className=" mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <label htmlFor="password">
              <img src={assets.lock_icon} alt="" />
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="w-full bg-transparent outline-none text-gray-100"
              type="password"
              placeholder="Password"
              name="password"
              id="password"
              required
            />
          </div>
          <span
            onClick={() => navigate("/reset-password")}
            className="mb-4 text-indigo-500 cursor-pointer inline-block"
          >
            Forgot password?
          </span>
          <button className="w-full py-2.5 rounded-full bg-linear-to-r from-indigo-500 to-indigo-900 text-white font-medium cursor-pointer">
            {state}
          </button>
        </form>
        {state === "Sign Up" ? (
          <p className="text-center text-gray-400 text-xs mt-4">
            Already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-blue-400 cursor-pointer underline "
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="text-center text-gray-400 text-xs mt-4">
            Don't have an account?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="text-blue-400 cursor-pointer underline "
            >
              Sign Up
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
