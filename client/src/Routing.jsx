// Routing.jsx
import React,{useEffect} from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./Pages/fullpages/Login";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Home from "./Pages/Sidebarpages/dashboard/Home";
import Members from "./Pages/Sidebarpages/member/Members";
import Books from "./Pages/Sidebarpages/books/Books";
import Bookreq from "./Pages/Sidebarpages/getRequestLib/BookReq";
import BorrowingLib from "./Pages/Sidebarpages/BorrowingListLib/BorrowingLib";
import BorrowingUser from "./Pages/UserLogin/BorrowingListUser/BorrowingUser";
import Paymentdetails from "./Pages/Sidebarpages/payment/Paymentdetails";
import DisplayBook from "./Pages/UserLogin/DisplayBooks/DisplayBook";
import BookDetail from "./Pages/UserLogin/DisplayBooks/BookDetail";
import Profile from "./Pages/fullpages/Profile";
import MemberProfile from "./Pages/Sidebarpages/member/MemberProfile";
import Settings from "./components/Settings";
import ScrollToTopButton from "./ScrollToTopButton";
import WelcomePage from "./Pages/fullpages/WelcomePage";
import Review from "./Pages/Sidebarpages/reviewSection/Review";
import ContactPage from "./Pages/Sidebarpages/ContactUs/ContactPage";
import LibContact from "./Pages/Sidebarpages/ContactUs/LibContact";

const Layout = ({ children }) => (
  <>
    <ProtectedRoute>
      <Header className="bg-[#142534]"/>
      <div className="flex w-full">
        <Sidebar />
        <div className="flex-1 divnayan">
          <div className="bg-[#142534] ">
            <div className="p-4 sm:p-3 md:p-8 bg-[#f4f8fb] rounded-tl-[30px] min-h-screen">
              {children}
            </div>
          </div>
        </div>
      </div>
      <ScrollToTopButton />
    </ProtectedRoute>
  </>
);



// if(localStorage.getItem("profileImage") == "null"){
//   localStorage.setItem("profileImage", "https://www.aiscribbles.com/img/variant/large-preview/18614/?v=1972e3")
// }


const ProtectedRoute = ({ children }) => {
  const sessiontoken = sessionStorage.getItem("jwt_token");
  return sessiontoken ? children : <Navigate to="/" />;
};




export default function RouterPath() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
       
         <Route
          path="/welcome"
          element={
            <Layout>
              <WelcomePage className="bg-[#f4f8fb]" />
            </Layout>
          }
        />
        <Route
          path="/home"
          element={
            <Layout>
              <Home className="bg-[#f4f8fb]" />
            </Layout>
          }
        />
        <Route
          path="/settings"
          element={
            <Layout>
              <Settings className="bg-[#f4f8fb]" />
            </Layout>
          }
        />
        <Route
          path="/members"
          element={
            <Layout>
              <Members className="bg-[#f4f8fb]" />
            </Layout>
          }
        />
        <Route
          path="/books"
          element={
            <Layout>
              <Books className="bg-[#f4f8fb]" />
            </Layout>
          }
        />
        <Route
          path="/reqbooks"
          element={
            <Layout>
              <Bookreq className="bg-[#f4f8fb]" />
            </Layout>
          }
        />
        <Route
          path="/Borrowinglistlibrarian"
          element={
            <Layout>
              <BorrowingLib className="bg-[#f4f8fb]" />
            </Layout>
          }
        />
        <Route
          path="/Borrowinglistuser"
          element={
            <Layout>
              <BorrowingUser className="bg-[#f4f8fb]" />
            </Layout>
          }
        />
        <Route
          path="/paymentdetails"
          element={
            <Layout>
              <Paymentdetails className="bg-[#f4f8fb]" />
            </Layout>
          }
        />
        <Route
          path="/Bookshow"
          element={
            <Layout>
              <DisplayBook className="bg-[#f4f8fb]" />
            </Layout>
          }
        />
        <Route
          path="/bookdetailbyid/:book_id"
          element={
            <Layout>
              <BookDetail className="bg-[#f4f8fb]" />
            </Layout>
          }
        />
        <Route
          path="/profile"
          element={
            <Layout>
              <Profile className="bg-[#f4f8fb]" />
            </Layout>
          }
        />
        <Route
          path="/memberdetail/:user_id"
          element={
            <Layout>
              <MemberProfile className="bg-[#f4f8fb]" />
            </Layout>
          }
        />
        <Route
          path="/reviews"
          element={
            <Layout>
              <Review className="bg-[#f4f8fb]" />
            </Layout>
          }
        />
        <Route
          path="/contactus"
          element={
            <Layout>
              <ContactPage className="bg-[#f4f8fb]" />
            </Layout>
          }
        />
        <Route
          path="/contactpage"
          element={
            <Layout>
              <LibContact className="bg-[#f4f8fb]" />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}
