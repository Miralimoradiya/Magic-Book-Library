// BooksTable.jsx
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
import { styled } from "@mui/system";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import NodataBook from "../../../components/resusable/NodataBook";
const StyledDialog = styled(Dialog)({
  "& .MuiDialog-paper": { borderRadius: "20px" },
});

export default function BooksTable({
  books,
  onEdit,
  onDelete,
  sortField,
  sortOrder,
  handleSort,
}) {
  const [openDialog, setOpenDialog] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const role = localStorage.getItem("role");

  const handleDeleteClick = (bookId) => {
    setBookToDelete(bookId);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    onDelete(bookToDelete);
    setOpenDialog(false);
  };

  const handleCancelDelete = () => setOpenDialog(false);
  return (
    <div>
      {books.length > 0 ? (
        <div className="scrollable-table-container fade-in">
          <table className="customer-table">
            <thead>
              <tr>
                {[
                  { header: "Book ID", forsorting: null },
                  { header: "Book Name", forsorting: "book_name" },
                  { header: "Author", forsorting: "author_name" },
                  { header: "Total Copies", forsorting: "no_of_copies" },
                  {
                    header: "Available Copies",
                    forsorting: "available_copies",
                  },
                  { header: "Genre", forsorting: "genre" },
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
                {role === "librarian" && (
                  <th className="table-header">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {books.map((book, index) => (
                <tr key={book.book_id} className="table-row">
                  <td className="table-data">{index + 1}</td>
                  <td className="table-data">{book.book_name}</td>
                  <td className="table-data">{book.author_name}</td>
                  <td className="table-data">{book.no_of_copies}</td>
                  <td className="table-data">{book.available_copies}</td>
                  <td className="table-data">{book.genre}</td>
                  {role === "librarian" && (
                    <td className="table-data flex gap-3">
                      <button
                        onClick={() => onEdit(book)}
                        className="border bg-blue-600 rounded-md w-[85px] py-1 text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(book.book_id)}
                        className="border bg-red-600 rounded-md w-[85px] py-1 text-white"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          <NodataBook
                      noDataMessage="No Books Available"
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
  );
}
