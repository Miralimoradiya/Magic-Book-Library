CREATE TABLE `tbl_transaction` (
  `transaction_id` int(11) NOT NULL AUTO_INCREMENT,
  `borrower_id` int(11) NOT NULL,
  `transaction_response` varchar(2048) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_successfull` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`transaction_id`)
) 


SELECT 
    tbl_user.user_id,
    tbl_user.first_name,
    tbl_user.last_name,
    tbl_user.email,
    tbl_user.phoneno,
    SUM(GREATEST(0, IFNULL(tbl_borrower_transactions.no_of_copies * 0.1 * DATEDIFF(IFNULL(tbl_borrower_transactions.release_date, NOW()), tbl_borrower_transactions.due_date), 0))) AS total_dues,
    SUM(CAST(JSON_UNQUOTE(JSON_EXTRACT(tbl_transaction.transaction_response,'$.xAuthAmount')) AS DECIMAL(10,2))) AS paid,
    SUM(GREATEST(0, IFNULL(tbl_borrower_transactions.no_of_copies * 0.1 * DATEDIFF(IFNULL(tbl_borrower_transactions.release_date, NOW()), tbl_borrower_transactions.due_date), 0))) 
    - SUM(CAST(JSON_UNQUOTE(JSON_EXTRACT(tbl_transaction.transaction_response,'$.xAuthAmount')) AS DECIMAL(10,2))) AS pending
FROM tbl_user

LEFT JOIN tbl_borrower AS tbl_borrower_transactions 
    ON tbl_borrower_transactions.user_id = tbl_user.user_id

LEFT JOIN tbl_transaction 
    ON tbl_transaction.borrower_id = tbl_borrower_transactions.borrower_id 
    AND tbl_transaction.is_successfull = 1

WHERE tbl_user.isDeleted = 0

GROUP BY tbl_user.user_id;
