import React, { useState, useEffect } from "react";
import config from "../../../../utils/config/index";
import { axiosInstance } from "../../../../utils/constants/api";
import TopPart from "../../../components/resusable/TopPart";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { MdDone } from "react-icons/md";

export default function LibContact() {
  const userRole = localStorage.getItem("role");
  const token = localStorage.getItem("jwt_token");

  const dropdownOptions = [
    { value: "1", label: "Option 1" },
    { value: "2", label: "Option 2" },
    { value: "3", label: "Option 3" },
  ];

  const enquiryTypeOptions = [
    { value: "library queries", label: "Library Queries" },
    { value: "book queries", label: "Book Queries" },
  ];

  const librarianCheckOptions = [
    { value: "0", label: "Pending" },
    { value: "1", label: "Completed" },
  ];

  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enquiryType, setEnquiryType] = useState("");
  const [librarianCheck, setLibrarianCheck] = useState("");

  const fetchInquiries = async () => {
    setError("");
    let url = `${config.API_URL}/l/get-inquiries`;

    const params = [];
    if (enquiryType) params.push(`enquiry_type=${enquiryType}`);
    if (librarianCheck !== "") params.push(`librarian_check=${librarianCheck}`);
    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }

    try {
      const response = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setInquiries(response.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setError(
        err.response
          ? err.response.data.message
          : "An unexpected error occurred"
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [enquiryType, librarianCheck]);

  const handleMarkAsRead = async (inquiryId) => {
    try {
      const updatedInquiries = inquiries.map((inquiry) =>
        inquiry.inquiry_id === inquiryId
          ? { ...inquiry, librarian_check: 1 }
          : inquiry
      );
      setInquiries(updatedInquiries);

      await axiosInstance.post(
        `${config.API_URL}/l/check-inquiry`,
        {
          inquiry_id: inquiryId,
          librarian_check: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const handleEnquiryTypeChange = (event) => {
    setEnquiryType(event.target.value);
  };

  const handleLibrarianCheckChange = (event) => {
    setLibrarianCheck(event.target.value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <TopPart
        title="Inquiries"
        linkPath={userRole === "librarian" ? "/home" : "/welcome"}
        dropdownOptions={dropdownOptions}
        defaultDropdownValue="1"
        showButton={false}
      />
      <div className="max-w-7xl mx-auto px-4">
        {/* Dropdowns for filtering */}
        <div className="flex flex-col sm:flex-row gap-6 mb-6">
          <div className="w-full">
            <FormControl fullWidth variant="outlined">
              <InputLabel>Enquiry Type</InputLabel>
              <Select
                value={enquiryType}
                onChange={handleEnquiryTypeChange}
                label="Enquiry Type"
                sx={{
                  borderRadius: 20,
                  borderColor: "gray",
                }}
              >
                <MenuItem value="">All Types</MenuItem>
                {enquiryTypeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="w-full">
            <FormControl fullWidth variant="outlined">
              <InputLabel>Status</InputLabel>
              <Select
                value={librarianCheck}
                onChange={handleLibrarianCheckChange}
                label="Status"
                sx={{
                  borderRadius: 20,
                  borderColor: "gray",
                }}
              >
                <MenuItem value="">All Status</MenuItem>
                {librarianCheckOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>

        {error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
            {error}
          </div>
        ) : (
          <div className=" fade-in grid grid-cols-1 sm:grid-cols-2 gap-3">
            {inquiries.length === 0 ? (
              <p className="text-gray-500">No inquiries found.</p>
            ) : (
              inquiries.map((inquiry) => (
                <div
                  key={inquiry.inquiry_id}
                  className="bg-white shadow-lg rounded-lg p-1 sm:p-6 relative transition-all duration-300 ease-in-out transform hover:scale-[1.01] hover:shadow-2xl "
                >
                  <div className="flex flex-col sm:flex-col ">
                    {/* Profile section */}
                    <div className="flex flex-col items-center mb-10">
                      <h3 className="text-2xl font-semibold text-gray-800 text-center underline">
                        {inquiry.user_name}
                      </h3>

                      {inquiry.librarian_check === 1 ? (
                        <p className="text-gray-500 flex items-center"><MdDone className="text-green-500 text-xl"/>Already Read </p>
                      ) : (
                        <div className="">
                          <button
                            onClick={() => handleMarkAsRead(inquiry.inquiry_id)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md mt-4"
                          >
                            Mark as Read
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Inquiry Information Grid */}
                    <div className="flex flex-col lg:flex-row sm:flex-col justify-between w-full gap-6">
                      <div className="flex flex-col justify-between gap-6 w-full lg:w-1/2">
                        <div className="flex flex-col justify-between">
                          <strong className="text-gray-700 w-32">Email:</strong>
                          <span className="text-gray-600 overflow-auto break-words">
                            {inquiry.user_email}
                          </span>
                        </div>

                        <div className="flex flex-col justify-between">
                          <strong className="text-gray-700 w-32">City:</strong>
                          <span className="text-gray-600">{inquiry.city}</span>
                        </div>

                        <div className="flex flex-col justify-between">
                          <strong className="text-gray-700 w-32">
                            Country:
                          </strong>
                          <span className="text-gray-600">
                            {inquiry.country}
                          </span>
                        </div>

                        <div className="flex flex-col justify-between">
                          <strong className="text-gray-700 w-32">
                            Phone Number:
                          </strong>
                          <span className="text-gray-600">
                            {inquiry.phone_number}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between gap-6 w-full lg:w-1/2">
                        <div className="flex flex-col justify-between">
                          <strong className="text-gray-700 w-32">
                            Subject:
                          </strong>
                          <span className="text-gray-600">
                            {inquiry.subject}
                          </span>
                        </div>
                        <div className="flex flex-col justify-between">
                          <strong className="text-gray-700 w-32">State:</strong>
                          <span className="text-gray-600">{inquiry.state}</span>
                        </div>
                        <div className="flex flex-col justify-between">
                          <strong className="text-gray-700 w-32">
                            Enquiry Type:
                          </strong>
                          <span className="text-gray-600">
                            {inquiry.enquiry_type}
                          </span>
                        </div>

                        <div className="flex flex-col justify-between">
                          <strong className="text-gray-700 w-32">
                            Message:
                          </strong>
                          <span className="text-gray-600 break-words">
                            {inquiry.message}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
}
