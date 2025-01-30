// Sidebar.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import PersonIcon from "@mui/icons-material/Person";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import ClassIcon from "@mui/icons-material/Class";
import { TbBooks } from "react-icons/tb";
import PaidIcon from "@mui/icons-material/Paid";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import HomeIcon from "@mui/icons-material/Home";
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { FaQuestion } from "react-icons/fa";

const SidebarItem = ({ to, icon, label, index, activeIndex, onClick }) => (
  <Link to={to}>
    <li
      className={`flex items-center space-x-3 px-5 py-3 text-white  ${activeIndex === index ? "bg-[#f4f8fb] rounded-tl-[20px] rounded-bl-[20px] px-7 py-4 active relative" : ""}`}
      onClick={() => onClick(index)}
    >
      {icon}
      <span className="sidebar-text">{label}</span>
    </li>
  </Link>
);

const Sidebar = () => {
  const [activeIndex, setActiveIndex] = useState(() => {
    const storedRole = localStorage.getItem("role");
    return storedRole === "librarian"
      ? parseInt(localStorage.getItem("activeIndex") || 0)
      : storedRole === "student"
      ? parseInt(localStorage.getItem("activeIndex") || 7)
      : 0;
  });
  const [role, setRole] = useState(null);

  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, []);

  const handleItemClick = (index) => {
    setActiveIndex(index);
    localStorage.setItem("activeIndex", index);
  };

  const librarianItems = [
    { to: "/home", icon: <IoHome />, label: "Dashboard", index: 0 },
    { to: "/members", icon: <PersonIcon />, label: "Members", index: 1 },
    { to: "/books", icon: <MenuBookIcon />, label: "Books", index: 2 },
    { to: "/reqbooks", icon: <TbBooks />, label: "Book Request", index: 3 },
    { to: "/Borrowinglistlibrarian", icon: <ClassIcon />, label: "Borrowing List", index: 4 },
    { to: "/paymentdetails", icon: <PaidIcon />, label: "Transaction Details", index: 5 },
    { to: "/contactpage", icon: <FaQuestion />, label: "Contact Details", index: 6 },
  ];

  const studentItems = [
    { to: "/welcome", icon: <HomeIcon />, label: "Home", index: 7 },
    { to: "/books", icon: <MenuBookIcon />, label: "Books", index: 8 },
    { to: "/reqbooks", icon: <TbBooks className="text-2xl" />, label: "Book Requests", index: 9 },
    { to: "/Borrowinglistuser", icon: <BookmarksIcon />, label: "Borrowing List", index: 10 },
    { to: "/Bookshow", icon: <LocalLibraryIcon />, label: "Displayed Books", index: 11 },
    { to: "/paymentdetails", icon: <PaidIcon />, label: "Transaction Details", index: 12 },
    { to: "/contactus", icon: <FaQuestion />, label: "Contact Us", index: 13 },
  ];

  const commonItems = [
    { to: "/reviews", icon: <QuestionAnswerIcon />, label: "Reviews", index: 14 },
  ];

  return (
    <div className="sidebar h-screen sticky overflow-y-hidden top-0">
      <nav className="h-full ">
        <ul className="list-none bg-[#142534] pt-[70px] w-[200px] space-y-4 min-h-full">
          {role === "librarian" &&
            librarianItems.map((item) => (
              <SidebarItem
                key={item.index}
                to={item.to}
                icon={item.icon}
                label={item.label}
                index={item.index}
                activeIndex={activeIndex}
                onClick={handleItemClick}
              />
            ))}
          {role === "student" &&
            studentItems.map((item) => (
              <SidebarItem
                key={item.index}
                to={item.to}
                icon={item.icon}
                label={item.label}
                index={item.index}
                activeIndex={activeIndex}
                onClick={handleItemClick}
              />
            ))}
          {commonItems.map((item) => (
            <SidebarItem
              key={item.index}
              to={item.to}
              icon={item.icon}
              label={item.label}
              index={item.index}
              activeIndex={activeIndex}
              onClick={handleItemClick}
            />
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
