// TopPart.jsx
import React from "react";
import { Link } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import img1 from "../../assets/Header/Group 564.png"; 
import AddIcon from '@mui/icons-material/Add';

const TopPart = ({
  title,
  rightContent,
  onBackClick,
  linkPath = "/home",
  dropdownOptions = [],
  defaultDropdownValue = "",
  buttonText = "Add",
  onButtonClick = () => {},
  showButton = true,
}) => {
  const profileImage = localStorage.getItem("profileImage") || img1;

  return (
      <div className="flex flex-col md:flex-row sm:flex-col justify-between items-center mb-9">
        <div className="flex flex-col md:flex-row  items-start md:items-center mb-4 md:mb-0 ">
          <h1>
            <Link
              to={linkPath}
              className="flex items-center text-lg m-0 text-[#333]"
              onClick={onBackClick}
            >
              <div className="flex items-center ">
                <ArrowBackIosIcon className="text-xl align-middle" />
                <img
                    src={profileImage && profileImage !== "null" ? profileImage : "https://www.aiscribbles.com/img/variant/large-preview/18614/?v=1972e3"}
                  alt="Logo"
                  className="h-10 w-10 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-125 "
                />
              </div>
              <div className="ml-2 ">
                <p className="text-[#142534] opacity-100 text-2xl">{title}</p>
                <p className="text-[#6d737c] text-sm">
                  {localStorage.getItem("email")} ({localStorage.getItem("role")})
                </p>
              </div>
            </Link>
          </h1>
        </div>
    
        <div className="flex items-center gap-5 flex-col md:flex-row">
          {/* Dropdown */}
          {dropdownOptions.length > 0 && (
            <select className="p-2 border border-[#142534] rounded-full text-base w-[150px] md:w-[180px] bg-white text-black">
              {dropdownOptions.map((option, index) => (
                <option 
                  key={index}
                  value={option.value}
                  selected={option.value === defaultDropdownValue}
                >
                  {option.label}
                </option>
              ))}
            </select>
          )}
    
          {/* Button */}
          {showButton && (
            <div
              className="flex items-center justify-center w-[190px] bg-[#142534] rounded-full pt-2 pb-2 pl-3 pr-0 text-white cursor-pointer relative transition-all duration-300 ease-in-out transform hover:scale-105 "
              onClick={onButtonClick}
            >
              <button className="absolute top-1 left-2 bg-white rounded-full w-[45px] h-[30px] cursor-pointer ">
                <AddIcon className="text-black text-2xl" />
              </button>
              <span className="ml-7">{buttonText}</span>
            </div>
          )}
        </div>
      </div>
    
  );
};

export default TopPart;
