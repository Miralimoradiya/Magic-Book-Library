// server-mysql/models/studentModel.js
const { processCardknoxPayment } = require("../config/cardknox")
const { query, DUE_AMOUNT } = require("../config/constants")

const requestBookM = async (id, book_id, no_of_copies) => {
    try {
        const [checkIfUserHasPaidAllDues] = await query(`
            SELECT COUNT(*) AS cnt FROM tbl_borrower
            WHERE tbl_borrower.user_id = ? AND tbl_borrower.is_due_paid = 0 AND release_date IS NOT NULL
        `, [id])
        if (checkIfUserHasPaidAllDues.cnt > 0) return { success: false, message: 'Please user, pay due for previously borrowed book first.' }
        const checkBookIfItExists = await query(`
                SELECT * FROM tbl_book
                WHERE book_id = ? AND isDeleted = 0
            `, [book_id])
        if (checkBookIfItExists.length === 0) return { success: false, message: 'No such book!' }
        const presentRequestByUser = await query(`
                SELECT * FROM tbl_request
                WHERE user_id = ? AND book_id = ? AND isApproved = 'requested'
            `, [id, book_id])
        if (presentRequestByUser.length > 0) return { success: false, message: 'You have already made a request for this book.' }
        const thisBookAlreadyBorrowed = await query(`
                SELECT * FROM tbl_borrower
                WHERE user_id = ? AND book_id = ? AND release_date IS NULL
            `, [id, book_id])
        if (thisBookAlreadyBorrowed.length > 0) return { success: false, message: 'You have already borrowed this book.' }
        const uploadDataToReqTable = await query(`
                INSERT INTO tbl_request
                (user_id,book_id,no_of_copies)
                VALUES(?,?,?)
            `, [id, book_id, no_of_copies])
        if (uploadDataToReqTable.affectedRows === 1) return { success: true, message: 'Book request added!' }
    } catch (error) {
        console.log(error)
        return { success: false, message: error }
    }
}

const processPendingDuesM = async (user_id, obj) => {
    try {
        const { borrow_id, amount, cardNumber, cardExpiration, cvv, name } = obj;
        const [checkIfReturned] = await query(`
                SELECT *,(GREATEST(0,tbl_borrower.no_of_copies * ${DUE_AMOUNT} * DATEDIFF(IFNULL(tbl_borrower.release_date,NOW()),tbl_borrower.due_date))) AS due_amount FROM tbl_borrower
                WHERE tbl_borrower.borrower_id = ? AND tbl_borrower.user_id = ?
                `, [obj.borrow_id, user_id])
        // checks
        if (!checkIfReturned) return { success: false, message: 'Invalid Entry.' }
        if (checkIfReturned.release_date === null) return { success: false, message: 'Cannot pay before returning the book.' }
        if (checkIfReturned.is_due_paid === 1) return { success: false, message: 'Transaction was processed earlier.' }
        if (checkIfReturned.due_amount != amount) return { success: false, message: 'amount mismatch, either less amount is being paid or more amount is being paid' }
        // checks ended
        const payment = await processCardknoxPayment(amount, cardNumber, cardExpiration, cvv, name);
        const sendTodb = await query(`
            INSERT INTO tbl_transaction(borrower_id, transaction_response,is_successfull)
            VALUES (?, ?,?)
            `, [borrow_id, JSON.stringify(payment), payment.xResult === 'A']);
        if (payment.xResult === 'A' && sendTodb.affectedRows === 1) {
            await query(`
                    UPDATE tbl_borrower
                    SET tbl_borrower.is_due_paid = 1
                    WHERE tbl_borrower.borrower_id = ? AND tbl_borrower.user_id = ?
                `, [obj.borrow_id, user_id])
            return { success: true, message: 'Transaction successful' };
        } else {
            return { success: false, message: payment.xError || 'Payment failed' };
        }
    } catch (error) {
        console.error('Error processing payment:', error);
        return { success: false, message: 'An error occurred while processing the payment' };
    }
};

const likeBookM = async (obj) => {
    try {
        const [checkIfAlreadyLiked] = await query(`
            SELECT COUNT(*) AS cnt FROM tbl_likes
            WHERE tbl_likes.user_id = ? AND tbl_likes.book_id = ?
        `, [obj.user_id, obj.book_id]);

        if (checkIfAlreadyLiked.cnt > 0) {
            await query(`
                DELETE FROM tbl_likes
                WHERE tbl_likes.user_id = ? AND tbl_likes.book_id = ?
            `, [obj.user_id, obj.book_id]);

            return { success: true, message: 'Disliked!' };
        } else {
            await query(`
                INSERT INTO tbl_likes(user_id, book_id)
                VALUES (?, ?)
            `, [obj.user_id, obj.book_id]);

            return { success: true, message: 'Liked!' };
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
}



const postReviewM = async (user_id, rating, message) => {
    try {
        const [existingReview] = await query(`
            SELECT * FROM tbl_reviews
            WHERE user_id = ?
        `, [user_id]);

        if (existingReview) {
            return { success: false, message: 'You have already posted a review.' };
        }
        const insertResult = await query(`
            INSERT INTO tbl_reviews (user_id, rating, message)
            VALUES (?, ?, ?)
        `, [user_id, rating, message]);

        if (insertResult.affectedRows === 1) {
            return { success: true, message: 'Review posted successfully' };
        } else {
            return { success: false, message: 'Failed to post review' };
        }
    } catch (error) {
        console.error('Error in postReviewM model:', error);
        return { success: false, message: 'An error occurred while posting the review' };
    }
};

const postBookReviewM = async (user_id, book_id, rating, message) => {
    try {
        // Check if the user has already posted a review for this book
        const [existingReview] = await query(`
            SELECT * FROM tbl_book_reviews
            WHERE user_id = ? AND book_id = ?
        `, [user_id, book_id]);

        if (existingReview) {
            return { success: false, message: 'You have already posted a review for this book.' };
        }

        // Insert the book-specific review into the database
        const insertResult = await query(`
            INSERT INTO tbl_book_reviews (user_id, book_id, rating, message)
            VALUES (?, ?, ?, ?)
        `, [user_id, book_id, rating, message]);

        if (insertResult.affectedRows === 1) {
            return { success: true, message: 'Book review posted successfully' };
        } else {
            return { success: false, message: 'Failed to post book review' };
        }
    } catch (error) {
        console.error('Error in postBookReviewM model:', error);
        return { success: false, message: 'An error occurred while posting the review' };
    }
};

const submitInquiryM = async (user_name, user_email, subject, city, state, country, enquiry_type, phone_number, message) => {
    try {
        const result = await query(`
            INSERT INTO tbl_inquiry (user_name, user_email, subject, city, state, country, enquiry_type, phone_number, message)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [user_name, user_email, subject, city, state, country, enquiry_type, phone_number, message]);

        if (result.affectedRows === 1) {
            return { success: true, message: 'Inquiry submitted successfully' };
        } else {
            return { success: false, message: 'Failed to submit inquiry' };
        }
    } catch (error) {
        console.error('Error in submitInquiryM model:', error);
        return { success: false, message: 'An error occurred while submitting the inquiry' };
    }
};

module.exports = { requestBookM, processPendingDuesM, likeBookM, postReviewM, postBookReviewM, submitInquiryM }