// PaymentDialog.jsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Slide,
} from "@mui/material";
import { styled } from "@mui/system";
import config from "../../../../utils/config/index";
import { axiosInstance } from "../../../../utils/constants/api";
import SnackbarComponent from "../../../components/resusable/SnackbarComponent";

const StyledDialog = styled(Dialog)({
  "& .MuiDialog-paper": { borderRadius: "20px" },
});

export default function PaymenDialog({
  open,
  onClose,
  onSubmit,
  selectedCustomer,
}) {
  const [formData, setFormData] = useState({
    amount: selectedCustomer?.due_amount || "",
    cardNumber: "",
    cardExpirationMonth: "",
    cardExpirationYear: "",
    cvv: "",
    name: selectedCustomer?.first_name || "",
  });
  const [errors, setErrors] = useState({
    amount: "",
    cardNumber: "",
    cardExpiration: "",
    cvv: "",
    name: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (selectedCustomer) {
      setFormData((prevData) => ({
        ...prevData,
        amount: selectedCustomer.due_amount,
        name: selectedCustomer.first_name,
      }));
    }
  }, [selectedCustomer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validate = (fieldName) => {
    const newErrors = {};

    if (fieldName === "amount" || fieldName === "all") {
      if (!formData.amount || formData.amount <= 0) {
        newErrors.amount = "Amount is required and should be greater than 0.";
      }
    }

    if (fieldName === "cardNumber" || fieldName === "all") {
      const cardNumberRegex = /^\d{16}$/;
      if (!formData.cardNumber) {
        newErrors.cardNumber = "Card number is required.";
      } else if (!cardNumberRegex.test(formData.cardNumber)) {
        newErrors.cardNumber = "Card number contain only numbers.";
      } else if (formData.cardNumber.length !== 16) {
        newErrors.cvv = "Card number must be 16 digits.";
      }
    }

    if (fieldName === "cardExpiration" || fieldName === "all") {
      if (!formData.cardExpirationMonth || !formData.cardExpirationYear) {
        newErrors.cardExpiration = "Card expiration date is required.";
      }
    }

    if (fieldName === "cvv" || fieldName === "all") {
      if (!formData.cvv) {
        newErrors.cvv = "CVV is required.";
      } else if (formData.cvv.length !== 3 && formData.cvv.length !== 4) {
        newErrors.cvv = "CVV must be 3 or 4 digits.";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate("all")) {
      const cardExpiration = `${formData.cardExpirationMonth}${formData.cardExpirationYear}`;
      const paymentDetails = {
        borrow_id: selectedCustomer.borrower_id,
        amount: parseFloat(formData.amount) || 0,
        cardNumber: formData.cardNumber,
        cardExpiration: cardExpiration,
        cvv: formData.cvv,
        name: formData.name,
      };

      try {
        const response = await axiosInstance.post(
          `${config.API_URL}/s/process-dues`,
          paymentDetails,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
            },
          }
        );
        if (response.status === 200) {
          console.log("Payment successful:", response.data);
          onSubmit(paymentDetails);
          onClose();
          setSnackbar({
            open: true,
            message: "Payment successful!",
            severity: "success",
          });
        } else {
          setSnackbar({
            open: true,
            message: "Payment failed. Please try again.",
            severity: "error",
          });
        }
      } catch (error) {
        console.error("Error submitting payment:", error);
        const errorMessage = error.response?.data?.message || "Payment failed.";
        // Show error Snackbar
        setSnackbar({
          open: true,
          message: errorMessage,
          severity: "error",
        });
      }
    }
  };

  const months = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) =>
    (currentYear + i).toString().slice(-2)
  );
  return (
    <>
      <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth TransitionComponent={Slide}
    direction="up">
        <DialogTitle className="text-center bg-[#142534] text-white">
          Payment Process
        </DialogTitle>
        <DialogContent className="my-2">
          {/* account name and all  */}
          <div className="flex flex-row justify-between items-center p-6">
            <div className="flex flex-col items-start">
              <span className="text-lg font-semibold ">
                Account Holder :
                <span className="text-xl font-bold mt-2"> {formData.name}</span>
              </span>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-lg font-semibold ">
                Amount to Pay :
                <span className="text-xl font-bold"> ${formData.amount}</span>
              </span>
            </div>
          </div>

          <div className="flex flex-row gap-9">
            {/* div 1  */}
            <div className="w-[500px]">
              <div className="relative">
                <TextField
                  label="Card Number"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={(e) => {
                    if (e.target.value.length <= 16) {
                      handleInputChange(e);
                    }
                  }}
                  onBlur={() => validate("cardNumber")}
                  fullWidth
                  margin="normal"
                  error={Boolean(errors.cardNumber)}
                  helperText={errors.cardNumber}
                  inputProps={{ maxLength: 16 }}
                />
              </div>

              <div className="flex space-x-4">
                <FormControl
                  fullWidth
                  margin="normal"
                  error={Boolean(errors.cardExpiration)}
                  helperText={errors.cardExpiration}
                >
                  <InputLabel>Expiration Month</InputLabel>
                  <Select
                    name="cardExpirationMonth"
                    value={formData.cardExpirationMonth}
                    onChange={handleInputChange}
                    onBlur={() => validate("cardExpiration")}
                  >
                    {months.map((month) => (
                      <MenuItem key={month} value={month}>
                        {month}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl
                  fullWidth
                  margin="normal"
                  error={Boolean(errors.cardExpiration)}
                  helperText={errors.cardExpiration}
                >
                  <InputLabel>Expiration Year</InputLabel>
                  <Select
                    name="cardExpirationYear"
                    value={formData.cardExpirationYear}
                    onChange={handleInputChange}
                    onBlur={() => validate("cardExpiration")}
                  >
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <TextField
                label="CVV"
                name="cvv"
                value={formData.cvv}
                onChange={handleInputChange}
                onBlur={() => validate("cvv")}
                fullWidth
                margin="normal"
                error={Boolean(errors.cvv)}
                helperText={errors.cvv}
                inputProps={{ maxLength: 4 }}
              />
            </div>
            {/* div 2  */}
            <div className="relative w-[380px] h-[220px] bg-gradient-to-r from-blue-600 via-blue-800 to-blue-900 text-white p-4 rounded-xl shadow-lg mt-4">
              <div className="text-md font-bold">
                <div className="text-sm font-normal">Cardholder</div>
                <div className="mb-8">{formData.name}</div>
                <div className=" text-2xl font-semibold">
                  {formData.cardNumber ? (
                    formData.cardNumber.replace(/(\d{4})(?=\d)/g, "$1 ")
                  ) : (
                    <span className="text-3xl">**** **** **** ****</span>
                  )}
                </div>
                <div className=" absolute right-6 bottom-2 text-sm">
                  <div className="align-bottom">
                    {formData.cardExpirationMonth && formData.cardExpirationYear
                      ? `${formData.cardExpirationMonth}/${formData.cardExpirationYear}`
                      : "MM/YY"}
                  </div>

                  <div>{formData.cvv ? "CVV: ***" : "CVV"}</div>
                </div>
              </div>
            </div>
          </div>
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
              minWidth: 170,
              backgroundColor: "#142534",
              color: "white",
            }}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={handleSubmit}
            sx={{
              marginRight: 2,
              borderRadius: 20,
              minWidth: 170,
              backgroundColor: "#142534",
              color: "white",
            }}
          >
            Process Payment
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
}
