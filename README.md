# Harshita Gupta — Portfolio

A full-stack portfolio website built with a static HTML frontend and a Node.js + Express backend.

## 🚀 Tech Stack
- **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Email**: Nodemailer (Gmail SMTP)
- **Deployment**: Vercel (frontend) / Railway or Render (backend)

## 📁 Project Structure
```
Portfolio Harshita/
├── index.html          # Main portfolio page (frontend)
├── backend/
│   ├── server.js       # Express API server
│   ├── models/
│   │   └── Contact.js  # MongoDB contact schema
│   ├── package.json
│   └── .env            # Environment variables (NOT committed)
└── README.md
```

## ⚙️ Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (copy from `.env.example`):
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/portfolio
   EMAIL_USER=your_gmail@gmail.com
   EMAIL_PASS=your_gmail_app_password
   RECEIVER_EMAIL=harshita9580gupta@gmail.com
   ```
   > **Note**: For `EMAIL_PASS`, generate a [Gmail App Password](https://myaccount.google.com/apppasswords) (not your regular password).

4. Start the server:
   ```bash
   node server.js
   ```

## 🌐 Frontend
Simply open `index.html` in a browser. The contact form submits to `http://localhost:5000/api/contact`.

## 📬 Contact API Endpoint
```
POST /api/contact
Body: { name, email, subject, message }
```
- Saves the message to MongoDB
- Sends an email notification to Harshita

## 👩‍💻 Author
**Harshita Gupta** — [GitHub](https://github.com/phoenixharshita04) | [LinkedIn](https://linkedin.com/in/harshitaguptag)
