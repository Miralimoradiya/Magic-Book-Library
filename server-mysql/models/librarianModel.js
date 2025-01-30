// server-mysql/models/librarianModel.js
const { query, MAX_BORROW_LIMIT, paginate, DUE_AMOUNT, editableFieldsInbooks } = require("../config/constants");
const bcrypt = require("bcryptjs");
const { orderby } = require("../config/utils");
const { uploadOnCloudinary } = require("../config/cloudinary");

const getUserByIdFromDB = async (userId) => {
    try {
        const qry = `
            SELECT 
                user_id,
                first_name,
                last_name,
                email,
                phoneno,
                profile_image,
                (SELECT SUM(GREATEST(0, IFNULL(tbl_borrower.no_of_copies * ${DUE_AMOUNT} * DATEDIFF(IFNULL(tbl_borrower.release_date, NOW()), tbl_borrower.due_date), 0))) 
                 FROM tbl_borrower 
                 WHERE tbl_borrower.user_id = tbl_user.user_id) AS total_dues,
                (SELECT SUM(
                    CASE 
                        WHEN tbl_borrower.is_due_paid = 1 THEN GREATEST(0, IFNULL(tbl_borrower.no_of_copies * 0.1 * DATEDIFF(IFNULL(tbl_borrower.release_date, NOW()), tbl_borrower.due_date), 0))
                        ELSE 0
                    END
                ) 
                 FROM tbl_borrower 
                 WHERE tbl_borrower.user_id = tbl_user.user_id) AS paid_dues,
                -- Left dues
                (SELECT SUM(GREATEST(0, IFNULL(tbl_borrower.no_of_copies * ${DUE_AMOUNT} * DATEDIFF(IFNULL(tbl_borrower.release_date, NOW()), tbl_borrower.due_date), 0))) 
                 FROM tbl_borrower 
                 WHERE tbl_borrower.user_id = tbl_user.user_id AND tbl_borrower.is_due_paid = 0) AS left_dues,
                
                -- Borrowed books details
                (SELECT COUNT(*) 
                 FROM tbl_borrower 
                 WHERE tbl_borrower.user_id = tbl_user.user_id AND tbl_borrower.release_date IS NULL) AS borrowed_books,
                
                -- Returned books
                (SELECT COUNT(*) 
                 FROM tbl_borrower 
                 WHERE tbl_borrower.user_id = tbl_user.user_id AND tbl_borrower.release_date IS NOT NULL) AS returned_books,
                 
                -- Book requests details
                (SELECT COUNT(*) 
                 FROM tbl_request 
                 WHERE tbl_request.user_id = tbl_user.user_id AND tbl_request.isApproved = 'requested') AS requested_books,
                 
                (SELECT COUNT(*) 
                 FROM tbl_request 
                 WHERE tbl_request.user_id = tbl_user.user_id AND tbl_request.isApproved = 'approved') AS approved_books,
                 
                (SELECT COUNT(*) 
                 FROM tbl_request 
                 WHERE tbl_request.user_id = tbl_user.user_id AND tbl_request.isApproved = 'declined') AS declined_books

            FROM tbl_user
            WHERE tbl_user.user_id = ? AND tbl_user.isDeleted = 0
        `;

        const user = await query(qry, [userId]);

        if (user.length > 0) {
            const userDetails = user[0];

            const borrowedBooksDetails = await query(`
                SELECT 
                    tbl_borrower.book_id,
                    tbl_book.book_name AS book_title,
                    tbl_borrower.no_of_copies,
                    IFNULL(tbl_borrower.release_date, 'Not Returned') AS release_date,
                    GREATEST(0, IFNULL(tbl_borrower.no_of_copies * ${DUE_AMOUNT} * DATEDIFF(IFNULL(tbl_borrower.release_date, NOW()), tbl_borrower.due_date), 0)) AS due_amount
                FROM tbl_borrower
                JOIN tbl_book ON tbl_borrower.book_id = tbl_book.book_id
                WHERE tbl_borrower.user_id = ? AND tbl_borrower.is_due_paid = 0
            `, [userId]);

            const pastBorrowingsDetails = await query(`
                SELECT 
                    tbl_borrower.book_id,
                    tbl_book.book_name AS book_title,
                    tbl_borrower.no_of_copies,
                    tbl_borrower.borrow_date,
                    tbl_borrower.release_date,
                    tbl_borrower.due_date,
                    GREATEST(0, IFNULL(tbl_borrower.no_of_copies * ${DUE_AMOUNT} * DATEDIFF(tbl_borrower.release_date, tbl_borrower.due_date), 0)) AS due_amount,
                    tbl_borrower.is_due_paid
                FROM tbl_borrower
                JOIN tbl_book ON tbl_borrower.book_id = tbl_book.book_id
                WHERE tbl_borrower.user_id = ? AND tbl_borrower.release_date IS NOT NULL
            `, [userId]);

            const transactionDetails = await query(`
                SELECT 
                    tbl_transaction.transaction_id,
                    tbl_transaction.createdAt AS transaction_date,
                    tbl_book.book_name,
                    JSON_UNQUOTE(JSON_EXTRACT(tbl_transaction.transaction_response, '$.xAuthAmount')) AS amount,
                    JSON_UNQUOTE(JSON_EXTRACT(tbl_transaction.transaction_response, '$.xMaskedCardNumber')) AS card_number,
                    JSON_UNQUOTE(JSON_EXTRACT(tbl_transaction.transaction_response, '$.xError')) AS error,
                    tbl_transaction.is_successfull,
                    tbl_borrower.book_id,
                    tbl_borrower.borrower_id
                FROM tbl_transaction
                JOIN tbl_borrower ON tbl_borrower.borrower_id = tbl_transaction.borrower_id
                JOIN tbl_book ON tbl_borrower.book_id = tbl_book.book_id
                WHERE tbl_borrower.user_id = ?
            `, [userId]);

            // Fetch requested books details
            const requestedBooksDetails = await query(`
                SELECT 
                    tbl_request.book_id,
                    tbl_book.book_name AS book_title,
                    tbl_request.no_of_copies,
                    tbl_request.isApproved
                FROM tbl_request
                JOIN tbl_book ON tbl_request.book_id = tbl_book.book_id
                WHERE tbl_request.user_id = ? 
            `, [userId]);

            return {
                success: true,
                data: {
                    ...userDetails,
                    borrowed_books_details: borrowedBooksDetails,
                    past_borrowings_details: pastBorrowingsDetails,
                    transaction_details: transactionDetails,
                    requested_books_details: requestedBooksDetails
                }
            };
        } else {
            console.log(`No user found with ID: ${userId}`);
            return { success: false, message: 'User not found', data: null };
        }
    } catch (error) {
        console.log('Error fetching user:', error);
        return { success: false, message: error.message, data: null };
    }
};

const createBookM = async (data, files = [], action) => {
    if (action !== 'update' && action !== 'create') {
        return { success: false, message: 'Not from available actions' };
    }
    if (action === 'update') {
        const { book_id, updates } = data;

        if (!book_id || !Array.isArray(updates)) {
            return { success: false, message: 'Invalid data provided for update.' };
        }
        const [checker] = await query(`
                SELECT COUNT(*) AS cnt
                FROM tbl_book
                WHERE tbl_book.book_id = ? AND tbl_book.isDeleted = 0
            `, [book_id])
        if (checker.cnt === 0) return { success: false, message: 'No such book' }
        const validUpdates = {};
        updates.forEach((update) => {
            if (editableFieldsInbooks.includes(update.field)) {
                validUpdates[update.field] = update.value;
            }
        });

        if (Object.keys(validUpdates).length === 0) {
            return { success: false, message: 'No valid fields to update.' };
        }

        try {
            const setClause = Object.keys(validUpdates)
                .map((field) => `${field} = ?`)
                .join(', ');

            const values = Object.values(validUpdates);
            values.push(book_id); // Add book_id to the end for WHERE clause

            // Perform the update query
            const updateQuery = `UPDATE tbl_book SET ${setClause} WHERE book_id = ?`;
            const updatedBook = await query(updateQuery, values);

            if (updatedBook.affectedRows === 0) {
                return { success: false, message: 'Failed to update book or no changes detected.' };
            }

            return { success: true, message: 'Book updated successfully!' };
        } catch (error) {
            console.error('Error during book update:', error);
            return { success: false, message: 'An error occurred while updating the book.' };
        }
    }

    if (action === 'create') {
        if (!data.author_name || !data.book_name || !data.genre || !data.no_of_copies) return { success: false, message: 'missing fields' }
        if (files.length === 0) return { success: false, message: 'missing upload files' }
        const { author_name, book_name, genre, no_of_copies } = data;
        try {
            const getBookName = await query(
                `SELECT * FROM tbl_book WHERE book_name = ?`,
                [book_name]
            );
            if (getBookName.length) {
                return { success: false, message: 'Book already exists!' };
            }
            const createdBook = await query(
                `INSERT INTO tbl_book (author_name, book_name, genre, no_of_copies) VALUES (?, ?, ?, ?)`,
                [author_name, book_name, genre, no_of_copies]
            );

            if (createdBook.affectedRows !== 1) {
                return { success: false, message: 'Failed to create book!' };
            }

            const bookId = createdBook.insertId;

            let mediaUrls = [];
            if (files && files.length > 0) {
                mediaUrls = await uploadOnCloudinary(files, 'create');
            }

            if (mediaUrls.length > 0) {
                const mediaInsertPromises = mediaUrls.map((media, index) =>
                    query(
                        `INSERT INTO tbl_media (book_id, url, isCover) VALUES (?, ?, ?)`,
                        [bookId, media.url, index === 0 ? 1 : 0]
                    )
                );

                await Promise.all(mediaInsertPromises);
            }

            return {
                success: true,
                message: 'Book created successfully!',
                bookId: bookId,
                mediaCount: mediaUrls.length
            };
        } catch (error) {
            console.error('Error during book creation:', error);
            return { success: false, message: 'An error occurred while creating the book.' };
        }
    }
};

const validateBookCopies = async (book_id, no_of_copies) => {
    try {
        const [bookAvailability] = await query(`
            SELECT 
                (SELECT no_of_copies FROM tbl_book WHERE book_id = ?) - 
                (SELECT IFNULL(SUM(no_of_copies), 0) FROM tbl_borrower WHERE book_id = ? AND release_date IS NULL) AS available_copies
        `, [book_id, book_id]);
        if (no_of_copies >= bookAvailability.available_copies) {
            return { success: true, message: 'Request successful. Sufficient copies available.' };
        }

        return { 
            success: false, 
            message: `You cannot update less than ${bookAvailability.available_copies} copies` 
        };

    } catch (error) {

        console.error('Error during book copy validation:', error);
        return { success: false, message: 'An error occurred while checking available copies.' };
    }
};


const acceptBookRequestM = async (request_id, user_id) => {
    try {
        const [checkIfUserHasPaidAllDues] = await query(`
                SELECT COUNT(*) AS cnt FROM tbl_borrower
                WHERE tbl_borrower.user_id = ? AND is_due_paid = 0
            `, [user_id])
        if (checkIfUserHasPaidAllDues.cnt > 0) {
            await query(`
                    UPDATE tbl_request
                    SET isApproved = 'declined'
                    WHERE request_id = ?
                `, [request_id]);
            return { success: false, message: 'Please ask user to pay due for previously borrowed book first.' }
        }
        const [getRequestTableData] = await query(`
            SELECT * FROM tbl_request
            WHERE request_id = ?
        `, [request_id]);

        if (!getRequestTableData) {
            return { success: false, message: 'Request not found.' };
        }
        if (getRequestTableData.isApproved !== 'requested') return { success: false, message: 'book was already processed earlier!' }
        const [totalNotReturnedBooks] = await query(`
            SELECT IFNULL(COUNT(*), 0) AS count
            FROM tbl_borrower
            WHERE user_id = ? AND release_date IS NULL
        `, [getRequestTableData.user_id]);
        const [checkBook] = await query(`
            SELECT isDeleted FROM tbl_book
            WHERE book_id = ?
        `, [getRequestTableData.book_id]);

        if (checkBook.isDeleted === 1) {
            await query(`
                UPDATE tbl_request
                SET isApproved = 'declined'
                WHERE request_id = ?
            `, [request_id]);

            return { success: false, message: 'No such book.' };
        }
        if (totalNotReturnedBooks.count >= MAX_BORROW_LIMIT) {
            await query(`
                UPDATE tbl_request
                SET isApproved = 'declined'
                WHERE request_id = ?
            `, [request_id]);

            return { success: false, message: `You have reached the maximum borrow limit of ${MAX_BORROW_LIMIT} book(s).` };
        }

        await query('START TRANSACTION');

        const [bookAvailability] = await query(`
            SELECT 
                (SELECT no_of_copies FROM tbl_book WHERE book_id = ?) - 
                (SELECT IFNULL(SUM(no_of_copies), 0) FROM tbl_borrower WHERE book_id = ? AND release_date IS NULL) AS can_acquire
        `, [getRequestTableData.book_id, getRequestTableData.book_id]);

        if (bookAvailability.can_acquire < getRequestTableData.no_of_copies) {
            await query('ROLLBACK');
            await query(`
                UPDATE tbl_request
                SET isApproved = 'declined'
                WHERE request_id = ?
            `, [request_id]);

            return { success: false, message: 'Not enough copies of the book are available at the moment.' };
        }

        const borrowResult = await query(`
            INSERT INTO tbl_borrower (user_id, book_id, no_of_copies, due_date) 
            VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 48 HOUR))
        `, [getRequestTableData.user_id, getRequestTableData.book_id, getRequestTableData.no_of_copies]);
        if (borrowResult.affectedRows === 1) {
            const updationInReqTable = await query(`
                UPDATE tbl_request
                SET isApproved = 'approved'
                WHERE request_id = ?
            `, [request_id]);

            if (updationInReqTable.affectedRows === 1) {
                await query('COMMIT');
                return { success: true, message: 'Book successfully borrowed!' };
            }
        }

        await query('ROLLBACK');
        await query(`
            UPDATE tbl_request
            SET isApproved = 'declined'
            WHERE request_id = ?
        `, [request_id]);

        return { success: false, message: 'Failed to borrow the book. Please try again.' };

    } catch (error) {
        console.error('Error during borrowing process:', error);
        await query('ROLLBACK');
        await query(`
            UPDATE tbl_request
            SET isApproved = 'declined'
            WHERE request_id = ?
        `, [request_id]);

        return { success: false, message: 'An error occurred while processing your request. Please try again later.' };
    }
};

const createUserM = async (email, password, first_name, last_name, phoneno) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const existingUsers = await query(`
            SELECT email 
            FROM tbl_user 
            WHERE email = ?
        `, [email]);

        if (existingUsers.length > 0) {
            return {
                success: false,
                message: 'email already exists'
            };
        }

        const result = await query(`
            INSERT INTO tbl_user (email, password,first_name,last_name,phoneno) 
            VALUES (?, ?,?,?,?)
        `, [
            email,
            hashedPassword,
            first_name,
            last_name,
            phoneno
        ]);

        return {
            success: true,
            message: 'User registered successfully',
            userId: result.insertId
        };

    } catch (error) {
        console.error('Registration error:', error);
        return {
            success: false,
            message: 'An error occurred during registration',
            error: error.message
        };
    }
};

const updateUserM = async (userId, email, password, first_name, last_name, phoneno) => {
    try {
        const updateQuery = `
            UPDATE tbl_user 
            SET email = ?, first_name = ?, last_name = ?, phoneno = ?
            WHERE user_id = ?`;

        const result = await query(updateQuery, [email, first_name, last_name, phoneno, userId]);
        if (result.affectedRows > 0) {
            return {
                success: true,
                message: `User with ID ${userId} has been updated successfully.`
            };
        } else {
            return {
                success: false,
                message: `User with ID ${userId} was not found or no changes were made.`
            };
        }
    } catch (error) {
        console.error('Update user error:', error);
        return {
            success: false,
            message: 'An error occurred during user update',
            error: error.message
        };
    }
};

const getTotalUsersM = async (id = undefined, paginationAndSortingData) => {
    try {
        let qry = `
SELECT 
    user_id,
    first_name,
    last_name,
    email,
    phoneno,
    total_dues,
    profile_image,
    paid_dues,
    total_dues - paid_dues AS left_dues
FROM (
    SELECT 
        tbl_user.user_id,
        tbl_user.first_name,
        tbl_user.last_name,
        tbl_user.email,
        tbl_user.phoneno,
        tbl_user.profile_image,
        
        SUM(GREATEST(0, IFNULL(tbl_borrower.no_of_copies * ${DUE_AMOUNT} * DATEDIFF(IFNULL(tbl_borrower.release_date, NOW()), tbl_borrower.due_date), 0))) AS total_dues,
        
        SUM(
            CASE 
                WHEN tbl_borrower.is_due_paid = 1 THEN GREATEST(0, IFNULL(tbl_borrower.no_of_copies * 0.1 * DATEDIFF(IFNULL(tbl_borrower.release_date, NOW()), tbl_borrower.due_date), 0))
                ELSE 0
            END
        ) AS paid_dues
    FROM tbl_user
    LEFT JOIN tbl_borrower ON tbl_user.user_id = tbl_borrower.user_id 
    WHERE tbl_user.isDeleted = 0 AND tbl_user.role = 'student' ${id ? "AND tbl_user.user_id = ?" : ""}
    GROUP BY tbl_user.user_id
) AS dues_summary
            `
        const members = await query(paginate(orderby(qry, paginationAndSortingData.sortField), paginationAndSortingData.limit, paginationAndSortingData.offset), [id])
        return { success: true, message: 'User count fetched successfully!', data: members }
    } catch (error) {
        console.log(error)
        return { success: false, message: error, data: null }
    }
}

const deleteUserM = async (user_id) => {
    try {
        const [getPendingTransactions] = await query(`
                SELECT SUM(GREATEST(0, IFNULL(tbl_borrower.no_of_copies * ${DUE_AMOUNT} * DATEDIFF(IFNULL(tbl_borrower.release_date,NOW()), tbl_borrower.due_date), 0))) AS left_dues
                FROM tbl_borrower WHERE tbl_borrower.user_id = ? AND tbl_borrower.is_due_paid = 0
            `, [user_id])
        if (getPendingTransactions.left_dues > 0) return { success: false, message: 'User needs to pay all the pending dues first, then only user can be deleted.' }
        const getUserBorrowedBooks = await query(`
            SELECT * FROM tbl_borrower
            WHERE tbl_borrower.user_id = ? AND tbl_borrower.release_date IS NULL
        `, [user_id]);
        const [getUserActiveBookRequest] = await query(`
                SELECT COUNT(*) as cnt FROM tbl_request WHERE tbl_request.user_id = ? AND tbl_request.isApproved = 'requested'
            `, [user_id])
        if (getUserActiveBookRequest.cnt !== 0) return { success: false, message: `${getUserActiveBookRequest.cnt} pending request(s) for this user to process.` }
        if (getUserBorrowedBooks.length === 0 && getUserActiveBookRequest.cnt === 0) {
            await query(`
                    UPDATE tbl_user
                    SET isDeleted = 1
                    WHERE user_id = ?
                `, [user_id])
            return { success: true, message: 'Deletion successfull.' }
        }
        return { success: false, message: `You have ${getUserBorrowedBooks.length} book(s) pending to return.` }
    } catch (error) {
        console.log(error)
        return { success: false, message: error }
    }
}

const validateDataM = async (qry) => {
    try {
        const op = await query(qry)
        if (op.length === 0) return { success: true, message: 'data is unique!' }
        return { success: false, message: 'data aready exists!' }
    } catch (error) {
        return { success: false, message: error.sqlMessage }
    }
}

const releasedBookM = async (borrower_id, returning_user_id, book_id) => {
    try {
        const [getBorrowDetails] = await query(`
            SELECT *,GREATEST(0, IFNULL(tbl_borrower.no_of_copies * ${DUE_AMOUNT} * DATEDIFF(IFNULL(tbl_borrower.release_date,NOW()), tbl_borrower.due_date), 0)) AS left_dues FROM tbl_borrower
            WHERE borrower_id = ? AND release_date IS NULL AND user_id = ? AND book_id = ?`,
            [borrower_id, returning_user_id, book_id]
        );
        if (!getBorrowDetails) {
            return { success: false, message: 'Invalid Entry!' };
        }

        await query('START TRANSACTION');

        try {
            const updateBorrower = await query(`
                UPDATE tbl_borrower 
                SET release_date = NOW()${getBorrowDetails.left_dues === 0 ? ',is_due_paid=1' : ''}
                WHERE borrower_id = ?`,
                [borrower_id]
            );

            if (updateBorrower.affectedRows === 1) {
                await query('COMMIT');
                return { success: true, message: 'Book released successfully!' };
            }

            await query('ROLLBACK');
            return { success: false, message: 'Failed to update borrower record.' };

        } catch (error) {
            await query('ROLLBACK');
            console.error('Error during transaction:', error);
            return { success: false, message: 'An error occurred during the release process.' };
        }

    } catch (error) {
        console.error('Error during book release:', error);
        return { success: false, message: 'An error occurred while releasing the book.' };
    }
};

const deleteBookM = async (book_id) => {
    try {
        const [checkBookFirst] = await query(`
            SELECT COUNT(*) AS book 
            FROM tbl_book 
            WHERE book_id = ? AND isDeleted = 0
        `, [book_id]);

        if (checkBookFirst.book === 0) {
            return { success: false, message: 'No such book' };
        }

        const [getPendingReturns] = await query(`
            SELECT IFNULL(SUM(no_of_copies), 0) AS cnt
            FROM tbl_borrower 
            WHERE release_date IS NULL AND book_id = ?
        `, [book_id]);

        const pendingCopies = getPendingReturns.cnt ?? 0;

        const [getBookRequest] = await query(`
            SELECT COUNT(*) AS reqCnt 
            FROM tbl_request 
            WHERE book_id = ? AND isApproved = 'requested'
        `, [book_id]);

        if (pendingCopies === 0 && getBookRequest.reqCnt === 0) {
            const delRec = await query(`
                UPDATE tbl_book
                SET isDeleted = 1
                WHERE book_id = ?
            `, [book_id]);

            if (delRec.affectedRows) {
                return { success: true, message: 'Book deleted successfully!' };
            }
        }

        if (pendingCopies > 0) {
            return { success: false, message: `First gather ${pendingCopies} copies first and then return them.` };
        } else {
            return { success: false, message: `There are active requests for this book.` };
        }

    } catch (error) {
        console.log(error);
        return { success: false, message: error.message || 'An error occurred' };
    }
};

const dashboardM = async (startDate, endDate) => {
    try {
        const formattedStartDate = startDate ? new Date(startDate).toISOString().split('T')[0] : null;
        const formattedEndDate = endDate ? new Date(endDate).toISOString().split('T')[0] : null;

        // Total General Reviews Count
        const [totalReviewsCount] = await query(`
            SELECT COUNT(*) AS cnt 
            FROM tbl_reviews
            WHERE 1=1
        `);

        // Total Book Reviews Count
        const [totalBookReviewsCount] = await query(`
            SELECT COUNT(*) AS cnt 
            FROM tbl_book_reviews
            WHERE 1=1
        `);


        const [duesData] = await query(`
            SELECT 
                SUM(
                    GREATEST(0, 
                        IFNULL(tbl_borrower.no_of_copies * 0.1 * DATEDIFF(
                            IFNULL(tbl_borrower.release_date, NOW()), 
                            tbl_borrower.due_date), 0)
                    )
                ) AS total_dues,

                SUM(
                    CASE 
                        WHEN tbl_borrower.is_due_paid = 1 THEN 
                            GREATEST(0, 
                                IFNULL(tbl_borrower.no_of_copies * 0.1 * DATEDIFF(
                                    IFNULL(tbl_borrower.release_date, NOW()), 
                                    tbl_borrower.due_date), 0)
                            )
                        ELSE 0
                    END
                ) AS paid_dues,

                SUM(
                    GREATEST(0, 
                        IFNULL(tbl_borrower.no_of_copies * 0.1 * DATEDIFF(
                            IFNULL(tbl_borrower.release_date, NOW()), 
                            tbl_borrower.due_date), 0)
                    )
                ) - SUM(
                    CASE 
                        WHEN tbl_borrower.is_due_paid = 1 THEN 
                            GREATEST(0, 
                                IFNULL(tbl_borrower.no_of_copies * 0.1 * DATEDIFF(
                                    IFNULL(tbl_borrower.release_date, NOW()), 
                                    tbl_borrower.due_date), 0)
                            )
                        ELSE 0
                    END
                ) AS left_dues
            FROM tbl_user
            LEFT JOIN tbl_borrower ON tbl_user.user_id = tbl_borrower.user_id
        `);

        // Borrow Date Count Graph Data with Date Filter
        const borrowDateCountGraphData = await query(`
            SELECT 
                DATE(tbl_borrower.borrow_date) AS dates, 
                COUNT(*) AS total_borrowers
            FROM tbl_borrower
            ${formattedStartDate && formattedEndDate ? `WHERE DATE(tbl_borrower.borrow_date) BETWEEN '${formattedStartDate}' AND '${formattedEndDate}'` : ''}
            GROUP BY DATE(tbl_borrower.borrow_date)
            ORDER BY DATE(tbl_borrower.borrow_date)
        `);

        // Registered Count By Date with Date Filter
        const registeredCountByDate = await query(`
            SELECT 
                DATE(tbl_user.createdAt) AS dates, 
                COUNT(*) AS total_created_accounts
            FROM tbl_user
            ${formattedStartDate && formattedEndDate ? `WHERE DATE(tbl_user.createdAt) BETWEEN '${formattedStartDate}' AND '${formattedEndDate}'` : ''}
            GROUP BY DATE(tbl_user.createdAt)
            ORDER BY DATE(tbl_user.createdAt)
        `);

        const [totalUserCount] = await query(`
            SELECT COUNT(*) AS cnt 
            FROM tbl_user
            WHERE tbl_user.isDeleted = 0
        `);

        const [bookCount] = await query(`
            SELECT COUNT(*) AS cnt 
            FROM tbl_book
            WHERE tbl_book.isDeleted = 0
        `);

        const [todayReleaseCount] = await query(`
            SELECT COUNT(*) AS cnt
            FROM tbl_borrower
             ${formattedStartDate && formattedEndDate ? `WHERE DATE(tbl_borrower.release_date) BETWEEN '${formattedStartDate}' AND '${formattedEndDate}'` : ''}
            GROUP BY DATE(tbl_borrower.release_date)
            ORDER BY DATE(tbl_borrower.release_date)
        `);

        const [todayBorrowCount] = await query(`
            SELECT COUNT(*) AS cnt
            FROM tbl_borrower
             ${formattedStartDate && formattedEndDate ? `WHERE DATE(tbl_borrower.borrow_date) BETWEEN '${formattedStartDate}' AND '${formattedEndDate}'` : ''}
            GROUP BY DATE(tbl_borrower.borrow_date)
            ORDER BY DATE(tbl_borrower.borrow_date)
        `);

        const [todayRequestCount] = await query(`
            SELECT COUNT(*) AS cnt
            FROM tbl_request
             ${formattedStartDate && formattedEndDate ? `WHERE DATE(tbl_request.req_date) BETWEEN '${formattedStartDate}' AND '${formattedEndDate}'` : ''}
            GROUP BY DATE(tbl_request.req_date)
            ORDER BY DATE(tbl_request.req_date)
        `);

        const [todayActiveUsersCount] = await query(`
            SELECT COUNT(*) AS cnt
            FROM tbl_user
             ${formattedStartDate && formattedEndDate ? `WHERE DATE(tbl_user.updatedAt) BETWEEN '${formattedStartDate}' AND '${formattedEndDate}'` : ''}
            GROUP BY DATE(tbl_user.updatedAt)
            ORDER BY DATE(tbl_user.updatedAt)
        `);

        const mostLikedBooks = await query(`
            SELECT tbl_book.book_name, COUNT(*) AS total_likes
            FROM tbl_likes
            LEFT JOIN tbl_book ON tbl_likes.book_id = tbl_book.book_id
            WHERE tbl_book.isDeleted = 0
            GROUP BY tbl_likes.book_id  
            ORDER BY total_likes DESC
            LIMIT 10
        `);

        const totalUserCountCnt = totalUserCount ? totalUserCount.cnt : 0;
        const bookCountCnt = bookCount ? bookCount.cnt : 0;
        const todayReleaseCountCnt = todayReleaseCount ? todayReleaseCount.cnt : 0;
        const todayBorrowCountCnt = todayBorrowCount ? todayBorrowCount.cnt : 0;
        const todayRequestCountCnt = todayRequestCount ? todayRequestCount.cnt : 0;
        const todayActiveUsersCountCnt = todayActiveUsersCount ? todayActiveUsersCount.cnt : 0;
        const totalReviewsCountCnt = totalReviewsCount ? totalReviewsCount.cnt : 0;
        const totalBookReviewsCountCnt = totalBookReviewsCount ? totalBookReviewsCount.cnt : 0;

        return {
            success: true,
            message: 'ok!',
            data: {
                mostLikedBooks,
                todayActiveUsers: todayActiveUsersCountCnt,
                todayRequestCount: todayRequestCountCnt,
                todayBorrowCount: todayBorrowCountCnt,
                todayReleaseCount: todayReleaseCountCnt,
                registeredCountByDate,
                duesData,
                borrowDateCountGraphData,
                totalUserCount: totalUserCountCnt,
                bookCount: bookCountCnt,
                totalReviewsCount: totalReviewsCountCnt,
                totalBookReviewsCount: totalBookReviewsCountCnt, 
            }
        };
    } catch (error) {
        console.error(error);
        return { success: false, message: error, data: null };
    }
};

const uploadImageM = async (book_id, files) => {
    const [xy] = await query(`
            SELECT book_name,COUNT(*) AS cnt
            FROM tbl_media WHERE tbl_media.book_id = ? AND tbl_media.isCover = 1
        `, [book_id])
    if (xy.cnt !== 0) {
        return { success: false, message: 'already done' }
    }
    let mediaUrls = [];
    if (files && files.length > 0) {
        mediaUrls = await uploadOnCloudinary(files, xy.book_name);
    }

    if (mediaUrls.length > 0) {
        const mediaInsertPromises = mediaUrls.map(media =>
            query(
                `INSERT INTO tbl_media (book_id, url,isCover) VALUES (?, ?,?)`,
                [book_id, media.url, 1]
            )
        );

        await Promise.all(mediaInsertPromises);
    }
}

module.exports = { createBookM, acceptBookRequestM, createUserM, getTotalUsersM, deleteUserM, validateDataM, releasedBookM, deleteBookM, dashboardM, uploadImageM, updateUserM, getUserByIdFromDB, validateBookCopies }