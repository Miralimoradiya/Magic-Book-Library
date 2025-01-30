// MemberDialogue.jsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Grid,
  Slide,
} from "@mui/material";
import { styled } from "@mui/system";
import config from "../../../../utils/config/index";
import { axiosInstance } from "../../../../utils/constants/api";
const StyledDialog = styled(Dialog)({
  "& .MuiDialog-paper": { borderRadius: "20px" },
});

export default function MemberDialogue({
  open,
  onClose,
  onSubmit,
  newCustomer,
  handleInputChange,
  editingCustomer,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [emailValidationError, setEmailValidationError] = useState("");

  useEffect(() => setIsEditing(Boolean(editingCustomer)), [editingCustomer]);

  useEffect(() => {
    if (!open) {
      setErrors({});
      resetForm();
      setEmailValidationError("");
    }
  }, [open]);

  const handleDialogClose = () => {
    onClose();
  };
  const resetForm = () => {
    newCustomer.first_name = "";
    newCustomer.last_name = "";
    newCustomer.email = "";
    newCustomer.phoneno = "";
    newCustomer.password = "";
  };
  const validate = (fieldName) => {
    const errors = {};
    if (fieldName === "first_name" || fieldName === "all") {
      if (!newCustomer.first_name) {
        errors.first_name = "First Name is required";
      } else if (newCustomer.first_name.length > 10) {
        errors.first_name = "First Name must be 10 characters or less";
      }
    }
    if (fieldName === "last_name" || fieldName === "all") {
      if (!newCustomer.last_name) {
        errors.last_name = "Last Name is required";
      } else if (newCustomer.last_name.length > 10) {
        errors.last_name = "Last Name must be 10 characters or less";
      }
    }
    if (fieldName === "email" || fieldName === "all") {
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (!newCustomer.email) {
        errors.email = "Email is required";
      } else if (!emailPattern.test(newCustomer.email)) {
        errors.email = "Invalid email format";
      }
    }
    if (fieldName === "phoneno" || fieldName === "all") {
      if (!newCustomer.phoneno) {
        errors.phone = "Phone is required";
      } else if (!/^\d+$/.test(newCustomer.phoneno)) {
        errors.phone = "Phone number must contain only numbers";
      } else if (newCustomer.phoneno.length !== 10) {
        errors.phone = "Phone number must be exactly 10 digits long";
      }
    }

    if ((fieldName === "password" || fieldName === "all") && !editingCustomer) {
      if (!newCustomer.password) {
        errors.password = "Password is required";
      }
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEmailValidation = async () => {
    const token = localStorage.getItem("jwt_token");
    const email = newCustomer.email;

    if (email) {
      try {
        const response = await axiosInstance.get(
          `${config.API_URL}/l/validate-data/?type=user&fieldName=email&fieldValue=${email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.valid) {
          setEmailValidationError("");
        } else {
          setEmailValidationError("");
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          setEmailValidationError(error.response.data.message);
        } else {
          setEmailValidationError(
            "An unknown error occurred during email validation."
          );
        }
      }
    }
  };
  const handleSubmitWithValidation = () => {
    if (validate("all") && !emailValidationError) {
      onSubmit();
      setErrors({});
    }
  };

  return (
    <StyledDialog
      open={open}
      onClose={() => {
        handleDialogClose();
      }}
      maxWidth="sm"
      fullWidth TransitionComponent={Slide}
    direction="up"
    >
      <DialogTitle className="text-xl font-semibold text-center bg-[#142534] text-white">
        {isEditing ? "Edit Customer" : "Add New Customer"}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} marginY="10px">
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              name="first_name"
              value={newCustomer.first_name}
              onChange={handleInputChange}
              onBlur={() => validate("first_name")}
              fullWidth
              margin="normal"
              error={Boolean(errors.first_name)}
              helperText={errors.first_name}
              InputProps={{ sx: { borderRadius: 20, borderColor: "gray" } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              name="last_name"
              value={newCustomer.last_name}
              onChange={handleInputChange}
              onBlur={() => validate("last_name")}
              fullWidth
              margin="normal"
              error={Boolean(errors.last_name)}
              helperText={errors.last_name}
              InputProps={{ sx: { borderRadius: 20, borderColor: "gray" } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              name="email"
              value={newCustomer.email}
              onChange={handleInputChange}
              onBlur={() => {
                validate("email");
                handleEmailValidation();
              }}
              fullWidth
              error={Boolean(errors.email) || Boolean(emailValidationError)}
              helperText={errors.email || emailValidationError}
              InputProps={{ sx: { borderRadius: 20, borderColor: "gray" } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Phoneno"
              name="phoneno"
              value={newCustomer.phone}
              onChange={handleInputChange}
              onBlur={() => validate("phoneno")}
              fullWidth
              error={Boolean(errors.phone)}
              helperText={errors.phone}
              InputProps={{ sx: { borderRadius: 20, borderColor: "gray" } }}
            />
          </Grid>
          <Grid item xs={12}>
            {!isEditing && (
              <TextField
                label="Password"
                name="password"
                type="password"
                value={newCustomer.password || ""}
                onChange={handleInputChange}
                onBlur={() => validate("password")}
                fullWidth
                margin="normal"
                error={Boolean(errors.password)}
                helperText={errors.password}
                InputProps={{ sx: { borderRadius: 20, borderColor: "gray" } }}
              />
            )}
          </Grid>
        </Grid>
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
          onClick={handleSubmitWithValidation}
          color="primary"
          sx={{
            borderRadius: 20,
            minWidth: 120,
            backgroundColor: "#142534",
            color: "white",
          }}
        >
          {isEditing ? "Update" : "Submit"}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
}
