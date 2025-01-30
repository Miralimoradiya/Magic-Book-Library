// SkeletonLoader.jsx
import React from "react";
import { Skeleton } from "@mui/material";

const SkeletonLoader = () => {
  return (
    <div className="flex px-6 gap-6 flex-col md:flex-row lg:flex-row">
      <div className="p-4 bg-white shadow-md rounded-md w-full sm:w-full md:w-full lg:w-1/3">
        <div className="flex flex-row gap-4 justify-center">
          <Skeleton variant="rectangular" width={80} height={80} />
          <Skeleton variant="rectangular" width={80} height={80} />
          <Skeleton variant="rectangular" width={80} height={80} />
        </div>
        <div className="mt-4">
          <Skeleton variant="rectangular" width={310} height={320} />
        </div>
      </div>

      {/* Right-side Skeleton */}
      <div className="bg-white p-4 px-6 shadow-md rounded-md w-full sm:w-full md:w-full lg:w-2/3">
        <div className="flex flex-col sm:flex-row justify-between">
          <div>
            <Skeleton variant="text" width={200} height={40} />
            <Skeleton variant="text" width={100} height={20} />
            <Skeleton variant="text" width={150} height={25} />
          </div>
          <div>
            <Skeleton variant="rectangular" width={150} height={40} />
          </div>
        </div>

        <div className="mt-8">
        <Skeleton variant="text" className="w-full" height={30} />
        <Skeleton variant="text" className="w-full" height={30} />
        <Skeleton variant="text" className="w-full" height={30} />
        <Skeleton variant="text" className="w-full" height={30} />
        <Skeleton variant="text" className="w-80" height={30} />
        </div>

        {/* Book Info Card Skeleton */}
        <div className="bg-white border rounded-lg shadow-md p-4 flex flex-col sm:flex-row gap-8 mt-16">
          <div className="flex items-center gap-2">
            <Skeleton variant="circle" width={24} height={24} />
            <div>
              <Skeleton variant="text" width={150} height={20} />
              <Skeleton variant="text" width={100} height={25} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton variant="circle" width={24} height={24} />
            <div>
              <Skeleton variant="text" width={150} height={20} />
              <Skeleton variant="text" width={100} height={25} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
