// Login.jsx
import React, { useState, useEffect } from "react";
import img1 from "../../assets/nodeproject/logo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../../utils/config/index";
import SnackbarComponent from "../../components/resusable/SnackbarComponent";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import { DNA } from "react-loader-spinner";
import SignupDialog from "./SignupDialog";
import { FaEye, FaEyeSlash } from "react-icons/fa";

// Encryption and Decryption of cookies
const encryptData = (data) => {
  const secretKey = "123";
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};
const decryptData = (encryptedData) => {
  const secretKey = "123";
  const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedData ? JSON.parse(decryptedData) : null;
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [savedEmails, setSavedEmails] = useState([]);
  const [isEmailSuggestionsVisible, setIsEmailSuggestionsVisible] =
    useState(false);
  const [isSignupDialogOpen, setIsSignupDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  const [showNewPassword, setShowNewPassword] = useState(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Toggle password visibility
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleNewPasswordVisibility = () =>
    setShowNewPassword(!showNewPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleOpenSignupDialog = () => {
    setIsSignupDialogOpen(true);
  };

  const handleCloseSignupDialog = () => {
    setIsSignupDialogOpen(false);
  };

  useEffect(() => {
    const savedEmailsCookie = Cookies.get("savedEmails");
    console.log("Saved Emails Cookie:", savedEmailsCookie);
    if (savedEmailsCookie) {
      const decryptedEmails = decryptData(savedEmailsCookie);
      console.log("Decrypted Emails:", decryptedEmails);
      if (decryptedEmails) {
        setSavedEmails(decryptedEmails);
      }
    }
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email) {
      setSnackbarMessage("Email is required");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }
    if (!password) {
      setSnackbarMessage("Passwords is required");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post(`${config.API_URL}/auth/login`, {
        email,
        password,
      });
      const { accessToken, refreshToken, role, perms, id, profile_image } =
        response.data;

      const profileImageUrl =
        profile_image ||
        "https://www.aiscribbles.com/img/variant/large-preview/18614/?v=1972e3";
      localStorage.setItem("jwt_token", accessToken);
      localStorage.setItem("jwt_refreshToken", refreshToken);
      localStorage.setItem("role", role);
      localStorage.setItem("permissions", perms);
      localStorage.setItem("UserId", id);
      localStorage.setItem("profileImage", profileImageUrl);
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("firstName", response.data.first_name);
      localStorage.setItem("lastName", response.data.last_name);
      sessionStorage.setItem("jwt_token", accessToken);

      setTimeout(() => {
        if (role === "student") {
          navigate("/welcome");
        } else if (role === "librarian") {
          navigate("/home");
        }
      }, 500);

      if (rememberMe) {
        const newSavedEmails = [...savedEmails, { email, password }];
        setSavedEmails(newSavedEmails);
        const encryptedEmails = encryptData(newSavedEmails);
        Cookies.set("savedEmails", encryptedEmails, { expires: 2 });
      }
    } catch (err) {
      const errorMessage =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "Invalid data please enter valid email and password";

      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await axios.get(
        "https://duck-pro-hen.ngrok-free.app/auth/google",
        {
          headers: {
            "ngrok-skip-browser-warning": "*",
          },
          withCredentials: true,
        }
      );
      const { accessToken, refreshToken, role, perms, id } = response.data;
      localStorage.setItem("jwt_token", accessToken);
      localStorage.setItem("jwt_refreshToken", refreshToken);
      localStorage.setItem("role", role);
      localStorage.setItem("permissions", perms);
      localStorage.setItem("UserId", id);
      localStorage.setItem("email", response.data.email);

      setTimeout(() => {
        if (role === "student") {
          navigate("/userbook");
        } else if (role === "librarian") {
          navigate("/home");
        }
      }, 500);
    } catch (err) {
      setSnackbarMessage("Google login failed. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email) {
      setSnackbarMessage("Email is required");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post(
        `${config.API_URL}/auth/forgot-password`,
        {
          email,
        }
      );
      setIsOtpSent(true);
      setSnackbarMessage("OTP sent to your email.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      const errorMessage =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "Invalid data please enter valid email and password";

      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "") {
      if (index > 0) {
        document.getElementById(`otp-input-${index - 1}`).focus();
      }
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp.join("").length !== 6) {
      setSnackbarMessage("OTP must be exactly 6 characters long.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    if (!/^\d{6}$/.test(otp.join(""))) {
      setSnackbarMessage("You can add only numbers in OTP.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    setIsOtpVerified(true);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setSnackbarMessage("Passwords do not match");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${config.API_URL}/auth/reset-password`,
        {
          email,
          otp: otp.join(""),
          newPassword,
        }
      );
      setSnackbarMessage("Password reset successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setIsForgotPassword(false);
      navigate("/");
    } catch (err) {
      const errorMessage =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "Invalid data please enter valid email and password";

      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    if (emailValue === "") {
      setIsEmailSuggestionsVisible(false);
    } else if (
      savedEmails.some((savedEmail) => savedEmail.email.includes(emailValue))
    ) {
      setIsEmailSuggestionsVisible(true);
    } else {
      setIsEmailSuggestionsVisible(false);
    }
  };

  const handleEmailClick = (savedEmail) => {
    setEmail(savedEmail.email);
    setPassword(savedEmail.password);
    setIsEmailSuggestionsVisible(false);
  };

  const filteredEmails = savedEmails.filter((savedEmail) =>
    savedEmail.email.includes(email)
  );

  return (
    <div className="flex flex-col md:flex-row w-full h-fit font-sans bg-gray-100">
      {loading && (
        <div className="loader-overlay">
          <DNA
            className="loader"
            visible={true}
            height="100"
            width="100"
            ariaLabel="dna-loading"
            wrapperStyle={{}}
            wrapperClass="dna-wrapper"
          />
        </div>
      )}
      <div className="md:w-1/2 w-full relative ">
        <div className="">
          <div className="">
            <img
              src={img1}
              alt="Logo"
              className="logoimg w-[100%] h-auto max-h-screen mx-auto p-5 rounded-[30px] md:rounded-[50px] fade-in"
            />
          </div>
        </div>
      </div>

      <div className="login-sec-right md:w-1/2 w-full flex flex-col justify-center items-center p-5 relative fade-in">
        {!isForgotPassword ? (
          <>
            {isEmailSuggestionsVisible && filteredEmails.length > 0 && (
              <div className="absolute top-1 right-3 ">
                <div className="absolute top-1 right-3 w-0 h-0 border-r-[20px] border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-white -rotate-[29deg] "></div>
                <div className=" bg-white rounded-lg w-full mt-3">
                  <ul className="max-h-60 overflow-y-auto">
                    {filteredEmails.map((savedEmail, index) => (
                      <li
                        key={index}
                        onClick={() => handleEmailClick(savedEmail)}
                        className="px-4 py-2 cursor-pointer rounded-lg transition-all duration-300 ease-in-out transform hover:scale-95"
                      >
                        {savedEmail.email}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <h1
              className="font-semibold text-[28px] md:text-[35px] leading-[35px] md:leading-[47px] text-[#142534] mb-10 text-center"
              onClick={handleEmailClick}
            >
              Login to Your Account
            </h1>
            <form onSubmit={handleLogin} className="w-full max-w-[400px]">
              <div className="logininputs flex flex-col items-center ">
                <div className="emaildata w-full relative">
                  <input
                    type="text"
                    className="emaildata-email w-full h-[50px] bg-gray-100 border border-gray-400 rounded-[30px] px-4 mb-5 text-[16px] transition-all ease-in-out duration-300 transform hover:shadow-lg focus:shadow-gray-300 text-black"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Email"
                  />
                </div>
                <div className="passworddata w-full relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="passworddata-password w-full h-[50px] bg-gray-100 border border-gray-400 rounded-[30px] px-4 mb-5 text-[16px] transition-all ease-in-out duration-300 transform hover:shadow-lg focus:shadow-gray-300 text-black"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-4 top-6 text-md sm:text-2xl transform -translate-y-1/2"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <div class="flex flex-col justify-end w-full items-end gap-3 mb-4">
                <p
                  className="  font-medium text-[14px] md:text-[18px] text-blue-500 cursor-pointer"
                  onClick={() => setIsForgotPassword(true)}
                >
                  Forget password
                </p>
                <p
                  className=" font-medium text-[14px] md:text-[18px] text-blue-500 cursor-pointer  transition-all ease-in-out duration-300 transform hover:scale-105"
                  onClick={handleGoogleLogin}
                >
                  Login With Google
                </p>
              </div>

              <div class="font-medium text-[14px] md:text-[18px] leading-[20px] md:leading-[27px] text-blue-500 mb-7 cursor-pointer flex flex-row align-middle space-x-2 text-center">
                <input
                  type="checkbox"
                  id="remember-me"
                  class="h-5 w-5 text-green-500  transition-all ease-in-out duration-300 transform hover:scale-125"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <label
                  for="remember-me"
                  class="cursor-pointer hover:text-blue-500 "
                >
                  Remember me?
                </label>
              </div>

              <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  className="loginbutton w-full py-3 bg-[#142534] rounded-[30px] text-white text-[16px] border-none  hover:bg-[#101c2a] "
                  type="button"
                  onClick={handleOpenSignupDialog}
                >
                  Sign Up
                </button>

                <button
                  className="loginbutton w-full py-3 bg-[#142534] rounded-[30px] text-white text-[16px] border-none  hover:bg-[#101c2a]"
                  type="submit"
                >
                  Login
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            {!isOtpSent ? (
              <>
                <h1 className="font-semibold text-[28px] md:text-[35px] leading-[35px] md:leading-[47px] text-[#142534] mb-10 text-center">
                  Reset Your Password
                </h1>
                <form
                  onSubmit={handleForgotPassword}
                  className="w-full max-w-[400px]"
                >
                  <div className="logininputs flex flex-col items-center">
                    <div className="emaildata w-full">
                      <input
                        type="text"
                        className="emaildata-email w-full h-[50px] bg-gray-100 border border-gray-400 rounded-[30px] px-4 mb-5 text-[16px] transition-all ease-in-out duration-300 transform hover:shadow-lg focus:shadow-gray-300 text-black"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  {error && <p className="text-red-500">{error}</p>}
                  <div className="mb-5 flex justify-center">
                    <button className="border bg-blue-500 text-white py-3 px-6 w-[200px] rounded-3xl transition-all duration-300 ease-in-out transform hover:scale-95 ">
                      Send Reset Link
                    </button>
                  </div>
                </form>
                <p
                  className="forgetpassword text-end font-medium text-[14px] md:text-[18px] leading-[20px] md:leading-[27px] text-blue-500 mb-7 cursor-pointer"
                  onClick={() => setIsForgotPassword(false)}
                >
                  Back to Login
                </p>
              </>
            ) : (
              <>
                {!isOtpVerified ? (
                  <>
                    <h1 className="font-semibold text-[28px] md:text-[35px] leading-[35px] md:leading-[47px] text-[#142534] mb-10 text-center ">
                      Enter OTP
                    </h1>
                    <form
                      onSubmit={handleVerifyOtp}
                      className="w-full max-w-[400px] mt-8 text-center"
                    >
                      <div className="logininputs flex flex-col items-center">
                        <div className="otp-inputs mb-5 flex justify-center space-x-3">
                          {otp.map((digit, index) => (
                            <input
                              key={index}
                              type="text"
                              id={`otp-input-${index}`}
                              value={digit}
                              onChange={(e) => handleOtpChange(e, index)}
                              onKeyDown={(e) => handleKeyDown(e, index)}
                              maxLength="1"
                              className="otp-input w-[50px] h-[50px] text-center text-xl border border-gray-300 rounded-md bg-white text-black"
                            />
                          ))}
                        </div>
                      </div>
                      <p
                        className="forgetpassword text-end font-medium text-[14px] md:text-[18px] leading-[20px] md:leading-[27px] text-blue-500 mb-7 cursor-pointer"
                        onClick={() => setIsForgotPassword(false)}
                      >
                        Back to Login
                      </p>
                      <div className="mb-5 flex justify-center">
                        <button
                          className="border bg-blue-500 text-white py-3 px-6 w-[200px] rounded-3xl transition-all duration-300 ease-in-out transform hover:scale-95 "
                          type="submit"
                        >
                          Next
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <>
                    <h1 className="font-semibold text-[28px] md:text-[35px] leading-[35px] md:leading-[47px] text-[#142534] mb-10 text-center">
                      Set New Password
                    </h1>
                    <form
                      onSubmit={handleResetPassword}
                      className="w-full max-w-[400px]"
                    >
                      <div className="logininputs flex flex-col items-center">
                        <div className="passworddata w-full relative">
                          <input
                            // type="password"
                            type={showNewPassword ? "text" : "password"}
                            className="passworddata-password w-full h-[50px] bg-gray-100 border border-gray-400 rounded-[30px] px-4 mb-5 text-[16px] transition-all ease-in-out duration-300 transform hover:shadow-lg focus:shadow-gray-300 text-black"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="New Password"
                          />
                          <button
                            type="button"
                            onClick={toggleNewPasswordVisibility}
                            className="absolute right-4 top-6 text-md sm:text-2xl transform -translate-y-1/2"
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                        <div className="passworddata w-full relative">
                          <input
                            // type="password"
                            type={showConfirmPassword ? "text" : "password"}
                            className="passworddata-password w-full h-[50px] bg-gray-100 border border-gray-400 rounded-[30px] px-4 mb-5 text-[16px] transition-all ease-in-out duration-300 transform hover:shadow-lg focus:shadow-gray-300 text-black"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm New Password"
                          />
                          <button
                            type="button"
                            onClick={toggleConfirmPasswordVisibility}
                            className="absolute right-4 top-6 text-md sm:text-2xl transform -translate-y-1/2"
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>
                      <p
                        className="forgetpassword text-end font-medium text-[14px] md:text-[18px] leading-[20px] md:leading-[27px] text-blue-500 mb-7 cursor-pointer"
                        onClick={() => setIsForgotPassword(false)}
                      >
                        Back to Login
                      </p>
                      <div className="mb-5 flex justify-center">
                        <button className="border bg-blue-500 text-white py-3 px-6 w-[200px] rounded-3xl transition-all duration-300 ease-in-out transform hover:scale-95 ">
                          Reset Password
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
      <SignupDialog
        open={isSignupDialogOpen}
        onClose={handleCloseSignupDialog}
      />
      <SnackbarComponent
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </div>
  );
};

export default Login;
