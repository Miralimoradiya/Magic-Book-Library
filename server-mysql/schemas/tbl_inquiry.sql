CREATE TABLE tbl_inquiry (
    inquiry_id INT AUTO_INCREMENT PRIMARY KEY, 
    user_name VARCHAR(255) NOT NULL, 
    user_email VARCHAR(255) NOT NULL, 
    subject VARCHAR(1024), 
    city VARCHAR(100), 
    state VARCHAR(100), 
    country VARCHAR(100), 
    enquiry_type ENUM('book queries', 'library queries') DEFAULT 'library queries', 
    phone_number VARCHAR(20), 
    message TEXT,
    librarian_check TINYINT(1) DEFAULT 0
);