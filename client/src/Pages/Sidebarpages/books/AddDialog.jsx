// Bookdialog.jsx 
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  Slide,
  FormControl,
} from "@mui/material";
import { styled } from "@mui/system";
import config from "../../../../utils/config/index";
import { useDropzone } from "react-dropzone";
import CloseIcon from "@mui/icons-material/Close";
import { axiosInstance } from "../../../../utils/constants/api";

const StyledDialog = styled(Dialog)({
  "& .MuiDialog-paper": { borderRadius: "20px" },
});

export default function AddDialog({
  open,
  onClose,
  onSubmit,
  newBook,
  handleInputChange,
  handleCopiesValidation,
  editingBook,
  copiesValidation
}) {
  const [images, setImages] = useState({
    frontPage: newBook.frontPage || null,
    backPage: newBook.backPage || null,
  });
  const [errors, setErrors] = useState({});
  const [bookValidation, setBookValidation] = useState("");

  useEffect(() => {
    if (!open) {
      setErrors({});
      resetForm();
      setBookValidation("");
    }
  }, [open]);

  const handleDialogClose = () => {
    onClose();
  };

  const resetForm = () => {
    newBook.book_name = "";
    newBook.genre = "";
    newBook.no_of_copies = "";
    newBook.author_name = "";
    setImages({
      frontPage: null,
      backPage: null,
    });
  };

  const validate = (fieldName) => {
    const errors = {};
    if (fieldName === "book_name" || fieldName === "all") {
      if (!newBook.book_name) {
        errors.book_name = "Book Name is required";
      }
    }
    if (fieldName === "genre" || fieldName === "all") {
      if (!newBook.genre) {
        errors.genre = "Genre is required";
      }
    }
    if (fieldName === "no_of_copies" || fieldName === "all") {
      if (!newBook.no_of_copies) {
        errors.no_of_copies = "Number of Copies is required";
      }
    }
    if (fieldName === "author_name" || fieldName === "all") {
      if (!newBook.author_name) {
        errors.author_name = "Author Name is required";
      }
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBookValidation = async () => {
    const token = localStorage.getItem("jwt_token");
    const bookname = newBook.book_name;

    if (bookname) {
      try {
        const response = await axiosInstance.get(
          `${config.API_URL}/l/validate-data/?type=book&fieldName=book_name&fieldValue=${bookname}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.valid) {
          setBookValidation("");
        } else {
          setBookValidation("");
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          setBookValidation(error.response.data.message);
        } else {
          setBookValidation(
            "An unknown error occurred during book name validation."
          );
        }
      }
    }
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("book_name", newBook.book_name);
    formData.append("genre", newBook.genre);
    formData.append("no_of_copies", newBook.no_of_copies);
    formData.append("author_name", newBook.author_name);
    if (images.frontPage) formData.append("mediaFiles", images.frontPage);
    if (images.backPage) formData.append("mediaFiles", images.backPage);

    if (validate("all") && !bookValidation && (!editingBook || !copiesValidation)) {
      onSubmit(formData, images);
      setErrors({});
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length) {
        if (!images.frontPage) {
          setImages((prev) => ({
            ...prev,
            frontPage: acceptedFiles[0],
          }));
          newBook.frontPage = acceptedFiles[0];
        } else if (!images.backPage) {
          setImages((prev) => ({
            ...prev,
            backPage: acceptedFiles[0],
          }));
          newBook.backPage = acceptedFiles[0];
        } else {
          alert("You can only upload 2 images.");
        }
      }
    },
  });

  const onRemoveImage = (imageType) => {
    setImages((prev) => {
      const updatedImages = { ...prev, [imageType]: null };
      return updatedImages;
    });
    newBook[imageType] = null;
  };

  function ImagePreview({ image, onRemove }) {
    if (!image) return null;
    return (
      <div
        style={{
          height: "140px",
          width: "230px",
          backgroundImage: `url(${URL.createObjectURL(image)})`,
          backgroundSize: "cover",
          borderRadius: "10px",
          margin: "5px",
          position: "relative",
        }}
      >
        <button
          onClick={() => {
            console.log("Remove button clicked!");
            onRemove();
          }}
          style={{
            position: "absolute",
            top: "5px",
            right: "5px",
            backgroundColor: "rgba(0,0,0,0.5)",
            color: "white",
            border: "none",
            borderRadius: "50%",
            padding: "5px",
            cursor: "pointer",
          }}
        >
          <CloseIcon />
        </button>
      </div>
    );
  }

  const genreOptions = [
    "Fiction",
    "Romantic",
    "Horror",
    "Children",
    "Comedy",
    "Suspense",
    "Biography",
    "Life",
    "Society",
    "Short stories",
    "History",
    "Drama",
    "Action",
    "Adventure",
    "Mythology",
    "Travel",
    "Religion",
  ]; 

  
  return (
    <StyledDialog
      open={open}
      onClose={handleDialogClose}
      maxWidth="sm"
      fullWidth TransitionComponent={Slide}
    direction="up"
    >
      <DialogTitle className="text-xl font-semibold text-center bg-[#142534] text-white">
        {editingBook ? "Edit Book" : "Add Book"}
      </DialogTitle>
      <DialogContent>
        <div
          {...getRootProps({ className: "dropzone" })}
          className="cursor-pointer h-44 w-full flex items-center justify-center relative overflow-hidden border-2 border-dashed border-gray-300 rounded-lg my-4"
        >
          <input {...getInputProps()} />
          <div>
            {!images.frontPage && !images.backPage && (
              <span className="opacity-40">
                Drag and drop book's front and back page here...
              </span>
            )}
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <ImagePreview
              image={images.frontPage}
              onRemove={() => onRemoveImage("frontPage")}
            />
            <ImagePreview
              image={images.backPage}
              onRemove={() => onRemoveImage("backPage")}
            />
          </div>
        </div>
        <TextField
          label="Book Name"
          name="book_name"
          value={newBook.book_name}
          onChange={handleInputChange}
          onBlur={() => {
            validate("book_name");
            handleBookValidation();
          }}
          fullWidth
          margin="dense"
          error={Boolean(errors.book_name) || Boolean(bookValidation)}
          helperText={errors.book_name || bookValidation}
          InputProps={{ sx: { borderRadius: 20, borderColor: "gray" } }}
        />
        <TextField
          label="Author Name"
          name="author_name"
          value={newBook.author_name}
          onChange={handleInputChange}
          onBlur={() => validate("author_name")}
          fullWidth
          margin="dense"
          error={Boolean(errors.author_name)}
          helperText={errors.author_name}
          InputProps={{ sx: { borderRadius: 20, borderColor: "gray" } }}
        />
        <div className="flex flex-row gap-2">
          <FormControl fullWidth margin="dense" error={Boolean(errors.genre)}>
            <InputLabel>Genre</InputLabel>
            <Select
              label="Genre"
              name="genre"
              value={newBook.genre}
              onChange={handleInputChange}
              onBlur={() => validate("genre")}
              sx={{
                borderRadius: 20,
                borderColor: "gray",
              }}
            >
              {genreOptions.map((genre, index) => (
                <MenuItem key={index} value={genre}>
                  {genre}
                </MenuItem>
              ))}
            </Select>
            {errors.genre && <div className="text-red-500">{errors.genre}</div>}
          </FormControl>

          <TextField
            type="number"
            label="No. of Copies"
            name="no_of_copies"
            value={newBook.no_of_copies}
            onChange={handleInputChange}
            onBlur={() => {
              console.log("Blur event triggered!");
              validate("no_of_copies");     
              handleCopiesValidation();  
              console.log("🚀 ~ copiesValidation:", copiesValidation);
            }}
            fullWidth
            margin="dense"
            error={Boolean(errors.no_of_copies) || Boolean(copiesValidation) } 
          
            helperText={errors.no_of_copies || copiesValidation}  
            InputProps={{ sx: { borderRadius: 20, borderColor: "gray" } }}
          />
        </div>
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          paddingBottom: 4,
        }}
      >
        <Button
          onClick={onClose}
          color="secondary"
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
          onClick={handleSubmit}
          color="primary"
          sx={{
            borderRadius: 20,
            minWidth: 120,
            backgroundColor: "#142534",
            color: "white",
          }}
        >
          {editingBook ? "Update Book" : "Add Book"}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
}
