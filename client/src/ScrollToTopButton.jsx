// ScrollToTopButton.jsx
import React, { useState, useEffect } from "react";
import { GoMoveToTop } from "react-icons/go";
const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    isVisible && (
      <button
        onClick={scrollToTop}
        className="slide-in fixed bottom-5 right-5 text-2xl font-bold p-2 bg-[#142534] text-white rounded-full cursor-pointer shadow-lg z-50 transition-all duration-300 ease-in-out transform hover:scale-125 hover:shadow-2xl hover:shadow-black"
        aria-label="Scroll to top"
      >
        <GoMoveToTop />
      </button>
    )
  );
};

export default ScrollToTopButton;
