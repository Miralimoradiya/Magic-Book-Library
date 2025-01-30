// Profile.jsx
import React, { useState, useEffect } from "react";
import TopPart from "../../components/resusable/TopPart";
import config from "../../../utils/config/index";
import { axiosInstance } from "../../../utils/constants/api";
import { DNA } from "react-loader-spinner";
import SnackbarComponent from "../../components/resusable/SnackbarComponent";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Slide
} from "@mui/material";
import { styled } from "@mui/system";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
const StyledDialog = styled(Dialog)({
  "& .MuiDialog-paper": { borderRadius: "20px" },
});

export default function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phoneno: "",
    profile_image: "",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) throw new Error("No token found in localStorage");

      const response = await axiosInstance.get(`${config.API_URL}/common/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Handle successful response
      if (response.status === 200) {
        const data = response.data;
        setProfileData(data.userData[0]);
        setFormData({
          first_name: data.userData[0].first_name,
          last_name: data.userData[0].last_name,
          phoneno: data.userData[0].phoneno,
          profile_image: data.userData[0].profile_image,
        });
        localStorage.setItem("profileImage", data.userData[0].profile_image);
      } else {
        throw new Error(`Failed to fetch profile data: ${response.statusText}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      profile_image: file,
    }));
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleSaveChangesClick = () => {
    setOpenDialog(true);
  };

  const handleDialogSave = async () => {
    const token = localStorage.getItem("jwt_token");
    if (!token) return;
    setOpenDialog(false);
    setLoading(true);

    try {
      const form = new FormData();
      form.append("firstName", formData.first_name);
      form.append("lastName", formData.last_name);
      form.append("phoneNo", formData.phoneno);
      if (formData.profile_image) {
        form.append("profileImage", formData.profile_image);
      }

      const response = await axiosInstance.put(
        `${config.API_URL}/common/edit-profile`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        fetchProfileData();
        setIsEditing(false);
        setSnackbar({
          open: true,
          message: "Profile Updated Successfully",
          severity: "success",
        });
        if (formData.profile_image) {
          const updatedImageURL = URL.createObjectURL(formData.profile_image);
        }
      } else {
        setSnackbar({
          open: true,
          message: "Failed to update profile.",
          severity: "error",
        });
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setSnackbar({
        open: true,
        message: "Failed to update profile.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDialogCancel = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <TopPart title="Your Profile" linkPath="/books" showButton={false} />

      {/* Profile Card */}
      <div className="p-6 bg-[#f2f3f4] shadow-xl rounded-xl relative mt-20 mx-4 md:mx-16 lg:mx-32 fade-in">
        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <DNA
              visible={true}
              height="100"
              width="100"
              ariaLabel="dna-loading"
              wrapperStyle={{}}
              wrapperClass="dna-wrapper"
            />
          </div>
        ) : (
          <>
            {/* Profile Image */}
            <div className="absolute -top-20 left-1/2 transform -translate-x-1/2">
              <img
                src={
                  imagePreview ||
                  profileData?.profile_image ||
                  "https://www.aiscribbles.com/img/variant/large-preview/18614/?v=1972e3"
                }
                alt="Profile"
                className="rounded-full h-32 w-32 md:h-40 md:w-40 shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105 slide-in"
              />
              {isEditing && (
                <div className="mt-2 text-center">
                  <label
                    htmlFor="fileInput"
                    className="cursor-pointer bg-white rounded-full absolute bottom-4 right-0 px-3 h-12 pt-2 text-center"
                  >
                    <AddAPhotoIcon className="text-2xl" />
                  </label>
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            {profileData ? (
              <>
                {/* User Info */}
                <div className="mb-6 mt-24 md:mt-28 slide-in">
                  <div className="text-center">
                    <div className="flex flex-col md:flex-row justify-center items-center gap-2">
                      <h2
                        className="text-gray-800 font-extrabold text-xl md:text-2xl lg:text-3xl"
                        style={{ fontFamily: "Garamond, serif" }}
                      >
                        {isEditing ? (
                          <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            className="border-b-2 border-black focus:outline-none bg-inherit text-center"
                          />
                        ) : (
                          `${profileData.first_name}`
                        )}
                      </h2>
                      <h2
                        className="text-gray-800 font-extrabold text-xl md:text-2xl lg:text-3xl"
                        style={{ fontFamily: "Garamond, serif" }}
                      >
                        {isEditing ? (
                          <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                            className="border-b-2 border-black focus:outline-none bg-inherit text-center"
                          />
                        ) : (
                          `${profileData.last_name}`
                        )}
                      </h2>
                    </div>

                    <p className="text-sm md:text-md text-gray-500">
                      {profileData.email}
                    </p>
                    <p className="text-sm text-gray-500">
                      {isEditing ? (
                        <input
                          type="text"
                          name="phoneno"
                          value={formData.phoneno}
                          onChange={handleInputChange}
                          className="border-b-2 border-black focus:outline-none bg-inherit text-center"
                        />
                      ) : (
                        profileData.phoneno
                      )}
                    </p>
                  </div>
                </div>

                {/* Dues Section */}
                <div className="flex flex-col md:flex-row justify-between px-4 md:px-16 lg:px-64 pt-8 pb-3 gap-6 slide-in">
                  <div className="flex justify-center items-center flex-col text-blue-600">
                    <p>Total Dues</p>
                    <p className="font-semibold">
                      ₹ {profileData.total_dues.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex justify-center items-center flex-col text-green-600">
                    <p>Paid Dues</p>
                    <p className="font-semibold">
                      ₹ {profileData.paid_dues.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex justify-center items-center flex-col text-red-600">
                    <p>Left Dues</p>
                    <p className="font-semibold">
                      ₹ {profileData.left_dues.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col md:px-40 lg:px-80 justify-start sm:justify-center gap-3 py-8 slide-in">
                  {isEditing ? (
                    <button
                      onClick={handleSaveChangesClick}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-2 w-32 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 mx-auto"
                    >
                      Save Changes
                    </button>
                  ) : (
                    <button
                      onClick={handleEditClick}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-2 w-32 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 mx-auto"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="text-gray-600 text-center">
                Loading profile...
              </div>
            )}
          </>
        )}
      </div>

      {/* Dialog */}
      <StyledDialog
        open={openDialog}
        onClose={handleDialogCancel}
        maxWidth="sm" TransitionComponent={Slide}
    direction="up"
      >
        <DialogTitle className="text-xl font-semibold text-center bg-[#142534] text-white">
          Confirm Changes
        </DialogTitle>
        <DialogContent
          sx={{ marginY: "20px", marginX: "10px" }}
          className="text-xl"
        >
          <p>
            Are you sure you want to save <br /> the changes to your profile?
          </p>
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            paddingBottom: 4,
          }}
        >
          <Button
            onClick={handleDialogCancel}
            color="primary"
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
            onClick={handleDialogSave}
            color="primary"
            sx={{
              borderRadius: 20,
              minWidth: 120,
              backgroundColor: "#142534",
              color: "white",
            }}
          >
            Save
          </Button>
        </DialogActions>
      </StyledDialog>

      <SnackbarComponent
        open={snackbar.open}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </>
  );
}
