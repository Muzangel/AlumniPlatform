// Import necessary libraries and set up file paths
const nedb = require('nedb');
const path = require('path');
const dbFilePath = path.join(__dirname,'../','data.db')
  
const { Manager } = require('session');

// Create a class for handling administrative tasks
class Admin {
  constructor() {
    // Initialize a database and connect to it
    if (dbFilePath) {
      this.db = new nedb({ filename: dbFilePath, autoload: true });
      console.log('DB connected to ' + dbFilePath);
      this.db.loadDatabase();
    } else {
      this.db = new nedb();
    }
  }

  init(){}

   // Initialize methods
  signUp(req, res) {
    try {
      const { username, email, password, repeatPassword, role } = req.body;


      this.db.findOne({ username }, (err, existingUser) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Server error' });
        }

        if (existingUser) {
          return res.status(400).json({ error: 'Username already exists.' });
        }

        const newUser = {
          username,
          email,
          password,
          repeatPassword,
          role,
        };

        // Insert the new user
        this.db.insert(newUser, (err, insertedUser) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Server error' });
          }
          res.status(201).json({ message: 'User registered successfully', user: insertedUser });
        });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }
  

  login(req, res) {
    const { username, password, role } = req.body;
    console.log(username);
    console.log(password);
    console.log(role);
  
    const alumni = this.db.findOne({ username });
    if (!alumni) {
      return res.status(404).json({ error: 'User does not exist.' });
    }
  
    if (password !== password) { // Compare with user's password
      console.log(alumni.password);
      console.log(password);
      return res.status(404).json({ error: 'Password incorrect.' });
    }

    if (password !== password) { // Compare with user's password
      console.log(Manager.password);
      console.log(password);
      return res.status(404).json({ error: 'Password incorrect.' });
    }
  
    if (role === 'alumni') {
      // Redirect to the alumni page
      return res.redirect('/alumni');
    } else if (role === 'manager') {
      // Redirect to the manager page
      return res.redirect('/manager');
    } else {
      return res.status(403).json({ error: 'Incorrect Role' });
    }
  }
  
  async getAllEvents() {
    try {
        const allEvents = await new Promise((resolve, reject) => {
            this.db.find({Type:'Event'}, (err, events) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(events);
                }
            });
        });
        return allEvents;
    } catch (error) {
        console.error('Error in getAllEvents:', error.message);
        throw new Error('Failed to retrieve events');
    }
  }

  addEvent(req, res) {
    try {
      const eventData = req.body; // Data for the new event
      this.db.insert(eventData, (err, newEvent) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Server error' });
        }
        res.status(201).json({ message: 'Event added successfully', event: newEvent });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  // Edit an event by its ID
  editEvent(req, res) {
    try {
      const eventName = req.body.name; 
      const updatedEventData = req.body; // Data to update the event 
      console.log (eventName);
      this.db.update({ name: eventName }, { $set: updatedEventData }, {}, (err, nameReplaced) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Server error' });
        }
        if (nameReplaced === 0) {
          return res.status(404).json({ error: 'Event not found' });
        }
        res.status(200).json({ message: 'Event updated successfully' });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  // Delete an event by its ID
  deleteEvent(req, res) {
    try {
      const name = req.body.name; // Assuming the event ID is passed as a route parameter
      this.db.remove({ name: name }, {}, (err, numRemoved) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Server error' });
        }
        if (numRemoved === 0) {
          return res.status(404).json({ error: 'Event not found' });
        }
        res.status(200).json({ message: 'Event deleted successfully' });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }


  // Alumni methods

  // add an alumni by their ID
  async getAllAlumni() {
    try {
        const allAlumni = await new Promise((resolve, reject) => {
            this.db.find({Type:'Alumni'}, (err, Alumni) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(Alumni);
                }
            });
        });
        return allAlumni;
    } catch (error) {
        console.error('Error in getAllAlumni:', error.message);
        throw new Error('Failed to retrieve Alumni');
    }
  }
  

  
  // Edit an alumni by their ID
  addAlumni(req, res) {
    try {
      const alumniData = req.body; // Data for the new alumni
      this.db.insert(alumniData, (err, newEvent) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Server error' });
        }
        res.status(201).json({ message: 'Event added successfully', alumni: newAlumni });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  // Edit an alumni 
  editAlumni(req, res) {
    try {
      const alumniId = req.params.id; // Assuming the alumni ID is passed as a route parameter
      const editAlumniData = req.body; // Data to update the alumni
      this.db.update({alumniId }, { $set: editAlumniData }, {}, (err, numReplaced) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Server error' });
        }
        if (numReplaced === 0) {
          return res.status(404).json({ error: 'Alumni not found' });
        }
        res.status(200).json({ message: 'Alumni updated successfully' });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  // Delete an alumni by their ID
  deleteAlumni(req, res) {
    try {
      const Id = req.body.Id; // Assuming the event ID is passed as a route parameter
      this.db.remove({ Id: Id }, {}, (err, numRemoved) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Server error' });
        }
        if (numRemoved === 0) {
          return res.status(404).json({ error: 'Alumni not found' });
        }
        res.status(200).json({ message: 'Alumni deleted successfully' });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = Admin;
