import React from "react";
import { Typography } from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FormatDate from "../../../components/resusable/FormatDate";
import NodataBook from "../../../components/resusable/NodataBook";

function SortableHeader({ field, label, sortField, sortOrder, handleSort }) {
  return (
    <th
      onClick={() => handleSort(field)}
      className="table-header cursor-pointer"
    >
      {label}
      {sortField === field && (
        <Typography variant="body" sx={{ fontSize: 18, marginLeft: 1 }}>
          {sortOrder === "asc" ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Typography>
      )}
    </th>
  );
}

export default function PaymentdetailsTable({
  customers,
  sortField,
  sortOrder,
  handleSort,
  roleName,
}) {
  const showFirstName = roleName !== "student";

  return (
    <div>
      {customers.length ? (
        <div className="scrollable-table-container fade-in">
          <table className="customer-table">
            <thead>
              <tr>
                <th className="table-header">ID</th>
                {showFirstName && (
                  <SortableHeader
                    field="first_name"
                    label="First Name"
                    sortField={sortField}
                    sortOrder={sortOrder}
                    handleSort={handleSort}
                  />
                )}
                <SortableHeader
                  field="email"
                  label="Email"
                  sortField={sortField}
                  sortOrder={sortOrder}
                  handleSort={handleSort}
                />
                <SortableHeader
                  field="book_name"
                  label="Book Name"
                  sortField={sortField}
                  sortOrder={sortOrder}
                  handleSort={handleSort}
                />
                <SortableHeader
                  field="card_number"
                  label="Card Number"
                  sortField={sortField}
                  sortOrder={sortOrder}
                  handleSort={handleSort}
                />
                <SortableHeader
                  field="amount"
                  label="Amount"
                  sortField={sortField}
                  sortOrder={sortOrder}
                  handleSort={handleSort}
                />
                <SortableHeader
                  field="createdAt"
                  label="Payment Date"
                  sortField={sortField}
                  sortOrder={sortOrder}
                  handleSort={handleSort}
                />
                <SortableHeader
                  field="error"
                  label="Status"
                  sortField={sortField}
                  sortOrder={sortOrder}
                  handleSort={handleSort}
                />
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => (
                <tr key={customer.request_id} className="table-row">
                  <td className="table-data">{index + 1}</td>
                  {showFirstName && (
                    <td className="table-data">{customer.first_name}</td>
                  )}
                  <td className="table-data">{customer.email}</td>
                  <td className="table-data">{customer.book_name}</td>
                  <td className="table-data">{customer.card_number}</td>
                  <td className="table-data">{customer.amount ?? "null"}</td>
                  <td className="table-data">
                    <FormatDate dateString={customer.createdAt} />
                  </td>
                  <td className="table-data flex gap-3">
                    {customer.error ? (
                      <span className="text-red-500 text-lg">
                        {customer.error}
                      </span>
                    ) : (
                      <span className="text-blue-500 text-lg">success</span>
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
            noDataMessage="No Transaction Available"
          />
        </>
      )}
    </div>
  );
}
