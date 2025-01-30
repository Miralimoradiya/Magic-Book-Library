// server-mysql/contollers/student.controller.js
const { requestBookM, processPendingDuesM, likeBookM, postReviewM, postBookReviewM, submitInquiryM } = require("../models/studentModel")

const requestBook = async (req, res) => {
    try {
        let data = await requestBookM(req.user.id, req.body.book_id, req.body.no_of_copies)
        if (data.success) return res.json({ message: data.message })
        return res.status(400).json({ message: data.message })
    } catch (error) {
        return res.staus(500).json({ message: error })
    }
}

const processPendingDues = async (req, res) => {
    try {
        const { borrow_id, amount, cardNumber, cardExpiration, cvv, name } = req.body;

        if (!borrow_id || !amount || !cardNumber || !cardExpiration || !cvv || !name) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const result = await processPendingDuesM(req.user.id, { borrow_id, amount, cardNumber, cardExpiration, cvv, name });

        if (result.success) {
            return res.json({ message: result.message });
        } else {
            return res.status(400).json({ message: result.message });
        }
    } catch (error) {
        console.error('Error in API handler:', error);
        return res.status(500).json({ message: 'An unexpected error occurred' });
    }
};

const likeBook = async (req, res) => {
    try {
        const resp = await likeBookM({ user_id: req.user.id, book_id: req.query.book_id })
        if (resp.success) return res.json({ message: resp.message })
    } catch (error) {
        return res.status(500).json({ message: error })
    }
}


const postReview = async (req, res) => {
    try {
        const { user_id, rating, message } = req.body;

        // Check if all required fields are present
        if (!user_id || !rating || !message) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Validate rating (it should be between 1 and 5)
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        // Insert the review into the database
        const result = await postReviewM(user_id, rating, message);
        if (result.success) {
            return res.json({ message: result.message });
        } else {
            return res.status(400).json({ message: result.message });
        }

    } catch (error) {
        console.error('Error in postReview controller:', error);
        return res.status(500).json({ message: 'An unexpected error occurred' });
    }
};


const postBookReview = async (req, res) => {
    try {
        const { user_id, book_id, rating, message } = req.body;

        if (!user_id || !book_id || !rating || !message) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        const result = await postBookReviewM(user_id, book_id, rating, message);
        if (result.success) {
            return res.json({ message: result.message });
        } else {
            return res.status(400).json({ message: result.message });
        }
    } catch (error) {
        console.error('Error in postBookReview controller:', error);
        return res.status(500).json({ message: 'An unexpected error occurred' });
    }
};

const submitInquiry = async (req, res) => {
    try {
        const { user_name, user_email, subject, city, state, country, enquiry_type, phone_number, message } = req.body;
        const result = await submitInquiryM(user_name, user_email, subject, city, state, country, enquiry_type, phone_number, message);

        if (result.success) {
            return res.json({ message: result.message });
        } else {
            return res.status(400).json({ message: result.message });
        }
    } catch (error) {
        console.error('Error in submitInquiry controller:', error);
        return res.status(500).json({ message: 'An unexpected error occurred' });
    }
};


module.exports = { requestBook, processPendingDues, likeBook, postReview, postBookReview, submitInquiry }