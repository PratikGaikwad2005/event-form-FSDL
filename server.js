// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json()); // For parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Default route to serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost/event-registration')
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB: ", err));

// Define the Event Registration Schema with new fields
const eventSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,      // New field for phone number
    event: String,      // Event type
    eventDate: Date,    // Event date
    date: { type: Date, default: Date.now },
});

// Create a model
const Event = mongoose.model('Event', eventSchema);

// API endpoint to register for an event
app.post('/register', async (req, res) => {
    const { name, email, phone, event, eventDate } = req.body;

    // Create a new event registration
    const newEvent = new Event({
        name,
        email,
        phone,
        event,
        eventDate,
    });

    try {
        await newEvent.save();
        res.status(200).json({ message: 'Registration successful!', newEvent });
    } catch (error) {
        res.status(500).json({ message: 'Error registering event', error });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});