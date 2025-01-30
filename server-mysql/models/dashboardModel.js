// server-mysql/models/dashboardModel.js
const { query } = require("../config/constants");

const getBorrowerDataM = async (searchValue) => {
    try {
        let qry = `
            SELECT tbl_book.*, 
                   (tbl_book.no_of_copies - IFNULL(SUM(tbl_borrower.no_of_copies), 0)) AS AvailableBooks
            FROM tbl_book
            LEFT JOIN tbl_borrower ON tbl_borrower.book_id = tbl_book.book_id 
            WHERE tbl_borrower.release_date IS NULL
        `;

        if (searchValue && searchValue.trim() !== '') {
            qry += `
                AND (
                    tbl_book.author_name LIKE ? 
                    OR tbl_book.book_name LIKE ? 
                    OR tbl_book.genre LIKE ?
                    OR tbl_book.no_of_copies LIKE ?
                )
            `;
        }

        qry += `
            GROUP BY tbl_book.book_id
        `;

        const params = [];
        if (searchValue && searchValue.trim() !== '') {
            const searchTerm = `%${searchValue}%`;
            params.push(searchTerm, searchTerm, searchTerm, searchTerm);
        }

        const data = await query(qry, params);
        return { success: true, data, message: 'fetched successfully' };
    } catch (error) {
        console.log(error);
        return { success: false, data: null, message: error.message };
    }
}

module.exports = { getBorrowerDataM }