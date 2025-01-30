# Magic Book Library - Library Management System (LMS)

This project is a full-stack Library Management System (LMS) designed to efficiently manage books, users, transactions, and reviews for a library. It features two user roles: Librarian and Student, with customized access and functionalities. The system supports real-time overdue penalties, book borrowing, user registration, and detailed reporting for librarians. This system is built using a combination of modern technologies including React, Node.js, Express, MySQL, and various other libraries.

It's fully responsive and if you want to check other details see my **[portfolio](netlify.com)** and check project section and check this project's more details and screenshots.

---

## Technologies & Libraries Used

### Backend:
- **Node.js**: Backend development environment.
- **Express.js**: Web framework for building RESTful APIs.
- **MySQL**: Relational database management system for storing and retrieving library data.
- **NodeMailer**: For sending OTP and email notifications.
- **JWT (JSON Web Tokens)**: For secure user authentication and session management.
- **Bcrypt.js**: For password hashing and security.
- **Multer**: For handling file uploads (such as book cover images).
- **Cloudinary**: For storing book images and media files.
- **Cardknox**: For payment processing and overdue penalties.
- **dotenv**: For managing environment variables.
- **winston**: For logging.

### Frontend:
- **React.js**: Frontend library for building the user interface.
- **Material-UI**: A popular UI framework for building React components with a consistent look and feel.
- **Tailwind CSS**: A utility-first CSS framework for styling.
- **Framer Motion**: For adding animations and transitions to the user interface.
- **Chart.js**: For displaying visual data such as library statistics and transaction reports.
- **Axios**: For making HTTP requests to interact with the backend.
- **React Router**: For managing routing and navigation.
- **React Icons**: For adding icons to the user interface.
- **Lodash**: A utility library that simplifies JavaScript code.
- **Multiselect React Dropdown**: For creating dropdowns with multi-select options.
- **React Date Range**: For selecting date ranges in user interfaces.
- **React Dropzone**: For file uploads.
- **React Loader Spinner**: For adding loading spinners in the UI.
- **React Slick**: For building carousels and sliders.

---

## Features & Functionality

### **For Librarians**:
- **Dashboard**: View metrics such as total books, users, transactions, and overdue dues.
- **Manage Books**: Add, update, delete, and view books in the library.
- **Manage Users**: View, edit, and delete user information.
- **Book Requests**: Approve or decline book requests from students.
- **Transaction Tracking**: Monitor all borrowing transactions, including penalties.
- **Reports**: Generate reports on book statistics, user activity, and overdue penalties.

### **For Students**:
- **User Profile**: Update personal information and view borrowing history.
- **Book Borrowing**: Borrow books and track due dates.
- **Book Requests**: Request new books that are not available in the library.
- **Reviews**: Submit reviews for borrowed books.
- **Overdue Penalties**: View overdue penalties and make payments.

### **Advanced Features**:
- **Real-time Overdue Penalty Calculation**: Automatically tracks overdue books and applies penalties.
- **Multi-language Support**: Integrated Google Translate API to support multiple languages for accessibility.
- **Payment Integration**: Pay for overdue books through secure Cardknox transaction processing.

---

## Setup & Installation

### Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js**: To run the backend server.
- **MySQL**: To host the database.
- **Vite**: For building and running the frontend application.

### Installation

#### Backend (Node.js + Express)
1. Clone the repository.
2. Navigate to the server folder:
   ```bash
   cd server
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up the database:
   - Import the SQL dump `libbrary-sysytem-dhruval.sql` into your MySQL database.
   - Modify the `.env` file with your database credentials and other secrets.
   
   Example `.env`:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=your_password
   DB_NAME=libbrary-sysytem-dhruval
   PORT=3000
   ACCESS_TOKEN_SECRET=your_access_token_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

#### Frontend (React + Vite)
1. Navigate to the `client` folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Running the Application

- The backend server will run on `http://localhost:3000`.
- The frontend will run on `http://localhost:5173` (default Vite port).

---

## Database Structure

The database is designed with multiple interconnected tables to support various functionalities. Below are some key tables:

- **tbl_book**: Stores information about books.
- **tbl_reviews**: Stores book reviews.
- **tbl_borrower**: Stores information about students borrowing books.
- **tbl_transactions**: Stores transaction data related to book borrowing and payments.
- **tbl_users**: Stores user information for both librarians and students.

---

## Environment Variables

Make sure to configure the environment variables in the `.env` file for the server.

Example:
```
NODE_ENV=dev
DB_HOST=localhost
DB_USERNAME=root
DB_PASSWORD=
DB_NAME=libbrary-sysytem-dhruval
PORT=3000

REFRESH_TOKEN_SECRET = your_Secret
REFRESH_TOKEN_EXPIRY = your_Secret

ACCESS_TOKEN_SECRET = your_Secret
ACCESS_TOKEN_EXPIRY = your_Secret

PORT = 3000

CARDKNOX_API_KEY = your_Secret


GOOGLE_CLIENT_ID = your_Secret
GOOGLE_CLIENT_SECRET = your_Secret

CLOUDINARY_CLOUD_NAME = your_Secret
CLOUDINARY_API_KEY = your_Secret
CLOUDINARY_API_SECRET = your_Secret

# node maier 
EMAIL_USER= your_Secret
EMAIL_PASS= your_Secret
...
```
---

## Help and Support

If you encounter any issues while setting up or using the Magic Book Library, or if you have any questions, you can reach out for help via the following channels:

### Troubleshooting

- **Check the Logs**: 
  - For backend issues, check the logs by reviewing the output in your terminal or the log files generated by the app. You can use `winston` for detailed logging in the server.
  - For frontend issues, check the browser console for any error messages.

- **Common Issues**:
  - If you're facing problems connecting to the MySQL database, ensure your database credentials in the `.env` file are correct and the MySQL service is running.
  - If the frontend isn't loading correctly, ensure you have installed all dependencies and started both the backend and frontend servers.

### Contact Support

If you can't resolve the issue on your own, feel free to get in touch:

- **Email Support**: 
  - Send an email to **[miralimoradiya@gmail.com](mailto:miralimoradiya@gmail.com)** for general inquiries and technical support.

- **GitHub Issues**:
  - Open an issue on the [GitHub repository](https://github.com/Miralimoradiya/Magic-Book-Library) if you find a bug or need assistance.

---
