// BooksDialog.jsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Slide,
  Autocomplete,
} from "@mui/material";
import { debounce } from "lodash";
import { styled } from "@mui/system";
import config from "../../../../utils/config/index";
import { axiosInstance } from "../../../../utils/constants/api";
const StyledDialog = styled(Dialog)({
  "& .MuiDialog-paper": { borderRadius: "20px" },
});

export default function BooksDialog({
  open,
  onClose,
  onSubmit,
  bookRequestData,
  handleInputChange
}) {
  const [books, setBooks] = useState([]);
  const [bookSearch, setBookSearch] = useState("");
  const [errors, setErrors] = useState({});

  const debouncedBookSearch = debounce(
    (searchQuery) => setBookSearch(searchQuery),
    500
  );
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        const response = await axiosInstance.get(
          `${config.API_URL}/common/get-books?limit=100&offset=0`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { search: bookSearch },
          }
        );
        setBooks(response.data.books);
      } catch (error) {
        console.error("Error fetching books", error);
      }
    };
    if (open) fetchBooks();
  }, [open, bookSearch]);

  const validate = (fieldName) => {
    const errors = {};
    if (fieldName === "book_id" || fieldName === "all") {
      if (!bookRequestData.book_id) {
        errors.book_id = "Book name is required";
      }
    }
    if (fieldName === "no_of_copies" || fieldName === "all") {
      const data = /^[+]?\d+(\.\d+)?$/;
      if (!bookRequestData.no_of_copies) {
        errors.no_of_copies = "Please specify the number of copies.";
      }
      if (!data.test(bookRequestData.no_of_copies)) {
        errors.no_of_copies = "Please add a positive number.";
      } else {
        if (parseFloat(bookRequestData.no_of_copies) <= 0) {
          errors.no_of_copies = "Please add a positive number.";
        }
      }
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate("all")) {
      onSubmit();
    }
  };
  useEffect(() => {
    if (!open) {
      setErrors({});
    }
  }, [open]);
  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth TransitionComponent={Slide}
    direction="up">
      <DialogTitle className="text-center bg-[#142534] text-white">
        Request Book
      </DialogTitle>
      <DialogContent>
        <Autocomplete
          id="book_id"
          name="book_name"
          options={books}
          getOptionLabel={(option) => option.book_name}
          onChange={(event, newValue) => {
            handleInputChange({
              target: {
                name: "book_id",
                value: newValue ? newValue.book_id : "",
              },
            });
          }}
          onInput={(e) => debouncedBookSearch(e.target.value)}
          onBlur={() => validate("book_id")}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search book"
              error={Boolean(errors.book_id)}
              helperText={errors.book_id}
              fullWidth
              margin="normal"
              InputProps={{
                ...params.InputProps,
                sx: { borderRadius: 20 },
              }}
            />
          )}
        />
        <TextField
          label="Number of Copies"
          name="no_of_copies"
          value={bookRequestData.no_of_copies || ""}
          onChange={handleInputChange}
          onBlur={() => validate("no_of_copies")}
          fullWidth
          margin="dense"
          type="number"
          error={Boolean(errors.no_of_copies)}
          helperText={errors.no_of_copies}
          InputProps={{ sx: { borderRadius: 20, borderColor: "gray" } }}
        />
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: "center",
          paddingBottom: 4,
          display: "flex",
          width: "100%",
        }}
      >
        <Button
          onClick={onClose}
          color="primary"
          sx={{
            marginRight: 2,
            borderRadius: 20,
            minWidth: 140,
            backgroundColor: "#142534",
            color: "white",
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          sx={{
            marginRight: 2,
            borderRadius: 20,
            minWidth: 140,
            backgroundColor: "#142534",
            color: "white",
          }}
        >
          Request Book
        </Button>
      </DialogActions>
    </StyledDialog>
  );
}
