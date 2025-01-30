// server-mysql/models/commonModel.js
const { query, DUE_AMOUNT, paginate } = require("../config/constants")
const { orderby, filterByDate } = require("../config/utils")

const getRecentlyAddedBooksM = async () => {
    try {
        const result = await query(`
            SELECT 
                tbl_book.book_id,
                tbl_book.book_name,
                tbl_book.author_name,
                tbl_book.genre,
                tbl_book.publishedAt,
                MAX(CASE WHEN tbl_media.isCover = 1 THEN tbl_media.url END) AS cover_image_url
            FROM tbl_book
            LEFT JOIN tbl_media ON tbl_book.book_id = tbl_media.book_id
            WHERE tbl_book.isDeleted = 0
            GROUP BY tbl_book.book_id
            ORDER BY tbl_book.publishedAt DESC
            LIMIT 10;
        `);

        if (result.length > 0) {
            return { success: true, books: result };
        } else {
            return { success: false, message: 'No books found' };
        }
    } catch (error) {
        console.error('Error fetching recently added books:', error);
        return { success: false, message: 'An error occurred while fetching books' };
    }
};

const getMostLikedBooksM = async () => {
    try {
        const result = await query(`
           SELECT 
    tbl_book.book_id, 
    tbl_book.book_name, 
    tbl_book.author_name, 
    -- Get the cover image where isCover = 1
    MAX(CASE WHEN tbl_media.isCover = 1 THEN tbl_media.url END) AS cover_image_url,
    -- Get the other media image where isCover = 0
    MAX(CASE WHEN tbl_media.isCover = 0 THEN tbl_media.url END) AS other_media_url,
    COUNT(tbl_likes.book_id) AS total_likes
FROM tbl_likes
LEFT JOIN tbl_book ON tbl_likes.book_id = tbl_book.book_id
LEFT JOIN tbl_media ON tbl_book.book_id = tbl_media.book_id
WHERE tbl_book.isDeleted = 0
GROUP BY tbl_likes.book_id, tbl_book.book_id
ORDER BY total_likes DESC
LIMIT 10;

        `);

        if (result.length > 0) {
            return { success: true, books: result };
        } else {
            return { success: false, message: 'No books found' };
        }
    } catch (error) {
        console.error('Error fetching most liked books:', error);
        return { success: false, message: 'An error occurred while fetching books' };
    }
};


const getActiveRequestsM = async (id, paginationAndSortingData) => {
    try {
        let qry = `SELECT tbl_request.*,tbl_book.book_name,tbl_user.first_name FROM tbl_request
                    LEFT JOIN tbl_book ON tbl_request.book_id = tbl_book.book_id
                    LEFT JOIN tbl_user ON tbl_request.user_id = tbl_user.user_id`
        if (id !== undefined) qry += ` WHERE tbl_request.user_id = ?`
        const getAllReqs = await query(paginate(orderby(qry, paginationAndSortingData.sortField), paginationAndSortingData.limit, paginationAndSortingData.offset), [id].filter(Boolean))
        return { success: true, message: 'pending requests fetched!', data: getAllReqs }
    } catch (error) {
        return { success: false, message: 'something failed', data: null }
    }
}

const getBooksM = async (paginationAndSortingData, user_id, book_id = null) => {
    try {
        let qry = `
        SELECT
            tbl_book.book_id,
            tbl_book.book_name,
            tbl_book.author_name,
            tbl_book.genre,
            tbl_book.isDeleted,
            tbl_book.no_of_copies,
            tbl_book.no_of_copies - IFNULL(SUM(tbl_borrower.no_of_copies), 0) AS available_copies,
            IFNULL(COUNT(user_likes.book_id), 0) AS isLiked,
            ${book_id ? '' : 'MAX(CASE WHEN tbl_media.isCover = 1 THEN tbl_media.url END) AS url,'}
            ${book_id ? '' : 'MAX(tbl_media.isCover) AS isCover,'}
            ${book_id ? `
                    (SELECT GROUP_CONCAT(
                    CONCAT(
                        url, '#concat#', 
                        isCover, '#concat#', 
                        media_id
                    ) SEPARATOR '##MEDIA_SEPARATOR##'
                )
                FROM tbl_media 
                WHERE tbl_media.book_id = tbl_book.book_id
            ) AS media_urls,
                ` : ''}
            COUNT(tbl_likes.book_id) AS total_likes
        FROM
            tbl_book
        LEFT JOIN
            tbl_borrower ON tbl_book.book_id = tbl_borrower.book_id AND tbl_borrower.release_date IS NULL
        LEFT JOIN
            tbl_likes AS user_likes ON tbl_book.book_id = user_likes.book_id AND user_likes.user_id = ?
        LEFT JOIN
            tbl_media ON tbl_book.book_id = tbl_media.book_id
        LEFT JOIN
            tbl_likes ON tbl_book.book_id = tbl_likes.book_id
        WHERE
            tbl_book.isDeleted = 0
            ${book_id ? 'AND tbl_book.book_id = ?' : ''}
            ${book_id ? '' : 'AND (tbl_media.isCover = 1 OR tbl_media.media_id IS NULL)'}
        GROUP BY
            tbl_book.book_id
        `;

        const params = [user_id];
        if (book_id) {
            params.push(book_id);
        }

        const getAllBooks = await query(paginate(
            orderby(qry, paginationAndSortingData.sortField),
            paginationAndSortingData.limit,
            paginationAndSortingData.offset
        ), params);

        const processedBooks = getAllBooks.map(book => ({
            ...book,
            media_urls: book.media_urls
                ? book.media_urls.split('##MEDIA_SEPARATOR##').map(media => {
                    const [url, isCover, media_id] = media.split('#concat#');
                    return {
                        url,
                        isCover: parseInt(isCover),
                        media_id: parseInt(media_id)
                    };
                })
                : []
        }));

        return { success: true, message: 'Books received successfully', data: processedBooks };
    } catch (error) {
        console.log('this is from getBooksM', error);
        return { success: false, message: 'Some error occurred', data: null };
    }
};

const getBookM = async (book_id, user_id) => {
    try {
        const isLikedSubquery = user_id ?
            `(
                SELECT COUNT(*)
                FROM tbl_likes AS indi_likes
                WHERE indi_likes.book_id = tbl_book.book_id AND indi_likes.user_id = ?
            )` :
            '0';

        let qry = `
        SELECT
            tbl_book.*,
            (tbl_book.no_of_copies - IFNULL(SUM(tbl_borrower.no_of_copies), 0)) AS available_copies,
            ${isLikedSubquery} AS isLiked,
            (
                SELECT COUNT(*) 
                FROM tbl_likes AS count_likes 
                WHERE count_likes.book_id = tbl_book.book_id
            ) AS total_likes
        FROM
            tbl_book
        LEFT JOIN
            tbl_borrower
            ON tbl_book.book_id = tbl_borrower.book_id
            AND tbl_borrower.release_date IS NULL
        WHERE tbl_book.isDeleted = 0 AND tbl_book.book_id = ?
        GROUP BY
            tbl_book.book_id
        `;

        const params = [];
        if (user_id) {
            params.push(user_id);
        }

        const getAllBooks = await query(qry, params);

        return { success: true, message: 'Books received successfully', data: getAllBooks };
    } catch (error) {
        console.log('this is from getBooksM', error);
        return { success: false, message: 'some error', data: null };
    }
}

const getBooksByGenreM = async (genre, user_id) => {
    try {
        let qry = `
        SELECT
            tbl_book.book_id,
            tbl_book.book_name,
            tbl_book.author_name,
            tbl_book.genre,
            tbl_book.isDeleted,
            tbl_book.no_of_copies,
            tbl_book.no_of_copies - IFNULL(SUM(tbl_borrower.no_of_copies), 0) AS available_copies,
            IFNULL(COUNT(user_likes.book_id), 0) AS isLiked,
            MAX(CASE WHEN tbl_media.isCover = 1 THEN tbl_media.url END) AS url,
            MAX(tbl_media.isCover) AS isCover,
            COUNT(tbl_likes.book_id) AS total_likes
        FROM
            tbl_book
        LEFT JOIN
            tbl_borrower ON tbl_book.book_id = tbl_borrower.book_id AND tbl_borrower.release_date IS NULL
        LEFT JOIN
            tbl_likes AS user_likes ON tbl_book.book_id = user_likes.book_id AND user_likes.user_id = ?
        LEFT JOIN
            tbl_media ON tbl_book.book_id = tbl_media.book_id
        LEFT JOIN
            tbl_likes ON tbl_book.book_id = tbl_likes.book_id
        WHERE
            tbl_book.isDeleted = 0
            AND tbl_book.genre = ?
        GROUP BY
            tbl_book.book_id
        `;

        const params = [user_id, genre];

        const getBooks = await query(qry, params);

        const processedBooks = getBooks.map(book => ({
            ...book,
            media_urls: book.media_urls
                ? book.media_urls.split('##MEDIA_SEPARATOR##').map(media => {
                    const [url, isCover, media_id] = media.split('#concat#');
                    return {
                        url,
                        isCover: parseInt(isCover),
                        media_id: parseInt(media_id)
                    };
                })
                : []
        }));

        return { success: true, message: 'Books received successfully', books: processedBooks };
    } catch (error) {
        console.log('Error in getBooksByGenreM:', error);
        return { success: false, message: 'Some error occurred', books: null };
    }
};


const getBorrowListM = async (id, paginationAndSortingData, dateData) => {
    try {
        let qry = `
            SELECT tbl_borrower.*,tbl_book.book_name,tbl_user.first_name,(GREATEST(0,tbl_borrower.no_of_copies * ${DUE_AMOUNT} * DATEDIFF(IFNULL(tbl_borrower.release_date,NOW()),tbl_borrower.due_date))) AS due_amount FROM tbl_borrower
            LEFT JOIN tbl_user ON tbl_borrower.user_id = tbl_user.user_id
            LEFT JOIN tbl_book ON tbl_borrower.book_id = tbl_book.book_id
        ` ;
        if (id !== undefined) {
            qry += 'WHERE tbl_borrower.user_id = ?'
        }
        qry = filterByDate(qry, dateData.stDate, dateData.endDate, dateData.fieldNameD);
        qry += ' GROUP BY tbl_borrower.borrower_id'
        const borrowList = await query(paginate(orderby(qry, paginationAndSortingData.sortField), paginationAndSortingData.limit, paginationAndSortingData.offset), [id].filter(Boolean))
        return { success: true, message: 'Fetched successfully!', data: borrowList }
    } catch (error) {
        return { success: false, message: error, data: null }
    }
}

const getTransactionsM = async (id, paginationAndSortingData, dateData) => {
    try {
        let qry = `
            SELECT 
                transaction_id, 
                tbl_borrower.user_id,
                tbl_transaction.createdAt, 
                tbl_user.first_name, 
                tbl_user.email,
                tbl_book.book_name,
                JSON_UNQUOTE(JSON_EXTRACT(transaction_response, '$.xAuthAmount')) AS amount,
                JSON_UNQUOTE(JSON_EXTRACT(transaction_response, '$.xMaskedCardNumber')) AS card_number,
                JSON_UNQUOTE(JSON_EXTRACT(transaction_response, '$.xError')) AS error 
            FROM tbl_transaction 
            LEFT JOIN tbl_borrower ON tbl_transaction.borrower_id = tbl_borrower.borrower_id 
            LEFT JOIN tbl_user ON tbl_borrower.user_id = tbl_user.user_id
            LEFT JOIN tbl_book ON tbl_borrower.book_id = tbl_book.book_id
        `;

        if (id !== undefined) {
            qry += ` WHERE tbl_borrower.user_id = ?`;
        }
        qry = filterByDate(qry, dateData.stDate, dateData.endDate, dateData.fieldNameD);
        qry += ' GROUP BY transaction_id';

        const x = await query(paginate(orderby(qry, paginationAndSortingData.sortField), paginationAndSortingData.limit, paginationAndSortingData.offset), [id].filter(Boolean));
        return { success: true, message: 'ok!', data: x };
    } catch (error) {
        console.log(error);
        return { success: false, message: error.message || 'An error occurred', data: null };
    }
}

const updateUserProfileM = async (userId, { firstName, lastName, phoneNo, profileImageUrl }) => {
    try {
        let qry = `UPDATE tbl_user SET first_name = ?, last_name = ?, phoneno = ?`;
        let params = [firstName, lastName, phoneNo];

        if (profileImageUrl) {
            qry += `, profile_image = ?`; 
            params.push(profileImageUrl); 
        }

        qry += ` WHERE user_id = ?`;
        params.push(userId);

        console.log("🚀 ~ updateUserProfileM ~ qry, params:", qry, params);

        await query(qry, params);

        return { success: true, message: 'Profile updated successfully' };
    } catch (error) {
        console.error('Error updating user profile:', error);
        return { success: false, message: 'Failed to update profile' };
    }
};

const getProfileData = async (id = undefined, paginationAndSortingData) => {
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
    WHERE tbl_user.isDeleted = 0 ${id ? "AND tbl_user.user_id = ?" : ""}
    GROUP BY tbl_user.user_id
) AS dues_summary
        `;
        const members = await query(paginate(orderby(qry, paginationAndSortingData.sortField), paginationAndSortingData.limit, paginationAndSortingData.offset), [id])
        return { success: true, message: 'User count fetched successfully!', data: members }
    } catch (error) {
        console.log(error)
        return { success: false, message: error, data: null }
    }
}

const searchBooksM = async (searchTerm) => {
    try {
        const qry = `
            SELECT
                tbl_book.book_id,
                tbl_book.book_name,
                tbl_book.author_name,
                tbl_book.genre
            FROM
                tbl_book
            WHERE
                tbl_book.isDeleted = 0
                AND (
                    tbl_book.book_name LIKE ? OR
                    tbl_book.author_name LIKE ? OR
                    tbl_book.genre LIKE ?
                )
        `;

        const params = [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`];

        const result = await query(qry, params);

        return { success: true, message: 'Books search results', data: result };
    } catch (error) {
        console.log('Error in searchBooksM:', error);
        return { success: false, message: 'Some error occurred', data: null };
    }
}

const searchUsersM = async (searchTerm) => {
    try {
        const qry = `
            SELECT 
                user_id,
                first_name,
                last_name,
                email,
                phoneno
            FROM 
                tbl_user
            WHERE 
                tbl_user.isDeleted = 0
                AND (
                    tbl_user.first_name LIKE ? OR
                    tbl_user.last_name LIKE ? OR
                    tbl_user.email LIKE ? OR
                    tbl_user.phoneno LIKE ?
                )
        `;

        const params = [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`];

        const result = await query(qry, params);

        return { success: true, message: 'User search results', data: result };
    } catch (error) {
        console.log('Error in searchUsersM:', error);
        return { success: false, message: 'Some error occurred', data: null };
    }
};


const getReviewsM = async () => {
    try {
        let qry = `
            SELECT r.review_id, r.user_id, r.rating, r.message, r.createdAt, 
                   u.first_name, u.last_name, u.email, u.phoneno, u.profile_image
            FROM tbl_reviews r
            LEFT JOIN tbl_user u ON r.user_id = u.user_id
        `;
        
        const reviews = await query(qry);
        return { success: true, message: 'Reviews fetched successfully', data: reviews };
    } catch (error) {
        console.log('Error in getReviewsM:', error);
        return { success: false, message: 'Some error occurred', data: null };
    }
};

const getBookReviewsM = async (book_id = null) => {
    try {
        let qry = `
            SELECT r.review_id, r.user_id, r.rating, r.message, r.createdAt, 
                   u.first_name, u.last_name, u.email, u.phoneno, u.profile_image,
                   b.book_name, b.author_name, b.genre
            FROM tbl_book_reviews r
            LEFT JOIN tbl_user u ON r.user_id = u.user_id
            LEFT JOIN tbl_book b ON r.book_id = b.book_id
            WHERE 1=1
            ${book_id ? 'AND r.book_id = ?' : ''}
        `;
        
        const params = [];
        if (book_id) {
            params.push(book_id);
        }

        const reviews = await query(qry, params);
        return { success: true, message: 'Book reviews fetched successfully', data: reviews };
    } catch (error) {
        console.log('Error in getBookReviewsM:', error);
        return { success: false, message: 'Some error occurred', data: null };
    }
};


module.exports = { getActiveRequestsM, getBookM, getBooksM, getBooksByGenreM, getBorrowListM, getTransactionsM,updateUserProfileM, getProfileData, getMostLikedBooksM, getRecentlyAddedBooksM, searchBooksM, searchUsersM, getReviewsM, getBookReviewsM }