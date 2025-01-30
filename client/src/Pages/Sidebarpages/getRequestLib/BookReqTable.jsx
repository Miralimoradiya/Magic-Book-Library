import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Slide,
} from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/system";
import FormatDate from "../../../components/resusable/FormatDate";
import NodataBook from "../../../components/resusable/NodataBook";

const StyledDialog = styled(Dialog)({
  "& .MuiDialog-paper": { borderRadius: "20px" },
});

export default function BookReqTable({
  customers,
  handleApprove,
  sortField,
  sortOrder,
  handleSort,
  role,
}) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleApproveClick = (customer) => {
    setSelectedCustomer(customer);
    setOpenDialog(true);
  };

  const handleConfirmApprove = async () => {
    if (selectedCustomer) {
      await handleApprove(selectedCustomer.request_id);
    }
    setOpenDialog(false);
  };

  const handleCancelApprove = () => {
    setOpenDialog(false);
  };

  return (
    <div>
      {customers.length ? (
        <div className="scrollable-table-container fade-in">
          <table className="customer-table">
            <thead>
              <tr>
                {[
                  { header: "ID", forsorting: null },
                  {
                    header: role === "student" ? "Book Name" : "User Name",
                    forsorting: "first_name",
                  },
                  { header: "Book Name", forsorting: "book_name" },
                  { header: "Issued Books", forsorting: "no_of_copies" },
                  { header: "Request Date", forsorting: "req_date" },
                  {
                    header: role === "librarian" ? "Action" : "Status",
                    forsorting: "isApproved",
                  },
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
                <tr key={customer.request_id} className="table-row">
                  <td className="table-data">{index + 1}</td>
                  <td className="table-data">
                    {role === "student"
                      ? customer.book_name
                      : customer.first_name}
                  </td>
                  <td className="table-data">{customer.book_name}</td>
                  <td className="table-data">{customer.no_of_copies}</td>
                  <td className="table-data">
                    <FormatDate dateString={customer.req_date} />
                  </td>
                  <td className="table-data flex gap-3">
                    {role === "student" ? (
                      customer.isApproved === "requested" ? (
                        <span className="text-blue-500 text-lg">Pending</span>
                      ) : customer.isApproved === "approved" ? (
                        <span className="text-green-500 text-lg">Approved</span>
                      ) : (
                        <span className="text-red-500 text-lg">Declined</span>
                      )
                    ) : customer.isApproved === "requested" ? (
                      <button
                        onClick={() => handleApproveClick(customer)}
                        className="border bg-blue-500 rounded-md w-[100px] pb-1 text-white text-lg"
                      >
                        Approve
                      </button>
                    ) : customer.isApproved === "approved" ? (
                      <span className="text-green-500 text-lg">Approved</span>
                    ) : (
                      <span className="text-red-500 text-lg">Declined</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          <NodataBook
                      noDataMessage="No Book Requests Available"
                    />
        </>
      )}

      {/* Confirmation Dialog for Librarian Approval */}
      <StyledDialog open={openDialog} onClose={handleCancelApprove} TransitionComponent={Slide}
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
            onClick={handleCancelApprove}
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
            onClick={handleConfirmApprove}
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
    </div>
  );
}
