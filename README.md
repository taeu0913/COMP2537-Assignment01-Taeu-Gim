# COMP 2537 Assignment 1 - Node.js Authentication Website

## Project Overview
This is a simple web application built using Node.js, Express, and MongoDB.  
It allows users to sign up, log in, and access a members-only area with session-based authentication.

---

## Self-graded Assignment 1 Checklist

    Criteria	
    ========
[x]  A home page links to signup and login, if not logged in; and links to members and signout, if logged in.
[x]  A members page that displays 1 of 3 random images stored on the server.
[x]  The members page will redirect to the home page if no valid session is found.
[x]  The signout buttons end the session.
[x]  All secrets, encryption keys, database passwords are stored in a .env file.

[x]  The .env file is NOT in your git repo.
[x]  Password is BCrypted in the MongoDB database.
[x]  Your site is hosted in a hosting service like Render.
[x]  A 404 page that "catches" all invalid page hits and that sets the status code to 404.
[x]  Session information is stored in an encrypted MongoDB session database. Sessions expire after 1 hour.

## Features
- User signup with name, email, and password
- Secure password hashing using bcrypt
- User login authentication
- Session-based login system (1 hour expiry)
- Protected members-only page
- Random image displayed in members area
- Logout functionality (session destroy)
- 404 error page for invalid routes
- MongoDB Atlas database integration
- Environment variables using `.env`

---

## Tech Stack
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- bcrypt
- express-session
- connect-mongo
- EJS (templating engine)
- dotenv

---

## Setup Instructions

### 1. Install dependencies
npm install

### 2. Create `.env` file
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_secret_key

### 3. Run the app
npm run dev
or
node server.js

---

## Routes

- `/` → Home page (dynamic based on login state)
- `/signup` → User registration
- `/login` → User login
- `/members` → Protected members page
- `/logout` → Logout user
- `/*` → 404 page

---

## Security Features
- Passwords hashed using bcrypt
- Input validation (Joi recommended)
- Sessions stored securely in MongoDB
- Session expiration after 1 hour
- `.env` file used for sensitive data

---

## Members Page Feature
Displays a random image from a set of 3 images stored in `/public/images`.

---

## Author
Taeu Gim  
COMP 2537 Web Development 2 Assignment 1
