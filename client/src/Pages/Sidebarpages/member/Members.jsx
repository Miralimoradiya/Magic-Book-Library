// Members.jsx
import React, { useEffect, useState } from "react";
import MemberTable from "./MemberTable";
import MemberDialogue from "./MemberDialogue";
import SnackbarComponent from "../../../components/resusable/SnackbarComponent";
import TopPart from "../../../components/resusable/toppart";
import config from "../../../../utils/config/index";
import { axiosInstance } from "../../../../utils/constants/api";

export default function Members() {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [newCustomer, setNewCustomer] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phoneno: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [sortField, setSortField] = useState("first_name");
  const [sortOrder, setSortOrder] = useState("asc");

  const fetchCustomers = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${config.API_URL}/l/get-users?limit=10&offset=${offset}&sortField=${sortField}|${sortOrder}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        }
      );
      const fetchedCustomers = response.data.data;
      setCustomers((prev) => [...prev, ...fetchedCustomers]);
      if (fetchedCustomers.length < 10) {
        setHasMore(false);
      } else {
        setOffset((prev) => prev + 1);
      }
    } catch (err) {
      setError("Error fetching customer data. Please check your token.");
      console.error("Fetch customers error:", err);
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
    setCustomers([]);
    setHasMore(true);
  };
  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      setError("Please login first.");
      return;
    }
    setOffset(0);
    setCustomers([]);
    setHasMore(true);
    fetchCustomers();
  }, [sortField, sortOrder]);

  useEffect(() => {
    if (loading || !hasMore) return;
    const handleScroll = (e) => {
      const bottom =
        e.target.documentElement.scrollHeight ===
        e.target.documentElement.scrollTop +
          e.target.documentElement.clientHeight;
      if (bottom) {
        fetchCustomers();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading, hasMore]);

  const handleSnackbar = (message, severity = "success") =>
    setSnackbar({ open: true, message, severity });

  const handleDialogOpen = (customer = null) => {
    if (!customer) {
      setNewCustomer({
        first_name: "",
        last_name: "",
        email: "",
        phoneno: "",
        password: "",
      });
    } else {
      setEditingCustomer(customer);
      setNewCustomer({
        first_name: customer.first_name,
        last_name: customer.last_name,
        email: customer.email,
        phoneno: customer.phoneno,
        password: "",
      });
    }
    setOpenDialog(true);
  };

  const createCustomer = async () => {
    const token = localStorage.getItem("jwt_token");
    const customerWithAction = {
      ...newCustomer,
      action: "create",
    };
    try {
      const { data } = await axiosInstance.post(
        `${config.API_URL}/l/create-user`,
        customerWithAction,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newCustomerWithDefaults = {
        user_id: data.userId,
        first_name: newCustomer.first_name,
        last_name: newCustomer.last_name,
        email: newCustomer.email,
        phoneno: newCustomer.phoneno,
        paid_dues: 0,
        left_dues: 0,
        total_dues: 0,
      };
      setCustomers((prevCustomers) => [
        newCustomerWithDefaults,
        ...prevCustomers,
      ]);
      console.log("Created Customer:", data);
      handleSnackbar("New customer added successfully!");
      setOpenDialog(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message;
      handleSnackbar(errorMessage, "error");
      console.error(err);
    }
  };

  const updateCustomer = async () => {
    const token = localStorage.getItem("jwt_token");
    if (!editingCustomer || !editingCustomer.user_id) {
      handleSnackbar("Missing user ID for update", "error");
      return;
    }
    const { password, ...customerWithoutPassword } = newCustomer;
    const customerWithAction = {
      ...customerWithoutPassword,
      action: "update",
      userId: editingCustomer.user_id,
    };
    try {
      const { data } = await axiosInstance.post(
        `${config.API_URL}/l/create-user`,
        customerWithAction,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedCustomer = {
        ...editingCustomer,
        ...newCustomer,
      };
      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer.user_id === updatedCustomer.user_id
            ? updatedCustomer
            : customer
        )
      );
      handleSnackbar("Customer updated successfully!");
      setOpenDialog(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message;
      handleSnackbar(errorMessage, "error");
      console.error(err);
    }
  };

  const handleSubmit = () => {
    if (editingCustomer) {
      updateCustomer();
    } else {
      createCustomer();
    }
  };
  const handleDelete = async (id) => {
    const token = localStorage.getItem("jwt_token");
    try {
      await axiosInstance.delete(`${config.API_URL}/l/delete-user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomers(customers.filter((customer) => customer.user_id !== id));
      handleSnackbar("Customer deleted successfully!");
      fetchCustomers();
    } catch (err) {
      const errorMessage = err.response?.data?.message;
      handleSnackbar(errorMessage, "error");
      console.error(err);
    }
  };

  const dropdownOptions = [
    { value: "1", label: "Option 1" },
    { value: "2", label: "Option 2" },
    { value: "3", label: "Option 3" },
  ];
  return (
    <>
      <TopPart
        title="Customer List"
        linkPath="/home"
        dropdownOptions={dropdownOptions}
        defaultDropdownValue="1"
        buttonText="Add Customer"
        onButtonClick={() => {
          setNewCustomer({
            first_name: "",
            last_name: "",
            email: "",
            phoneno: "",
            password: "",
          });
          setEditingCustomer(null);
          setOpenDialog(true);
        }}
        showButton={true}
      />
      {error && <p className="text-red-500">{error}</p>}
      <MemberTable
        customers={customers}
        onEdit={handleDialogOpen}
        onDelete={handleDelete}
        sortField={sortField}
        sortOrder={sortOrder}
        handleSort={handleSort}
      />
      <MemberDialogue
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSubmit={handleSubmit}
        newCustomer={newCustomer}
        handleInputChange={(e) =>
          setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value })
        }
        editingCustomer={editingCustomer}
      />
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
