const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const Contact = require('./models/Contact');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000
}).then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err.message));

// Nodemailer Transporter Configuration
let transporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_USER !== 'your_email@gmail.com') {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
}

// Serve static frontend files from parent directory (Portfolio Harshita)
app.use(express.static(path.join(__dirname, '..'), {
    index: 'index.html'
}));

// API Routes
app.get('/api/contact', (req, res) => {
    res.json({
        status: 'online',
        message: 'Portfolio Contact API is running. Submit POST requests here with name, email, subject, and message.'
    });
});

app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
        }

        // 1. Save to Database
        let dbSaved = false;
        try {
            const newContact = new Contact({ name, email, subject, message });
            await newContact.save();
            dbSaved = true;
            console.log(`[Contact Saved] Message from: ${name} (${email})`);
        } catch (dbError) {
            console.error('[DB Save Error]:', dbError.message);
        }

        // 2. Send Email if configured
        let emailSent = false;
        if (transporter) {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: process.env.RECEIVER_EMAIL || process.env.EMAIL_USER,
                subject: `New Portfolio Message: ${subject || 'No Subject'}`,
                text: `You received a new message from your portfolio website.\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`
            };

            try {
                const info = await transporter.sendMail(mailOptions);
                console.log('Email sent:', info.response);
                emailSent = true;
            } catch (mailError) {
                console.error('Email sending failed:', mailError.message);
            }
        }

        if (dbSaved || emailSent) {
            return res.status(200).json({
                success: true,
                message: 'Message sent and saved successfully!'
            });
        } else {
            return res.status(500).json({
                success: false,
                message: 'Could not connect to MongoDB Atlas. Please ensure IP Access in MongoDB Atlas allows access from anywhere (0.0.0.0/0).'
            });
        }

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ success: false, message: 'Server error processing your request: ' + error.message });
    }
});

// Fallback to index.html for any other route
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
