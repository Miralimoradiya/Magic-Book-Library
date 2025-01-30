// BookDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TopPart from "../../../components/resusable/toppart";
import config from "../../../../utils/config/index";
import { axiosInstance } from "../../../../utils/constants/api";
import ReadMoreComponent from "../../../components/resusable/ReadMoreComponent";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import FormatTime from "../../../components/resusable/FormatTime";
import FormatDate from "../../../components/resusable/FormatDate";
import SkeletonLoader from "./SkeletonLoader";
import { MdAdd } from "react-icons/md";
import NodataBook from "../../../components/resusable/NodataBook";
import SnackbarComponent from "../../../components/resusable/SnackbarComponent";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  Slide,
} from "@mui/material";
import { styled } from "@mui/system";
const StyledDialog = styled(Dialog)({
  "& .MuiDialog-paper": { borderRadius: "20px" },
});

const fallbackImages = [
  "https://m.media-amazon.com/images/I/71+HXUNTnxL.jpg",
  "https://m.media-amazon.com/images/I/81u2eqUPXvL._AC_UF1000,1000_QL80_.jpg",
];

const BookDetail = () => {
  const { book_id } = useParams();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [likedBooks, setLikedBooks] = useState(() => {
    const storedLikes = localStorage.getItem("likedBooks");
    return storedLikes ? JSON.parse(storedLikes) : {};
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [rating, setRating] = useState(1);
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviews, setReviews] = useState([]);

  const token = localStorage.getItem("jwt_token");
  const user_id = localStorage.getItem("UserId");

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `${config.API_URL}/common/get-books?book_id=${book_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const fetchedBooks = response.data.books;
      if (fetchedBooks.length) {
        setBooks(fetchedBooks);

        let bookImages = fetchedBooks[0]?.media_urls || [];
        if (bookImages.length === 0) {
          bookImages = [{ url: fallbackImages[0] }, { url: fallbackImages[1] }];
        }
        if (bookImages.length > 0) {
          setSelectedImage(bookImages[0]?.url);
          setBooks((prevBooks) => [
            { ...prevBooks[0], media_urls: bookImages },
          ]);
        }
      }
    } catch (err) {
      if (err.response && err.response.status === 419) {
        localStorage.clear();
        navigate("/");
      } else {
        setError("Error fetching book data. Please check your token.");
        console.error("Fetch books error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {   
      const response = await axiosInstance.get(
        `${config.API_URL}/common/get-book-reviews?book_id=${book_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const fetchedReviews = response.data.reviews;
      setReviews(fetchedReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError("Error fetching reviews. Please try again.");
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchReviews();
  }, [book_id]);

  const handleImageClick = (url) => {
    setSelectedImage(url);
  };

  const handleLike = async (bookId) => {
    try {
      const response = await axiosInstance.post(
        `${config.API_URL}/s/like-book?book_id=${bookId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response?.data?.message === "Liked!") {
        const updatedLikes = { ...likedBooks, [bookId]: true };
        setLikedBooks(updatedLikes);
        localStorage.setItem("likedBooks", JSON.stringify(updatedLikes));

        setBooks((prev) =>
          prev.map((book) =>
            book.book_id === bookId
              ? { ...book, total_likes: book.total_likes + 1 }
              : book
          )
        );
      } else if (response?.data?.message === "Disliked!") {
        const updatedLikes = { ...likedBooks, [bookId]: false };
        setLikedBooks(updatedLikes);
        localStorage.setItem("likedBooks", JSON.stringify(updatedLikes));

        setBooks((prev) =>
          prev.map((book) =>
            book.book_id === bookId
              ? { ...book, total_likes: book.total_likes - 1 }
              : book
          )
        );
      }
    } catch (error) {
      console.error("Error processing like/dislike action:", error);
      alert("Unable to process your request.");
    }
  };

  const handleRequestBook = async () => {
    const bookRequestData = {
      user_id: user_id,
      book_id: books[0]?.book_id,
      no_of_copies: "1",
    };

    try {
      await axiosInstance.post(
        `${config.API_URL}/s/request-book`,
        bookRequestData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSnackbar({
        open: true,
        message: "Book requested successfully!",
        severity: "success",
      });
      setOpenDialog(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message;
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
      setOpenDialog(false);
    }
  };
  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleReviewSubmit = async () => {
    const reviewData = {
      user_id,
      book_id: books[0]?.book_id,
      rating,
      message: reviewMessage,
    };

    try {
      const response = await axiosInstance.post(
        `${config.API_URL}/s/post-book-review`,
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

  return (
    <>
      <TopPart
        title="Displayed Books"
        linkPath="/welcome"
        dropdownOptions={[
          { value: "1", label: "All Books" },
          { value: "2", label: "Most Liked Books" },
          { value: "3", label: "New Books" },
          { value: "4", label: "History" },
        ]}
        defaultDropdownValue="1"
        showButton={false}
      />
      {loading ? (
        <SkeletonLoader />
      ) : (
        <>
          <div className="flex px-6 gap-6 flex-col md:flex-row lg:flex-row">
            {/* Left-side images */}
            <div className="p-4 bg-white shadow-md rounded-md w-full sm:w-full md:w-full lg:w-1/3 fade-in">
              {books.length > 0 ? (
                <>
                  <div className="flex flex-row gap-4 justify-center">
                    {books[0]?.media_urls?.map((image, index) => (
                      <div
                        key={image.media_id}
                        onClick={() => handleImageClick(image.url)}
                        className={`cursor-pointer w-20 h-20 object-cover border ${
                          selectedImage === image.url
                            ? "border-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        <img
                          src={image.url}
                          alt={`book thumbnail ${index}`}
                          className="w-full h-full "
                        />
                      </div>
                    ))}
                  </div>
                  {selectedImage && (
                    <div className="mt-4">
                      <img
                        src={selectedImage}
                        alt="book preview"
                        className="w-72 h-80 mx-auto"
                      />
                    </div>
                  )}
                </>
              ) : (
                <p className="sm:text-2xl text-sm m-auto"> &#128522; No Book Image yet.</p>
              )}
            </div>

            {/* Right-side panel with preview + details */}
            <div className="bg-white p-4 sm:px-6 px-2 shadow-md rounded-md w-full sm:w-full md:w-full lg:w-2/3 fade-in">
              {books.length > 0 && (
                <div className="">
                  <div className="flex flex-col sm:flex-row justify-between">
                    <div>
                      <h2
                        className="text-4xl font-semibold text-black"
                        style={{ fontFamily: "Playfair Display, serif" }}
                      >
                        {books[0]?.book_name || "N/A"}
                      </h2>
                      <span className="italic opacity-55">
                        {books[0]?.genre || "N/A"}
                      </span>
                      <p className="text-xl">
                        by {books[0]?.author_name || "N/A"}
                      </p>
                    </div>

                    <div>
                      <button
                        onClick={handleDialogOpen}
                        className="bg-gradient-to-r from-blue-300 to-red-300 text-black font-semibold py-2 px-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 mt-4 sm:text-white"
                      >
                        Want this Book?
                      </button>
                    </div>
                  </div>

                  <ReadMoreComponent />

                  {/* review section  */}
                  <div className="flex flex-col gap-7 mt-12 ">
                    <button
                      onClick={() => setOpenReviewDialog(true)}
                      className="ml-auto bg-gradient-to-r from-blue-300 to-red-300 text-black sm:text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 mt-4 flex justify-center align-middle items-center"
                    >
                      <MdAdd className="font-extrabold text-2xl" />
                      Add Yours
                    </button>
                    <div className="flex flex-col gap-5 h-auto max-h-80 overflow-auto custom-scrollbar slide-in">
                      {reviews.length > 0 ? (
                        reviews.map((review) => (
                          <div
                            key={review.review_id}
                            className="sm:p-4 p-1 border rounded-lg shadow-lg flex flex-col sm:flex-row sm:gap-5 gap-0 text-black"
                          >
                            <div className="flex justify-center sm:justify-start">
                              <img
                                src={
                                  review.profile_image ||
                                  localStorage.getItem("profileImage")
                                }
                                alt=""
                                className="h-16 w-16 sm:h-16 sm:w-20 rounded-full shadow-lg"
                              />
                            </div>
                            <div className="flex flex-col w-full sm:p-0 p-3">
                              <div className="flex flex-col sm:flex-row justify-between">
                                <div>
                                  <strong className="text-lg sm:text-base">
                                    {review.message}
                                  </strong>
                                  <p className="text-sm sm:text-base">
                                    {review.first_name} {review.last_name}
                                  </p>
                                  <span className="text-xs sm:text-sm text-gray-500 flex items-center ml-0 sm:ml-auto  break-words">
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
                                  <span className="text-xs sm:text-sm text-gray-500 flex items-center  ml-0 sm:ml-auto">
                                    <FormatTime dateString={review.createdAt} />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="sm:text-2xl text-sm m-auto"> &#128522; No reviews yet for this book.</p>
                      )}
                    </div>
                  </div>

                  {/* Book Info Card */}
                  <div className="bg-white border rounded-lg shadow-md p-4 flex flex-col sm:flex-row gap-8 mt-10 slide-in">
                    <div className="flex items-center gap-2">
                      <EventAvailableIcon className="text-blue-700" />
                      <div>
                        <p className="text-sm font-semibold text-gray-700">
                          Available Copies
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {books[0]?.available_copies || "0"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleLike(books[0].book_id)}>
                        {likedBooks[books[0]?.book_id] ? (
                          <FavoriteIcon className="text-red-600" />
                        ) : (
                          <FavoriteBorderIcon className="text-red-600" />
                        )}
                      </button>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">
                          Total Likes
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {books[0]?.total_likes || "0"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

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

          {/* Confirmation Dialog */}
          <StyledDialog
            open={openDialog}
            onClose={handleDialogClose}
            Width="sm"
            maxWidth="sm" TransitionComponent={Slide}
    direction="up"
          >
            <DialogTitle className="text-xl font-semibold text-center bg-[#142534] text-white">
              Confirm Request
            </DialogTitle>
            <DialogContent className="mt-4 text-xl overflow-auto">
              Are you sure you want to Add this book <br /> in your borrowing
              List?
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
                onClick={handleRequestBook}
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
        </>
      )}
    </>
  );
};

export default BookDetail;
