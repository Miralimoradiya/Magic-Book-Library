// server-mysql/contollers/librarian.controller.js
const { createBookM, acceptBookRequestM, createUserM, updateUserM, getTotalUsersM, deleteUserM, validateDataM, releasedBookM, deleteBookM, dashboardM, uploadImageM, getUserByIdFromDB, validateBookCopies } = require("../models/librarianModel")
const { query } = require("../config/constants");

const getUserById = async (req, res) => {
    const userId = req.params.id;

    try {
        const data = await getUserByIdFromDB(userId);
        if (data.success && data.data) {
            return res.json({ message: 'User fetched successfully', data: data.data });
        } else {
            return res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error('Error in getUserById controller:', error); 
        return res.status(500).json({ message: error.message });
    }
};

const createBook = async (req, res) => {
    try {
        const { author_name, book_name, genre, no_of_copies, action, updates, book_id } = req.body
        let createdBook = await createBookM({ book_id, author_name, book_name, genre, no_of_copies, updates }, req.files, action)
        if (createdBook.success)
            return res.json({ message: createdBook.message })
        return res.status(400).json({ message: createdBook.message })
    } catch (error) {
        console.log(error)
        return res.status(400).json({ message: error })
    }
}

const validateCopies = async (req, res) => {
    try {
        const { book_id, no_of_copies } = req.body;
        const result = await validateBookCopies(book_id, no_of_copies);
        if (result.success) {
            return res.json({ message: result.message });
        } else {
            return res.status(400).json({ message: result.message });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


const acceptBookRequest = async (req, res) => {
    try {
        const { request_id } = req.body;
        let borrowedBook = await acceptBookRequestM(request_id, req.user.id);
        if (borrowedBook.success) return res.json({ message: borrowedBook.message })
        else return res.status(400).json({ message: borrowedBook.message })
    } catch (error) {
        return res.status(400).json({ message: error })
    }
}
const createUser = async (req, res) => {
    const { email, password, first_name, last_name, phoneno, action, userId } = req.body;
    if (action === "create") {
        if (!password) {
            return res.status(400).json({ message: "Password is required for user creation." });
        }
        const registeredUser = await createUserM(email, password, first_name, last_name, phoneno);
        if (registeredUser.success) {
            return res.json({ message: registeredUser.message, userId: registeredUser.userId });
        } else {
            return res.status(400).json({ message: registeredUser.message });
        }
    }
    else if (action === "update" && userId) {
        if (password) {
            return res.status(400).json({ message: "You cannot change the password through this request." });
        }
        const updatedUser = await updateUserM(userId, email, null, first_name, last_name, phoneno);
        if (updatedUser.success) {
            return res.json({ message: updatedUser.message });
        } else {
            return res.status(400).json({ message: updatedUser.message });
        }
    } else {
        return res.status(400).json({ message: "Invalid action or missing userId for update" });
    }
};

const totalUsersWhichAreNotDeleted = async (req, res) => {
    try {
        let data = await getTotalUsersM(req.query.id, { offset: req.query.offset, limit: req.query.limit, sortField: req.query.sortField });
        if (data.success) return res.json({ message: data.message, data: data.data })
        return res.status(500).json({ message: data.message })
    } catch (error) {
        return res.status(400).json({ message: error })
    }
}

const deleteUser = async (req, res) => {
    try {
        let data = await deleteUserM(req.params.id)
        if (data.success) return res.status(200).json({ message: data.message })
        return res.status(400).json({ message: data.message })
    } catch (error) {
        return res.json({ message: error })
    }
}

const validateData = async (req, res) => {
    try {
        let prepareObj = {}
        if (req.query.type === 'user') prepareObj.tableName = "tbl_user"
        else if (req.query.type === 'book') prepareObj.tableName = "tbl_book"
        else return res.status(400).json({ message: 'No such type' })

        prepareObj.fieldName = req.query.fieldName
        prepareObj.fieldValue = req.query.fieldValue

        const fieldValue = `'${prepareObj.fieldValue}'`

        const qry = `
            SELECT ${prepareObj.tableName}.${prepareObj.fieldName} FROM ${prepareObj.tableName}
            WHERE ${prepareObj.tableName}.${prepareObj.fieldName} = ${fieldValue}
        `
        const validate = await validateDataM(qry)
        if (validate.success) return res.status(200).json({})
        return res.status(400).json({ message: validate.message })
    } catch (error) {
        return res.status(500).json({ message: error })
    }
}

const releaseBook = async (req, res) => {
    try {
        let releasedBook = await releasedBookM(req.body.borrower_id, req.body.returning_user_id, req.body.book_id);
        if (releasedBook.success) {
            return res.status(200).json({ message: releasedBook.message })
        } else
            return res.status(400).json({ message: releasedBook.message });
    } catch (error) {
        return res.status(400).json({ message: error })
    }
}

const deleteBook = async (req, res) => {
    try {
        const delRec = await deleteBookM(req.query.book_id)
        if (delRec.success) return res.json({ message: delRec.message })
        res.status(400).json({ message: delRec.message })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error })
    }
};

const dashboard = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const data = await dashboardM(startDate, endDate);
        if (data.success) {
            return res.json({
                count: {
                    todayActiveUsersCount: data.data.todayActiveUsers,
                    todayRequestCount: data.data.todayRequestCount,
                    todayBorrowCount: data.data.todayBorrowCount,
                    todayReleaseCount: data.data.todayReleaseCount,
                    bookCount: data.data.bookCount,
                    totalUserCount: data.data.totalUserCount,
                    totalReviewsCount: data.data.totalReviewsCount,
                    totalBookReviewsCount: data.data.totalBookReviewsCount 
                },
                graph: {
                    registrationCountByDate: data.data.registeredCountByDate,
                    borrowDateCountGraphData: data.data.borrowDateCountGraphData
                },
                mostLikedBooks: data.data.mostLikedBooks,
                dues: data.data.duesData,
                message: data.message
            });
        }
        return res.status(400).json({ message: data.message });
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};

const uploadImage = async (req, res) => {
    try {
        const xd = await uploadImageM(req.body.book_id, req.files)
        return res.json({ message: 'construction' })
    } catch (error) {
        return res.json({ message: 'isd' })
    }
}


const getInquiries = async (req, res) => {
    try {
        const { enquiry_type, librarian_check } = req.query;

        let conditions = [];
        let queryParams = [];

        if (enquiry_type) {
            conditions.push("enquiry_type = ?");
            queryParams.push(enquiry_type);
        }

        if (librarian_check !== undefined) {
            conditions.push("librarian_check = ?");
            queryParams.push(librarian_check);
        }

        let whereClause = "";
        if (conditions.length > 0) {
            whereClause = "WHERE " + conditions.join(" AND ");
        }

        const queryStr = `
            SELECT * FROM tbl_inquiry
            ${whereClause}
        `;

        const inquiries = await query(queryStr, queryParams);

        if (inquiries.length === 0) {
            return res.status(404).json({ message: 'No inquiries found' });
        }

        return res.status(200).json(inquiries);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
const checkInquiryStatus = async (req, res) => {
    try {
        const { inquiry_id, librarian_check } = req.body; 
        if (librarian_check === undefined || (librarian_check !== 0 && librarian_check !== 1)) {
            return res.status(400).json({ message: 'Invalid librarian_check value. It must be either 0 or 1.' });
        }
        const [existingInquiry] = await query(`
            SELECT librarian_check FROM tbl_inquiry
            WHERE inquiry_id = ?
        `, [inquiry_id]);

        if (!existingInquiry) {
            return res.status(404).json({ message: 'Inquiry not found.' });
        }
        if (existingInquiry.librarian_check === 1) {
            return res.status(400).json({ message: 'Inquiry has already been checked.' });
        }
        const updateResult = await query(`
            UPDATE tbl_inquiry
            SET librarian_check = ?
            WHERE inquiry_id = ?
        `, [1, inquiry_id]);

        if (updateResult.affectedRows === 1) {
            return res.status(200).json({ message: 'Inquiry marked as checked successfully.' });
        } else {
            return res.status(404).json({ message: 'Inquiry not found.' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};


module.exports = { createBook, acceptBookRequest, createUser, totalUsersWhichAreNotDeleted, deleteUser, validateData, releaseBook, deleteBook, dashboard, uploadImage, getUserById, validateCopies, getInquiries, checkInquiryStatus }