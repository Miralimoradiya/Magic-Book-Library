// server-mysql/routes/student.routes.js
const express = require('express')
const inputVerifier = require("../middleware/inputVerifier");
const { requestBook, processPendingDues, likeBook, postReview, postBookReview, submitInquiry } = require('../controllers/student.controller');
const router = express.Router()

router.post('/post-book-review', inputVerifier(['user_id', 'book_id', 'rating', 'message']), postBookReview);
router.post('/post-review', inputVerifier(['user_id', 'rating', 'message']), postReview); 
router.post('/request-book', inputVerifier(['id', 'book_id', 'no_of_copies']), requestBook)
router.post('/process-dues', processPendingDues)
router.post('/like-book', inputVerifier(['book_id', 'id']), likeBook)
router.post('/submit-inquiry', inputVerifier(['user_name', 'user_email', 'subject', 'city', 'state', 'country', 'enquiry_type', 'phone_number', 'message']), submitInquiry);

module.exports = router