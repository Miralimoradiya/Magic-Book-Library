// TestimonialSlider.jsx
import React, { useState } from "react";
import Slider from "react-slick";
import { ImQuotesLeft } from "react-icons/im";
import { MdAdd } from "react-icons/md";
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
import SnackbarComponent from "../SnackbarComponent";
import { axiosInstance } from "../../../../utils/constants/api";
import config from "../../../../utils/config/index";
import FormatTime from "../FormatTime";
import FormatDate from "../FormatDate";
const StyledDialog = styled(Dialog)({
  "& .MuiDialog-paper": { borderRadius: "20px" },
});

const settings = {
  speed: 500,
  focusOnSelect: true,
  infinite: true,
  centerPadding: "60px",
  slidesToShow: 3,
  speed: 500,
  autoplay: true,
  autoplaySpeed: 3000,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 1,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
      },
    },
    {
        breakpoint: 300,
        settings: {
          slidesToShow: 1,
        },
      },
  ],
};

const TestimonialSlider = ({ testimonials }) => {
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

  const resetForm = () => {
    setRating(1);
    setReviewMessage("");
  };

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
      resetForm();
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
    <div className="mt-12">
      <div className="text-center max-w-xl mx-auto">
        <h1 className="text-2xl md:text-5xl font-bold mb-2 text-gray-600">
          What people are saying.
        </h1>
        <h3 className="text-xl font-light">
          don't trust on us but trust on this feedbacks.
        </h3>
        <div className="text-center">
          <span className="inline-block w-1 h-1 rounded-full bg-indigo-500 ml-1"></span>
          <span className="inline-block w-3 h-1 rounded-full bg-indigo-500 ml-1"></span>
          <span className="inline-block w-40 h-1 rounded-full bg-indigo-500"></span>
          <span className="inline-block w-3 h-1 rounded-full bg-indigo-500 ml-1"></span>
          <span className="inline-block w-1 h-1 rounded-full bg-indigo-500 ml-1"></span>
        </div>
        <div className="flex flex-col gap-7 mb-5">
          <button
            onClick={() => setOpenReviewDialog(true)}
            className="mx-auto bg-gradient-to-r from-blue-300 to-red-300 text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 mt-4 flex justify-center align-middle items-center"
          >
            <MdAdd className="font-extrabold text-2xl" />
            Add Yours
          </button>
        </div>
      </div>
    </div>
    <div>
      <Slider {...settings}>
        {testimonials.map((testimonial, index) => (
          <div key={index}>
            <figure className="relative rounded-2xl bg-white p-6 ml-0 sm:ml-4 h-96 sm:h-auto">
              <ImQuotesLeft className="absolute left-6 fill-slate-100 text-2xl sm:text-7xl" />
              <blockquote className="relative">
                <p className="text-lg tracking-tight text-slate-900 max-h-14 h-14 overflow-auto custom-scrollbar">
                  {testimonial.message}
                </p>
                <p className="flex flex-col justify-start sm:justify-between">
                  <span className="text-xs sm:text-sm text-gray-500 flex items-center ml-0 sm:ml-auto">
                    <FormatDate dateString={testimonial.createdAt} />
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500 flex items-center ml-0 sm:ml-auto">
                    <FormatTime dateString={testimonial.createdAt} />
                  </span>
                </p>
              </blockquote>
              <figcaption className="relative flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 pt-6">
                <div className="text-center sm:text-left">
                  <div className="font-display text-md text-slate-900 w-24 sm:w-full break-words">
                    {testimonial.first_name} {testimonial.last_name}
                  </div>
                  <div className="mt-1 text-sm text-slate-500">
                    <p className="whitespace-normal break-words w-24 sm:w-full">{testimonial.email}</p>
                  </div>
                </div>
                <div className="overflow-hidden rounded-full bg-slate-50 mt-4 sm:mt-0">
                  <img
                    alt={testimonial.name}
                    src={
                      testimonial.profile_image ||
                      localStorage.getItem("profileImage")
                    }
                    className="h-14 w-14 object-cover"
                    loading="lazy"
                    width="56"
                    height="56"
                  />
                </div>
              </figcaption>
            </figure>
          </div>
        ))}
      </Slider>
    </div>

    {/* Review Dialog */}
    <StyledDialog
      open={openReviewDialog}
      onClose={() => {
        setOpenReviewDialog(false);
        resetForm(); 
      }}
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
          onClick={() => {
            setOpenReviewDialog(false);
            resetForm();  // Reset the form when dialog is canceled
          }}
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
  </>
  );
};

export default TestimonialSlider;
