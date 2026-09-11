require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const Contact = require('./models/Contact');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Nodemailer Transporter Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can change this to another provider
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// API Routes
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
        }

        // 1. Save to Database
        const newContact = new Contact({ name, email, subject, message });
        await newContact.save();

        // 2. Send Email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.RECEIVER_EMAIL, // E.g., harshita9580gupta@gmail.com
            subject: `New Portfolio Message: ${subject || 'No Subject'}`,
            text: `You received a new message from your portfolio website.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Email sending failed:', error);
                // We still saved it to the DB, so we return a partial success or error
                return res.status(500).json({ success: false, message: 'Saved to DB, but failed to send email.' });
            } else {
                console.log('Email sent: ' + info.response);
                return res.status(200).json({ success: true, message: 'Message sent and saved successfully!' });
            }
        });

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ success: false, message: 'Server error processing your request.' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
