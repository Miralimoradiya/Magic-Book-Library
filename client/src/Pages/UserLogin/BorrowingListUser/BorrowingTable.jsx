// BorrowingTable.jsx
import React, { useState } from "react";
import { Typography } from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PaymenDialog from "./PaymenDialog";
import FormatDate from "../../../components/resusable/FormatDate";
import { calculateDelayedDays } from "../../../components/resusable/CalculateDelayedDays";
import NodataBook from "../../../components/resusable/NodataBook";

export default function BorrowingTable({
  customers,
  sortField,
  sortOrder,
  handleSort,
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handlePayNowClick = (customer) => {
    setSelectedCustomer(customer);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedCustomer(null);
  };

  const handleDialogSubmit = (paymentDetails) => {
    console.log("Payment details submitted:", paymentDetails);
    setDialogOpen(false);
    setSelectedCustomer(null);
  };

  return (
    <div className="">
      {customers.length ? (
        <div className="scrollable-table-container fade-in">
          <table className="customer-table">
            <thead>
              <tr>
                {[
                  { header: "ID", forsorting: null },
                  { header: "Book Name", forsorting: "book_name" },
                  { header: "Issued Books", forsorting: "no_of_copies" },
                  { header: "Borrow date", forsorting: "borrow_date" },
                  { header: "Due date", forsorting: "due_date" },
                  { header: "Return date", forsorting: "release_date" },
                  { header: "Due amount", forsorting: "due_amount" },
                  { header: "Delayed Days", forsorting: null },
                  { header: "Payment", forsorting: null },
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
                  <td className="table-data">{customer.book_name}</td>
                  <td className="table-data">{customer.no_of_copies}</td>

                  <td className="table-data">
                    {" "}
                    <FormatDate dateString={customer.borrow_date} />
                  </td>
                  <td className="table-data">
                    {" "}
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
                  <td className="table-data">
                    {customer.due_amount > 0 && customer.is_due_paid === 0 ? (
                      <button
                        className="text-white bg-blue-600 px-2 py-1 rounded-md"
                        onClick={() => handlePayNowClick(customer)}
                      >
                        Pay Now
                      </button>
                    ) : (
                      <span className="text-green-500">Payment Done</span>
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
                    noDataMessage="No Borrowings Available"
                  />
        </> 
      )}

      <PaymenDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleDialogSubmit}
        selectedCustomer={selectedCustomer}
      />
    </div>
  );
}
