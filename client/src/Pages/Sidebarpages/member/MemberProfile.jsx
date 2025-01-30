// MemberProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SnackbarComponent from "../../../components/resusable/SnackbarComponent";
import TopPart from "../../../components/resusable/TopPart";
import config from "../../../../utils/config/index";
import { axiosInstance } from "../../../../utils/constants/api";
import TableComponent from "../../../components/resusable/TableComponent";

export default function MemberProfile() {
  const { user_id } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentView, setCurrentView] = useState("full_profile");
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneno, setPhoneno] = useState("");

  const fetchUserData = async () => {
    try {
      const response = await axiosInstance.get(
        `${config.API_URL}/l/get-user/${user_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        }
      );
      const data = response.data.data;
      setUserData(data);
      setFirstName(data.first_name);
      setLastName(data.last_name);
      setEmail(data.email);
      setPhoneno(data.phoneno);
    } catch (err) {
      setError("Error fetching user data.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUserData();
  }, [user_id]);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveClick = async () => {
    try {
      const updatedUserData = {
        userId: user_id,
        first_name: firstName,
        last_name: lastName,
        email: email,
        phoneno: phoneno,
        action: "update",
      };
      await axiosInstance.post(
        `${config.API_URL}/l/create-user`,
        updatedUserData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        }
      );
      setIsEditing(false);
      setUserData(updatedUserData);
      fetchUserData();
    } catch (err) {
      setError("Error updating user data.");
      console.error("Error:", err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const dropdownOptions = [
    { value: "1", label: "All status" },
    { value: "2", label: "Pending" },
    { value: "3", label: "Approved" },
    { value: "4", label: "Declined" },
  ];

  const handleButtonClick = (view) => {
    setCurrentView(view);
  };

  const pastBorrowingsColumns = [
    { key: "book_title", label: "Book Title" },
    { key: "no_of_copies", label: "No. of Copies" },
    { key: "borrow_date", label: "Borrow Date" },
    { key: "due_date", label: "Due Date" },
    { key: "release_date", label: "Release Date" },
    { key: "due_amount", label: "Due Amount" },
    {
      key: "is_due_paid",
      label: "Is Due Paid",
      render: (item) => (item.is_due_paid ? "Yes" : "No"),
    },
  ];

  const currentBorrowingsColumns = [
    { key: "book_title", label: "Book Title" },
    { key: "no_of_copies", label: "No. of Copies" },
    { key: "release_date", label: "Release Date" },
    { key: "due_amount", label: "Due Amount" },
  ];

  const bookRequestsColumns = [
    { key: "book_title", label: "Book Title" },
    {
      key: "isApproved",
      label: "Approval Status",
      render: (item) => item.isApproved,
    },
  ];

  const transactionsColumns = [
    { key: "transaction_date", label: "Transaction Date" },
    { key: "book_name", label: "Book Name" },
    { key: "amount", label: "Amount" },
    { key: "card_number", label: "Card Number" },
    {
      key: "is_successfull",
      label: "Success",
      render: (item) => (item.is_successfull ? "Yes" : "No"),
    },
  ];

  return (
    <>
      <TopPart
        title="User Details"
        linkPath="/members"
        dropdownOptions={dropdownOptions}
        defaultDropdownValue="1"
        showButton={false}
      />
      <div className="flex flex-col md:flex-row gap-4 w-full">
        {/* Left Side ----------------------------------------------------------------------------------------------------------*/}
        <div className="w-full md:w-[30%] text-center rounded-lg shadow-2xl overflow-hidden bg-white fade-in">
          {/* profile pic     and        profile details  */}
          <div className="flex justify-center pt-6">
            <img
              src={
                userData.profile_image ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-GD3XzXDHYm1rFxbZa8ZA0UyLaTKSZJm-oQ&s"
              }
              alt="Profile"
              className="h-32 w-32 rounded-full object-cover shadow-2xl"
            />
          </div>
          <div className="mt-4">
            <div className="flex flex-col">
              <strong className="text-2xl font-semibold text-gray-900">
                {userData.first_name} {userData.last_name}
              </strong>
              <p className="text-sm text-gray-500 opacity-75 md:text-md sm:text-xs">
                {userData.email}
              </p>
              <p className="text-sm text-gray-500 opacity-75">
                {userData.phoneno}
              </p>
            </div>
            {/* navigation button  */}
            <div className="my-6 space-y-3 px-5 slide-in">
              <button
                onClick={() => handleButtonClick("full_profile")}
                className={`w-full py-3 text-black rounded-lg font-serif border-1 border-gray-400 ${
                  currentView === "full_profile"
                    ? "bg-blue-600 text-white border-white"
                    : "hover:bg-gray-300"
                }`}
              >
                Full Profile
              </button>
              <button
                onClick={() => handleButtonClick("past_borrowings")}
                className={`w-full py-3 text-black rounded-lg font-serif border-1 border-gray-400  ${
                  currentView === "past_borrowings"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                Past Borrowings
              </button>
              <button
                onClick={() => handleButtonClick("current_borrowings")}
                className={`w-full py-3 text-black rounded-lg font-serif border-1 border-gray-400  ${
                  currentView === "current_borrowings"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                Current Borrowings
              </button>
              <button
                onClick={() => handleButtonClick("book_requests")}
                className={`w-full py-3 text-black rounded-lg font-serif border-1 border-gray-400  ${
                  currentView === "book_requests"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                Book Requests
              </button>
              <button
                onClick={() => handleButtonClick("transactions")}
                className={`w-full py-3 text-black rounded-lg font-serif border-1 border-gray-400  ${
                  currentView === "transactions"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                Transactions
              </button>
            </div>
          </div>
        </div>

        {/* Right Side ----------------------------------------------------------------------------------------------------------------------------------------------*/}
        <div className="rounded-lg shadow-2xl overflow-hidden bg-white w-full md:w-[70%] p-6 fade-in">
          {/* full profile  */}
          {currentView === "full_profile" && (
            <div className="text-center">
              <div className="flex flex-row justify-end">
                {!isEditing ? (
                  <button
                    className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:opacity-90 transition-all duration-300"
                    onClick={handleEditClick}
                  >
                    Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={handleSaveClick}
                    className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:opacity-90 transition-all duration-300"
                  >
                    Save
                  </button>
                )}
              </div>

              {/* profile pic     and        profile details  */}
              <div className="flex justify-center pt-6">
                <img
                  src={
                    userData.profile_image ||
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-GD3XzXDHYm1rFxbZa8ZA0UyLaTKSZJm-oQ&s"
                  }
                  alt="Profile"
                  className="h-32 w-32 rounded-full object-cover shadow-2xl"
                />
              </div>
              {/* profile details  */}
              <div className="flex flex-col text-center space-y-3 mt-6">
                <div>
                  <strong className="text-xs font-semibold text-gray-900 mr-3 sm:text-xl">
                    First Name:
                  </strong>
                  {isEditing ? (
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="text-sm p-2 border rounded"
                    />
                  ) : (
                    <span className="font-serif text-sm sm:text-md text-blue-500">
                      {userData.first_name}
                    </span>
                  )}
                </div>
                <div>
                <strong className="text-xs font-semibold text-gray-900 mr-3 sm:text-xl">
                    Last Name:
                  </strong>
                  {isEditing ? (
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="text-sm p-2 border rounded"
                    />
                  ) : (
                    <span className="font-serif text-sm sm:text-md text-blue-500">
                      {userData.last_name}
                    </span>
                  )}
                </div>
                <div>
                <strong className="text-xs font-semibold text-gray-900 mr-3 sm:text-xl">
                    Email:
                  </strong>
                  {isEditing ? (
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="text-sm p-2 border rounded"
                    />
                  ) : (
                    <span className="font-serif text-sm sm:text-md text-blue-500 ">
                      {userData.email}
                    </span>
                  )}
                </div>
                <div>
                <strong className="text-xs font-semibold text-gray-900 mr-3 sm:text-xl">
                    Phone Number:
                  </strong>
                  {isEditing ? (
                    <input
                      type="text"
                      value={phoneno}
                      onChange={(e) => setPhoneno(e.target.value)}
                      className="text-sm p-2 border rounded"
                    />
                  ) : (
                    <span className="font-serif text-sm sm:text-md text-blue-500">
                      {userData.phoneno}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-10 my-8 sm:gap-4 md:gap-10 bg-[#f4f8fb] shadow-lg rounded-lg p-3">
                <div className="text-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
                  <span className="text-xl font-bold text-blue-700">
                    {userData.total_dues || 0.0}
                  </span>
                  <span className="block text-sm text-gray-600">
                    Total Dues
                  </span>
                </div>
                <div className="text-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
                  <span className="text-xl font-bold text-green-700">
                    {userData.paid_dues || 0.0}
                  </span>
                  <span className="block text-sm text-gray-600">Paid Dues</span>
                </div>
                <div className="text-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
                  <span className="text-xl font-bold text-red-700">
                    {userData.left_dues || 0.0}
                  </span>
                  <span className="block text-sm text-gray-600">Left Dues</span>
                </div>
              </div>

              <div className="my-8 space-y-3">
                <div className="text-xl font-semibold text-gray-900">
                  Borrowing States
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-center sm:justify-between text-sm text-gray-500 flex-wrap">
                    <span>Borrowed Books:</span>
                    <span>{userData.borrowed_books || 0}</span>
                  </div>
                  <div className="flex justify-center sm:justify-between text-sm text-gray-500 flex-wrap">
                    <span>Returned Books:</span>
                    <span>{userData.returned_books || 0}</span>
                  </div>
                  <div className="flex justify-center sm:justify-between text-sm text-gray-500 flex-wrap">
                    <span>Requested Books:</span>
                    <span>{userData.requested_books || 0}</span>
                  </div>
                  <div className="flex justify-center sm:justify-between text-sm text-gray-500 flex-wrap">
                    <span>Approved Books:</span>
                    <span>{userData.approved_books || 0}</span>
                  </div>
                  <div className="flex justify-center sm:justify-between text-sm text-gray-500 flex-wrap">
                    <span>Declined Books:</span>
                    <span>{userData.declined_books || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          {currentView === "past_borrowings" && (
            <>
              <h1 className="text-3xl text-center mt-3 font-serif">
                Past Borrowings{" "}
              </h1>
              <p className="text-2xl text-center mb-7 text-red-400 font-extralight -mt-2">
                {userData.first_name} {userData.last_name}
              </p>
              <TableComponent
                data={userData.past_borrowings_details}
                columns={pastBorrowingsColumns}
              />
            </>
          )}
          {currentView === "current_borrowings" && (
            <>
              <h1 className="text-3xl text-center mt-3 font-serif">
                Current Borrowings
              </h1>
              <p className="text-2xl text-center mb-7 text-red-400 font-extralight -mt-2">
                {userData.first_name} {userData.last_name}
              </p>
              <TableComponent
                data={userData.borrowed_books_details}
                columns={currentBorrowingsColumns}
              />
            </>
          )}
          {currentView === "book_requests" && (
            <>
              <h1 className="text-3xl text-center mt-3 font-serif">
                Book Requests{" "}
              </h1>
              <p className="text-2xl text-center mb-7 text-red-400 font-extralight -mt-2">
                {userData.first_name} {userData.last_name}
              </p>
              <TableComponent
                data={userData.requested_books_details}
                columns={bookRequestsColumns}
              />
            </>
          )}
          {currentView === "transactions" && (
            <>
              <h1 className="text-3xl text-center mt-3 font-serif">
                Transaction Details{" "}
              </h1>
              <p className="text-2xl text-center mb-7 text-red-400 font-extralight -mt-2">
                {userData.first_name} {userData.last_name}
              </p>
              <TableComponent
                data={userData.transaction_details}
                columns={transactionsColumns}
              />
            </>
          )}
        </div>
      </div>

      <SnackbarComponent
        open={error ? true : false}
        message={error}
        severity="error"
      />
    </>
  );
}
