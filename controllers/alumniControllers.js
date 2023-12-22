//imports
const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const sqlite3 = require('sqlite3').vervose();
const Admin = require('../models/Admin');

const db = new sqlite3.Database('accounts.db');
const router = express.Router();
const admin = new Admin('admin.db');

//authetication
router.use(passport.initialize());
router.use(passport.session());

passport.use(new LocalStrategy(
  (username, password, done) => {
    if (username === 'yourUsername' && password === 'yourPassword') {
      return done(null, { id: 1, username: 'yourUsername', role: 'alumni' });
    } else {
      return done(null, false, { message: 'Incorrect username or password' });
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = { id: 1, username: 'yourUsername', role: 'alumni' };
  done(null, user);
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

function createDatabaseIfNotExists() {
}

createDatabaseIfNotExists();

module.exports = {
  getEvents,
  addEvent,
  editEvent,
  deleteEvent,
}

// Routes for handling signup, login, and alumni-related actions
router.post('/signup', (req, res) => {
  const username = req.body.username;
  const Password = req.body.Password;

  try {
    admin.signUp(req, res);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.post('/login', (req, res) => {
  try {
    admin.login(req, res);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.post('/alumni_signup', (req, res) => {
  try {
    admin.alumniSignUp(req, res);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.post('/alumni_login', (req, res) => {
  try {
    admin.alumniLogin(req, res);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.get('/alumni_profile/:id', (req, res) => {
  try {
    admin.viewAlumniProfile(req, res);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.post('/alumni_profile/:id/edit', (req, res) => {
  try {
    admin.editAlumniProfile(req, res);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});



router.post('/add_event', (req, res) => {
  try {
    admin.addEvent(req, res);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.post('/edit_event/:id', (req, res) => {
  try {
    admin.editEvent(req, res);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.post('/delete_event/:id', (req, res) => {
  try {
    admin.deleteEvent(req, res);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.post('/delete_alumni/:id', (req, res) => {
  try {
    admin.deleteAlumni(req, res);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.get('/alumni', async (req, res) => {
  try {
    const allEvents = await admin.getAllEvents(); // Update this line
    console.log('Retrieved Events:', allEvents);

    res.render('alumni', { title: 'Alumni', events: allEvents });
  } catch (error) {
    console.error('An error occurred during rendering:', error);
    return res.status(500).send('An error occurred during rendering');
  }
});

router.get('/manager', async (req, res) => {
  try {
    const allEvents = await admin.getAllEvents(); // Update this line
    console.log('Retrieved Events:', allEvents);

    res.render('manager', { title: 'Manager', events: allEvents });
  } catch (error) {
    console.error('An error occurred during rendering:', error);
    return res.status(500).send('An error occurred during rendering');
  }
});






module.exports = router;
