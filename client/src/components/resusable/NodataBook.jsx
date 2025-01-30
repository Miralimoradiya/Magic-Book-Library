//  NodataBook.jsx
import React, { useState, useEffect } from "react";
import { DNA } from "react-loader-spinner";

export default function NodataBook({ noDataMessage = "No data Available" }) {
  const [showBook, setShowBook] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setShowBook(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-full mx-auto mt-0 sm:mt-20">
          <DNA
            visible={true}
            height="80"
            width="80"
            ariaLabel="dna-loading"
            wrapperStyle={{}}
            wrapperClass="dna-wrapper"
          />
        </div>
      ) : (
        showBook && (
          <div className="flex flex-col justify-center items-center zoom-in">
            <img
              src="https://png.pngtree.com/png-vector/20240724/ourmid/pngtree-clip-art-a-student-of-reading-png-image_12787371.png"
              alt=""
            />
            <div className="-mt-0 sm:mt-[-15px] text-md sm:text-2xl font-bold font-serif text-gray-500 text-center">
              <p>{noDataMessage}</p>
            </div>
          </div>
        )
      )}
    </>
  );
}
