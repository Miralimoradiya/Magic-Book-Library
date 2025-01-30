
// components/resusable/welcomePage_compo/LibrarySlider.jsx
import React from "react";
import Slider from "react-slick";

const LibrarySlider = ({ sliderContent, imageSliderSettings }) => {
  return (
    <section className="mb-9 w-[92%] max-w-6xl sm:w-[92%] bg-white rounded-xl shadow-lg  p-2 sm:p-5">
      <h1 className="text-center font-bold text-2xl font-serif mb-6">
        Our Idea for this
      </h1>
      <div className="relative w-full h-96 overflow-x-hidden rounded-lg">
        <Slider {...imageSliderSettings}>
          {sliderContent.map((content, index) => (
            <div key={index} className="w-full flex items-center bg-[#d9e6f0] sticky top-0 rounded-xl">
              <div
                className="absolute top-0 left-0 right-0 bottom-0 bg-cover bg-center rounded-xl"
                style={{
                  backgroundImage: `url(${content.image})`,
                  mixBlendMode: "overlay",
                }}
              ></div>
              <div className=" mx-auto px-5 sm:px-10 py-2 sm:py-8 relative text-black">
                <h1 className="text-xl sm:text-3xl font-normal before:content-['“'] before:text-4xl">
                  {content.heading}
                </h1>
                {content.text.map((para, idx) => (
                  <p key={idx} className="text-gray-700 mt-2 sm:mt-6">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default LibrarySlider;