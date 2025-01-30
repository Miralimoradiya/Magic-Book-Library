// LoadingSkeleton.jsx
import React from "react";
import Skeleton from "@mui/material/Skeleton";

// Define styles for the skeleton loader
const skeletonStyles = {
  cardContainer: "flex flex-row items-center justify-center px-4 py-6 border border-gray-300 rounded-lg text-center",
  skeletonText: "mb-4 w-full",
  skeletonBar: "h-6 bg-gray-300 rounded",
  skeletonImage: "w-20 h-20 bg-gray-300",
  chartContainer: "flex flex-col gap-6 my-10",
  chartWrapper: "w-full h-[300px]",
  progressBar: "mt-7 flex flex-col gap-4 bg-white px-6 pb-4 rounded-lg shadow-lg",
};

const LoadingSkeleton = ({ type = "card", height = 200 }) => {
  if (type === "card") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((_, index) => (
          <div key={index} className={skeletonStyles.cardContainer}>
            <div className={skeletonStyles.skeletonText}>
              <div className={skeletonStyles.skeletonBar} style={{ width: "80%", marginBottom:"20px" }} />
              <div className={skeletonStyles.skeletonBar} style={{ width: "60%" }} />
            </div>
            <div className={skeletonStyles.skeletonImage}></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "chart") {
    return (
      <div className={skeletonStyles.chartContainer}>
        <Skeleton variant="rectangular" height={height} />
      </div>
    );
  }

  if (type === "progress") {
    return (
      <div className={skeletonStyles.progressBar}>
        <Skeleton variant="rectangular" height={height} />
      </div>
    );
  }

  return null;
};

export default LoadingSkeleton;
