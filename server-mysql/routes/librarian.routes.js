// server-mysql/routes/librarian.routes.js
const express = require('express')
const inputVerifier = require("../middleware/inputVerifier");
const { createBook, acceptBookRequest, createUser, totalUsersWhichAreNotDeleted, deleteUser, validateData, releaseBook, deleteBook, dashboard, uploadImage, getUserById, validateCopies, getInquiries, checkInquiryStatus } = require('../controllers/librarian.controller');
const router = express.Router()
const { upload } = require('../middleware/multer')

router.get('/get-user/:id', inputVerifier(['id']), getUserById);
router.post('/create-book', upload.array('mediaFiles'), createBook)
router.post('/accept-book-request', inputVerifier(['request_id']), acceptBookRequest)
router.post('/create-user', inputVerifier(['email', 'password', 'first_name', 'last_name', 'phoneno', 'action']), createUser);
router.get('/get-users/', totalUsersWhichAreNotDeleted)
router.get('/get-users/:id', totalUsersWhichAreNotDeleted)
router.delete('/delete-user/:id', inputVerifier(['id']), deleteUser)
router.get('/validate-data/', validateData)
router.post('/release-book', inputVerifier(['borrower_id', 'returning_user_id', 'book_id']), releaseBook)
router.delete('/delete-book', inputVerifier(['book_id']), deleteBook)
router.get('/dashboard', dashboard)
router.post('/uploadImage', upload.array('mediaFiles'), uploadImage)
router.post('/validate-book-copies', inputVerifier(['book_id', 'no_of_copies']), validateCopies);
router.get('/get-inquiries', getInquiries);
router.post('/check-inquiry', inputVerifier(['inquiry_id']), checkInquiryStatus);

module.exports = router