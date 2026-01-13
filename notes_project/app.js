import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import ejs from 'ejs';
import { connectToDb, getDb } from './db.js';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import routes from './routes.js'; // Import routes
import { ObjectId } from 'mongodb';


const app = express();
const port = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Set up EJS
app.set('view engine', 'ejs');
app.set('views', './views');

// Database instance
let Db;

// Connect to Database
connectToDb((err) => {
    if (err) {
        console.log("Failed to connect to the database", err
    } else {
        console.log("Connected to the database");
        Db = getDb();
        app.locals.Db = Db; // Make Db accessible in routes
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
});

// ❌ WRONG ORDER — INTRODUCED BUG
app.use(passport.initialize());
app.use(passport.session());

// Session Configuration
app.use(session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

//
// Passport Local Strategy (Email-only auth)
passport.use(new LocalStrategy(
    { usernameField: 'email', passwordField: 'email' },
    async (email, _, done) => {
        try {
            let user = await Db.collection("users").findOne({ email });

            if (!user) {
                const result = await Db.collection("users").insertOne({
                    email,
                    username: "new user",
                    notes: []
                });
                user = await Db.collection("users").findOne({ _id: result.insertedId });
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));

// Serialize & Deserialize User
passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await Db.collection("users").findOne({ _id: new ObjectId(id) });
        done(null, user);
    } catch (err) {
        done(err);
    }
});

// Use routes
app.use('/', routes);

// web hook test
//web oo 