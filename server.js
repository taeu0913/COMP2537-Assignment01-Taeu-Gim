require('dotenv').config();

const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("./models/user");
const MongoStore = require("connect-mongo");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    }),
    cookie: {
        maxAge: 1000 * 60 * 60
    }
}));

app.set("view engine", "ejs");

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

//routes
// Home
app.get('/', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    res.render('home', { user: req.session.user });
});

//Signup
app.get("/signup", (req, res) => {
    res.render("signup", { error: null });
});

app.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;

        // check if user exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.send('User already exists');
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // save user
        const newUser = new User({
            username,
            password: hashedPassword
        });

        await newUser.save();

        res.redirect('/login');

    } catch (err) {
        console.log(err);
        res.send('Error signing up');
    }
});

//login
app.get("/login", (req, res) => {
    res.render("login", { error: null });
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (!user) {
            return res.send('User not found');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.send('Incorrect password');
        }

        // create session
        req.session.user = {
            id: user._id,
            username: user.username
        };

        res.redirect('/');

    } catch (err) {
        console.log(err);
        res.send('Login error');
    }
});

//members
app.get('/members', (req, res) => {

    if (!req.session.user) {
        return res.redirect('/');
    }

    const images = [
        '/images/img1.jpg',
        '/images/img2.jpg',
        '/images/img3.jpg'
    ];

    const randomImage = images[Math.floor(Math.random() * images.length)];

    res.render('members', {
        user: req.session.user,
        image: randomImage
    });
});

//logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('404');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});