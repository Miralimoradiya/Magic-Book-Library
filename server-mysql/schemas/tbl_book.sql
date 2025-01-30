-- CREATE TABLE `tbl_book` (
--   `book_id` int(11) NOT NULL AUTO_INCREMENT,
--   `author_name` varchar(255) NOT NULL,
--   `book_name` varchar(255) NOT NULL,
--   `publishedAt` timestamp NOT NULL DEFAULT current_timestamp(),
--   `genre` varchar(255) NOT NULL,
--   `no_of_copies` int(4) NOT NULL,
--   `isDeleted` tinyint(1) DEFAULT 0,
--   PRIMARY KEY (`book_id`),
--   UNIQUE KEY `book_name` (`book_name`)
-- )














CREATE TABLE `tbl_book` (
    `book_id` int(11) NOT NULL AUTO_INCREMENT,
    `author_name` varchar(255) NOT NULL,
    `book_name` varchar(255) NOT NULL,
    `publishedAt` timestamp NOT NULL DEFAULT current_timestamp(),
    `genre` ENUM('Fiction', 'Romantic', 'Horror', 'Children', 'Comedy', 'Suspense', 'Biography', 'Life', 'Society', 'Short stories', 'History', 'Drama', 'Action', 'Adventure', 'Mythology', 'Travel', 'Religion') NOT NULL,
    `no_of_copies` int(4) NOT NULL,
    `isDeleted` tinyint(1) DEFAULT 0,
    PRIMARY KEY (`book_id`),
    UNIQUE KEY `book_name` (`book_name`)
);
