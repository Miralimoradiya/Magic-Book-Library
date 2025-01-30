CREATE TABLE `user_sessions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `login_timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_logged_out` tinyint(1) DEFAULT 0,
  `is_password_changed` TINYINT(1) DEFAULT 0;
   `is_loggedout_by_id` tinyint(1) DEFAULT 0,
  `location` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) 