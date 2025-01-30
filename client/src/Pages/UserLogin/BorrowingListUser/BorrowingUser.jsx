// BorrowingLib.jsx
import React, { useEffect, useState } from "react";
import BorrowingTable from "./BorrowingTable";
import { useNavigate } from "react-router-dom";
import SnackbarComponent from "../../../components/resusable/SnackbarComponent"
import TopPart from "../../../components/resusable/toppart";
import DateRangeFilter from "../../../components/resusable/DateRangeFilter";
import config from "../../../../utils/config/index"
import { axiosInstance } from "../../../../utils/constants/api";

export default function BorrowingLib() {
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
  const [sortField, setSortField] = useState("book_name"); 
  const [sortOrder, setSortOrder] = useState("asc"); 
  const navigate = useNavigate();
  const [dateParams, setDateParams] = useState({});

  const fetchCustomers = async (params = {}) => {
    if (loading || !hasMore) return;
    setLoading(true);
    const queryParams = {
      limit: 10,
      offset: offset,
      ...params,
    };
    try {
      const response = await axiosInstance.get(
        `${config.API_URL}/common/get-borrow-list?sortField=${sortField}|${sortOrder}`,
        {
          params: queryParams,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        }
      );
      const fetchedBorrowingList = response.data.data;
      setCustomers((prev) => [...prev, ...fetchedBorrowingList]);
      if (fetchedBorrowingList.length < 10) {
        setHasMore(false);
      } else {
        setOffset((prev) => prev + 1);
      }
    } catch (err) {
      if (err.response && err.response.status === 419) {
        localStorage.clear();
        navigate("/"); 
      } else {
        console.error("Fetch books error:", err);
      }
    } finally {
      setLoading(false);
    }
  };
  const handleApplyDateFilter = (params) => {
    setOffset(0);
    setCustomers([]);
    setHasMore(true);
    setDateParams(params);
    fetchCustomers(params);
  };
  const handleSort = (field) => {
    const newSortOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newSortOrder);
    setOffset(0);
    setCustomers([]);
    setHasMore(true);
  };
  
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
  return (
    <>
      <div className="flex justify-between items-center w-full borrowing-list-container">
      <div>
          <TopPart
            title="Borrowing List"
            linkPath="/books"
            showButton={false}
          />
        </div>
        <div className="flex items-end gap-4 date-filter-container">
        <DateRangeFilter onApplyDateFilter={handleApplyDateFilter} />
          <div>
          <select className="filter-select bg-white text-black">
              <option value="All Books">All status</option>
              <option value="1">Pending</option>
              <option value="2">Approved</option>
              <option value="3">Declined</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Member Table */}
      <BorrowingTable
        customers={customers}
        sortField={sortField} 
        sortOrder={sortOrder} 
        handleSort={handleSort} 
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
