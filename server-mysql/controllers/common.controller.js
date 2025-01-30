// server-mysql/contollers/common.controller.js
const { getActiveRequestsM, getBooksM, getBorrowListM, getTransactionsM, updateUserProfileM, getProfileData, getMostLikedBooksM, getRecentlyAddedBooksM, getBooksByGenreM, searchBooksM, searchUsersM, getReviewsM, getBookReviewsM } = require("../models/commonModel")
const { uploadOnCloudinary } = require("../config/cloudinary");

const getRecentlyAddedBooks = async (req, res) => {
    try {
        let data = await getRecentlyAddedBooksM();
        if (data.success) {
            return res.json({ books: data.books });
        } else {
            return res.status(400).json({ message: data.message });
        }
    } catch (error) {
        console.error('Error in API handler:', error);
        return res.status(500).json({ message: 'An unexpected error occurred' });
    }
};


const getMostLikedBooks = async (req, res) => {
    try {
        let data = await getMostLikedBooksM();
        if (data.success) {
            return res.json({ books: data.books });
        } else {
            return res.status(400).json({ message: data.message });
        }
    } catch (error) {
        console.error('Error in API handler:', error);
        return res.status(500).json({ message: 'An unexpected error occurred' });
    }
};

const searchBooks = async (req, res) => {
    try {
        const searchTerm = req.query.searchTerm;
        const userRole = req.user.role;
        if (!searchTerm) {
            return res.status(400).json({ message: 'Search term is required', data: null });
        }
        let result;
        if (userRole === 'librarian') {
            result = await searchUsersM(searchTerm);
        } else {
            result = await searchBooksM(searchTerm);
        }
        if (result.success) {
            return res.status(200).json({ message: 'Search results', data: result.data });
        } else {
            return res.status(404).json({ message: 'No results found', data: null });
        }
    } catch (error) {
        return res.status(400).json({ message: error, data: null });
    }
};

const getBooksByGenre = async (req, res) => {
    try {
        const { genre } = req.body;

        if (!genre) {
            return res.status(400).json({ message: 'Genre is required' });
        }

        let data = await getBooksByGenreM(genre, req.user.role === 'librarian' ? undefined : req.user.id);

        if (data.success) {
            return res.json({ books: data.books });
        } else {
            return res.status(400).json({ message: data.message });
        }
    } catch (error) {
        console.error('Error in API handler:', error);
        return res.status(500).json({ message: 'An unexpected error occurred' });
    }
};

const getActiveRequests = async (req, res) => {
    try {
        let requests = await getActiveRequestsM(req.user.role === 'librarian' ? undefined : req.user.id, { offset: req.query.offset, limit: req.query.limit, sortField: req.query.sortField })
        if (requests.success) {
            return res.status(200).json({ message: requests.message, data: requests.data })
        }
    } catch (error) {
        return res.status(400).json({ message: error, data: null })
    }
}

const getBooks = async (req, res) => {
    try {
        let getReceivedBooks = await getBooksM({ offset: req.query.offset, limit: req.query.limit, sortField: req.query.sortField }, req.user.role === 'librarian' ? undefined : req.user.id, req.query.book_id)
        return res.json({ user_id: req.user.role === 'librarian' ? undefined : req.user.id, message: getReceivedBooks.message, books: getReceivedBooks.data })
    } catch (error) {
        return res.status(400).json({ message: error })
    }
}

const getBorrowList = async (req, res) => {
    try {
        let borrowList = await getBorrowListM(req.user.role === 'librarian' ? undefined : req.user.id, { offset: req.query.offset, limit: req.query.limit, sortField: req.query.sortField }, { stDate: req.query.stDate, endDate: req.query.endDate, fieldNameD: 'tbl_borrower.due_date' })
        if (borrowList.success) return res.json({ message: borrowList.message, data: borrowList.data })
    } catch (error) {
        return res.status(400).json({ message: error })
    }
}

const getTransactions = async (req, res) => {
    try {
        let transactions = await getTransactionsM(req.user.role === 'librarian' ? undefined : req.user.id, { offset: req.query.offset, limit: req.query.limit, sortField: req.query.sortField }, { stDate: req.query.stDate, endDate: req.query.endDate, fieldNameD: 'tbl_transaction.createdAt' })
        if (transactions.success) return res.json({ message: transactions.message, data: transactions.data })
        else return res.status(400).json({ message: transactions.message, data: transactions.data })
    } catch (error) {
        return res.status(500).json({ message: error })
    }
}

const me = async (req, res) => {
    try {
        const userData = await getProfileData(req.user.id, { offset: req.query.offset, limit: req.query.limit, sortField: req.query.sortField })
        if (userData.success) return res.json({ message: userData.message, userData: userData.data })
        return res.status(400).json({ message: userData.message })
    } catch (error) {
        return res.status(500).json({ message: error })
    }
}

const editProfile = async (req, res) => {
    try {
        const { firstName, lastName, phoneNo } = req.body;

        if (!firstName || !lastName || !phoneNo) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        console.log("Files received:", req.file);
        let profileImageUrl = null;

        if (req.file) {
            const uploadResult = await uploadOnCloudinary([req.file], 'update');
               console.log("Cloudinary Upload Result:", uploadResult);

            if (uploadResult.length > 0) {
                profileImageUrl = uploadResult[0].url;
                console.log("Profile Image URL:", profileImageUrl);

            } else {
                console.log("Cloudinary upload failed.");
                return res.status(400).json({ message: 'Failed to upload profile image' });
            }
        }


        const result = await updateUserProfileM(req.user.id, { firstName, lastName, phoneNo, profileImageUrl });

        if (result.success) {
            return res.status(200).json({
                message: 'Profile updated successfully',
                userData: result.data
            });
        } else {
            return res.status(500).json({ message: result.message });
        }
    } catch (error) {
        console.error("Error in editProfile:", error);
        return res.status(500).json({ message: error.message });
    }
};



const getReviews = async (req, res) => {
    try {
        let reviews = await getReviewsM();
        return res.json({ message: reviews.message, reviews: reviews.data });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};

const getBookReviews = async (req, res) => {
    try {
        let reviews = await getBookReviewsM(req.query.book_id);
        return res.json({ message: reviews.message, reviews: reviews.data });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};


module.exports = { getActiveRequests, getBooks, getBorrowList, getTransactions, me, editProfile, getMostLikedBooks, getRecentlyAddedBooks, getBooksByGenre,searchBooks, getReviews, getBookReviews }