// Review.jsx
import React, { useEffect, useState } from "react";
import config from "../../../../utils/config/index";
import { axiosInstance } from "../../../../utils/constants/api";
import debounce from "lodash/debounce";
import { MdAdd } from "react-icons/md";
import FormatTime from "../../../components/resusable/FormatTime";
import FormatDate from "../../../components/resusable/FormatDate";
import TopPart from "../../../components/resusable/toppart";
import SnackbarComponent from "../../../components/resusable/SnackbarComponent"
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Autocomplete,
  TextField,
  Button,
  Slide,
} from "@mui/material";
import { styled } from "@mui/system";
const StyledDialog = styled(Dialog)({
  "& .MuiDialog-paper": { borderRadius: "20px" },
});

export default function Review() {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [books, setBooks] = useState([]);
  const [bookSearch, setBookSearch] = useState("");
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState("");
  const [selectedBookReviews, setSelectedBookReviews] = useState([]);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [rating, setRating] = useState(1);
  const [reviewMessage, setReviewMessage] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "",
  });

  const token = localStorage.getItem("jwt_token");
  const user_id = localStorage.getItem("UserId");
  const role = localStorage.getItem("role");

  const fetchReviews = async () => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      setError("No token found");
      return;
    }
    try {
      const response = await axiosInstance.get(
        `${config.API_URL}/common/get-reviews`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("API Response Data:", response.data);
      setReviews(response.data.reviews);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch reviews");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

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
    const tempErrors = { ...errors };
    if (fieldName === "book_id" && !selectedBookId) {
      tempErrors.book_id = "Book name is required";
    }
    setErrors(tempErrors);
  };

  useEffect(() => {
    const fetchReviews = async () => {
      const token = localStorage.getItem("jwt_token");

      if (!selectedBookId) {
        try {
          const response = await axiosInstance.get(
            `${config.API_URL}/common/get-book-reviews`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          console.log("Default Reviews:", response.data);
          setSelectedBookReviews(response.data.reviews);
        } catch (err) {
          console.error(err);
          setError("Failed to fetch default reviews");
        }
      } else {
        try {
          const response = await axiosInstance.get(
            `${config.API_URL}/common/get-book-reviews?book_id=${selectedBookId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          console.log("Book Reviews:", response.data);
          setSelectedBookReviews(response.data.reviews);
        } catch (err) {
          console.error(err);
          setError("Failed to fetch book reviews");
        }
      }
    };
    fetchReviews();
  }, [selectedBookId]);

  const handleReviewSubmit = async () => {
    const reviewData = {
      user_id,
      rating,
      message: reviewMessage,
    };

    try {
      const response = await axiosInstance.post(
        `${config.API_URL}/s/post-review`,
        reviewData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOpenReviewDialog(false);
      const res = response?.data?.message;
      setSnackbar({
        open: true,
        message: res,
        severity: "success",
      });
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message;
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const dropdownOptions = [
    { value: "1", label: "All status" },
    { value: "2", label: "Pending" },
    { value: "3", label: "Approved" },
    { value: "4", label: "Declined" },
  ];

  return (
    <div>
      <TopPart
        title="Reviews List"
        linkPath={role === "librarian" ? "/home" : "/welcome"}
        dropdownOptions={dropdownOptions}
        defaultDropdownValue="1"
        showButton={false}
      />

      {error && <div style={{ color: "red" }}>{error}</div>}

      {/* SECTION 1  */}
      <section>
        <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-4xl text-center">
          <span class="text-transparent bg-clip-text bg-gradient-to-r to-emerald-300 from-slate-500">
            General reviews
          </span>
        </h1>
        <div class="inline-flex items-center justify-center w-full mt-9 sm:mt-0 ">
          <hr class="w-[45%] h-1 bg-gray-200 border-0 rounded dark:bg-gray-700" />
          <div class="absolute px-4 ">
            <p className="text-center font-serif text-sm sm:text-xl bg-[#f4f8fb] px-1">
              What user likes most about the website
            </p>
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-10 my-3">
          {role === "student" && (
            <button
              onClick={() => setOpenReviewDialog(true)}
              className="ml-auto bg-gradient-to-r from-blue-300 to-red-300 text-black sm:text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 -mt-7 flex justify-center align-middle items-center mb-3 "
            >
              <MdAdd className="font-extrabold text-2xl" />
              Add Yours
            </button>
          )}
          <div className="flex flex-col gap-5 h-80 overflow-auto custom-scrollbar text-black">
            {reviews && reviews.length > 0 ? (
              reviews.map((review) => (
                <div
                  key={review.review_id}
                  className="sm:p-4 p-1 border rounded-lg shadow-lg flex flex-col sm:flex-row sm:gap-5 gap-0 fade-in"
                >
                  <div className="flex justify-center sm:justify-start">
                    <img
                      src={
                        review.profile_image ||
                        localStorage.getItem("profileImage") ||
                        "https://www.aiscribbles.com/img/variant/large-preview/18614/?v=1972e3"
                      }
                      alt="Profile"
                      className="h-16 w-16 sm:h-16 sm:w-20 rounded-full shadow-lg"
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <div className="flex flex-col sm:flex-row justify-between">
                      <div>
                        <strong className="text-lg sm:text-base">
                          {review.message}
                        </strong>
                        <p className="text-sm sm:text-base">
                          {review.first_name} {review.last_name}
                        </p>
                        <span className="text-xs sm:text-sm text-gray-500 flex items-center ml-0 sm:ml-auto break-words">
                          {review.email}
                        </span>
                      </div>
                      <div className="flex flex-col justify-between sm:ml-auto">
                        <strong className=" ml-0 sm:ml-auto text-sm sm:text-base">
                          {review.rating} ★
                        </strong>
                        <span className="text-xs sm:text-sm text-gray-500 flex items-center ml-0 sm:ml-auto">
                          <FormatDate dateString={review.createdAt} />
                        </span>
                        <span className="text-xs sm:text-sm text-gray-500 flex items-center ml-0 sm:ml-auto">
                          <FormatTime dateString={review.createdAt} />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="sm:text-2xl text-sm m-auto"> &#128522; No reviews yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 2  */}
      <section>
        <h1 class="mt-20 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-4xl text-center">
          <span class="text-transparent bg-clip-text bg-gradient-to-r to-emerald-300 from-slate-500">
            Book reviews
          </span>
        </h1>
        <div class="inline-flex items-center justify-center w-full mt-9 sm:mt-0">
          <hr class="w-[45%] h-1 bg-gray-200 border-0 rounded dark:bg-gray-700" />
          <div class="absolute px-4 ">
            <p className="text-center font-serif text-sm sm:text-xl bg-[#f4f8fb] px-1">
              which book user most liked?
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-7 bg-white shadow-lg rounded-lg p-10 my-3">
          <div className="w-40 sm:w-96 ml-0 sm:ml-auto -mt-7">
            <Autocomplete
              id="book_id"
              name="book_name"
              options={books}
              getOptionLabel={(option) => option.book_name}
              onChange={(event, newValue) => {
                setSelectedBookId(newValue ? newValue.book_id : "");
              }}
              onInput={(e) => debouncedBookSearch(e.target.value)}
              onBlur={() => validate("book_id")}
              onOpen={() => setOpen(true)}
              onClose={() => setOpen(false)}
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
          </div>
          <div className="flex flex-col gap-5 h-80 overflow-auto custom-scrollbar text-black">
            {selectedBookReviews && selectedBookReviews.length > 0 ? (
              selectedBookReviews.map((review) => (
                <div
                  key={review.review_id}
                  className="sm:p-4 p-1 border rounded-lg shadow-lg flex flex-col sm:flex-row sm:gap-5 gap-0 slide-in"
                >
                  <div className="flex justify-center sm:justify-start">
                    <img
                      src={
                        review.profile_image ||
                        localStorage.getItem("profileImage") ||
                        "https://www.aiscribbles.com/img/variant/large-preview/18614/?v=1972e3"
                      }
                      alt="Profile"
                      className="h-16 w-16 sm:h-16 sm:w-20 rounded-full shadow-lg"
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <div className="flex flex-col sm:flex-row justify-between">
                      <div>
                        <strong className="text-lg sm:text-base">
                          {review.message}
                        </strong>
                        <p className="text-sm sm:text-base">
                          {review.first_name} {review.last_name}
                        </p>
                        <span className="text-xs sm:text-sm text-gray-500 flex items-center ml-0 sm:ml-auto break-words">
                          {review.email}
                        </span>
                      </div>
                      <div className="flex flex-col justify-between sm:ml-auto">
                        <strong className=" ml-0 sm:ml-auto text-sm sm:text-base">
                          {review.rating} ★
                        </strong>
                        <span className="text-xs sm:text-sm text-gray-500 flex items-center ml-0 sm:ml-auto">
                          <FormatDate dateString={review.createdAt} />
                        </span>
                        <span className="text-xs sm:text-sm text-gray-500 flex items-center ml-0 sm:ml-auto">
                          <FormatTime dateString={review.createdAt} />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="sm:text-2xl text-sm m-auto"> &#128522; No reviews yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* Review Dialog */}
      <StyledDialog
        open={openReviewDialog}
        onClose={() => setOpenReviewDialog(false)}
        maxWidth="sm" TransitionComponent={Slide}
    direction="up"
      >
        <DialogTitle className="text-xl font-semibold text-center bg-[#142534] text-white">
          Add Your Review
        </DialogTitle>
        <DialogContent className="text-center flex flex-col gap-6 mt-4">
          {/* Star Rating */}
          <div className="rating rating-lg">
            {[1, 2, 3, 4, 5].map((star) => (
              <input
                key={star}
                type="radio"
                name="rating"
                value={star}
                checked={rating === star}
                className="mask mask-star-2 mx-2  bg-orange-400"
                onChange={() => setRating(star)}
              />
            ))}
          </div>

          {/* Review Message */}
          <TextField
            label="Your Review"
            multiline
            rows={4}
            value={reviewMessage}
            onChange={(e) => setReviewMessage(e.target.value)}
            maxWidth="sm"
          />
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
            onClick={() => setOpenReviewDialog(false)}
            sx={{
              borderRadius: 20,
              minWidth: 120,
              backgroundColor: "#142534",
              color: "white",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleReviewSubmit}
            sx={{
              borderRadius: 20,
              minWidth: 120,
              backgroundColor: "#142534",
              color: "white",
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </StyledDialog>

      <SnackbarComponent
            open={snackbar.open}
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            message={snackbar.message}
            severity={snackbar.severity}
          />
    </div>
  );
}
