// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('frontend'));

// MongoDB Atlas Connection
const dbURI = 'mongodb+srv://rahul:Rahul22csu@project.qzm1i.mongodb.net/?retryWrites=true&w=majority&appName=project'
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Contact Schema and Model
const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// POST endpoint to save contact form data
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;

    // Validate incoming data
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const newContact = new Contact({ name, email, message });
    newContact.save()
        .then(() => res.status(201).json({ message: 'Contact saved successfully!' }))
        .catch(err => res.status(500).json({ error: 'Failed to save contact' }));
});

// Route to serve the contact page
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'pages', 'contact.html'));
});

// Serve static files from the 'frontend/pages' directory
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'pages', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
