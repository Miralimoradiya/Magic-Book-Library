// Home.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { IoIosLink } from "react-icons/io";
import { Bar } from "react-chartjs-2";
import LinearProgress from "@mui/material/LinearProgress";
import TopPart from "../../../components/resusable/toppart";
import LoadingSkeleton from "./LoadingSkeleton";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import config from "../../../../utils/config/index";
import { axiosInstance } from "../../../../utils/constants/api";
import DateRangeFilter from "../../../components/resusable/DateRangeFilter";
import NodataBook from "../../../components/resusable/NodataBook";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Home = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  const [dateParams, setDateParams] = useState({});

  const fetchDashboardData = async (params = {}) => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      setError("No token found");
      return;
    }
    try {
      const response = await axiosInstance.get(
        `${config.API_URL}/l/dashboard`,
        {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("API Response Data:", response.data);
      setDashboardData(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch dashboard data");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleApplyDateFilter = (params) => {
    const updatedParams = {
      startDate: params.stDate,
      endDate: params.endDate,
    };
    setDateParams(updatedParams);
    fetchDashboardData(updatedParams);
  };

  if (error)
    return (
      <>
        <p className="sm:text-2xl text-sm m-auto sm:ml-96 sm:mt-10"> &#128522; {error}</p>
        <NodataBook
                    noDataMessage="No Data Available"
                  />
      </>
    );

  const registrationData = dashboardData?.graph?.registrationCountByDate || [];
  const borrowData = dashboardData?.graph?.borrowDateCountGraphData || [];
  const counts = dashboardData?.count || {};
  const mostLikedBooks = dashboardData?.mostLikedBooks || [];

  // Skeleton loader rendering
  const isLoading = !dashboardData;

  const mostLikedBooksChartData = {
    labels: mostLikedBooks.map((book) => book.book_name),
    datasets: [
      {
        label: "Likes",
        data: mostLikedBooks.map((book) => book.total_likes),
        backgroundColor: mostLikedBooks.map(
          (_, index) =>
            `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
              Math.random() * 255
            }, 0.3)`
        ),
        borderColor: "rgba(20, 37, 52,1)",
        fill: true,
        tension: 0.3,
        borderWidth: 2,
      },
    ],
  };

  const registrationChartData = {
    labels: registrationData.map((item) =>
      new Date(item.dates).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Created Accounts",
        data: registrationData.map((item) => item.total_created_accounts),
        borderColor: "#142534",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const borrowChartData = {
    labels: borrowData.map((item) => new Date(item.dates).toLocaleDateString()),
    datasets: [
      {
        label: "Total Borrowers",
        data: borrowData.map((item) => item.total_borrowers),
        borderColor: "#142534",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { title: { display: true, text: "Date" } },
      y: { title: { display: true, text: "Count" }, beginAtZero: true },
    },
  };
  const chartOptionsforlikes = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: { display: true, text: "Books" },
        ticks: { autoSkip: true, maxTicksLimit: 10 },
      },
      y: {
        title: { display: true, text: "Likes" },
        beginAtZero: true,
        ticks: {
          stepSize: 10,
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => `Likes: ${context.raw}`,
        },
      },
    },
  };

  const maxCount = Math.max(
    ...[
      counts.todayActiveUsersCount,
      counts.todayRequestCount,
      counts.todayBorrowCount,
      counts.todayReleaseCount,
      counts.bookCount,
      counts.totalUserCount,
    ]
  );

  const calculateProgress = (count) => (count / maxCount) * 100;

  const progressItems = [
    { label: "Total Books", value: counts.bookCount },
    { label: "Total Users", value: counts.totalUserCount },
    { label: "Active Users", value: counts.todayActiveUsersCount },
    { label: "Requests", value: counts.todayRequestCount },
    { label: "Borrows", value: counts.todayBorrowCount },
    { label: "Release", value: counts.todayReleaseCount },
  ];

  const cardStyle = {
    container:
      "bg-white rounded-lg shadow-lg flex flex-col md:flex-row justify-between items-center",
    textContainer: "p-6 text-center md:text-left",
    heading: "text-xl font-semibold text-gray-700",
    amount: "text-2xl font-bold text-gray-900",
    image: "h-[100px] md:h-[120px] align-baseline p-4",
  };

  const chartStyle = {
    container: "bg-white p-6 rounded-lg shadow-lg",
    heading: "text-xl font-semibold text-gray-700 mb-4",
    chartWrapper: "w-full h-[349px]",
  };

  const tableStyle = {
    container: "p-3 rounded-lg shadow-lg",
    table: "w-full text-sm",
    row: "border-b last:border-0",
    cell: "py-2",
    header: "font-bold text-start last:text-end",
  };

  const progressStyle = {
    container:
      "mt-7 flex flex-col gap-4 bg-white px-6 pb-4 rounded-lg shadow-lg",
    label: "flex flex-row justify-between text-[#142534]",
    bar: {
      height: 10,
      borderRadius: "10px",
      "& .MuiLinearProgress-bar": {
        backgroundColor: "#142534",
      },
      "& .MuiLinearProgress-root": {
        backgroundColor: "red",
      },
    },
  };

  const mostLikedBooksStyle = {
    container: "bg-white p-4 rounded-lg shadow-lg",
    heading: "text-xl font-semibold text-gray-700 mb-4",
    chartWrapper: "w-full h-[200px]",
  };

  return (
    <div>
      <div className="flex justify-between items-center w-full borrowing-list-container">
        <div>
          <TopPart title="Dashboard" linkPath="/home" showButton={false} />
        </div>
        <div className="flex items-end gap-4 date-filter-container">
          <DateRangeFilter onApplyDateFilter={handleApplyDateFilter} />
          <div>
            <select className="filter-select">
              <option value="All Books">All status</option>
              <option value="1">Pending</option>
              <option value="2">Approved</option>
              <option value="3">Declined</option>
            </select>
          </div>
        </div>
      </div>

      {/* Skeleton for data cards */}
      {isLoading ? (
        <LoadingSkeleton type="card" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 fade-in">
          {[
            {
              type: "total_dues",
              imgSrc: "https://cdn-icons-png.flaticon.com/512/1578/1578656.png",
            },
            {
              type: "paid_dues",
              imgSrc: "https://cdn-icons-png.flaticon.com/512/4221/4221652.png",
            },
            {
              type: "left_dues",
              imgSrc:
                "https://cdn4.iconfinder.com/data/icons/cygnus-finance-filled-1/64/time_deposit-term_deposit-investment-due-payment-512.png",
            },
          ].map((dues, index) => (
            <div
              key={index}
              className={`${cardStyle.container} transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl`}
            >
              <div className={cardStyle.textContainer}>
                <h2 className={cardStyle.heading}>
                  {dues.type.replace("_", " ").toUpperCase()}
                </h2>
                <p className={cardStyle.amount}>
                  ₹{dashboardData.dues[dues.type].toFixed(2)}
                </p>
              </div>
              <img
                src={dues.imgSrc}
                alt={dues.type}
                className={cardStyle.image}
              />
            </div>
          ))}
        </div>
      )}

      {/* Skeleton for charts */}
      <div className="flex flex-col md:flex-row gap-6 my-10">
        {/* Left */}
        <div className="w-full md:w-[65%] flex flex-col gap-6">
          {isLoading ? (
            <LoadingSkeleton type="chart" height={300} />
          ) : (
            <div
              className={`${chartStyle.container} transition-all duration-300 ease-in-out transform hover:shadow-2xl`}
            >
              <h2 className={chartStyle.heading}>Registration Count by Date</h2>
              <div className={chartStyle.chartWrapper}>
                <Line data={registrationChartData} options={chartOptions} />
              </div>
            </div>
          )}
          {isLoading ? (
            <LoadingSkeleton type="chart" height={300} />
          ) : (
            <div
              className={` ${chartStyle.container} transition-all duration-300 ease-in-out transform hover:shadow-2xl`}
            >
              <h2 className={chartStyle.heading}>Borrow Count by Date</h2>
              <div className={chartStyle.chartWrapper}>
                <Line data={borrowChartData} options={chartOptions} />
              </div>
            </div>
          )}
        </div>

        {/* Right */}
        <div className="w-full md:w-[35%] flex flex-col gap-6 bg-white rounded-lg p-4">
          {isLoading ? (
            <LoadingSkeleton type="chart" height={200} />
          ) : (
            <div
              className={`${tableStyle.container} transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl fade-in text-black`}
            >
              <table className={tableStyle.table}>
                <thead>
                  <tr className={tableStyle.row}>
                    <th className={`${tableStyle.cell} ${tableStyle.header}`}>
                      Field
                    </th>
                    <th className={`${tableStyle.cell} ${tableStyle.header}`}>
                      Links
                    </th>
                    <th
                      className={`${tableStyle.cell} ${tableStyle.header} text-right`}
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className={tableStyle.row}>
                    <td className={tableStyle.cell}>Total Users</td>
                    <td className={tableStyle.cell}>
                      <Link to="/members">
                        <IoIosLink className="text-blue-500 cursor-pointer text-xl" />
                      </Link>
                    </td>
                    <td className={`${tableStyle.cell} text-right`}>
                      {dashboardData.count.totalUserCount}
                    </td>
                  </tr>
                  <tr className={tableStyle.row}>
                    <td className={tableStyle.cell}>Total Books</td>
                    <td className={tableStyle.cell}>
                      <Link to="/books">
                        <IoIosLink className="text-blue-500 cursor-pointer text-xl" />
                      </Link>
                    </td>
                    <td className={`${tableStyle.cell} text-right`}>
                      {dashboardData.count.bookCount}
                    </td>
                  </tr>
                  <tr className={tableStyle.row}>
                    <td className={tableStyle.cell}>Total Reviews</td>
                    <td className={tableStyle.cell}>
                      <Link to="/reviews">
                        <IoIosLink className="text-blue-500 cursor-pointer text-xl" />
                      </Link>
                    </td>
                    <td className={`${tableStyle.cell} text-right`}>
                      {dashboardData.count.totalReviewsCount}
                    </td>
                  </tr>
                  <tr className={tableStyle.row}>
                    <td className={tableStyle.cell}>Total Book Reviews</td>
                    <td className={tableStyle.cell}>
                      <Link to="/reviews">
                        <IoIosLink className="text-blue-500 cursor-pointer text-xl" />
                      </Link>
                    </td>
                    <td className={`${tableStyle.cell} text-right`}>
                      {dashboardData.count.totalBookReviewsCount}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {progressItems.map(({ label, value }, index) => (
              <div
                key={index}
                className={`${progressStyle.container} transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl`}
              >
                <p className={progressStyle.label}>
                  <span>{label}:</span>
                  <span>{value}</span>
                </p>
                {isLoading ? (
                  <LoadingSkeleton type="progress" height={10} />
                ) : (
                  <LinearProgress
                    variant="determinate"
                    value={calculateProgress(value)}
                    sx={progressStyle.bar}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skeleton for Most Liked Books chart */}
      {isLoading ? (
        <LoadingSkeleton type="chart" height={200} />
      ) : (
        <div
          className={`${mostLikedBooksStyle.container} transition-all duration-300 ease-in-out transform hover:shadow-2xl`}
        >
          <h2 className={mostLikedBooksStyle.heading}>Most Liked Books</h2>
          <div className={mostLikedBooksStyle.chartWrapper}>
            <Bar
              data={mostLikedBooksChartData}
              options={chartOptionsforlikes}
            />
          </div>
        </div>
      )}



      
    </div>
  );
};

export default Home;
