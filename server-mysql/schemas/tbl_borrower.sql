CREATE TABLE `tbl_borrower` (
  `borrower_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `borrow_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `release_date` timestamp NULL DEFAULT NULL,
  `no_of_copies` int(4) NOT NULL,
  `due_date` datetime DEFAULT current_timestamp(),
  `is_due_paid` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`borrower_id`)
)