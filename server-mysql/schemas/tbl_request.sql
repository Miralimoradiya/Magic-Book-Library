CREATE TABLE `tbl_request` (
  `request_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `req_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `no_of_copies` int(4) NOT NULL,
  `isApproved` enum('requested','approved','declined') NOT NULL DEFAULT 'requested',
  PRIMARY KEY (`request_id`)
)