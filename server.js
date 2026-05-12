require('dotenv').config();

const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Joi = require('joi');

const User = require("./models/user");
const MongoStore = require("connect-mongo");

const PORT = process.env.PORT || 3000;
const app = express();


// =====================
// BASIC SETUP
// =====================
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set("view engine", "ejs");

// =====================
// SESSION
// =====================
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    }),

    cookie: {
        maxAge: 1000 * 60 * 60,
        httpOnly: true
    }
}));


// =====================
// GLOBAL USER HELPER
// =====================

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});


// =====================
// MIDDLEWARE
// =====================
function isAuthenticated(req, res, next) {

    if (req.session.user) {
        return next();
    }

    return res.redirect('/login');
}

function isAdmin(req, res, next) {

    if (req.session.user && req.session.user.role === 'admin') {
        return next();
    }

    return res.status(403).send('Access Denied');
}


// =====================
// DATABASE
// =====================
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));


// =====================
// ROUTES
// =====================


// HOME
app.get('/', isAuthenticated, (req, res) => {

    res.render('home');
});


// SIGNUP
app.get("/signup", (req, res) => {

    res.render("signup", { error: null });
});

app.post('/signup', async (req, res) => {

    try {

        const schema = Joi.object({
            username: Joi.string().alphanum().min(3).max(20).required(),
            password: Joi.string().min(3).max(20).required()
        });

        const { error } = schema.validate(req.body);

        if (error) {
            return res.send(error.details[0].message);
        }

        const { username, password } = req.body;

        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.send('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await new User({
            username,
            password: hashedPassword,
            role: 'user'
        }).save();

        res.redirect('/login');

    } catch (err) {
        console.log(err);
        res.send('Error signing up');
    }
});


// LOGIN
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
            username: user.username,
            role: user.role
        };

        req.session.save((err) => {

            if (err) {
                console.log(err);
                return res.send("Session error");
            }

            return res.redirect('/');
        });

    } catch (err) {
        console.log(err);
        res.send('Login error');
    }
});


// MEMBERS
app.get('/members', isAuthenticated, async (req, res) => {

    const users = await User.find();

    const images = [
        '/images/img1.jpg',
        '/images/img2.jpg',
        '/images/img3.jpg'
    ];

    const usersWithImages = users.map(user => ({
        username: user.username,
        role: user.role,
        image: images[Math.floor(Math.random() * images.length)]
    }));

    res.render('members', {
        users: usersWithImages
    });
});


// ADMIN
app.get('/admin', isAuthenticated, isAdmin, async (req, res) => {

    const users = await User.find();

    res.render('admin', {
        users
    });
});


// PROMOTE
app.get('/promote/:id', isAuthenticated, isAdmin, async (req, res) => {

    await User.findByIdAndUpdate(req.params.id, {
        role: 'admin'
    });

    res.redirect('/admin');
});


// DEMOTE
app.get('/demote/:id', isAuthenticated, isAdmin, async (req, res) => {

    await User.findByIdAndUpdate(req.params.id, {
        role: 'user'
    });

    res.redirect('/admin');
});


// LOGOUT
app.get('/logout', (req, res) => {

    req.session.destroy(() => {
        res.redirect('/login');
    });
});


// 404
app.use((req, res) => {

    res.status(404).render('404');
});

// =====================
// START SERVER
// =====================
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});