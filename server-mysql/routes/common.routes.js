// server-mysql/routes/common.routes.js
const express = require('express')
const { getActiveRequests, getBooks, getBorrowList, getTransactions, me, editProfile,getMostLikedBooks, getRecentlyAddedBooks, getBooksByGenre, searchBooks, getReviews, getBookReviews } = require('../controllers/common.controller');
const { upload } = require('../middleware/multer'); 
const router = express.Router()

router.get('/get-reviews', getReviews);
router.get('/get-book-reviews', getBookReviews);
router.post('/get-books-by-genre', getBooksByGenre);
router.get('/search', searchBooks);
router.get('/get-requests', getActiveRequests)
router.get('/get-books', getBooks)
router.get('/get-borrow-list', getBorrowList)
router.get('/get-transactions', getTransactions)
router.get('/me', me)
router.put('/edit-profile', upload.single('profileImage'), editProfile); 
router.get('/most-liked-books', getMostLikedBooks);
router.get('/recently-added-books', getRecentlyAddedBooks);

module.exports = router