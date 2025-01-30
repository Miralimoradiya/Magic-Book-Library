CREATE TABLE `tbl_book_reviews` (
    `review_id` int(11) NOT NULL AUTO_INCREMENT,
    `user_id` int(11) NOT NULL,
    `book_id` int(11) NOT NULL,  
    `rating` int(1) NOT NULL CHECK (`rating` BETWEEN 1 AND 5),
    `message` TEXT NOT NULL,
    `createdAt` datetime DEFAULT current_timestamp(),
    PRIMARY KEY (`review_id`),
    UNIQUE (`user_id`, `book_id`)  
);