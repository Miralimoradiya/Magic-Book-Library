// DateRangeFilter.jsx
import React, { useState, useRef, useEffect } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function DateRangeFilter({ onApplyDateFilter, cssClass }) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectionRange, setSelectionRange] = useState({
    startDate: null,
    endDate: null,
    key: "selection",
  });

  const datePickerRef = useRef(null);
  const [screenSize, setScreenSize] = useState("desktop");

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handleDateChange = (ranges) => {
    setSelectionRange(ranges.selection);
  };

  const handleApplyFilter = () => {
    if (selectionRange.startDate && selectionRange.endDate) {
      const formattedStartDate = formatDate(selectionRange.startDate);
      const formattedEndDate = formatDate(selectionRange.endDate);

      onApplyDateFilter({
        stDate: formattedStartDate,
        endDate: formattedEndDate,
      });
    }
    setShowDatePicker(false);
  };

  const formatDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = (date.getMonth() + 1).toString().padStart(2, "0");
    const dd = date.getDate().toString().padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target)
      ) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth <= 300) {
        setScreenSize("small-mobile");
      } else if (window.innerWidth <= 576) {
        setScreenSize("samsungse");
      } else if (window.innerWidth <= 576) {
        setScreenSize("mobile");
      } else if (window.innerWidth <= 768) {
        setScreenSize("tablet");
      } else if (window.innerWidth <= 1200) {
        setScreenSize("fullscreen");
      } else {
        setScreenSize("desktop");
      }
    };

    checkScreenSize(); 
    window.addEventListener("resize", checkScreenSize); 

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  return (
    <div ref={datePickerRef} style={{ position: "relative" }} className="text-black">
      <button
        onClick={toggleDatePicker}
        className="p-2 border border-[#142534] rounded-full text-base w-[150px] bg-white"
      >
        Date Range
      </button>

      {showDatePicker && (
        <div
          className={`${cssClass || ""} ${
            screenSize === "small-mobile"
              ? "left-0"
              : screenSize === "samsungse"
              ? "left-0"
              : screenSize === "mobile"
              ? "-right-72"
              : screenSize === "tablet"
              ? "-right-60"
              : screenSize === "tablet"
              ? "-right-56"
              : "-right-36"
          }`}
          style={{
            position: "absolute",
            zIndex: 1,
            maxWidth:
              screenSize === "small-mobile"
                ? "130%"
                : screenSize === "samsungse"
                ? "180%"
                : screenSize === "mobile"
                ? "340%"
                : screenSize === "tablet"
                ? "400%"
                : screenSize === "fullscreen"
                ? "300%"
                : "1000px",
            overflowX: "auto",
          }}
        >
          <DateRangePicker
            onChange={handleDateChange}
            showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            months={2}
            ranges={[selectionRange]}
            direction="horizontal"
          />
          <div className="flex flex-col items-center bg-white pl-5 pb-3 w-full -mt-1">
            <button
              onClick={handleApplyFilter}
              className="p-1 px-4 rounded-full bg-blue-500 text-white"
            >
              Apply Filter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
