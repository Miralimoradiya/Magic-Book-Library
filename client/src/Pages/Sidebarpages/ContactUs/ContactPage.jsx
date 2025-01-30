// ContactPage.jsx
import React, { useState, useEffect } from "react";
import config from "../../../../utils/config/index";
import { axiosInstance } from "../../../../utils/constants/api";
import TopPart from "../../../components/resusable/TopPart";
import SnackbarComponent from "../../../components/resusable/SnackbarComponent"
import { FaRegAddressCard } from "react-icons/fa6";
import { TbDeviceLandlinePhone } from "react-icons/tb";
import { CiMobile3 } from "react-icons/ci";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Typography,
} from "@mui/material";
import { MdPhoneCallback } from "react-icons/md";

export default function ContactPage() {
  const token = localStorage.getItem("jwt_token");
  const userRole = localStorage.getItem("role");
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    subject: "",
    city: "",
    state: "",
    country: "",
    enquiry_type: "",
    phone_number: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "",
  });

  // Fetching country data
  useEffect(() => {
    axiosInstance
      .get("https://restcountries.com/v3.1/all")
      .then((response) => {
        const countryOptions = response.data.map((country) => ({
          value: country.name.common,
          label: country.name.common,
        }));
        setCountries(countryOptions);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });
  }, []);

  // Fetching state data based on selected country
  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
    setStates([]);
    setCities([]);

    if (selectedOption) {
      setFormData({
        ...formData,
        country: selectedOption.target.value,
      });

      axiosInstance
        .post("https://countriesnow.space/api/v0.1/countries/states", {
          country: selectedOption.target.value,
        })
        .then((response) => {
          const stateOptions = response.data.data.states.map((state) => ({
            value: state.name,
            label: state.name,
          }));
          setStates(stateOptions);
        })
        .catch((error) => {
          console.error("Error fetching states:", error);
          setStates([]);
        });
    }
  };

  // Fetching city data based on selected state and country
  const handleStateChange = (selectedOption) => {
    setSelectedState(selectedOption);
    setCities([]);
    if (selectedOption && selectedCountry) {
      setFormData({
        ...formData,
        state: selectedOption.target.value,
      });

      axiosInstance
        .post("https://countriesnow.space/api/v0.1/countries/state/cities", {
          country: selectedCountry.target.value,
          state: selectedOption.target.value,
        })
        .then((response) => {
          if (response.data && response.data.data) {
            const cityOptions = response.data.data.map((city) => ({
              value: city,
              label: city,
            }));
            setCities(cityOptions);
          }
        })
        .catch((error) => {
          console.error("Error fetching cities:", error);
        });
    }
  };

  const CustomSelect = ({
    label,
    name,
    value,
    onChange,
    options,
    required,
    onBlur,
  }) => {
    return (
      <FormControl fullWidth required={required}>
        <InputLabel>{label}</InputLabel>
        <Select
          label={label}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          sx={{ borderRadius: 20, borderColor: "gray" }}
        >
          {options.map((option, index) => (
            <MenuItem key={index} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {errors[name] && (
          <div className="text-red-500 text-sm pl-4">{errors[name]}</div>
        )}
      </FormControl>
    );
  };

  const enquiryOptions = [
    { value: "", label: "Select enquiry type" },
    { value: "library queries", label: "Library Queries" },
    { value: "book queries", label: "Book Queries" },
  ];

  const validate = (fieldName) => {
    const errors = {};
    if (fieldName === "user_name" || fieldName === "all") {
      if (!formData.user_name) {
        errors.user_name = "User name is required";
      }
    }
    if (fieldName === "user_email" || fieldName === "all") {
      if (!formData.user_email) {
        errors.user_email = "Email is required";
      }
    }
    if (fieldName === "phone_number" || fieldName === "all") {
      if (!formData.phone_number) {
        errors.phone_number = "Phone number is required";
      }
    }
    if (fieldName === "city" || fieldName === "all") {
      if (!formData.city) {
        errors.city = "City is required";
      }
    }
    if (fieldName === "state" || fieldName === "all") {
      if (!formData.state) {
        errors.state = "State is required";
      }
    }
    if (fieldName === "country" || fieldName === "all") {
      if (!formData.country) {
        errors.country = "Country is required";
      }
    }
    if (fieldName === "enquiry_type" || fieldName === "all") {
      if (!formData.enquiry_type) {
        errors.enquiry_type = "Enquiry type is required";
      }
    }
    if (fieldName === "subject" || fieldName === "all") {
      if (!formData.subject) {
        errors.subject = "Subject is required";
      }
    }
    if (fieldName === "message" || fieldName === "all") {
      if (!formData.message) {
        errors.message = "Message is required";
      }
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!validate("all")) {
      setLoading(false);
      return;
    }
    try {
      const response = await axiosInstance.post(
        `${config.API_URL}/s/submit-inquiry`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("🚀 ~ handleSubmit ~ response:", response)
      const res = response?.data?.message;
      setSnackbar({
        open: true,
        message: res,
        severity: "success",
      });

      setFormData({
        user_name: "",
        user_email: "",
        subject: "",
        city: "",
        state: "",
        country: "",
        enquiry_type: "",
        phone_number: "",
        message: "",
      });
    } catch (error) {
      console.log(error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message;
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <MdPhoneCallback />,
      title: "Technical support",
      content: (
        <>
          magicbooklibrary@gmail.com
          <br />
          1-600-890-4567
        </>
      ),
    },
    {
      icon: <FaRegAddressCard />,
      title: "Address",
      content: (
        <>
          Palladium Plaza,
          <br />
          VIP Road, Vesu, Surat, Gujarat 395007
        </>
      ),
    },
    {
      icon: <TbDeviceLandlinePhone />,
      title: "Land Line",
      content: "(0421) 431 2030",
    },
    {
      icon: <CiMobile3 />,
      title: "Mobile",
      content: "+91 123456789",
    },
  ];

  const dropdownOptions = [
    { value: "1", label: "Option 1" },
    { value: "2", label: "Option 2" },
    { value: "3", label: "Option 3" },
  ];

  return (
    <div className="mb-96">
      <TopPart
        title="Book List"
        linkPath={userRole === "librarian" ? "/home" : "/welcome"}
        dropdownOptions={dropdownOptions}
        defaultDropdownValue="1"
        showButton={false}
      />
      <section className="mb-32 ">
        <div
          id="map"
          className="relative h-screen overflow-hidden bg-cover bg-[50%] bg-no-repeat fade-in hidden sm:block"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.2064608044902!2d72.79313257430941!3d21.144180383806177!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be053fa13e5542b%3A0x67b4b567726b12a4!2sPalladium%20Plaza!5e0!3m2!1sen!2sin!4v1737014176182!5m2!1sen!2sin"
            width="100%"
            height="480"
            className="rounded-lg "
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        <div className=" mt-40 sm:mt-0 text-black">
          <div className="block rounded-lg bg-[hsla(0,0%,100%,0.8)] px-6 py-6 backdrop-blur-[30px] -mt-[40%] border border-gray-300 shadow-2xl slide-in">
            <div className="flex flex-col md:flex-col lg:flex-row ">
              <form onSubmit={handleSubmit}>
                <div className="p-0 sm:p-10 ">
                  <h1 className="font-bold mb-2 font-serif text-xl text-center">
                    Know More About Magic Book Library
                  </h1>
                  <p className="mb-3 text-center opacity-65">
                    <span className="text-red-400">*</span> Indicates Mandatory
                    Fields
                  </p>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Name"
                        name="user_name"
                        value={formData.user_name}
                        onChange={handleChange}
                        onBlur={() => validate("user_name")}
                        fullWidth
                        error={Boolean(errors.user_name)}
                        helperText={errors.user_name}
                        InputProps={{
                          sx: { borderRadius: 20, borderColor: "gray" },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Email"
                        name="user_email"
                        type="email"
                        value={formData.user_email}
                        onChange={handleChange}
                        fullWidth
                        onBlur={() => validate("user_email")}
                        error={Boolean(errors.user_email)}
                        helperText={errors.user_email}
                        InputProps={{
                          sx: { borderRadius: 20, borderColor: "gray" },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Phone Number"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        fullWidth
                        onBlur={() => validate("phone_number")}
                        error={Boolean(errors.phone_number)}
                        helperText={errors.phone_number}
                        InputProps={{
                          sx: { borderRadius: 20, borderColor: "gray" },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomSelect
                        label="Country"
                        name="country"
                        value={formData.country}
                        onChange={handleCountryChange}
                        options={countries}
                        onBlur={() => validate("country")}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomSelect
                        label="State"
                        name="state"
                        value={formData.state}
                        onChange={handleStateChange}
                        options={states}
                        onBlur={() => validate("state")}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomSelect
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        options={cities}
                        onBlur={() => validate("city")}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomSelect
                        label="Enquiry Type"
                        name="enquiry_type"
                        value={formData.enquiry_type}
                        onChange={handleChange}
                        options={enquiryOptions}
                        required
                        onBlur={() => validate("enquiry_type")}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        fullWidth
                        onBlur={() => validate("subject")}
                        error={Boolean(errors.subject)}
                        helperText={errors.subject}
                        InputProps={{
                          sx: { borderRadius: 20, borderColor: "gray" },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={4}
                        onBlur={() => validate("message")}
                        error={Boolean(errors.message)}
                        helperText={errors.message}
                        InputProps={{
                          sx: { borderRadius: 7, borderColor: "gray" },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        sx={{
                          borderRadius: 20,
                          backgroundColor: "#142534",
                          color: "white",
                        }}
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={loading}
                      >
                        {loading ? "Submitting..." : "Submit"}
                      </Button>
                    </Grid>
                  </Grid>
                </div>
              </form>
              <div className="flex flex-col md:flex-col lg:flex-col mt-6 sm:mt-12 gap-14 ">
                {contactInfo.map(({ icon, title, content }, index) => (
                  <div className="flex items-start" key={index}>
                    <div className="shrink-0">
                      <div className="inline-block rounded-md bg-sky-200 p-4 text-primary cursor-pointer">
                        <div className="transition-all duration-300 ease-in-out transform hover:scale-125">
                          {icon}
                        </div>
                      </div>
                    </div>
                    <div className="ml-6 grow overflow-y-auto">
                      <p className="mb-2 font-bold">{title}</p>
                      <p className="text-sm text-neutral-500 break-words">{content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <SnackbarComponent
      open={snackbar.open}
      onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      message={snackbar.message}
      severity={snackbar.severity}
    />
    </div>
  );
}
