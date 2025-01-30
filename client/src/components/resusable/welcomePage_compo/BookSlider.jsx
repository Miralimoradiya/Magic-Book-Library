// BookSlider.jsx
import React from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { MdOutlineNavigateNext } from "react-icons/md";

const BookSlider = ({ title, link, books, sliderSettings }) => {
  return (
    <section className="mt-16 w-[90%] max-w-6xl sm:w-[92%] py-5">
      <div className="flex flex-row justify-between items-center px-4 mb-4 flex-wrap">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold">
          {title}
        </h1>
        <Link
          to={link}
          className="rounded-lg text-black hover:mr-[-8px] transition-all font-serif font-bold"
        >
          <MdOutlineNavigateNext className="text-4xl" />
        </Link>
      </div>
      <div className="">
        <Slider {...sliderSettings}>
          {books.map((book) => (
            <div key={book.book_id} className="px-3">
              <Link to={`/bookdetailbyid/${book.book_id}`} className="block">
                <div className="transition-all duration-300 ease-in-out transform hover:scale-95 ">
                  <img
                    src={
                      book.cover_image_url 
                    }
                    alt={book.book_name}
                    className="w-full h-[250px] object-cover rounded-lg"
                  />
                  <h3 className="text-xl font-semibold w-full overflow-hidden whitespace-nowrap text-ellipsis">
                    {book.book_name}
                  </h3>

                  <p className="text-gray-600">by {book.author_name}</p>
                </div>
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default BookSlider;
