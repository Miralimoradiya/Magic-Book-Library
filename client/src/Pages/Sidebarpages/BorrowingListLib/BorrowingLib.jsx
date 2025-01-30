// BorrowingLib.jsx
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Slide,
} from "@mui/material";
import { styled } from "@mui/system";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FormatDate from "../../../components/resusable/FormatDate";
import { calculateDelayedDays } from "../../../components/resusable/CalculateDelayedDays";
import SnackbarComponent from "../../../components/resusable/SnackbarComponent";
import TopPart from "../../../components/resusable/toppart";
import DateRangeFilter from "../../../components/resusable/DateRangeFilter";
import { useNavigate } from "react-router-dom";
import config from "../../../../utils/config/index";
import NodataBook from "../../../components/resusable/NodataBook";
import { axiosInstance } from "../../../../utils/constants/api";
const StyledDialog = styled(Dialog)({
  "& .MuiDialog-paper": { borderRadius: "20px" },
});

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
  const [sortField, setSortField] = useState("first_name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [dateParams, setDateParams] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const navigate = useNavigate();

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
      setError("Error fetching customer data. Please check your token.");
      console.error("Fetch books error:", err);
      if (err.response && err.response.status === 419) {
        localStorage.clear();
        navigate("/");
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
    setOffset(0);
    setCustomers([]);
    setHasMore(true);
    fetchCustomers();
  }, [sortField, sortOrder]);

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      setError("Please login first.");
      return;
    }
  }, []);
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

  const handleReturnClick = (customer) => {
    setSelectedCustomer(customer);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedCustomer(null);
  };

  const handleConfirmReturn = async () => {
    const token = localStorage.getItem("jwt_token");
    if (!selectedCustomer) return;
    const payload = {
      borrower_id: selectedCustomer.borrower_id,
      returning_user_id: selectedCustomer.user_id,
      book_id: selectedCustomer.book_id,
    };
    try {
      const response = await axiosInstance.post(
        `${config.API_URL}/l/release-book`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSnackbar({
        open: true,
        message: "Book returned successfully!",
        severity: "success",
      });
      setOpenDialog(false);
      setSelectedCustomer(null);
      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer.borrower_id === selectedCustomer.borrower_id
            ? { ...customer, release_date: new Date().toISOString() }
            : customer
        )
      );
    } catch (error) {
      const errorMessage = err.response?.data?.message;
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };


  return (
    <>
      <div className="flex justify-between items-center w-full borrowing-list-container">
        <div>
          <TopPart title="Borrowing List" linkPath="/home" showButton={false} />
        </div>

        <div className="flex items-end gap-4 date-filter-container ">
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

      {error && <p className="text-red-500">{error}</p>}

      <div className="scrollable-table-container fade-in">
        {customers.length ? (
          <table className="customer-table">
            <thead>
              <tr>
                {[
                  { header: "ID", forsorting: null },
                  { header: "User Name", forsorting: "first_name" },
                  { header: "Book Name", forsorting: "book_name" },
                  { header: "Issued Books", forsorting: "no_of_copies" },
                  { header: "Borrow date", forsorting: "borrow_date" },
                  { header: "Due date", forsorting: "due_date" },
                  { header: "Return date", forsorting: "release_date" },
                  { header: "Due amount", forsorting: "due_amount" },
                  { header: "Delayed Days", forsorting: null },
                  { header: "Action", forsorting: null },
                ].map(({ header, forsorting }) => (
                  <th
                    key={header}
                    onClick={() => forsorting && handleSort(forsorting)}
                    className="table-header"
                  >
                    <div className="flex">
                      {header}
                      {forsorting && (
                        <Typography
                          variant="body"
                          sx={{ fontSize: 18, marginLeft: 1 }}
                        >
                          {sortField === forsorting &&
                            (sortOrder === "asc" ? (
                              <ExpandLessIcon />
                            ) : (
                              <ExpandMoreIcon />
                            ))}
                        </Typography>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => (
                <tr key={customer.borrower_id} className="table-row">
                  <td className="table-data">{index + 1}</td>
                  <td className="table-data">{customer.first_name}</td>
                  <td className="table-data">{customer.book_name}</td>
                  <td className="table-data">{customer.no_of_copies}</td>
                  <td className="table-data">
                    <FormatDate dateString={customer.borrow_date} />
                  </td>
                  <td className="table-data">
                    <FormatDate dateString={customer.due_date} />
                  </td>
                  <td className="table-data">
                    {!customer.release_date ? (
                      "null"
                    ) : (
                      <FormatDate dateString={customer.release_date} />
                    )}
                  </td>
                  <td className="table-data">{customer.due_amount}</td>
                  <td className="table-data">
                    {calculateDelayedDays(
                      customer.due_date,
                      customer.release_date
                    )}
                  </td>
                  <td className="table-data flex gap-3">
                    {!customer.release_date ? (
                      <button
                        onClick={() => handleReturnClick(customer)}
                        className="border bg-blue-500 rounded-md w-[100px] py-1 text-white"
                      >
                        Return book
                      </button>
                    ) : (
                      <span>book returned</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <>
          <NodataBook
                      noDataMessage="No Borrowings Available"
                    />
          </> 
        )}
      </div>

      <StyledDialog open={openDialog} onClose={handleDialogClose} TransitionComponent={Slide}
    direction="up">
        <DialogTitle className="text-xl font-semibold text-center bg-[#142534] text-white">
          Confirm Approval
        </DialogTitle>
        <DialogContent className="mt-4 text-xl">
          Are you sure you want to approve this request?
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
            onClick={handleConfirmReturn}
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

      <SnackbarComponent
        open={snackbar.open}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        message={snackbar.message}
        severity={snackbar.severity}
      />

      {loading && (
        <div className="flex justify-center mt-4 ">
Loading...
        </div>
      )}
    </>
  );
}
