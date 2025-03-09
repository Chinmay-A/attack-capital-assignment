# Posts App

This is a full-stack web application built with **Next.js** as the frontend and **Node.js** for the backend. It allows users to sign up, log in, and create posts. Authentication is handled using **JWT**. Also **PostgreSQL** is used as the database.

# Setup Instructions

To set up the project, follow these steps:

1. **Backend Setup**
   - Navigate to the project root where `index.js` is located.
   - Create a `.env` file and add the following:
     ```
     APP_PORT=5879
     POSTGRES_DB=database_name
     POSTGRES_USER=database_user
     POSTGRES_PASSWORD=database_password
     POSTGRES_HOST=localhost
     POSTGRES_PORT=5432
     AUTH_SECRET=secret_key_for_bcrypt
     ```
   - Install dependencies:
     ```
     npm install
     ```
   - Run the database migration script to create the necessary tables:
     ```
     node createTables.js
     ```
   - Start the backend server:
     ```
     npm start
     ```
     The API will be running at `http://localhost:5879/api`.

2. **Frontend Setup**
   - Navigate to the `frontend` directory:
     ```
     cd frontend
     ```
   - Install frontend dependencies:
     ```
     npm install
     ```
   - Start the Next.js server:
     ```
     npm run dev
     ```
     The frontend will be running at `http://localhost:3000`.

# Design Choices

- **Bcrypt Hashing**: Bcrypt was used for hashing because it adds random strings (salts) to the password before hashing it, so that even two same passwords have differet hashes
- **Bootstrap Styling**: I have used bootstrap because it provides functionality for easy and modern styling

