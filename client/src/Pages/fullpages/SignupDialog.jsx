import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  Grid,
  Box,
  Slide,
} from "@mui/material";
import { styled } from "@mui/system";
import { axiosInstance } from "../../../utils/constants/api";
import config from "../../../utils/config/index"
import SnackbarComponent from "../../components/resusable/SnackbarComponent";
import { FaEye, FaEyeSlash } from "react-icons/fa";

// Styled Dialog Component
const StyledDialog = styled(Dialog)(`
  & .MuiDialog-paper {
    border-radius: 20px;
  }
`);

const SignupDialog = ({ open, onClose }) => {
  const [signUpFirstName, setSignUpFirstName] = useState("");
  const [signUpLastName, setSignUpLastName] = useState("");
  const [signUpPhoneNo, setSignUpPhoneNo] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [password, setPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});


  const validate = (fieldName) => {
    const errors = {};

    if (fieldName === "signUpFirstName" || fieldName === "all") {
      if (!signUpFirstName) {
        errors.signUpFirstName = "First name is required";
      }
    }

    if (fieldName === "signUpLastName" || fieldName === "all") {
      if (!signUpLastName) {
        errors.signUpLastName = "Last name is required";
      }
    }

    if (fieldName === "signUpPhoneNo" || fieldName === "all") {
      if (!signUpPhoneNo) {
        errors.signUpPhoneNo = "Phone number is required";
      }
    }

    if (fieldName === "signUpEmail" || fieldName === "all") {
      if (!signUpEmail) {
        errors.signUpEmail = "Email is required";
      }
    }

    if (fieldName === "signUpPassword" || fieldName === "all") {
      if (!signUpPassword) {
        errors.signUpPassword = "Password is required";
      }
    }

    if (fieldName === "signUpConfirmPassword" || fieldName === "all") {
      if (!signUpConfirmPassword) {
        errors.signUpConfirmPassword = "Confirm password is required";
      } else if (signUpPassword !== signUpConfirmPassword) {
        errors.signUpConfirmPassword = "Passwords do not match";
      }
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!validate("all")) {
      setLoading(false);
      return;
    }

    const payload = {
      email: signUpEmail,
      password: signUpPassword,
      confirm_password: signUpConfirmPassword,
      first_name: signUpFirstName,
      last_name: signUpLastName,
      phoneno: signUpPhoneNo,
    };

    try {
      const response = await axiosInstance.post(
        `${config.API_URL}/auth/register`,
        payload
      );
      setSnackbarMessage(response.data.message);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Something went wrong, please try again!";
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    // Reset form fields when the dialog is closed
    if (!open) {
      setSignUpFirstName("");
      setSignUpLastName("");
      setSignUpPhoneNo("");
      setSignUpEmail("");
      setSignUpPassword("");
      setSignUpConfirmPassword("");
      setLoading(false);
      setSnackbarOpen(false);
      setSnackbarMessage("");
      setSnackbarSeverity("success");
      setPassword(false);
      setConfirmPassword(false);
    }
  }, [open]);

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth TransitionComponent={Slide}
    direction="up"
>
      <DialogTitle className="text-xl font-semibold text-center bg-[#142534] text-white">
        Sign Up
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSignup} className="mt-4">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                name="first_name"
                variant="outlined"
                value={signUpFirstName}
                onChange={(e) => setSignUpFirstName(e.target.value)}
                onBlur={() => validate("signUpFirstName")}
                error={Boolean(errors.signUpFirstName)}
                helperText={errors.signUpFirstName}
                fullWidth
                InputProps={{ sx: { borderRadius: 20, borderColor: "gray" } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                variant="outlined"
                value={signUpLastName}
                onChange={(e) => setSignUpLastName(e.target.value)}
                onBlur={() => validate("signUpLastName")}
                error={Boolean(errors.signUpLastName)}
                helperText={errors.signUpLastName}
                fullWidth
                InputProps={{ sx: { borderRadius: 20, borderColor: "gray" } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone Number"
                variant="outlined"
                value={signUpPhoneNo}
                onChange={(e) => setSignUpPhoneNo(e.target.value)}
                onBlur={() => validate("signUpPhoneNo")}
                error={Boolean(errors.signUpPhoneNo)}
                helperText={errors.signUpPhoneNo}
                fullWidth
                InputProps={{ sx: { borderRadius: 20, borderColor: "gray" } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                variant="outlined"
                type="email"
                value={signUpEmail}
                onChange={(e) => setSignUpEmail(e.target.value)}
                onBlur={() => validate("signUpEmail")}
                error={Boolean(errors.signUpEmail)}
                helperText={errors.signUpEmail}
                fullWidth
                InputProps={{ sx: { borderRadius: 20, borderColor: "gray" } }}
              />
            </Grid>

            <Grid item xs={12}>
              <Box position="relative">
                <TextField
                  label="Password"
                  variant="outlined"
                  type={password ? "text" : "password"}
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  onBlur={() => validate("signUpPassword")}
                  error={Boolean(errors.signUpPassword)}
                  helperText={errors.signUpPassword}
                  fullWidth
                  InputProps={{ sx: { borderRadius: 20, borderColor: "gray" } }}
                />
                <Box
                  position="absolute"
                  top={15}
                  right={10}
                  fontSize={23}
                  sx={{ cursor: "pointer" }}
                  onClick={() => setPassword(!password)}
                >
                  {password ? <FaEyeSlash /> : <FaEye />}
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box position="relative">
                <TextField
                  label="Confirm Password"
                  variant="outlined"
                  type={confirmPassword ? "text" : "password"}
                  value={signUpConfirmPassword}
                  onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                  onBlur={() => validate("signUpConfirmPassword")}
                  error={Boolean(errors.signUpConfirmPassword)}
                  helperText={errors.signUpConfirmPassword}
                  fullWidth
                  InputProps={{ sx: { borderRadius: 20, borderColor: "gray" } }}
                />
                <Box
                  position="absolute"
                  top={15}
                  right={10}
                  fontSize={23}
                  sx={{ cursor: "pointer" }}
                  onClick={() => setConfirmPassword(!confirmPassword)}
                >
                  {confirmPassword ? <FaEyeSlash /> : <FaEye />}
                </Box>
              </Box>
            </Grid>
          </Grid>

          <DialogActions
            className="flex flex-col sm:flex-row w-full mt-3 gap-4"
            sx={{
              justifyContent: "center",
            }}
          >
            <Button
              onClick={onClose}
              color="primary"
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
              type="submit"
              color="primary"
              disabled={loading}
              sx={{
                borderRadius: 20,
                minWidth: 120,
                backgroundColor: "#142534",
                color: "white",
              }}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>

      <SnackbarComponent
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </StyledDialog>
  );
};

export default SignupDialog;
