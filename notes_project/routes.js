import express from 'express';
import { ObjectId } from "mongodb";
import passport from 'passport';

const router = express.Router();

// Middleware to ensure authentication
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

// Landing Page
router.get('/', (req, res) => {
    res.render('landing.ejs');
});

// Check User & Login/Register
router.post('/checkuser', passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/landing",
}));

// Dashboard (Protected Route)
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
    const user = req.user["_id"].toString();
    const Db = req.app.locals.Db;

    try {
        const result = await Db.collection("users").findOne({ _id: new ObjectId(user) });
        res.render('dashboard.ejs', { username: result.username, email: result.email, notes: result.notes });
    } catch (err) {
        console.error("Error fetching dashboard data:", err);
        res.status(500).send("Failed to load dashboard");
    }
});

// Create a New Note
router.post('/createnote', ensureAuthenticated, async (req, res) => {
    const user = req.user["_id"].toString();
    const { title, content, date } = req.body;
    const Db = req.app.locals.Db;

    const note = { title, content, date };

    try {
        await Db.collection("users").updateOne(
            { _id: new ObjectId(user) },
            { $push: { notes: note } }
        );
        res.redirect('/dashboard');
    } catch (err) {
        console.error("Error adding note:", err);
        res.status(500).json({ message: "Failed to create note" });
    }
});

// Update Profile
router.post('/updateprofile', ensureAuthenticated, async (req, res) => {
    const user = req.user["_id"].toString();
    const { username, email } = req.body;
    const Db = req.app.locals.Db;

    try {
        const updateFields = {};
        if (username) updateFields.username = username;
        if (email) updateFields.email = email;

        await Db.collection("users").updateOne(
            { _id: new ObjectId(user) },
            { $set: updateFields }
        );

        res.redirect('/dashboard');
    } catch (err) {
        console.error("Error updating profile:", err);
        res.status(500).json({ message: "Failed to update profile" });
    }
});

// Delete Note
router.delete('/delete', ensureAuthenticated, async (req, res) => {
    const userId = req.user["_id"].toString();
    const index = req.body.noteId;
    const Db = req.app.locals.Db;

    try {
        await Db.collection("users").updateOne(
            { _id: new ObjectId(userId) },
            { $unset: { [`notes.${index}`]: 1 } }
        );

        await Db.collection("users").updateOne(
            { _id: new ObjectId(userId) },
            { $pull: { notes: null } }
        );

        res.status(200).send({ message: "Note deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "An error occurred while deleting the note" });
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error("Logout error:", err);
            return res.status(500).send("Logout failed");
        }
        res.clearCookie("connect.sid");
        res.redirect('/');
    });
});

// Test Route
router.get('/test', (req, res) => {
    res.render('test.ejs');
});

router.get("/contactus", (req, res) => {
    res.render("contactus.ejs");
});

router.get("/features", (req, res) => {
    res.render("features.ejs");
});

export default router;
