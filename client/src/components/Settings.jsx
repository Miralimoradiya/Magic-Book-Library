// Settings.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import FormatDate from "./resusable/FormatDate";
import FormatTime from "./resusable/FormatTime";
import TopPart from "./resusable/TopPart";
import config from "../../utils/config/index";
import { axiosInstance } from "../../utils/constants/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  Slide,
} from "@mui/material";
import { styled } from "@mui/system";
const StyledDialog = styled(Dialog)({
  "& .MuiDialog-paper": { borderRadius: "20px" },
});

const Accordion = ({ title, isOpen, toggle, children }) => (
  <div className="border-2 rounded-lg shadow-md px-5 py-4 mb-7 bg-white slide-in">
    <div
      onClick={toggle}
      className="flex flex-row justify-between cursor-pointer"
    >
      <div className="text-lg font-serif transition-all duration-300 ease-in-out transform hover:scale-105 text-black">
        {title}
      </div>
      <div className="text-2xl ">
        {isOpen ? <MdExpandLess /> : <MdExpandMore />}
      </div>
    </div>
    <div
      className={`transition-all duration-500 ease-in-out overflow-x-scroll custom-scrollbar ${
        isOpen ? "max-h-screen" : "max-h-0"
      }`}
    >
      {children}
    </div>
  </div>
);

export default function Settings() {
  const [sessions, setSessions] = useState(null);
  const [pastSessions, setPastSessions] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(true);
  const [isSessionsOpen, setIsSessionsOpen] = useState(false);
  const [pastLoggedinOpen, setPastLoggedinOpen] = useState(false);
  const profileImage = localStorage.getItem("profileImage");

  const [openDialog, setOpenDialog] = useState(false);
  const [sessionToLogout, setSessionToLogout] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);

  // Fetch user profile data
  const fetchUserProfile = async () => {
    const token = localStorage.getItem("jwt_token");
    try {
      setLoading(true);
      const response = await axiosInstance.get(`${config.API_URL}/common/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200 && response.data.userData) {
        setUserData(response.data.userData[0]);
      } else {
        setError("Failed to fetch user data");
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch active sessions
  const fetchSessions = async () => {
    const token = localStorage.getItem("jwt_token");
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `${config.API_URL}/auth/sessions`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        setSessions(response.data.sessions);
      } else {
        setSessions([]);
      }
    } catch (err) {
      setSessions([]);
      console.error("Error fetching sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch past sessions
  const fetchPastSessions = async () => {
    const token = localStorage.getItem("jwt_token");
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `${config.API_URL}/auth/pastsessions`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        if (response.data.sessions && response.data.sessions.length > 0) {
          setPastSessions(response.data.sessions);
        } else {
          setPastSessions([]);
        }
      } else {
        setError("Failed to fetch past sessions");
      }
    } catch (err) {
      console.error("Error fetching past sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  // LogOut from session
  const handleLogoutClick = (sessionId) => {
    setSessionToLogout(sessionId);
    setIsChangePassword(false);
    setOpenDialog(true);
  };
  const handleChangePasswordClick = () => {
    setIsChangePassword(true);
  };
  const logoutFromSession = async (sessionId) => {
    const token = localStorage.getItem("jwt_token");
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        `${config.API_URL}/auth/logout-by-session-id/${sessionId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        alert("Logged out successfully from this session!");
        fetchSessions();
      } else {
        alert("Failed to log out from the session.");
      }
    } catch (err) {
      console.error("Error logging out from session:", err);
      alert("Error logging out from the session.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      setPasswordError("Both fields are required.");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("jwt_token");
    try {
      const response = await axiosInstance.post(
        `${config.API_URL}/auth/change-password`,
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setOldPassword("");
        setNewPassword("");
        setPasswordError("");
        setOpenDialog(false);
      } else {
        setPasswordError("Error changing password.");
      }
    } catch (error) {
      const errormessage = error.response.data.message;
      console.error("Error changing password:", error);
      setPasswordError(errormessage);
    } finally {
      setLoading(false);
    }
  };

  const logoutFromAllSessions = async () => {
    const token = localStorage.getItem("jwt_token");
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        `${config.API_URL}/auth/logoutallsessions`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        alert("Logged out from all devices successfully!");
      } else {
        alert("Failed to log out from all devices.");
      }
    } catch (err) {
      console.error("Error logging out from all devices:", err);
      alert("Error logging out from all devices.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
    fetchPastSessions();
    fetchUserProfile();
  }, []);

  if (loading) return <div className="text-center text-xl">Loading...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;

  return (
    <>
      <TopPart title="settings" linkPath="/books" showButton={false} />
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          Loading...
        </div>
      )}
      {/* Profile Accordion */}
      <Accordion
        title="Profile"
        isOpen={isProfileOpen}
        toggle={() => setIsProfileOpen(!isProfileOpen)}
      >
        <div className="my-6 slide-in">
          {userData ? (
            <div className="p-6 rounded-lg shadow-lg border border-gray-200 space-y-6">
              <div className="flex flex-col sm:flex-row sm:space-x-6 w-full">
                {/* Profile Image and User Info */}
                <div className="flex flex-col sm:flex-row gap-6 items-center w-full sm:w-[40%] mb-4 sm:mb-0">
                  <div className="w-28 h-28 bg-[#f4f8fb] rounded-md overflow-hidden shadow-lg">
                    <img
                      // src={userData.profile_image}
                      src={
                        userData.profile_image && profileImage !== "null"
                          ? profileImage
                          : "https://www.aiscribbles.com/img/variant/large-preview/18614/?v=1972e3"
                      }
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="pl-0 sm:pl-0">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 ">
                      {`${userData.first_name} ${userData.last_name}`}
                    </h2>
                    <p className="text-xs sm:text-lg text-gray-600">
                      {userData.email}
                    </p>
                    <p className="text-md text-gray-600">
                      Phone: {userData.phoneno}
                    </p>
                  </div>
                </div>

                {/* Dues Information */}
                <div className="flex flex-col sm:pt-3 sm:w-[50%] pr-0 sm:pr-14 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between gap-6">
                    <div className="flex justify-between items-center flex-col text-blue-600">
                      <p>Total Dues</p>
                      <p className="font-semibold">
                        ₹ {userData.total_dues.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex justify-between items-center flex-col text-green-600">
                      <p>Paid Dues</p>
                      <p className="font-semibold">
                        ₹ {userData.paid_dues.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex justify-between items-center flex-col text-red-600">
                      <p>Left Dues</p>
                      <p className="font-semibold">
                        ₹ {userData.left_dues.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-center">
                    <Link
                      to="/profile"
                      className="bg-[#1d6ca1] text-white px-6 py-2 rounded-md hover:bg-[#155b7e] transition-colors"
                    >
                      Go to Profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-lg text-gray-600">
              &#128522; Loading profile...
            </p>
          )}
        </div>
      </Accordion>
      {/* Sessions Accordion */}
      <Accordion
        title="Where You Are Logged in?"
        isOpen={isSessionsOpen}
        toggle={() => setIsSessionsOpen(!isSessionsOpen)}
      >
        {sessions && sessions.length > 0 ? (
          <>
            <div className="flex justify-end ">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
                onClick={logoutFromAllSessions}
              >
                Logout from all Devices?
              </button>
            </div>

            <div className="space-y-6 mt-4 ">
              {sessions.map((session, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-300 rounded-lg shadow-md py-6 px-3 sm:px-6 pr-0 sm:pr-20 flex flex-col sm:flex-row items-start sm:items-center gap-5 transition-all duration-300 ease-in-out transform hover:shadow-xl"
                >
                  <div className="w-20 h-20 bg-[#f4f8fb] rounded-full overflow-hidden shadow-lg">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                      alt="PC"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="break-words overflow-x-auto w-full">
                    <p className="text-gray-800 font-bold mb-2 break-words overflow-x-auto w-full">
                      {session.user_agent}
                    </p>
                    <p className="text-md font-semibold text-[#1d6ca1]">
                      {session.ip_address.replace(/^::ffff:/, "")}
                    </p>
                    <p className="text-gray-800 text-sm">
                      {session.login_timestamp && (
                        <FormatDate dateString={session.login_timestamp} />
                      )}
                    </p>
                    <p className="text-gray-800 text-sm">
                      {session.login_timestamp && (
                        <FormatTime dateString={session.login_timestamp} />
                      )}
                    </p>

                    {!session.your_pc && (
                      <button
                        onClick={() => handleLogoutClick(session.id)}
                        className="text-white bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mt-3"
                      >
                        Log out from this session?
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-center text-lg text-gray-600 p-10">
            &#128522; No active sessions available...
          </p>
        )}
      </Accordion>
      {/* Past Logged-in Accordion */}
      <Accordion
        title="Past Logged in User"
        isOpen={pastLoggedinOpen}
        toggle={() => setPastLoggedinOpen(!pastLoggedinOpen)}
      >
        {pastSessions && pastSessions.length > 0 ? (
          <div className="space-y-6 mt-4">
            {pastSessions.map((session, index) => (
              <div
                key={index}
                className="bg-white border border-gray-300 rounded-lg shadow-md py-6 px-3 sm:px-6 pr-0 sm:pr-20 flex flex-col sm:flex-row items-start sm:items-center gap-5 transition-all duration-300 ease-in-out transform hover:shadow-xl "
              >
                <div className="w-20 h-20 bg-[#f4f8fb] rounded-full overflow-hidden shadow-lg">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                    alt="PC"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="break-words overflow-x-auto w-full">
                  <p className="text-gray-800 font-bold mb-2 break-words overflow-x-auto w-full">
                    {session.user_agent}
                  </p>
                  <p className="text-md font-semibold text-[#1d6ca1]">
                    {session.ip_address.replace(/^::ffff:/, "")}
                  </p>
                  <p className="text-gray-800 text-sm">
                    {session.login_timestamp && (
                      <FormatDate dateString={session.login_timestamp} />
                    )}
                  </p>
                  <p className="text-gray-800 text-sm">
                    {session.login_timestamp && (
                      <FormatTime dateString={session.login_timestamp} />
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-lg text-gray-600 p-10">
            &#128522; No past sessions available...
          </p>
        )}
      </Accordion>
      <StyledDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        TransitionComponent={Slide}
        direction="up"
      >
        <DialogTitle className="text-xl font-semibold text-center bg-[#142534] text-white">
          {isChangePassword ? "Change Password" : "Log out from this session?"}
        </DialogTitle>
        <DialogContent>
          {isChangePassword ? (
            <>
              <div className="relative">
                <TextField
                  label="Old Password"
                  type={showOldPassword ? "text" : "password"}
                  fullWidth
                  variant="outlined"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  margin="normal"
                  InputProps={{ sx: { borderRadius: 20, borderColor: "gray" } }}
                />
                <div
                  className="absolute top-8 right-4 text-2xl text-slate-600 cursor-pointer"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                >
                  {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
              <div className="relative">
                <TextField
                  label="New Password"
                  type={showNewPassword ? "text" : "password"}
                  fullWidth
                  variant="outlined"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  margin="normal"
                  InputProps={{ sx: { borderRadius: 20, borderColor: "gray" } }}
                />
                <div
                  className="absolute top-8 right-4 text-2xl text-slate-600 cursor-pointer"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
              {passwordError && (
                <div className="text-red-500 text-sm mt-2">{passwordError}</div>
              )}
            </>
          ) : (
            <p className="mt-6 text-md sm:text-xl p-3">
              Are you sure you want to log out from this session? You can also
              change your password if you wish.
            </p>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 3,
            width: "100%",
            paddingBottom: 3,
          }}
        >
          <Button
            sx={{
              borderRadius: 20,
              minWidth: 120,
              backgroundColor: "#142534",
              color: "white",
            }}
            onClick={() => setOpenDialog(false)}
          >
            Close
          </Button>
          {!isChangePassword ? (
            <>
              <Button
                sx={{
                  borderRadius: 20,
                  minWidth: 120,
                  backgroundColor: "#142534",
                  color: "white",
                }}
                onClick={handleChangePasswordClick}
              >
                Change Password
              </Button>
              <Button
                sx={{
                  borderRadius: 20,
                  minWidth: 120,
                  backgroundColor: "#142534",
                  color: "white",
                }}
                onClick={() => {
                  logoutFromSession(sessionToLogout);
                  setOpenDialog(false);
                }}
              >
                Log out
              </Button>
            </>
          ) : (
            <Button
              sx={{
                borderRadius: 20,
                minWidth: 120,
                backgroundColor: "#142534",
                color: "white",
              }}
              onClick={handleChangePassword}
            >
              Confirm
            </Button>
          )}
        </DialogActions>
      </StyledDialog>
    </>
  );
}
