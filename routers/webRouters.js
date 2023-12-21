const express = require('express');
const router = express.Router();
const path = require('path');
const Event = require('../models/webModel');
const session = require('express-session');
// const db = new Event('events.db');
const public = path.join(__dirname, '..', 'public', 'home.html');
const Admin = require('../models/webModel');
const admin = new Admin('account.db'); // Initialize Admin with the appropriate database file

router.use(session({
    secret: 'your-secret-key', // Replace with your secret key
    resave: false,
    saveUninitialized: false
}));

router.get('/getEvents', (req, res) => admin.getEvents(req, res));
router.post('/addEvent', (req, res) => admin.addEvent(req, res));
router.post('/editEvent/:id', (req, res) => admin.editEvent(req, res));
router.post('/deleteEvent/:id', (req, res) => admin.deleteEvent(req, res));

// retrieve the home page
router.get('/', (req, res) => {
    const public = path.join(__dirname, '..', 'public', 'home.html');
    res.sendFile(public);
});

// User registration route
router.get('/signup', (req, res) => {
    res.render('signUp', {
        title: 'SignUp Form'
    });
});

//submits signup
router.post('/signup', (req, res) => {
    admin.signUp(req, res);
});

// User login route
router.get('/login', (req, res) => {
    res.render('login', {
        title: 'Login'
    });
});

router.post('/login', (req, res) => {
    admin.login(req, res);
});

router.get('/alumni', (req, res) => {
    admin.getAllEvents()
        .then(allEvents => {
            console.log('Retrieved Events:', allEvents);
            res.render('alumni', { title: 'Alumni', events: allEvents });
        })
        .catch(error => {
            console.error('An error occurred during rendering:', error);
            res.status(500).send('An error occurred during rendering');
        });
});

router.get('/managerEvennts', (req, res) => {
    admin.getAllEvents()
        .then(allEvents => {
            console.log('Retrieved events:', allEvents);
            res.render('managerEvennts', { title: 'events', events: allEvents });
        })
        .catch(error => {
            console.error('An error occurred during rendering:', error);
            res.status(500).send('An error occurred during rendering');
        });
}); 


router.get('/manager', async (req, res) => {
    try {
        const [allAlumni, allEvents] = await Promise.all([
            admin.getAllAlumni(),
        ]);

        console.log('Retrieved Alumni:', allAlumni);

        res.render('manager', { title: 'Manager', alumni: allAlumni });
    } catch (error) {
        console.error('An error occurred during rendering:', error);
        res.status(500).send('An error occurred during rendering');
    }
});

  


router.post('/edit', (req, res) => {
    admin.editEvent(req, res);;
});

router.post('/add', (req, res) => {
    admin.addEvent(req, res);;
});

router.post('/delete', (req, res) => {
    admin.deleteEvent(req, res);;
});

// Create a new event route
router.get('/`new_event`', (req, res) => {
    res.render('newAlumniEvent', {
        title: 'Add Event'
    });
});

router.post('/new_event', (req, res) => {
    if (!req.body.Name || !req.body.Date) {
        res.status(400).send("Events must have a name and date.");
        return;
    }
    db.addEvent(req.body);
    res.redirect('/view');
});

// Delete an event route
router.get('/delete_event', (req, res) => {
    res.render('deleteAlumniEvent', {
        title: 'Delete Event'
    });
});

router.post('/delete_event', (req, res) => {
    if (!req.body.Name) {
        res.status(400).send("Enter the event name for deletion.");
        return;
    }
    db.removeEvent(req.body.Name);
    res.redirect('/view');
});

// Update an event route
router.get('/edit_event', (req, res) => {
    res.render('editEvent', {
        title: 'Edit Event'
    });
});

router.get('/signout', (req, res) => {
    const public = path.join(__dirname, '..', 'public', 'home.html');
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error logging out');
      }
      res.sendFile(public);
    });
  });

// Edit an alumni route
router.post('/edit_alumni', (req, res) => {
    admin. editAlumni(req, res);;
});

router.post('/edit_alumni', (req, res) => {
    if (!req.body.Username) {
        res.status(400).send("Enter the alumni username for editing.");
        return;
    }
    admin.editAlumni(req, res);
});

router.post('/deleteAlummni', (req, res) => {
    admin.deleteAlumni(req, res);;
});

router.post('/delete_alumni', (req, res) => {
    if (!req.body.Id) {
        res.status(400).send("Enter the alumni Id for deletion.");
        return;
    }
    admin.deleteAlumni(req, res);
});



module.exports = router;
