# COMP 2537 Assignment 1 - Node.js Authentication Website

## Project Overview
This is a simple web application built using Node.js, Express, and MongoDB.  
It allows users to sign up, log in, and access a members-only area with session-based authentication.

---

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

## Project Structure
---
public/
├── images/
├── styles.css

views/
├── home.ejs
├── login.ejs
├── signup.ejs
├── members.ejs
├── 404.ejs

models/
├── user.js

server.js
.env (NOT included in repo)
---


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
