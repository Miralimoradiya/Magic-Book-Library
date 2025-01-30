-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 24, 2025 at 05:22 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `libbrary-sysytem-dhruval`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_book`
--

CREATE TABLE `tbl_book` (
  `book_id` int(11) NOT NULL,
  `author_name` varchar(255) NOT NULL,
  `book_name` varchar(255) NOT NULL,
  `publishedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `genre` enum('Fiction','Romantic','Horror','Children','Comedy','Suspense','Biography','Life','Society','Short stories','History','Drama','Action','Adventure','Mythology','Travel','Religion') NOT NULL,
  `no_of_copies` int(4) NOT NULL,
  `isDeleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_book`
--

INSERT INTO `tbl_book` (`book_id`, `author_name`, `book_name`, `publishedAt`, `genre`, `no_of_copies`, `isDeleted`) VALUES
(67, 'Someone who', 'mirali\'s book', '2024-12-09 13:53:20', 'Mythology', 502, 0),
(69, 'George Matthew Adams', 'You Can', '2024-12-10 10:31:45', 'Fiction', 50, 0),
(77, 'xyz', 'abcdeeqqq', '2024-12-11 10:07:02', 'Society', 22, 1),
(78, 'xyz', 'abcderr', '2024-12-11 10:14:04', 'Drama', 50, 1),
(79, 'avtar book', 'avtar book', '2024-12-11 10:52:50', 'Action', 412, 1),
(87, 'Erica Jong', 'Fear of Flying', '2024-12-11 12:22:31', 'Horror', 20, 0),
(93, 'wewewe', 'axyzwee', '2024-12-13 05:59:05', 'Biography', 11, 0),
(95, 'xaegdryhfjguik', 'dwaerweredfgdry', '2024-12-16 05:52:19', 'Society', 50, 1),
(97, 'xyz', 'Mere', '2024-12-16 11:14:06', 'History', 412, 0),
(99, 'Narendra Modi', 'Greatness of AbdulKalam', '2024-12-17 07:15:01', 'Action', 788, 0),
(103, 'Dr.Manmohan Sign', 'The Greate Econimist', '2024-12-27 11:50:24', 'Fiction', 1000, 0),
(104, 'Soniya Gandhi', 'The Accidental', '2024-12-27 12:01:02', 'Romantic', 50, 0),
(105, 'Narendra Modi', 'Modi 3.0', '2024-12-27 12:09:11', 'Romantic', 2000, 0),
(109, 'come to dubai', 'ya habbibi ', '2025-01-02 11:41:38', 'Children', 20, 0),
(110, 'Brad Graber', 'Boca by Moonlight', '2025-01-02 12:23:03', 'Horror', 20, 0),
(112, 'xyz', 'abfg', '2025-01-02 13:05:15', 'Biography', 50, 1),
(114, 'Narsih Mehta', 'Ranchhod', '2025-01-04 06:53:16', 'Biography', 700, 0),
(115, 'Villiam care', 'Racing Cars', '2025-01-17 13:09:03', 'Society', 555, 0);

--
-- Triggers `tbl_book`
--
DELIMITER $$
CREATE TRIGGER `set_random_genre` BEFORE INSERT ON `tbl_book` FOR EACH ROW BEGIN
    -- Check if the genre is valid; if not, assign a random genre
    IF NOT FIND_IN_SET(NEW.genre, 'Fiction,Romantic,Horror,Children,Comedy,Suspense,Biography,Life,Society,Short stories,History,Drama,Action,Adventure,Mythology,Travel,Religion') THEN
        -- If the genre is invalid, set a random genre from the list
        SET NEW.genre = ELT(FLOOR(1 + (RAND() * 17)), 'Fiction', 'Romantic', 'Horror', 'Children', 'Comedy', 'Suspense', 'Biography', 'Life', 'Society', 'Short stories', 'History', 'Drama', 'Action', 'Adventure', 'Mythology', 'Travel', 'Religion');
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_book_reviews`
--

CREATE TABLE `tbl_book_reviews` (
  `review_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `rating` int(1) NOT NULL CHECK (`rating` between 1 and 5),
  `message` text NOT NULL,
  `createdAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_book_reviews`
--

INSERT INTO `tbl_book_reviews` (`review_id`, `user_id`, `book_id`, `rating`, `message`, `createdAt`) VALUES
(7, 67, 69, 3, 'helloo', '2025-01-09 13:23:42'),
(8, 132, 67, 2, 'from mirali side', '2025-01-09 13:24:00'),
(9, 1, 67, 4, 'huhue', '2025-01-09 15:23:45'),
(10, 67, 67, 5, 'done review proper working', '2025-01-09 15:27:16'),
(11, 32, 67, 4, 'very nice', '2025-01-09 16:13:57'),
(12, 32, 114, 5, 'Jay Dwarkadhish ????', '2025-01-09 18:07:46'),
(13, 1, 69, 4, 'nice', '2025-01-09 18:40:29'),
(14, 1, 78, 3, 'good', '2025-01-09 18:42:43'),
(15, 6, 93, 3, 'nice', '2025-01-10 10:11:31'),
(16, 6, 69, 4, 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus excepturi commodi voluptatum vel natus veritatis, illo cupiditate dolor saepe quia consequatur provident laboriosam molestias ipsum perferendis rerum est alias quaerat', '2025-01-10 10:21:41'),
(17, 32, 99, 5, 'Great book ever which i had read before ', '2025-01-10 10:50:49'),
(18, 32, 97, 4, 'funny book wich is useful for childrens ', '2025-01-10 18:05:25'),
(19, 32, 115, 4, 'nice book', '2025-01-21 11:40:05'),
(20, 32, 103, 4, 'wonderful', '2025-01-23 16:28:50');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_borrower`
--

CREATE TABLE `tbl_borrower` (
  `borrower_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `borrow_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `release_date` timestamp NULL DEFAULT NULL,
  `no_of_copies` int(4) NOT NULL,
  `due_date` datetime DEFAULT current_timestamp(),
  `is_due_paid` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_borrower`
--

INSERT INTO `tbl_borrower` (`borrower_id`, `user_id`, `book_id`, `borrow_date`, `release_date`, `no_of_copies`, `due_date`, `is_due_paid`) VALUES
(79, 32, 67, '2024-12-10 05:35:49', '2024-12-10 07:14:16', 25, '2024-12-12 11:05:49', 1),
(94, 32, 77, '2024-12-19 04:58:55', '2024-12-23 05:43:55', 4, '2024-12-21 10:28:55', 1),
(110, 32, 79, '2024-12-28 10:10:07', '2024-12-28 10:45:26', 5, '2024-12-30 15:40:07', 1),
(122, 6, 79, '2024-12-28 11:08:38', '2024-12-28 11:13:54', 5, '2024-12-30 16:38:38', 1),
(141, 32, 109, '2025-01-04 05:13:57', '2025-01-07 04:28:04', 1, '2025-01-06 10:43:57', 1),
(142, 32, 103, '2025-01-04 05:14:00', '2025-01-07 06:17:23', 1, '2025-01-06 10:44:00', 1),
(143, 6, 69, '2025-01-06 13:53:25', '2025-01-07 04:27:57', 5, '2025-01-08 19:23:25', 1),
(144, 6, 69, '2025-01-07 09:39:13', '2025-01-07 09:47:57', 5, '2025-01-09 15:09:13', 1),
(145, 67, 79, '2025-01-07 09:39:17', '2025-01-07 09:47:53', 20, '2025-01-09 15:09:17', 1),
(146, 32, 99, '2025-01-07 09:39:19', '2025-01-23 06:37:36', 2, '2025-01-09 15:09:19', 0),
(147, 32, 103, '2025-01-07 09:42:01', '2025-01-10 10:16:05', 1, '2025-01-09 15:12:01', 0),
(148, 32, 97, '2025-01-16 04:51:46', '2025-01-23 06:37:03', 1, '2025-01-18 10:21:46', 0),
(149, 32, 110, '2025-01-16 04:52:01', '2025-01-22 09:16:17', 1, '2025-01-18 10:22:01', 0),
(150, 32, 97, '2025-01-16 04:52:09', '2025-01-22 09:16:31', 1, '2025-01-18 10:22:09', 0),
(151, 32, 97, '2025-01-16 04:52:15', '2025-01-22 09:16:38', 1, '2025-01-18 10:22:15', 0),
(152, 132, 67, '2025-01-17 13:05:10', '2025-01-23 06:11:14', 1, '2025-01-19 18:35:10', 0),
(153, 6, 87, '2025-01-22 09:18:00', '2025-01-22 10:40:49', 5, '2025-01-24 14:48:00', 1),
(154, 6, 87, '2025-01-22 09:18:09', '2025-01-23 04:39:01', 5, '2025-01-24 14:48:09', 1),
(155, 6, 67, '2025-01-23 06:25:27', '2025-01-23 06:36:30', 1, '2025-01-25 11:55:27', 1),
(156, 6, 114, '2025-01-23 06:25:38', '2025-01-23 06:36:34', 1, '2025-01-25 11:55:38', 1),
(157, 6, 87, '2025-01-23 06:26:24', '2025-01-23 06:38:32', 1, '2025-01-25 11:56:24', 1),
(158, 6, 99, '2025-01-23 06:30:57', '2025-01-23 06:38:55', 1, '2025-01-25 12:00:57', 1),
(159, 6, 67, '2025-01-23 07:19:57', '2025-01-23 07:20:43', 1, '2025-01-25 12:49:57', 1),
(160, 6, 67, '2025-01-23 07:21:48', NULL, 1, '2025-01-25 12:51:48', 0);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_inquiry`
--

CREATE TABLE `tbl_inquiry` (
  `inquiry_id` int(11) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `subject` varchar(1024) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `enquiry_type` enum('book queries','library queries') DEFAULT 'library queries',
  `phone_number` varchar(20) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `librarian_check` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_inquiry`
--

INSERT INTO `tbl_inquiry` (`inquiry_id`, `user_name`, `user_email`, `subject`, `city`, `state`, `country`, `enquiry_type`, `phone_number`, `message`, `librarian_check`) VALUES
(1, 'John Doe', 'johndoe@example.com', 'Library Inquiry', 'New York', 'NY', 'USA', 'library queries', '123456789', 'I have a question regarding the availability of books.', 1),
(4, 'gaurav ', 'digitatttava', 'for librry ', 'Gujarat', 'gujrat', 'India', 'library queries', '5857787878787', 'hello', 1),
(7, 'dsfdsfsd', 'yash@gmail.com', 'dfsdfdsf', 'surat', 'gujrat', 'India', 'library queries', '8989889899', 'affa', 1),
(8, 'weqweq', 'dqweqwe@gmail.com', 'dwded', 'los_angeles', 'texas', 'usa', 'book queries', '1234567890', 'xyz', 1),
(9, 'weqweq', 'dqweqwe@gmail.com', 'dwded', 'boston', 'michigan', 'india', 'book queries', '1234567890', 'qersedgd', 1),
(10, 'Nayan Dangar', 'nayandangar98@gmail.com', 'library', 'New York', 'NY', 'USA', 'book queries', '8347919742', 'hello library  i want one book', 1),
(11, 'Mr.Hacker', 'abc@gmail.com', 'books', 'Los Angeles', 'NY', 'USA', 'library queries', '8552457852', 'there is missing subjects ', 1),
(12, 'Yash Kukadiya ', 'yash33@gmail.com', 'books', 'Sihor', 'Gujarat', 'India', 'book queries', '8552457852', 'i wan five copies of book name modi 3.2 is it available ?', 1),
(13, 'Khushal Vaghela ', 'khushvaghela@gmail.com', 'library', 'Jamnagar', 'Gujarat', 'India', 'library queries', '8552457852', 'this library is not clean ', 1),
(14, 'Bhautik Sutariya ', 'bhautik22@gmail.com', 'staff', 'Austin', 'Texas', 'United States', 'library queries', '9825667744', 'this staff is rudly behave with us make sure this issue will be solved   ', 1),
(15, 'weqweq', 'dqweqwe@gmail.com', 'saws', 'Pobé', 'Plateau Department', 'Benin', 'library queries', '1234567890', 'awdde', 1),
(16, 'weqweq', 'dqweqwe@gmail.com', 'dwded', 'Sauteurs', 'Saint Patrick Parish', 'Grenada', 'book queries', '1234567890', 'htjtygjyukuilijlkmdasedewrfesdgt fjg', 1),
(17, 'weqweq', 'dqweqwe@gmail.com', 'dwded', 'Haslen', 'Appenzell Innerrhoden', 'Switzerland', 'library queries', '1234567890', 'aaaaaaaaaaaaasssssssssssssssssssssssssssssssssssssssssssssssssss', 1),
(18, 'Jenish Bittudi', 'Jenish@gmail.com', 'books', 'Mandvi (Surat)', 'Gujarat', 'India', 'book queries', '9825584784', 'sajhdfjbdsbskjdf', 1),
(19, 'yuh', 'absss@gamil.com', 'for inquiry', 'Binkolo', 'Northern Province', 'Sierra Leone', 'library queries', '8989889899', 'reg3yulk', 1),
(20, 'Nikhil', 'abc@gmail.com', 'library', 'Arisdorf', 'Basel-Landschaft', 'Switzerland', 'library queries', '852854544', 'hdsababsdkjabs', 1),
(21, 'Gaurav', 'gauravs@gmail.com', 'Harray Potter', 'Surat', 'Gujarat', 'India', 'book queries', '8425477822', 'Harry Potter books are available or not', 1),
(22, 'Gaurav', 'gauravS@gmail.com', 'Harray Potter', 'Surat', 'Gujarat', 'India', 'book queries', '8425477822', 'Harry Potter', 1),
(23, 'Gaurav', 'gauravS@gmail.com', 'Harray Potter', 'Surat', 'Gujarat', 'India', 'book queries', '8425477822', 'harray', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_likes`
--

CREATE TABLE `tbl_likes` (
  `like_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `createdAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_likes`
--

INSERT INTO `tbl_likes` (`like_id`, `user_id`, `book_id`, `createdAt`) VALUES
(439, 32, 97, '2024-12-16 17:55:49'),
(583, 6, 78, '2025-01-06 16:48:31'),
(584, 6, 77, '2025-01-06 16:48:35'),
(585, 6, 67, '2025-01-06 16:48:37'),
(614, 6, 79, '2025-01-08 16:33:12'),
(616, 6, 93, '2025-01-08 16:33:20'),
(617, 6, 95, '2025-01-08 16:33:22'),
(618, 6, 104, '2025-01-08 16:33:31'),
(619, 6, 103, '2025-01-08 16:33:36'),
(620, 32, 78, '2025-01-08 18:13:57'),
(629, 67, 67, '2025-01-09 13:12:11'),
(632, 32, 77, '2025-01-09 18:22:00'),
(636, 6, 112, '2025-01-10 10:24:57'),
(637, 6, 110, '2025-01-10 10:25:00'),
(638, 6, 109, '2025-01-10 10:25:04'),
(639, 6, 105, '2025-01-10 10:25:08'),
(640, 6, 114, '2025-01-10 10:25:11'),
(641, 6, 97, '2025-01-10 10:25:24'),
(642, 6, 99, '2025-01-10 15:45:15'),
(645, 32, 114, '2025-01-20 11:44:48'),
(651, 132, 93, '2025-01-21 18:16:28'),
(654, 132, 99, '2025-01-21 18:16:37'),
(658, 132, 104, '2025-01-21 18:16:41'),
(661, 67, 97, '2025-01-22 17:43:01'),
(664, 32, 67, '2025-01-23 17:01:35');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_media`
--

CREATE TABLE `tbl_media` (
  `media_id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `url` varchar(255) NOT NULL,
  `isCover` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_media`
--

INSERT INTO `tbl_media` (`media_id`, `book_id`, `url`, `isCover`, `createdAt`) VALUES
(7, 67, 'http://res.cloudinary.com/dybdcoc9k/image/upload/v1733752401/books/experience/2024-12-09T135320587Z_abcd.jpg.jpg', 1, '2024-12-09 19:23:23'),
(8, 67, 'http://res.cloudinary.com/dybdcoc9k/image/upload/v1733752402/books/experience/2024-12-09T135320642Z_adfasfd.png.png', 0, '2024-12-09 19:23:23'),
(11, 69, 'http://res.cloudinary.com/dybdcoc9k/image/upload/v1733826706/books/you_can/2024-12-10T103145039Z_81fTsv3pkkL._SL1500_.jpg.jpg', 1, '2024-12-10 16:01:47'),
(12, 69, 'http://res.cloudinary.com/dybdcoc9k/image/upload/v1733826706/books/you_can/2024-12-10T103145043Z_81-KIufv9aL._SL1500_.jpg.jpg', 0, '2024-12-10 16:01:47'),
(13, 69, 'http://res.cloudinary.com/dybdcoc9k/image/upload/v1733826706/books/you_can/2024-12-10T103145045Z_81-cYiMHbWL._SL1500_.jpg.jpg', 0, '2024-12-10 16:01:47'),
(14, 69, 'http://res.cloudinary.com/dybdcoc9k/image/upload/v1733826706/books/you_can/2024-12-10T103145047Z_71b5VpRkZeL._SL1500_.jpg.jpg', 0, '2024-12-10 16:01:47'),
(25, 77, 'http://res.cloudinary.com/dybdcoc9k/image/upload/v1733911622/books/abcdee/2024-12-11T100702741Z_download.jpg.jpg', 1, '2024-12-11 15:37:04'),
(26, 78, 'http://res.cloudinary.com/dybdcoc9k/image/upload/v1733912044/books/abcderr/2024-12-11T101404523Z_download.jpg.jpg', 1, '2024-12-11 15:44:06'),
(27, 78, 'http://res.cloudinary.com/dybdcoc9k/image/upload/v1733912044/books/abcderr/2024-12-11T101404526Z_download.jpg.jpg', 0, '2024-12-11 15:44:06'),
(28, 79, 'http://res.cloudinary.com/dybdcoc9k/image/upload/v1733914370/books/avtar_book/2024-12-11T105250901Z_download.jpg.jpg', 1, '2024-12-11 16:22:52'),
(42, 87, 'http://res.cloudinary.com/dybdcoc9k/image/upload/v1733919751/books/fear_of_flying/2024-12-11T122231330Z_9780143107354.jpg.jpg', 1, '2024-12-11 17:52:32'),
(47, 91, 'http://res.cloudinary.com/dybdcoc9k/image/upload/v1733923645/books/eftgtf/2024-12-11T132725050Z_images.jpg.jpg', 1, '2024-12-11 18:57:26'),
(48, 92, 'http://res.cloudinary.com/dybdcoc9k/image/upload/v1733923797/books/mere_xd_ka_naya_nw/2024-12-11T132957197Z_images.jpg.jpg', 1, '2024-12-11 18:59:58'),
(49, 93, 'http://res.cloudinary.com/dybdcoc9k/image/upload/v1734069545/books/2024-12-13T055905228Z_download.jpg.jpg', 1, '2024-12-13 11:29:06'),
(54, 95, 'http://res.cloudinary.com/dybdcoc9k/image/upload/v1734328340/books/2024-12-16T055219197Z_images.jpg.jpg', 1, '2024-12-16 11:22:20'),
(57, 97, 'http://res.cloudinary.com/dybdcoc9k/image/upload/v1734347647/books/2024-12-16T111406160Z_download.jpg.jpg', 1, '2024-12-16 16:44:07'),
(61, 99, 'http://res.cloudinary.com/dybdcoc9k/image/upload/v1734419703/books/2024-12-17T071501681Z_AbdulKalam.jpg.jpg', 1, '2024-12-17 12:45:05'),
(68, 103, 'http://res.cloudinary.com/dybdcoc9k/image/upload/v1735300225/books/2024-12-27T115024630Z_images2.jpg.jpg', 1, '2024-12-27 17:20:26'),
(71, 104, 'http://res.cloudinary.com/dybdcoc9k/image/upload/v1735300863/books/2024-12-27T120102532Z_abc.jpg.jpg', 1, '2024-12-27 17:31:04'),
(72, 104, 'http://res.cloudinary.com/dybdcoc9k/image/upload/v1735300863/books/2024-12-27T120102558Z_accidentalPm.jpg.jpg', 0, '2024-12-27 17:31:04'),
(73, 104, 'http://res.cloudinary.com/dybdcoc9k/image/upload/v1735300862/books/2024-12-27T120102553Z_67476547.webp.webp', 0, '2024-12-27 17:31:04'),
(74, 105, 'http://res.cloudinary.com/dybdcoc9k/image/upload/v1735301352/books/2024-12-27T120911900Z_images%20%282%29.jpg.jpg', 1, '2024-12-27 17:39:13'),
(78, 109, 'http://res.cloudinary.com/dybdcoc9k/image/upload/v1735818100/books/2025-01-02T114138158Z_71D3YqhbTiL._SL1124_.jpg.jpg', 1, '2025-01-02 17:11:40'),
(79, 109, 'http://res.cloudinary.com/dybdcoc9k/image/upload/v1735818100/books/2025-01-02T114138440Z_71dNsRuYL7L._SL1500_.jpg.jpg', 0, '2025-01-02 17:11:40'),
(80, 110, 'http://res.cloudinary.com/dybdcoc9k/image/upload/v1735820585/books/2025-01-02T122303763Z_61lYRN8xqFL._SY466_.jpg.jpg', 1, '2025-01-02 17:53:06'),
(84, 112, 'http://res.cloudinary.com/dybdcoc9k/image/upload/v1735823116/books/2025-01-02T130515876Z_download.jpg.jpg', 1, '2025-01-02 18:35:17'),
(85, 112, 'http://res.cloudinary.com/dybdcoc9k/image/upload/v1735823116/books/2025-01-02T130515884Z_download.jpg.jpg', 0, '2025-01-02 18:35:17'),
(86, 113, 'http://res.cloudinary.com/dybdcoc9k/image/upload/v1735970543/books/2025-01-04T060222569Z_hero3.jpg.jpg', 1, '2025-01-04 11:32:25'),
(87, 114, 'http://res.cloudinary.com/dybdcoc9k/image/upload/v1735973597/books/2025-01-04T065316930Z_ranchhod.jpg.jpg', 1, '2025-01-04 12:23:18'),
(93, 115, 'http://res.cloudinary.com/dybdcoc9k/image/upload/v1737119345/books/2025-01-17T130904028Z_car2.jpg.jpg', 1, '2025-01-17 18:39:06');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_request`
--

CREATE TABLE `tbl_request` (
  `request_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `req_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `no_of_copies` int(4) NOT NULL,
  `isApproved` enum('requested','approved','declined') NOT NULL DEFAULT 'requested'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_request`
--

INSERT INTO `tbl_request` (`request_id`, `user_id`, `book_id`, `req_date`, `no_of_copies`, `isApproved`) VALUES
(121, 32, 67, '2024-12-10 05:35:36', 25, 'approved'),
(136, 32, 77, '2024-12-18 12:24:50', 4, 'approved'),
(146, 32, 79, '2024-12-27 10:22:58', 5, 'approved'),
(160, 6, 79, '2024-12-28 10:47:43', 5, 'approved'),
(167, 6, 77, '2024-12-28 11:10:50', 12, 'declined'),
(173, 32, 109, '2025-01-02 12:09:04', 1, 'approved'),
(174, 32, 105, '2025-01-02 12:11:25', 1, 'declined'),
(184, 32, 103, '2025-01-04 04:24:52', 1, 'approved'),
(185, 6, 69, '2025-01-06 13:53:12', 5, 'approved'),
(186, 67, 79, '2025-01-07 06:14:43', 20, 'approved'),
(187, 32, 99, '2025-01-07 06:18:25', 2, 'approved'),
(188, 32, 97, '2025-01-09 05:58:36', 1, 'declined'),
(189, 32, 110, '2025-01-09 10:38:04', 1, 'approved'),
(190, 132, 67, '2025-01-17 05:11:23', 1, 'approved'),
(191, 6, 87, '2025-01-21 07:48:33', 5, 'approved'),
(192, 6, 93, '2025-01-23 06:12:08', 50, 'declined'),
(193, 6, 69, '2025-01-23 06:13:25', 60, 'declined'),
(194, 6, 110, '2025-01-23 06:21:23', 60, 'declined'),
(195, 6, 114, '2025-01-23 06:22:01', 1, 'approved'),
(196, 6, 67, '2025-01-23 06:23:22', 1, 'approved'),
(197, 6, 87, '2025-01-23 06:26:12', 1, 'approved'),
(198, 6, 99, '2025-01-23 06:30:44', 1, 'approved'),
(199, 6, 67, '2025-01-23 07:19:46', 1, 'approved'),
(200, 6, 67, '2025-01-23 07:21:37', 1, 'approved');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_reviews`
--

CREATE TABLE `tbl_reviews` (
  `review_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `rating` int(1) NOT NULL CHECK (`rating` between 1 and 5),
  `message` text NOT NULL,
  `createdAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_reviews`
--

INSERT INTO `tbl_reviews` (`review_id`, `user_id`, `rating`, `message`, `createdAt`) VALUES
(12, 1, 5, 'This book was fantastic! Highly recommend.', '2025-01-10 12:01:05'),
(13, 7, 5, 'This book was fantastic! Highly recommend.', '2025-01-10 12:01:35'),
(14, 11, 5, 'This book was fantastic! Highly recommend.', '2025-01-10 12:01:46'),
(15, 14, 5, 'This book was fantastic! Highly recommend.', '2025-01-10 12:01:54'),
(16, 20, 5, 'This book was fantastic! Highly recommend.', '2025-01-10 12:02:06'),
(17, 56, 5, 'This book was fantastic! Highly recommend.', '2025-01-10 12:02:14'),
(18, 73, 5, 'This book was fantastic! Highly recommend.', '2025-01-10 12:02:27'),
(20, 67, 4, 'Why is this important? Because clients want to know the businesses they depend on for advice, are well managed in their own right. Not only that but this event gives you the chance to give your back-office team<', '2025-01-10 13:12:17'),
(21, 6, 4, 'nice', '2025-01-10 14:29:52'),
(22, 32, 4, 'thats very useful app for every librarian and stundet also', '2025-01-10 18:17:05'),
(23, 132, 2, 'mm', '2025-01-17 10:01:01');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_transaction`
--

CREATE TABLE `tbl_transaction` (
  `transaction_id` int(11) NOT NULL,
  `borrower_id` int(11) NOT NULL,
  `transaction_response` varchar(2048) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_successfull` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_transaction`
--

INSERT INTO `tbl_transaction` (`transaction_id`, `borrower_id`, `transaction_response`, `createdAt`, `is_successfull`) VALUES
(55, 94, '{\"xResult\":\"A\",\"xStatus\":\"Approved\",\"xError\":\"\",\"xErrorCode\":\"00000\",\"xRefNum\":\"10207417518\",\"xExp\":\"1225\",\"xAuthCode\":\"80816A\",\"xBatch\":\"34999501\",\"xAvsResultCode\":\"NNN\",\"xAvsResult\":\"Address: No Match & 5 Digit Zip: No Match\",\"xCvvResultCode\":\"M\",\"xCvvResult\":\"Match\",\"xAuthAmount\":\"0.80\",\"xMaskedCardNumber\":\"4xxxxxxxxxxx4242\",\"xCardType\":\"Visa\",\"xName\":\"Nayan\",\"xToken\":\"q7m097135n7822g6h25n1p78m823038p\",\"xMID\":\"xxxxxxxxxx9999\",\"xTID\":\"xxxxx6789\",\"xCurrency\":\"USD\",\"xDate\":\"12/25/2024 1:05:24 AM\",\"xEntryMethod\":\"Keyed\"}', '2024-12-25 06:05:26', 1),
(61, 141, '{\"xResult\":\"A\",\"xStatus\":\"Approved\",\"xError\":\"\",\"xErrorCode\":\"00000\",\"xRefNum\":\"10212286609\",\"xExp\":\"1225\",\"xAuthCode\":\"68877A\",\"xBatch\":\"35266950\",\"xAvsResultCode\":\"NNN\",\"xAvsResult\":\"Address: No Match & 5 Digit Zip: No Match\",\"xCvvResultCode\":\"M\",\"xCvvResult\":\"Match\",\"xAuthAmount\":\"0.10\",\"xMaskedCardNumber\":\"4xxxxxxxxxxx4242\",\"xCardType\":\"Visa\",\"xName\":\"Nayan\",\"xToken\":\"0mp7gg75hmmq13pq17nm9hm49985n3m4\",\"xMID\":\"xxxxxxxxxx9999\",\"xTID\":\"xxxxx6789\",\"xCurrency\":\"USD\",\"xDate\":\"1/7/2025 1:15:37 AM\",\"xEntryMethod\":\"Keyed\"}', '2025-01-07 06:15:37', 1),
(62, 142, '{\"xResult\":\"A\",\"xStatus\":\"Approved\",\"xError\":\"\",\"xErrorCode\":\"00000\",\"xRefNum\":\"10212287135\",\"xExp\":\"1225\",\"xAuthCode\":\"22576A\",\"xBatch\":\"35266950\",\"xAvsResultCode\":\"NNN\",\"xAvsResult\":\"Address: No Match & 5 Digit Zip: No Match\",\"xCvvResultCode\":\"M\",\"xCvvResult\":\"Match\",\"xAuthAmount\":\"0.10\",\"xMaskedCardNumber\":\"4xxxxxxxxxxx4242\",\"xCardType\":\"Visa\",\"xName\":\"Nayan\",\"xToken\":\"81pqpq6n987550556mn509hnh6271phn\",\"xMID\":\"xxxxxxxxxx9999\",\"xTID\":\"xxxxx6789\",\"xCurrency\":\"USD\",\"xDate\":\"1/7/2025 1:17:56 AM\",\"xEntryMethod\":\"Keyed\"}', '2025-01-07 06:17:56', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_user`
--

CREATE TABLE `tbl_user` (
  `user_id` int(11) NOT NULL,
  `email` varchar(124) NOT NULL,
  `password` varchar(255) NOT NULL,
  `refresh_token` varchar(255) DEFAULT NULL,
  `role` enum('librarian','student') NOT NULL DEFAULT 'student',
  `perms` varchar(1024) DEFAULT 'submit-inquiry,get-book-reviews,get-reviews,post-book-review,post-review,get-books-by-genre,recently-added-books,most-liked-books,search,edit-profile,like-book,get-transactions,process-dues,get-borrow-list,read-book,request-book,get-books,get-requests',
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `isDeleted` tinyint(1) NOT NULL DEFAULT 0,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `phoneno` char(20) NOT NULL,
  `otp` varchar(6) DEFAULT NULL,
  `otp_expiry` bigint(20) DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_user`
--

INSERT INTO `tbl_user` (`user_id`, `email`, `password`, `refresh_token`, `role`, `perms`, `createdAt`, `updatedAt`, `isDeleted`, `first_name`, `last_name`, `phoneno`, `otp`, `otp_expiry`, `profile_image`) VALUES
(1, 'dhruvalS@gmail.com', '$2a$10$iR/m/mZxnjzk.kk/My/cbukIX94uBqM2CuiTP2rqtq7WydIUMibKO', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJkaHJ1dmFsU0BnbWFpbC5jb20iLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTczNTYzODIyOSwiZXhwIjoxNzM4MjMwMjI5fQ.9MIPkBMdKj65VbOli4jff2jna3I1SRaNzn4lj784JAs', 'student', 'submit-inquiry,get-book-reviews,get-reviews,post-book-review,post-review,get-books-by-genre,recently-added-books,most-liked-books,search,edit-profile,like-book,get-transactions,process-dues,get-borrow-list,read-book,request-book,get-books,get-requests', '2024-11-28 07:40:27', '2025-01-10 11:02:00', 0, 'Anthoniii', 'Smithi', '9612549555', '247831', 1735568497001, 'http://res.cloudinary.com/dybdcoc9k/image/upload/v1736502322/books/2025-01-10T094521015Z_download.jpg.jpg'),
(2, 'dhruvalL@gmail.com', '$2a$10$wWhabXXxlViFEZrcxDB2OOgcjD5gAWMdIroXw9gLo9N7WCbALgZSm', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJkaHJ1dmFsTEBnbWFpbC5jb20iLCJyb2xlIjoibGlicmFyaWFuIiwiaWF0IjoxNzM0NjkxODYwLCJleHAiOjE3MzQ3NzgyNjB9.nN5MpehwEl-vzw9y9jLkUAsPU34m4IrYXGbVKH9Mc44', 'librarian', 'check-inquiry,get-inquiries,get-book-reviews,get-reviews,search,get-books-by-genre,validate-book-copies,recently-added-books,most-liked-books,get-user,edit-profile,dashboard,get-transactions,delete-book,release-book,get-borrow-list,accept-book-request,validate-data,read-book,create-user,get-requests,get-users,create-book,get-books,delete-user', '2024-11-28 07:40:52', '2025-01-10 11:41:59', 0, 'Will', 'Smith', '9899566556', NULL, NULL, NULL),
(4, 'gauravL@gmail.com', '$2a$10$DLryzG5az9s6hqgYIW.wVO6IMjCR6TVCTuBIRyel4RpLqmOSZXqYa', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJnYXVyYXZMQGdtYWlsLmNvbSIsInJvbGUiOiJsaWJyYXJpYW4iLCJzZXNzaW9uSWQiOjE1NTQsImlhdCI6MTczNzYxOTEwMywiZXhwIjoxNzQwMjExMTAzfQ.ohsO-d1wIVUjn_5P6dlEgDca_ddgVfsZ3TWbnDSJotY', 'librarian', 'check-inquiry,get-inquiries,get-book-reviews,get-reviews,search,get-books-by-genre,validate-book-copies,recently-added-books,most-liked-books,get-user,edit-profile,dashboard,get-transactions,delete-book,release-book,get-borrow-list,accept-book-request,validate-data,read-book,create-user,get-requests,get-users,create-book,get-books,delete-user', '2024-11-28 07:41:07', '2025-01-23 07:58:23', 0, 'Gaurav', 'Gupta', '8477520125', NULL, NULL, 'http://res.cloudinary.com/dybdcoc9k/image/upload/v1736502322/books/2025-01-10T094521015Z_download.jpg.jpg'),
(6, 'gauravS@gmail.com', '$2a$10$IkyuChH1HTOBOrKJi1S4ye9i5wkyMCUYrfH/LTSax6pggeqM4z0Za', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJnYXVyYXZTQGdtYWlsLmNvbSIsInJvbGUiOiJzdHVkZW50Iiwic2Vzc2lvbklkIjoxNTQ5LCJpYXQiOjE3Mzc2MTg5MTYsImV4cCI6MTc0MDIxMDkxNn0.E-G6WJ-qOYzOuXdisGqLdbsZG2wZL3lYNunsO2FhCds', 'student', 'submit-inquiry,get-book-reviews,get-reviews,post-book-review,post-review,get-books-by-genre,recently-added-books,most-liked-books,search,edit-profile,like-book,get-transactions,process-dues,get-borrow-list,read-book,request-book,get-books,get-requests', '2024-11-28 07:41:29', '2025-01-23 07:55:16', 0, 'Gaurav', 'Student', '8425477822', NULL, NULL, 'http://res.cloudinary.com/dybdcoc9k/image/upload/v1736320764/books/2025-01-08T071921738Z_1bfd48405dcf9924ef71d3c3d9d79422.jpg.jpg'),
(7, 'miraliS@gmail.com', '$2a$10$xsTag0Q9fBxkT/baXror5OBup9ZDdkaZgboiW1ArCCFBkpBY.Eal6', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJtaXJhbGlTQGdtYWlsLmNvbSIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzMyNzg4MTI5LCJleHAiOjE3MzI4NzQ1Mjl9.tJZLjJQcwvNfgsBj38yXKSqEJYiu0VomESRlw_KxpM8', 'student', 'submit-inquiry,get-book-reviews,get-reviews,post-book-review,post-review,get-books-by-genre,recently-added-books,most-liked-books,search,edit-profile,like-book,get-transactions,process-dues,get-borrow-list,read-book,request-book,get-books,get-requests', '2024-11-28 07:41:58', '2025-01-10 11:02:00', 0, 'Mike', 'Anderson', '9845659823', NULL, NULL, 'http://res.cloudinary.com/dybdcoc9k/image/upload/v1735118862/books/2024-12-25T092741997Z_chk.jpg.jpg'),
(9, 'miraliL@gmail.com', '$2a$10$VtMCo/MwkqORV5667dTpUeNomw5SecPrSy.bfNtCfPkYq8NPrVnLi', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiZW1haWwiOiJtaXJhbGlMQGdtYWlsLmNvbSIsInJvbGUiOiJsaWJyYXJpYW4iLCJzZXNzaW9uSWQiOjE1NDIsImlhdCI6MTczNzYxODcyMiwiZXhwIjoxNzQwMjEwNzIyfQ.Nc_MH3KdWx-x8GaZR84WsoD0aQRshfoHrbm-EnJQPrI', 'librarian', 'check-inquiry,get-inquiries,get-book-reviews,get-reviews,search,get-books-by-genre,validate-book-copies,recently-added-books,most-liked-books,get-user,edit-profile,dashboard,get-transactions,delete-book,release-book,get-borrow-list,accept-book-request,validate-data,read-book,create-user,get-requests,get-users,create-book,get-books,delete-user', '2024-11-28 07:42:40', '2025-01-23 07:52:02', 0, 'sachin', 'jigar', '8425477862', '961478', 1737186218680, 'http://res.cloudinary.com/dybdcoc9k/image/upload/v1737197904/books/2025-01-18T105822629Z_pngwing.com.png.png'),
(10, 'nayanL@gmail.com', '$2a$10$DUqrisKl6p8eH408dlwnDuyDpHG33dWYPDsHltydW9wQmO2LbbSle', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImVtYWlsIjoibmF5YW5MQGdtYWlsLmNvbSIsInJvbGUiOiJsaWJyYXJpYW4iLCJpYXQiOjE3Mzc2MTUxODQsImV4cCI6MTc0MDIwNzE4NH0.uIoekvXKGnJvxqvghPwz9X93RXW926oNKUtvqgaVd98', 'librarian', 'check-inquiry,get-inquiries,get-book-reviews,get-reviews,search,get-books-by-genre,validate-book-copies,recently-added-books,most-liked-books,get-user,edit-profile,dashboard,get-transactions,delete-book,release-book,get-borrow-list,accept-book-request,validate-data,read-book,create-user,get-requests,get-users,create-book,get-books,delete-user', '2024-11-28 07:43:01', '2025-01-23 06:53:04', 0, 'Nayan', 'Ahir', '8341919753', NULL, NULL, 'http://res.cloudinary.com/dybdcoc9k/image/upload/v1737435996/books/2025-01-21T050633314Z_chiku.jpg.jpg'),
(11, 'nayanS@gmail.com', '$2a$10$DiCUiHgvhaAQcIMgzpJabO.P8U4dGvJfCGo59cywwnqAecLBZwboW', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsImVtYWlsIjoibmF5YW5TQGdtYWlsLmNvbSIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzMyODU3NjEyLCJleHAiOjE3MzI5NDQwMTJ9.zG5IP6k3wAvqH7cNaRHI6UiPOiASoCd3qyhq6pZoDCs', 'student', 'submit-inquiry,get-book-reviews,get-reviews,post-book-review,post-review,get-books-by-genre,recently-added-books,most-liked-books,search,edit-profile,like-book,get-transactions,process-dues,get-borrow-list,read-book,request-book,get-books,get-requests', '2024-11-28 07:43:09', '2025-01-10 11:02:00', 0, 'Justin', 'Bieber', '7990689760', NULL, NULL, 'http://res.cloudinary.com/dybdcoc9k/image/upload/v1735973597/books/2025-01-04T065316930Z_ranchhod.jpg.jpg'),
(14, 'khushalS@gmail.com', '$2a$10$phAe7yco2tk9WSbpx39GwuoVkPk95qaDyT3RwKigAKy/1NvokQtLy', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImVtYWlsIjoia2h1c2hhbFNAZ21haWwuY29tIiwicm9sZSI6InN0dWRlbnQiLCJpYXQiOjE3MzM1NTQ3MDksImV4cCI6MTczMzY0MTEwOX0.562CMF-W5695byheYXFf2qDvLsBPgZz_rF4vw9HhhJE', 'student', 'submit-inquiry,get-book-reviews,get-reviews,post-book-review,post-review,get-books-by-genre,recently-added-books,most-liked-books,search,edit-profile,like-book,get-transactions,process-dues,get-borrow-list,read-book,request-book,get-books,get-requests', '2024-11-28 07:43:38', '2025-01-10 11:02:00', 0, 'Bobby', 'Singh', '6897982790', NULL, NULL, 'http://res.cloudinary.com/dybdcoc9k/image/upload/v1735970543/books/2025-01-04T060222569Z_hero3.jpg.jpg'),
(15, 'khushalL@gmail.com', '$2a$10$wiJGkTBlkW68gkOBTDm.P.zd1.PuB1jGnyNc9J.6nHS104ndcWb5a', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsImVtYWlsIjoia2h1c2hhbExAZ21haWwuY29tIiwicm9sZSI6ImxpYnJhcmlhbiIsInNlc3Npb25JZCI6MTY0NCwiaWF0IjoxNzM3NjkyMzY4LCJleHAiOjE3NDAyODQzNjh9.70cB0Kes3BwOtzrI6sh_4CxmUpbmv61ShY6lm--i4o0', 'librarian', 'check-inquiry,get-inquiries,get-book-reviews,get-reviews,search,get-books-by-genre,validate-book-copies,recently-added-books,most-liked-books,get-user,edit-profile,dashboard,get-transactions,delete-book,release-book,get-borrow-list,accept-book-request,validate-data,read-book,create-user,get-requests,get-users,create-book,get-books,delete-user', '2024-11-28 07:43:59', '2025-01-24 04:19:28', 0, 'khush', 'vaghela', '7089898898', '816791', 1735033807225, 'http://res.cloudinary.com/dybdcoc9k/image/upload/v1735122610/books/2024-12-25T103009377Z_240_F_828478393_NPlgXq1Z2XXfxyM53SmjE3Z15SrR13Nh.jpg.jpg'),
(32, 'nayandangar1@gmail.com', '$2a$10$nIOK.i.s6Ht0b.s1QLpUpurhFUh7go/VT7lBLfHlwAg4gbdQLmumS', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzIsImVtYWlsIjoibmF5YW5kYW5nYXIxQGdtYWlsLmNvbSIsInJvbGUiOiJzdHVkZW50Iiwic2Vzc2lvbklkIjoxNjQzLCJpYXQiOjE3Mzc2NDE3MzAsImV4cCI6MTc0MDIzMzczMH0.Kzi1ZAVcwCUfSKncKHhvyupfN5GRRghdp5xgEMYXkNc', 'student', 'submit-inquiry,get-book-reviews,get-reviews,post-book-review,post-review,get-books-by-genre,recently-added-books,most-liked-books,search,edit-profile,like-book,get-transactions,process-dues,get-borrow-list,read-book,request-book,get-books,get-requests', '2024-11-29 05:47:06', '2025-01-23 14:15:30', 0, 'Nayan', 'Dangar', '8347919742', NULL, NULL, 'http://res.cloudinary.com/dybdcoc9k/image/upload/v1736422893/books/2025-01-09T114131090Z_images%20%284%29.jpg.jpg'),
(34, 'gaurav@gmail.com', '$2a$10$Cpme347V0I7WD7l6W56EueZxcV.mpkf9es7WaQKs1wz3gk8q.XhMO', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzQsImVtYWlsIjoiZ2F1cmF2QGdtYWlsLmNvbSIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzMyODYyMjE4LCJleHAiOjE3MzI5NDg2MTh9.PLZnQLTHpY2HxYgLrnpji06fbzYOIBC7zyBrzIIYEfU', 'student', 'submit-inquiry,get-book-reviews,get-reviews,post-book-review,post-review,get-books-by-genre,recently-added-books,most-liked-books,search,edit-profile,like-book,get-transactions,process-dues,get-borrow-list,read-book,request-book,get-books,get-requests', '2024-11-29 06:36:21', '2025-01-10 11:02:00', 0, 'Gaurav', 'Gupta', '7894561230', NULL, NULL, NULL),
(56, 'khush1@gmail.com', '$2a$10$8IKRMzE4M2J8UFE3qKAyA.9yJvlBVEfsRpwkmhapBQutVuFvoaltm', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTYsImVtYWlsIjoia2h1c2gxQGdtYWlsLmNvbSIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzMzMzc2NTI2LCJleHAiOjE3MzM0NjI5MjZ9.HCMi8FKq7OUuy6s5cG49xR2gBXNXOAsc8PPuK_dzsbE', 'student', 'submit-inquiry,get-book-reviews,get-reviews,post-book-review,post-review,get-books-by-genre,recently-added-books,most-liked-books,search,edit-profile,like-book,get-transactions,process-dues,get-borrow-list,read-book,request-book,get-books,get-requests', '2024-12-03 08:06:12', '2025-01-10 11:02:00', 0, 'khush', 'vaghela', '1234567890', NULL, NULL, 'http://res.cloudinary.com/dybdcoc9k/image/upload/v1735300225/books/2024-12-27T115024630Z_images2.jpg.jpg'),
(67, 'yash@gmail.com', '$2a$10$lQxVc0bvj7iE5AEa0nU3OOPR8/gCMpKfsv/lk9JKylNw60syc8X7O', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjcsImVtYWlsIjoieWFzaEBnbWFpbC5jb20iLCJyb2xlIjoic3R1ZGVudCIsInNlc3Npb25JZCI6MTY0MSwiaWF0IjoxNzM3NjQxMTMxLCJleHAiOjE3NDAyMzMxMzF9.RrpVOIggsgIIyi7m-ECGlQI6_FQXeAEIdqabBEvtSrg', 'student', 'submit-inquiry,get-book-reviews,get-reviews,post-book-review,post-review,get-books-by-genre,recently-added-books,most-liked-books,search,edit-profile,like-book,get-transactions,process-dues,get-borrow-list,read-book,request-book,get-books,get-requests', '2024-12-04 05:02:04', '2025-01-23 14:05:31', 0, 'khuhshal', 'liririririri', '213265626565', '473698', 1735540291819, 'http://res.cloudinary.com/dybdcoc9k/image/upload/v1734518341/books/2024-12-18T103859721Z_images.jfif.jpg'),
(73, 'khushVaghela@gmail.com', '$2a$10$loDn91LX0bqJltu6SdN/Ae1peDY59KZ2F.sW4PDAuAvUvFVc/MCCu', NULL, 'student', 'submit-inquiry,get-book-reviews,get-reviews,post-book-review,post-review,get-books-by-genre,recently-added-books,most-liked-books,search,edit-profile,like-book,get-transactions,process-dues,get-borrow-list,read-book,request-book,get-books,get-requests', '2024-12-12 05:31:07', '2025-01-10 11:02:00', 0, 'khush', 'vaghela', '888888888888', NULL, NULL, 'http://res.cloudinary.com/dybdcoc9k/image/upload/v1733826706/books/you_can/2024-12-10T103145039Z_81fTsv3pkkL._SL1500_.jpg.jpg'),
(76, 'moradiyamirali9@gmail.com', '$2a$10$ZHm7mqvfLulemTtyLF7e4.sMj023i87E1/GjUJXGytvwIZmMexiwy', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzYsImVtYWlsIjoibW9yYWRpeWFtaXJhbGk5QGdtYWlsLmNvbSIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzM3MTA2MTk1LCJleHAiOjE3Njg2NDIxOTV9.k411rnnbaXxYkGB7-_1k5rHXj78faa1H59GDOiUqSkQ', 'student', 'submit-inquiry,get-book-reviews,get-reviews,post-book-review,post-review,get-books-by-genre,recently-added-books,most-liked-books,search,edit-profile,like-book,get-transactions,process-dues,get-borrow-list,read-book,request-book,get-books,get-requests', '2024-12-13 11:41:34', '2025-01-17 09:29:55', 0, 'mirali', 'moradiya', '1222323434', NULL, NULL, NULL),
(77, 'vaghelakhush926@gmail.com', '$2a$10$JC6053bkUK6DLqyengMavOeEPQZ0fWmtH28j5g4qj.KZGV7K0OCA2', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzcsImVtYWlsIjoidmFnaGVsYWtodXNoOTI2QGdtYWlsLmNvbSIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzM3NDU2NDk3LCJleHAiOjE3Njg5OTI0OTd9.kN__J5kNc8V3Ceh3Hff2GjWj2U0xxTSAB4xoMUNkY5o', 'student', 'submit-inquiry,get-book-reviews,get-reviews,post-book-review,post-review,get-books-by-genre,recently-added-books,most-liked-books,search,edit-profile,like-book,get-transactions,process-dues,get-borrow-list,read-book,request-book,get-books,get-requests', '2024-12-13 11:47:01', '2025-01-21 10:48:17', 0, 'khush', 'vaghela', '55455645444', '979321', 1737445650773, NULL),
(91, 'gauravguptaofficework@gmail.com', '$2a$10$DArHHQaXE/.2miUlN/rBBueRnVfeWZHdzZZXyG8vFnLXk35HTqm66', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTEsImVtYWlsIjoiZ2F1cmF2Z3VwdGFvZmZpY2V3b3JrQGdtYWlsLmNvbSIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzM1MTk4MzI1LCJleHAiOjE3MzUyODQ3MjV9.7ySXdTurlVjVBqBGyrEHYDiTobhAiSRnL-CGWLzyam4', 'student', 'submit-inquiry,get-book-reviews,get-reviews,post-book-review,post-review,get-books-by-genre,recently-added-books,most-liked-books,search,edit-profile,like-book,get-transactions,process-dues,get-borrow-list,read-book,request-book,get-books,get-requests', '2024-12-18 06:48:15', '2025-01-10 11:02:00', 0, 'Gaurav', 'Office', '8425477862', NULL, NULL, 'http://res.cloudinary.com/dybdcoc9k/image/upload/v1734509182/books/2024-12-18T080617899Z_1bfd48405dcf9924ef71d3c3d9d79422.jpg.jpg'),
(92, 'nvdangar98@gmail.com', '$2a$10$Rlu9RxXRpKlB6qUIOiD.AuhAj1kWmgqsXrVrrpoalWWWVYpJqkDVK', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTIsImVtYWlsIjoibnZkYW5nYXI5OEBnbWFpbC5jb20iLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTczNDU5NTQ2MCwiZXhwIjoxNzM0NjgxODYwfQ.ZHA6-vTM8GfSMAF6UYjshbuNQLSdUQbC1-L8lNNUXp0', 'student', 'submit-inquiry,get-book-reviews,get-reviews,post-book-review,post-review,get-books-by-genre,recently-added-books,most-liked-books,search,edit-profile,like-book,get-transactions,process-dues,get-borrow-list,read-book,request-book,get-books,get-requests', '2024-12-18 13:06:51', '2025-01-10 11:02:00', 0, 'Nayan', 'Dangar', '8347919742', NULL, NULL, 'http://res.cloudinary.com/dybdcoc9k/image/upload/v1734609503/books/2024-12-19T115821795Z_mahadev2.jpg.jpg'),
(132, 'ram123@gmail.com', '$2a$10$rHE.N4Oby5.Y1h.ixENdcurskux97KkzEv8AG6aCfkBviKcsbok/m', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMyLCJlbWFpbCI6InJhbTEyM0BnbWFpbC5jb20iLCJyb2xlIjoic3R1ZGVudCIsInNlc3Npb25JZCI6MTY0MCwiaWF0IjoxNzM3NjM5NTQ3LCJleHAiOjE3NDAyMzE1NDd9.bxH5R8Pl6nGVKP765HlOPOINgiBC6ZpM8pehpvqoScM', 'student', 'submit-inquiry,get-book-reviews,get-reviews,post-book-review,post-review,get-books-by-genre,recently-added-books,most-liked-books,search,edit-profile,like-book,get-transactions,process-dues,get-borrow-list,read-book,request-book,get-books,get-requests', '2025-01-06 06:05:15', '2025-01-23 13:39:07', 0, 'ram123', 'ram', '9743221122', '491727', 1737632228928, NULL),
(136, 'anshuman@gmail.com', '$2a$10$kxG3eVpwOyRJWGWqMasyeuEot7t8xjRzNRreXZrSxwT.HnE8922Sa', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTM2LCJlbWFpbCI6ImFuc2h1bWFuQGdtYWlsLmNvbSIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzM3Mzc4NDk5LCJleHAiOjE3Mzk5NzA0OTl9.FnCQM0vEZ85iogknWtrdnNrWwktEJowTjvaS61Ee0cw', 'student', 'submit-inquiry,get-book-reviews,get-reviews,post-book-review,post-review,get-books-by-genre,recently-added-books,most-liked-books,search,edit-profile,like-book,get-transactions,process-dues,get-borrow-list,read-book,request-book,get-books,get-requests', '2025-01-20 05:21:00', '2025-01-23 04:42:47', 1, 'anshuman', 'anuman', '1234567890', NULL, NULL, NULL),
(140, 'q@gmail.com', '$2a$10$NHexfBqAKuWRCEDk8t0/5O2I3QZDQ6LBKWU34MCoDNMEIV1x5d7FG', NULL, 'student', 'submit-inquiry,get-book-reviews,get-reviews,post-book-review,post-review,get-books-by-genre,recently-added-books,most-liked-books,search,edit-profile,like-book,get-transactions,process-dues,get-borrow-list,read-book,request-book,get-books,get-requests', '2025-01-21 07:18:45', '2025-01-21 09:22:45', 1, 'qa', 'Qa', '8765456889', NULL, NULL, NULL),
(141, 'qyy@gmail.com', '$2a$10$mIdD0iKQkXoKiC8xRclXweecrk4jWhajXiu7kY8lvRIQxghwsjRFi', NULL, 'student', 'submit-inquiry,get-book-reviews,get-reviews,post-book-review,post-review,get-books-by-genre,recently-added-books,most-liked-books,search,edit-profile,like-book,get-transactions,process-dues,get-borrow-list,read-book,request-book,get-books,get-requests', '2025-01-21 07:19:50', '2025-01-21 09:22:49', 1, 'qa', 'qa', '7877998888', NULL, NULL, NULL),
(146, 'vivek11@gmail.com', '$2a$10$7NMrgqk13foKFpBhAYqOguQpc0zbApuPu1QtiIzlQUPEDZ1tPMzWO', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQ2LCJlbWFpbCI6InZpdmVrMTFAZ21haWwuY29tIiwicm9sZSI6InN0dWRlbnQiLCJpYXQiOjE3Mzc0NTYxMzEsImV4cCI6MTc2ODk5MjEzMX0.OGoNl6L-IpPpn6rbX9UM97jDDVF4bvPYF5eJThvwywA', 'student', 'submit-inquiry,get-book-reviews,get-reviews,post-book-review,post-review,get-books-by-genre,recently-added-books,most-liked-books,search,edit-profile,like-book,get-transactions,process-dues,get-borrow-list,read-book,request-book,get-books,get-requests', '2025-01-21 09:39:54', '2025-01-21 10:42:11', 0, 'Vivek', 'lathiya', '9724719533', NULL, NULL, NULL),
(147, 'ss@gmail.com', '$2a$10$.x4Jc2o56eNIt/KDCFkaGOptW8zCbUAtOhPo9P.BvfzVNl/pvK2Xm', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQ3LCJlbWFpbCI6InNzQGdtYWlsLmNvbSIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzM3NDU2NzM5LCJleHAiOjE3Njg5OTI3Mzl9.GaajvV91rYm1faGFxwgYQTBf2PVWSwEZ56SH-DpS9XQ', 'student', 'submit-inquiry,get-book-reviews,get-reviews,post-book-review,post-review,get-books-by-genre,recently-added-books,most-liked-books,search,edit-profile,like-book,get-transactions,process-dues,get-borrow-list,read-book,request-book,get-books,get-requests', '2025-01-21 09:59:43', '2025-01-23 04:42:09', 1, 'vk', 'vk', '77778778787', NULL, NULL, NULL),
(148, 'om@gmail.com', '$2a$10$t8sv/QWal4oVgVi.sfT2du6IX5pih.c111i.2tO1dBGfDiJCyLDTm', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQ4LCJlbWFpbCI6Im9tQGdtYWlsLmNvbSIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzM3NDU5MjE0LCJleHAiOjE3Njg5OTUyMTR9.nNhOrvmqcE_1RA3vhT8M3DDWY1sBoS_V5Iq4p0aY4rU', 'student', 'submit-inquiry,get-book-reviews,get-reviews,post-book-review,post-review,get-books-by-genre,recently-added-books,most-liked-books,search,edit-profile,like-book,get-transactions,process-dues,get-borrow-list,read-book,request-book,get-books,get-requests', '2025-01-21 11:33:05', '2025-01-21 11:33:34', 0, 'Om', 'Gupta', '8754197304', NULL, NULL, NULL),
(149, 'sy@gmail.com', '$2a$10$04D/VNDterlgGMh9fCtHYuLWLSlI/untfvsw.F8pouQEWS9O6doke', NULL, 'student', 'submit-inquiry,get-book-reviews,get-reviews,post-book-review,post-review,get-books-by-genre,recently-added-books,most-liked-books,search,edit-profile,like-book,get-transactions,process-dues,get-borrow-list,read-book,request-book,get-books,get-requests', '2025-01-21 11:38:54', '2025-01-23 04:42:04', 1, 'Shiva', 'Yadav', '8751326457', NULL, NULL, NULL),
(150, 'anshuman1@gmail.com', '$2a$10$LKRidVu31GwE3vqzRV22Neul6hygcKEyoBqmcn7cLCVKWnBnlmJ4e', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUwLCJlbWFpbCI6ImFuc2h1bWFuMUBnbWFpbC5jb20iLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTczNzQ2MDE5MSwiZXhwIjoxNzY4OTk2MTkxfQ.pfu9NMyZvom6uhzX_-g-DX1B4BjTtytfmx2K_y7jADw', 'student', 'submit-inquiry,get-book-reviews,get-reviews,post-book-review,post-review,get-books-by-genre,recently-added-books,most-liked-books,search,edit-profile,like-book,get-transactions,process-dues,get-borrow-list,read-book,request-book,get-books,get-requests', '2025-01-21 11:49:43', '2025-01-21 11:49:51', 0, 'anshuman', 'anuman', '12345668898', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_sessions`
--

CREATE TABLE `user_sessions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `login_timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_logged_out` tinyint(1) DEFAULT 0,
  `is_password_changed` tinyint(1) DEFAULT 0,
  `is_loggedout_by_id` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_sessions`
--

INSERT INTO `user_sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `login_timestamp`, `is_logged_out`, `is_password_changed`, `is_loggedout_by_id`) VALUES
(1608, 32, '::ffff:192.168.29.246', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36', '2025-01-23 10:17:49', 0, 0, 0),
(1609, 67, '::ffff:192.168.29.104', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', '2025-01-23 10:18:44', 1, 0, 0),
(1612, 32, '::ffff:192.168.29.246', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36 Edg/132.0.0.0', '2025-01-23 10:24:14', 0, 0, 0),
(1617, 132, '::ffff:192.168.29.104', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', '2025-01-23 10:28:00', 1, 0, 1),
(1618, 132, '::ffff:192.168.29.175', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', '2025-01-23 10:28:01', 1, 1, 0),
(1621, 67, '::ffff:192.168.29.104', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', '2025-01-23 10:32:09', 1, 0, 0),
(1623, 32, '::ffff:192.168.29.246', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', '2025-01-23 10:42:31', 1, 0, 0),
(1627, 32, '::ffff:192.168.29.246', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36', '2025-01-23 11:30:11', 0, 0, 0),
(1629, 32, '::ffff:192.168.29.246', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36', '2025-01-23 11:56:00', 0, 0, 0),
(1630, 32, '::ffff:192.168.29.246', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36', '2025-01-23 12:11:56', 0, 0, 0),
(1631, 32, '::ffff:192.168.29.246', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36', '2025-01-23 12:17:35', 0, 0, 0),
(1632, 32, '::ffff:192.168.29.246', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', '2025-01-23 12:23:37', 0, 0, 0),
(1633, 15, '::ffff:192.168.29.104', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', '2025-01-23 12:34:24', 1, 0, 0),
(1634, 67, '::ffff:192.168.29.246', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36', '2025-01-23 12:36:16', 0, 0, 0),
(1635, 15, '::ffff:192.168.29.104', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', '2025-01-23 12:40:14', 0, 0, 0),
(1636, 132, '::ffff:192.168.29.175', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', '2025-01-23 12:50:49', 1, 0, 0),
(1637, 67, '::ffff:192.168.29.104', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', '2025-01-23 12:53:21', 0, 0, 0),
(1638, 132, '::ffff:192.168.29.175', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', '2025-01-23 13:33:14', 0, 0, 0),
(1639, 32, '::ffff:192.168.29.106', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36', '2025-01-23 13:37:00', 0, 0, 0),
(1640, 132, '::ffff:192.168.29.175', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', '2025-01-23 13:39:07', 0, 0, 0),
(1641, 67, '::ffff:192.168.29.104', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36', '2025-01-23 14:05:31', 1, 0, 0),
(1642, 15, '::ffff:192.168.29.104', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36', '2025-01-23 14:05:43', 0, 0, 0),
(1643, 32, '::ffff:192.168.29.106', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36', '2025-01-23 14:15:30', 1, 0, 0),
(1644, 15, '::ffff:192.168.29.104', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', '2025-01-24 04:19:27', 0, 0, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_book`
--
ALTER TABLE `tbl_book`
  ADD PRIMARY KEY (`book_id`),
  ADD UNIQUE KEY `book_name` (`book_name`);

--
-- Indexes for table `tbl_book_reviews`
--
ALTER TABLE `tbl_book_reviews`
  ADD PRIMARY KEY (`review_id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`book_id`);

--
-- Indexes for table `tbl_borrower`
--
ALTER TABLE `tbl_borrower`
  ADD PRIMARY KEY (`borrower_id`);

--
-- Indexes for table `tbl_inquiry`
--
ALTER TABLE `tbl_inquiry`
  ADD PRIMARY KEY (`inquiry_id`);

--
-- Indexes for table `tbl_likes`
--
ALTER TABLE `tbl_likes`
  ADD PRIMARY KEY (`like_id`);

--
-- Indexes for table `tbl_media`
--
ALTER TABLE `tbl_media`
  ADD PRIMARY KEY (`media_id`);

--
-- Indexes for table `tbl_request`
--
ALTER TABLE `tbl_request`
  ADD PRIMARY KEY (`request_id`);

--
-- Indexes for table `tbl_reviews`
--
ALTER TABLE `tbl_reviews`
  ADD PRIMARY KEY (`review_id`);

--
-- Indexes for table `tbl_transaction`
--
ALTER TABLE `tbl_transaction`
  ADD PRIMARY KEY (`transaction_id`);

--
-- Indexes for table `tbl_user`
--
ALTER TABLE `tbl_user`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`email`);

--
-- Indexes for table `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_book`
--
ALTER TABLE `tbl_book`
  MODIFY `book_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=116;

--
-- AUTO_INCREMENT for table `tbl_book_reviews`
--
ALTER TABLE `tbl_book_reviews`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `tbl_borrower`
--
ALTER TABLE `tbl_borrower`
  MODIFY `borrower_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=161;

--
-- AUTO_INCREMENT for table `tbl_inquiry`
--
ALTER TABLE `tbl_inquiry`
  MODIFY `inquiry_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `tbl_likes`
--
ALTER TABLE `tbl_likes`
  MODIFY `like_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=666;

--
-- AUTO_INCREMENT for table `tbl_media`
--
ALTER TABLE `tbl_media`
  MODIFY `media_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=95;

--
-- AUTO_INCREMENT for table `tbl_request`
--
ALTER TABLE `tbl_request`
  MODIFY `request_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=201;

--
-- AUTO_INCREMENT for table `tbl_reviews`
--
ALTER TABLE `tbl_reviews`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `tbl_transaction`
--
ALTER TABLE `tbl_transaction`
  MODIFY `transaction_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT for table `tbl_user`
--
ALTER TABLE `tbl_user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=151;

--
-- AUTO_INCREMENT for table `user_sessions`
--
ALTER TABLE `user_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1645;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
