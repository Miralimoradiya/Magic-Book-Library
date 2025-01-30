// server-mysql/config/constant.js
const jwt = require('jsonwebtoken')
const { pool } = require('./database')

const generateAccessAndRefreshToken = (id, email, role,sessionId) => {
    let accessToken = generateAccessToken(id, email, role,sessionId)
    let refreshToken = generateRefreshToken(id, email, role, sessionId)
    return { accessToken, refreshToken }
}

const generateAccessToken = (id, email, role,sessionId) => {
    return jwt.sign({ id, email, role,sessionId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '3d',
    })
}

const generateRefreshToken = (id, email, role, sessionId) => {
    return jwt.sign({ id, email, role, sessionId }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '30d',
    })
}


const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(Date.now() + 86400 * 1000),
    sameSite: "Lax",
};

const whiteListedAPIs = [
    "/",
    "/get-transactions",
    "/dashboard",
    "/uploadImage",
    "/me"
]

const query = (sql, values = {}) => {
    return new Promise((resolve, reject) => {
        pool.query(sql, values, (error, results) => {
            if (error) reject(error);
            resolve(results);
        });
    });
};

const MAX_BORROW_LIMIT = 7

const apiPermissions = {
    'create-user': ['create-user'],
    'create-book': ['create-book'],
    'borrow-book': ['borrow-book'],
    'accept-book-request': ['accept-book-request'],
    'request-book': ['request-book'],
    'get-users': ['get-users'],
    'get-books': ['get-books'],
    'delete-user': ['delete-user'],
    'get-requests': ['get-requests'],
    'validate-data': ['validate-data'],
    'get-borrow-list': ['get-borrow-list'],
    'release-book': ['release-book'],
    'delete-book': ['delete-book'],
    'process-dues': ['process-dues'],
    'get-transactions': ['get-transactions'],
    'dashboard': ['dashboard'],
    'like-book': ['like-book'],
    'edit-profile': ['edit-profile'],
    'search': ['search'],
    'get-user': ['get-user'],
    'most-liked-books': ['most-liked-books'],
    'recently-added-books': ['recently-added-books'],
    'validate-book-copies': ['validate-book-copies'],
    'get-books-by-genre': ['get-books-by-genre'],
    'post-review': ['post-review'],
    'post-book-review': ['post-book-review'],
    'get-reviews': ['get-reviews'],
    'get-book-reviews': ['get-book-reviews'],
    'submit-inquiry': ['submit-inquiry'],
    'get-inquiries': ['get-inquiries'],
    'check-inquiry': ['check-inquiry'],
};

const DUE_AMOUNT = 0.1

const paginate = (inputString, limit, offset) => {
    limit = limit || 25;
    offset = offset || 0;
    return `${inputString} LIMIT ${limit} OFFSET ${offset * limit}`;
}

const editableFieldsInbooks = [
    "book_name",
    "author_name",
    "genre",
    "no_of_copies"
]

module.exports = { generateAccessAndRefreshToken, options, whiteListedAPIs, query, MAX_BORROW_LIMIT, apiPermissions, DUE_AMOUNT, paginate, editableFieldsInbooks }