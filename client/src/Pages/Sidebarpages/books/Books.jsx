// Books.jsx
import React, { useEffect, useState } from "react";
import BooksTable from "./BooksTable";
import { useNavigate } from "react-router-dom";
import AddDialog from "./AddDialog";
import SnackbarComponent from "../../../components/resusable/SnackbarComponent";
import { axiosInstance } from "../../../../utils/constants/api";
import TopPart from "../../../components/resusable/toppart";
import config from "../../../../utils/config/index";
import BooksDialogss from "./BooksDialog";
export default function Members() {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [newBook, setNewBook] = useState({
    book_name: "",
    author_name: "",
    available_copies: "",
    genre: "",
    publishedAt: "",
    mediaFiles: [],
  });
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [sortField, setSortField] = useState("book_name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [bookRequestData, setBookRequestData] = useState({
    user_id: localStorage.getItem("UserId") || "",
    book_id: "",
    no_of_copies: "",
  });
  const [copiesValidation, setCopiesValidation] = useState("");

  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");

  const fetchBooks = async () => {
    const token = localStorage.getItem("jwt_token");
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${config.API_URL}/common/get-books?limit=10&offset=${offset}&sortField=${sortField}|${sortOrder}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response);
      const fetchedBooks = response.data.books;
      setBooks((prev) => [...prev, ...fetchedBooks]);
      if (fetchedBooks.length < 10) {
        setHasMore(false);
      } else {
        setOffset((prev) => prev + 1);
      }
    } catch (err) {
      setError("Error fetching books data. Please check your token.");
      console.error("Fetch books error:", err);
      if (err.response && err.response.status === 419) {
        localStorage.clear();
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    const newSortOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newSortOrder);
    setOffset(0);
    setBooks([]);
    setHasMore(true);
  };
  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) return setError("Please login first.");
    setOffset(0);
    setBooks([]);
    setHasMore(true);
    fetchBooks();
  }, [sortField, sortOrder]);

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

  const handleEditDialogOpen = (book) => {
    setEditingBook(book);
    setNewBook({
      book_name: book.book_name,
      author_name: book.author_name,
      no_of_copies: book.no_of_copies,
      genre: book.genre,
      publishedAt: book.publishedAt,
      mediaFiles: book.mediaFiles,
      book_id: book.book_id,
    });
    setOpenDialog(true);
  };

  const handleAddDialogOpen = () => {
    setEditingBook(null);
    setNewBook({
      book_name: "",
      author_name: "",
      no_of_copies: "",
      genre: "",
      publishedAt: "",
      mediaFiles: [],
    });
    if (userRole === "librarian") {
      setOpenDialog(true);
    } else if (userRole === "student") {
      setOpenDialog(true);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setEditingBook(null);
    setNewBook({
      book_name: "",
      author_name: "",
      available_copies: "",
      genre: "",
      publishedAt: "",
      mediaFiles: [],
    });
    setBookRequestData({
      user_id: localStorage.getItem("UserId") || "",
      book_id: "",
      no_of_copies: "",
    });
  };

  const handleInputChange = (e) => {
    setBookRequestData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setNewBook((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddBook = async (formData) => {
    const token = localStorage.getItem("jwt_token");
    formData.append("action", "create");
    try {
      const { data } = await axiosInstance.post(
        `${config.API_URL}/l/create-book`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const newBookWithDefaults = {
        book_id: data.book_id,
        book_name: newBook.book_name,
        author_name: newBook.author_name,
        no_of_copies: newBook.no_of_copies,
        available_copies: newBook.no_of_copies,
        genre: newBook.genre,
      };

      setBooks((prevBooks) => [newBookWithDefaults, ...prevBooks]);
      setSnackbar({
        open: true,
        message: "Book added successfully!",
        severity: "success",
      });
      handleDialogClose();
    } catch (err) {
      const errorMessage = err.response?.data?.message;
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
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
  const handleEditBook = async () => {
    const token = localStorage.getItem("jwt_token");

    const payload = {
      action: "update",
      book_id: editingBook.book_id,
      updates: [
        { field: "book_name", value: newBook.book_name },
        { field: "author_name", value: newBook.author_name },
        { field: "no_of_copies", value: newBook.no_of_copies },
        { field: "genre", value: newBook.genre },
      ],
    };

    try {
      const { data } = await axiosInstance.post(
        `${config.API_URL}/l/create-book`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setBooks((prev) =>
        prev.map((book) =>
          book.book_id === editingBook.book_id
            ? {
                ...book,
                no_of_copies: newBook.no_of_copies,
                book_name: newBook.book_name,
                author_name: newBook.author_name,
                genre: newBook.genre,
              }
            : book
        )
      );

      setSnackbar({
        open: true,
        message: "Book updated successfully!",
        severity: "success",
      });

      handleDialogClose();
    } catch (err) {
      const errorMessage = err.response?.data?.message;
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("jwt_token");
    try {
      await axiosInstance.delete(
        `${config.API_URL}/l/delete-book?book_id=${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBooks(books.filter((book) => book.book_id !== id));
      setSnackbar({
        open: true,
        message: "Book deleted successfully!",
        severity: "success",
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };
  const dropdownOptions = [
    { value: "1", label: "Option 1" },
    { value: "2", label: "Option 2" },
    { value: "3", label: "Option 3" },
  ];

  const handleCopiesValidation = async () => {
    if (!editingBook) return; 
    const token = localStorage.getItem("jwt_token");
    const no_of_copies = newBook.no_of_copies;
    const book_id = newBook.book_id;
      try {
        const response = await axiosInstance.post(
          `${config.API_URL}/l/validate-book-copies`, 
          {
            book_id: book_id,  
            no_of_copies: no_of_copies 
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data && response.data.message) {
          setCopiesValidation("");  
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          setCopiesValidation(error.response.data.message);
        } else {
          setCopiesValidation("An unknown error occurred during copies validation.");
        }
      }
    };
  
  return (
    <>
      <TopPart
        title="Book List"
        linkPath={userRole === "librarian" ? "/home" : "/welcome"}
        dropdownOptions={dropdownOptions}
        defaultDropdownValue="1"
        buttonText={userRole === "librarian" ? "Add Book" : "Request Book"}
        onButtonClick={handleAddDialogOpen}
        showButton={true}
      />
      {/* Error Message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Member Table */}
      <BooksTable
        books={books}
        onEdit={handleEditDialogOpen}
        onDelete={handleDelete}
        sortField={sortField}
        sortOrder={sortOrder}
        handleSort={handleSort}
      />

      {userRole === "librarian" && (
        <AddDialog
          open={openDialog}
          onClose={handleDialogClose}
          onSubmit={editingBook ? handleEditBook : handleAddBook}
          newBook={newBook}
          handleInputChange={handleInputChange}
          editingBook={editingBook}
          handleCopiesValidation={handleCopiesValidation}
          copiesValidation={copiesValidation}
        />
      )}

      {userRole !== "librarian" ? (
        <BooksDialogss
          open={openDialog}
          onClose={handleDialogClose}
          onSubmit={userRole === "student" ? handleRequestBook : handleAddBook}
          bookRequestData={bookRequestData}
          handleInputChange={handleInputChange}
        />
      ) : null}

      <SnackbarComponent
        open={snackbar.open}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        message={snackbar.message}
        severity={snackbar.severity}
      />

      {loading && (
        <div className="flex justify-center mt-4">
          Loading...
        </div>
      )}
    </>
  );
}
