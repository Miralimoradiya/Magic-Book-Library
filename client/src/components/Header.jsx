// Header.jsx
import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/nodeproject/cutoutlogo.png";
import iconsearch from "../assets/Header/loupe.svg";
import arrow from "../assets/Header/left-arrow.svg";
import { Link } from "react-router-dom";
import { debounce } from "lodash";
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
import { useRef } from "react";
const StyledDialog = styled(Dialog)({
  "& .MuiDialog-paper": { borderRadius: "20px" },
});

const Header = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLanguageDialogOpen, setLanguageDialogOpen] = useState(false);
  const [openChangePasswordDialog, setOpenChangePasswordDialog] =
    useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const profileImage = localStorage.getItem("profileImage");
  const googleTranslateRef = useRef(null);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        sessionStorage.removeItem("jwt_token");
      }
    };
    document.addEventListener("beforeunload", handleVisibilityChange);
    return () => {
      document.removeEventListener("beforeunload", handleVisibilityChange);
    };
  }, []);

  const handleLogout = async () => {
    const userId = localStorage.getItem("UserId");
    const token = localStorage.getItem("jwt_token");
    if (!userId) {
      console.error("No UserId found in localStorage");
      return;
    }
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        `${config.API_URL}/auth/logout`,
        { id: userId },{
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );
      if (response.status === 200) {
        localStorage.clear();
        navigate("/");
      } else {
        console.error("Error logging out: ", response);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchSearchResults = useCallback(
    debounce(async (searchTerm) => {
      if (searchTerm.trim() === "") {
        setSearchResults([]);
        return;
      }
      try {
        const token = localStorage.getItem("jwt_token");
        const role = localStorage.getItem("role");

        const response = await axiosInstance.get(
          `${config.API_URL}/common/search`,
          {
            params: { searchTerm },
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = response.data;

        if (data.data) {
          if (role === "student") {
            setSearchResults(data.data);
          } else if (role === "librarian") {
            const librarianResults = data.data.map((item) => ({
              user_id: item.user_id,
              first_name: item.first_name,
              last_name: item.last_name,
              email: item.email,
              phoneno: item.phoneno,
            }));
            setSearchResults(librarianResults);
          }
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchResults([]);
      }
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    setSearchQuery(searchTerm);
    debouncedFetchSearchResults(searchTerm);
  };

  const openConfirmationDialog = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleConfirmLogout = () => {
    handleLogout();
    setOpenDialog(false);
  };

  useEffect(() => {
    if (isLanguageDialogOpen) {
      const existingScript = document.getElementById("google_translate_script");
      if (!existingScript) {
        const script = document.createElement("script");
        script.src =
          "https://translate.google.com/translate_a/element.js?cb=loadGoogleTranslate";
        script.id = "google_translate_script";
        script.async = true;
        document.body.appendChild(script);
      }
    }
  }, [isLanguageDialogOpen]);

  window.loadGoogleTranslate = () => {
    if (
      googleTranslateRef.current &&
      window.google &&
      window.google.translate
    ) {
      new window.google.translate.TranslateElement(
        { pageLanguage: "en" },
        googleTranslateRef.current
      );
    }
  };

  const handleLanguageClick = () => {
    setLanguageDialogOpen(true);
  };

  const handleCloseLanguageDialog = () => {
    setLanguageDialogOpen(false);
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
        {
          oldPassword,
          newPassword,
        },
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
        setOpenChangePasswordDialog(false);
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
  const handleOpenChangePasswordDialog = () => {
    console.log("Change password dialog triggered.");
    setOpenChangePasswordDialog(true);
  };

  return (
    <>
      <div
         className="bg-[#142534] flex items-center p-3 px-2 sm:px-6 flex-wrap gap-0 sm:gap-2 justify-center sm:justify-between flex-col sm300:flex-row"
        onMouseLeave={() => setShowSearchResults(false)}
      >
        {/* flex 1  */}
        <Link
          to={role === "student" ? "/welcome" : "/home"}
          className="transition-all duration-300 ease-in-out transform hover:scale-105 "
        >
          <img
            src={logo}
            alt="Logo"
            className="h-[60px] w-[80px] sm:h-[80px] sm:w-[90px] md:h-[90px] md:w-[100px]"
          />
        </Link>

        <div className="flex-1 w-full ">
          <div
            className="relative flex items-center justify-center w-full"
            onClick={() => setShowSearchResults(true)}
          >
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={
                role === "student" ? "Search any book" : "Search any student"
              }
              className="w-full max-w-[200px] sm:max-w-[400px] h-[45px] rounded-full px-4 py-2 bg-[#2c3b4a] text-white text-[16px] border border-[#1f2c36] focus:border-[#4a90e2] focus:outline-none transition-all mr-2 duration-1000 hover:shadow-lg hover:shadow-slate-700 ease-in-out"
            />
            <img
              src={iconsearch}
              alt="Search"
              className="-ml-10 cursor-pointer hidden sm300:block"
            />
            {searchResults.length > 0 && showSearchResults && (
              <div
                className="absolute top-[50px] bg-white border max-h-48 overflow-y-scroll rounded-md shadow-lg p-2 custom-scrollbar z-10 w-full max-w-[400px] sm:max-w-[400px]"
                onClick={() => setShowSearchResults(false)}
              >
                {searchResults.map((item, index) => (
                  <div
                    key={index}
                    className="p-2 cursor-pointer hover:bg-[#f0f0f0] rounded-[12px] transition-all duration-300 ease-in-out transform hover:scale-95"
                  >
                    {role === "student" ? (
                      <Link to={`/bookdetailbyid/${item.book_id}`}>
                        <div>
                          {item.book_name && <strong>Book Name:</strong>}{" "}
                          {item.book_name}
                        </div>
                        <div>
                          {item.author_name && <strong>Author Name:</strong>}{" "}
                          {item.author_name}
                        </div>
                        <div>
                          {item.genre && <strong>Genre:</strong>} {item.genre}
                        </div>
                      </Link>
                    ) : role === "librarian" ? (
                      <Link to={`/memberdetail/${item.user_id}`}>
                        <div>
                          <strong>Name:</strong> {item.first_name}{" "}
                          {item.last_name}
                        </div>
                        <div>
                          <strong>Email:</strong> {item.email}
                        </div>
                        <div>
                          <strong>Phone:</strong> {item.phoneno}
                        </div>
                      </Link>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Profile Section */}
        <div
          className="icons flex justify-end sm:justify-center relative cursor-pointer text-black"
          onClick={() => setShowOptions((prev) => !prev)}
        >
          <div
            onClick={(e) => {
              if (window.innerWidth <= 300) {
                setShowOptions((prev) => !prev);
              }
            }}
          >
            <img
              src={
                profileImage && profileImage !== "null"
                  ? profileImage
                  : "https://www.aiscribbles.com/img/variant/large-preview/18614/?v=1972e3"
              }
              alt="Profile"
              className="profilepic ml-2 relative h-10 w-10 sm:h-12 sm:w-12 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
            />
            <img
              src={arrow}
              alt="Arrow"
              className="absolute top-[16px] right-[29px] sm:right-[36px] bg-yellow-500 p-1 rounded-full sm:h-4 sm300:block"
            />
          </div>

          {showOptions && (
            <div className="dropdown absolute top-full right-0 bg-white border border-[#ccc] rounded-lg shadow-lg p-2 flex flex-col z-10">
              <Link
                to="/profile"
                className="px-4 py-2 hover:bg-[#f0f0f0] rounded-[12px] transition-all duration-300 ease-in-out transform hover:scale-95 "
              >
                View Profile
              </Link>
              <Link
                to="/settings"
                className="px-4 py-2 hover:bg-[#f0f0f0] rounded-[12px] transition-all duration-300 ease-in-out transform hover:scale-95 "
              >
                Settings
              </Link>
              <div
                onClick={handleLanguageClick}
                className="px-4 py-2 hover:bg-[#f0f0f0] rounded-[12px] transition-all duration-300 ease-in-out transform hover:scale-95 "
              >
                change Language
              </div>
              <div
                onClick={handleOpenChangePasswordDialog}
                className="px-4 py-2 hover:bg-[#f0f0f0] rounded-[12px] transition-all duration-300 ease-in-out transform hover:scale-95 "
              >
                change Password
              </div>
              <div
                onClick={openConfirmationDialog}
                className="px-4 py-2 hover:bg-[#f0f0f0] rounded-[12px] transition-all duration-300 ease-in-out transform hover:scale-95 "
              >
                Logout
              </div>
            </div>
          )}
        </div>
      </div>

      {/* for language changing  */}
      <StyledDialog
        open={isLanguageDialogOpen}
        onClose={handleCloseLanguageDialog} TransitionComponent={Slide}
    direction="up"
      >
        <DialogTitle className="text-xl font-semibold text-center bg-[#142534] text-white">
          Select Language
        </DialogTitle>
        <DialogContent className="mt-4 text-xl custom-scrollbar bg-white text-black">
          <div ref={googleTranslateRef} className=""></div>
          <div className="bg-white -mt-32 h-10"></div>
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "center",
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
            onClick={handleCloseLanguageDialog}
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </StyledDialog>

      {/* for logout  */}
      <StyledDialog open={openDialog} onClose={handleDialogClose} TransitionComponent={Slide}
    direction="up">
        <DialogTitle className="text-xl font-semibold text-center bg-[#142534] text-white">
          Confirm Logout
        </DialogTitle>
        <DialogContent className="mt-4 text-xl">
          Are you sure you want to logout?
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            paddingBottom: 3,
          }}
        >
          <Button
            onClick={handleDialogClose}
            sx={{
              marginRight: 2,
              borderRadius: 20,
              minWidth: 120,
              backgroundColor: "#142534",
              color: "white",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmLogout}
            sx={{
              borderRadius: 20,
              minWidth: 120,
              backgroundColor: "#142534",
              color: "white",
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </StyledDialog>

      {/* Change Password Dialog */}
      <StyledDialog
        fullWidth
        open={openChangePasswordDialog}
        onClose={() => setOpenChangePasswordDialog(false)} TransitionComponent={Slide}
    direction="up"
      >
        <DialogTitle className="text-xl font-semibold text-center bg-[#142534] text-white">
          Change Password
        </DialogTitle>
        <DialogContent className="mt-4">
          <div>
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
          </div>
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "center",
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
            onClick={() => setOpenChangePasswordDialog(false)}
            color="primary"
          >
            Close
          </Button>
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
        </DialogActions>
      </StyledDialog>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          Loading...
        </div>
      )}
    </>
  );
};
export default Header;
