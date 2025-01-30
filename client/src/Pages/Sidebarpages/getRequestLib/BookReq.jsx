import React, { useEffect, useState } from "react";
import BookReqTable from "./BookReqTable";
import SnackbarComponent from "../../../components/resusable/SnackbarComponent";
import TopPart from "../../../components/resusable/toppart";
import { useNavigate } from "react-router-dom";
import config from "../../../../utils/config/index";
import { axiosInstance } from "../../../../utils/constants/api";

export default function BookReq() {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [sortField, setSortField] = useState("first_name");
  const [sortOrder, setSortOrder] = useState("asc");
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  // Function to fetch customer data
  const fetchCustomers = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${config.API_URL}/common/get-requests?limit=10&offset=${offset}&sortField=${sortField}|${sortOrder}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        }
      );
      const fetchedList = response.data.data;
      setCustomers((prev) => [...prev, ...fetchedList]);
      if (fetchedList.length < 10) {
        setHasMore(false);
      } else {
        setOffset((prev) => prev + 1);
      }
    } catch (err) {
      setError("Error fetching books data. Please check your token.");
      console.error("Fetch books error:", err);
      if (err.response && err.response.status === 419) {
        localStorage.clear();
        navigate('/'); 
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Sorting logic
  const handleSort = (field) => {
    const newSortOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newSortOrder);
    setOffset(0);
    setCustomers([]);
    setHasMore(true);
  };

  const handleApprove = async (request_id) => {
    const token = localStorage.getItem("jwt_token");
    try {
      const response = await axiosInstance.post(
        `${config.API_URL}/l/accept-book-request`,
        { request_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      handleSnackbar("Request approved successfully!", "success");
      setCustomers((prevCustomers) =>
        prevCustomers.filter((customer) => customer.request_id !== request_id)
      );
      fetchCustomers();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Error approving request. Please try again.";
      handleSnackbar(errorMessage, "error");
      console.error("Error in approving request:", err);
    }
  };
  const handleSnackbar = (message, severity = "success") =>
    setSnackbar({ open: true, message, severity });
  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      setError("Please login first.");
      return;
    }
    setOffset(0);
    setCustomers([]);
    setHasMore(true);
    fetchCustomers();
  }, [sortField, sortOrder]);
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading, hasMore]);

  const handleScroll = (e) => {
    const bottom =
      e.target.documentElement.scrollHeight ===
      e.target.documentElement.scrollTop +
        e.target.documentElement.clientHeight;
    if (bottom && !loading && hasMore) {
      fetchCustomers();
    }
  };

  const dropdownOptions = [
    { value: "1", label: "All status" },
    { value: "2", label: "Pending" },
    { value: "3", label: "Approved" },
    { value: "4", label: "Declined" },
  ];

  return (
    <>
      <TopPart
        title="Book Request List"
        linkPath={role === "librarian" ? "/home" : "/welcome"}
        dropdownOptions={dropdownOptions}
        defaultDropdownValue="1"
        showButton={false}
      />
      
      {/* Error Message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Member Table */}
      <BookReqTable
        customers={customers}
        handleApprove={handleApprove}
        sortField={sortField}
        sortOrder={sortOrder}
        handleSort={handleSort}
        role={role}  
      />

      <SnackbarComponent
        open={snackbar.open}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        message={snackbar.message}
        severity={snackbar.severity}
      />

      {loading && (
        <div className="flex justify-center mt-4">
          Loading...
        </div>
      )}
    </>
  );
}