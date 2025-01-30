// Categories.jsx
import React, { useState } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import {
  MdOutlineNavigateNext,
  MdExpandMore,
} from "react-icons/md";
import { axiosInstance } from "../../../../utils/constants/api";
import config from "../../../../utils/config/index";
import { motion, AnimatePresence } from "framer-motion";

const CategorySlider = ({ categories, sliderSettings }) => {
  const [books, setBooks] = useState([]);
  const [showMore, setShowMore] = useState(false);

  const handleCategoryClick = async (category) => {
    const token = localStorage.getItem("jwt_token");

    try {
      const response = await axiosInstance.post(
        `${config.API_URL}/common/get-books-by-genre`,
        { genre: category },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBooks(response.data.books);
      setShowMore(false);
    } catch (error) {
      console.error("Error fetching books for category:", error);
    }
  };

  return (
    <>
      <section className="mt-12 w-[92%] max-w-6xl sm:w-[92%] relative">
        <div className="flex flex-row justify-between items-center px-4 mb-4 flex-wrap">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold">
            Explore Categories
          </h1>
          <Link
            to="/books"
            className="rounded-lg text-black hover:mr-[-8px] transition-all font-serif font-bold"
          >
            <MdOutlineNavigateNext className="text-4xl" />
          </Link>
        </div>
        <div>
          <Slider {...sliderSettings}>
            {categories.map((category, index) => (
              <div key={index} className="w-full">
                <div
                  className="relative mx-2 bg-gray-900 group rounded-xl h-[200px] cursor-pointer"
                  onClick={() => handleCategoryClick(category.name)} 
                >
                  <img
                    className="absolute inset-0 object-cover w-full h-full group-hover:opacity-25 rounded-xl"
                    src={category.imageUrl} 
                    alt={category}
                  />
                  <div className="relative p-5">
                    <div className="mt-40">
                      <div
                        className="transition-all transform 
                        translate-y-8 opacity-0 
                        group-hover:opacity-100 
                        group-hover:-translate-y-24"
                      >
                        <div className="p-2 text-center h-full">
                          <p
                            className="text-lg font-serif font-bold cursor-pointer text-white"
                            // onClick={() => handleCategoryClick(category)}
                          >
                           {category.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center text-xl">{category.name}</div>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* Book get by id */}
      <section className="mt-10 w-[90%] max-w-6xl sm:w-[90%] relative ">
        <AnimatePresence>
          {books.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              key="books-section"
            >
              <div className="flex flex-row justify-between items-center px-3 mb-4 flex-wrap">
                {books[0].genre && (
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold">
                    {books[0].genre}
                  </h1>
                )}
                {books.length > 4 && (
                  <div
                    onClick={() => setShowMore((prev) => !prev)}
                    className="text-black font-serif font-bold cursor-pointer transition-all duration-300"
                  >
                    <div
                      className={`transform transition-all duration-300 ${
                        showMore ? "rotate-180" : "rotate-0"
                      }`}
                    >
                      {showMore ? (
                        <MdExpandMore className="text-4xl" />
                      ) : (
                        <MdExpandMore className="text-4xl" />
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                {books.slice(0, showMore ? books.length : 4).map((book) => (
                  <div
                    key={book.book_id}
                    className="bg-white rounded-lg overflow-hidden shadow-md"
                  >
                    <Link to={`/bookdetailbyid/${book.book_id}`}>
                      <img
                        src={book.url}
                        alt={book.book_name}
                        className="w-full h-[250px] object-cover"
                      />
                      <div className="p-4">
                        <h3 className="text-lg font-semibold">
                          {book.book_name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {book.author_name}
                        </p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  );
};

export default CategorySlider;
