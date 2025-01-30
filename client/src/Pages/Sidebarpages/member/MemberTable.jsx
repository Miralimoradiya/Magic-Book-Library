import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import NodataBook from "../../../components/resusable/NodataBook";
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

const StyledDialog = styled(Dialog)({
  "& .MuiDialog-paper": { borderRadius: "20px" },
});

export default function MemberTable({
  customers,
  onEdit,
  onDelete,
  sortField,
  sortOrder,
  handleSort,
}) {
  const [openDialog, setOpenDialog] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const navigate = useNavigate(); 

  const handleDeleteClick = (customerId) => {
    setCustomerToDelete(customerId);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    onDelete(customerToDelete);
    setOpenDialog(false);
  };

  const handleCancelDelete = () => setOpenDialog(false);

  const handleRowClick = (customerId) => {
    navigate(`/memberdetail/${customerId}`);
  };

  return (
    <div>
      <div>
        {customers.length ? (
          <div className="scrollable-table-container fade-in">
  
          
          <table className="customer-table">
            <thead>
              <tr>
                {[
                  { header: "ID", forsorting: null },
                  { header: "First Name", forsorting: "first_name" },
                  { header: "Last Name", forsorting: "last_name" },
                  { header: "Phone", forsorting: "phoneno" },
                  { header: "Email", forsorting: "email" },
                  { header: "Paid Dues", forsorting: "paid_dues" },
                  { header: "Left Dues", forsorting: "left_dues" },
                  { header: "Total Dues", forsorting: "total_dues" },
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
                <tr
                  key={customer.user_id}
                  className="table-row"
                  onClick={() => handleRowClick(customer.user_id)}
                  style={{ cursor: "pointer" }} 
                >
                  <td className="table-data">{index + 1}</td>
                  <td className="table-data">{customer.first_name}</td>
                  <td className="table-data">{customer.last_name}</td>
                  <td className="table-data">{customer.phoneno}</td>
                  <td className="table-data">{customer.email}</td>
                  <td className="table-data">{customer.paid_dues}</td>
                  <td className="table-data">{customer.left_dues}</td>
                  <td className="table-data">{customer.total_dues}</td>
                  <td className="table-data flex flex-row gap-1">
                    <button
                      className="border bg-blue-600 rounded-md w-[65px] py-1 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(customer);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); 
                        handleDeleteClick(customer.user_id);
                      }}
                      className="border bg-red-600 rounded-md w-[65px] py-1 text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        ) : (
          <>
<NodataBook
            noDataMessage="No Members Available"
          />
</>
        )}

        <StyledDialog open={openDialog} onClose={handleCancelDelete} TransitionComponent={Slide}
    direction="up">
          <DialogTitle className="text-xl font-semibold text-center bg-[#142534] text-white">
            Confirm Deletion
          </DialogTitle>
          <DialogContent className="mt-4 text-xl">
            Are you sure you want to delete this customer?
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
              onClick={handleCancelDelete}
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
              onClick={handleConfirmDelete}
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
    </div>
  );
}

