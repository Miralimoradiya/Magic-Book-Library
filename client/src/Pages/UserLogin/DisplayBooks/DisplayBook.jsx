// DisplayBook.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SnackbarComponent from "../../../components/resusable/SnackbarComponent";
import TopPart from "../../../components/resusable/toppart";
import config from "../../../../utils/config/index";
import { axiosInstance } from "../../../../utils/constants/api";
import BooksDialogss from "../../Sidebarpages/books/BooksDialog";
import NodataBook from "../../../components/resusable/NodataBook";

export default function DisplayBook() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [likedBooks, setLikedBooks] = useState({});
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [bookRequestData, setBookRequestData] = useState({
    user_id: localStorage.getItem("UserId") || "",
    book_id: "",
    no_of_copies: "",
  });
  const navigate = useNavigate();

  const token = localStorage.getItem("jwt_token");

  const fetchBooks = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${config.API_URL}/common/get-books?limit=10&offset=${offset}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const fetchedBooks = response.data.books;
      const initialLikedBooks = {};
      fetchedBooks.forEach((book) => {
        initialLikedBooks[book.book_id] = !!book.isLiked;
      });
      setBooks((prev) => [...prev, ...fetchedBooks]);
      setLikedBooks((prev) => ({ ...prev, ...initialLikedBooks }));
      if (fetchedBooks.length < 10) {
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
      fetchBooks();
    }
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
        setLikedBooks((prev) => ({
          ...prev,
          [bookId]: true,
        }));
        setBooks((prev) =>
          prev.map((book) =>
            book.book_id === bookId
              ? { ...book, total_likes: book.total_likes + 1 }
              : book
          )
        );
      } else if (response?.data?.message === "Disliked!") {
        setLikedBooks((prev) => ({
          ...prev,
          [bookId]: false,
        }));
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
    const token = localStorage.getItem("jwt_token");
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
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setBookRequestData({
      user_id: localStorage.getItem("UserId") || "",
      book_id: "",
      no_of_copies: "",
    });
  };

  useEffect(() => {
    fetchBooks();
  }, []);
  const dropdownOptions = [
    { value: "1", label: "All status" },
    { value: "2", label: "2 Days Ago" },
    { value: "3", label: "7 Days Ago" },
    { value: "4", label: "1 Week Ago" },
  ];
  const getBookImage = (url) => {
    return url;
  };
  return (
    <>
      <TopPart
        title="Displayed Books"
        linkPath="/books"
        dropdownOptions={dropdownOptions}
        defaultDropdownValue="1"
        buttonText="Request Book"
        onButtonClick={() => setOpenDialog(true)}
        showButton={true}
      />

      <BooksDialogss
        open={openDialog}
        onClose={handleDialogClose}
        onSubmit={handleRequestBook}
        bookRequestData={bookRequestData}
        handleInputChange={(e) =>
          setBookRequestData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
          }))
        }
      />

      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-flow-row grid-cols-1 gap-4 screen1880:grid-cols-6 screen1600:grid-cols-5 screen1400:grid-cols-4 lg:grid-cols-4 screen900:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 fade-in">
        {books.length === 0 ? (
          <div className="ml-0 sm:ml-64 sm:w-96">
            <NodataBook noDataMessage="No Books Available" />
          </div>
        ) : (
          books.map((book) => (
            <>
              <div
                key={book.book_id}
                className="bg-white border rounded-lg shadow-md overflow-hidden flex flex-col text-center items-center py-4"
              >
                <div
                  className="book bg-white border rounded-lg overflow-hidden flex flex-col hover:shadow-2xl transition-shadow duration-200"
                  onClick={() => navigate(`/bookdetailbyid/${book.book_id}`)}
                >
                  <div className="cover relative group">
                    <img
                      src={getBookImage(book.url)}
                      alt={book.book_name}
                      className="w-full h-full"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Book Title & Author Info */}
                  <div className="text-center">
                    <h3 className="text-lg font-semibold">{book.book_name}</h3>
                    <p className="text-sm text-gray-600">{book.author_name}</p>
                  </div>
                </div>
                <div className="mt-2 pt-2 flex justify-between w-[80%] text-center items-center">
                  <div className="overflow-hidden">
                    <h3 className="text-md font-semibold text-black">{book.book_name}</h3>
                    <p className="text-xs text-gray-500 overflow-hidden">
                      {book.author_name}
                    </p>
                  </div>

                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => handleLike(book.book_id)}
                      className="transition-all duration-300 ease-in-out transform hover:scale-110"
                    >
                      {likedBooks[book.book_id] ? (
                        <FavoriteIcon className="text-red-600" />
                      ) : (
                        <FavoriteBorderIcon className="text-red-600" />
                      )}
                    </button>
                    <span className="text-sm text-gray-600">
                      {book.total_likes} Likes
                    </span>
                  </div>
                </div>
              </div>
            </>
          ))
        )}
      </div>

      {loading && (
        <div className="flex justify-center items-center w-full ">
          Loading...
        </div>
      )}
      <SnackbarComponent
        open={snackbar.open}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </>
  );
}
