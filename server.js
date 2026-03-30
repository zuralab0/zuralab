const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware - adatok feldolgozásához
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Statikus fájlok kiszolgálása (HTML, CSS, JS, IMG)
// Ez biztosítja, hogy a böngésző lássa a stílusaidat és képeidet
app.use(express.static(__dirname));

// E-mail küldő konfiguráció (SMTP)
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // 587-es port esetén kötelezően false
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        // Ez segít átjutni a Railway hálózati korlátozásain
        rejectUnauthorized: false
    }
});

// E-mail küldő végpont
app.post('/send-email', (req, res) => {
    const { name, email, message } = req.body;

    const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER,
        subject: `Üzenet tőle: ${name}`,
        text: `Név: ${name}\nE-mail: ${email}\n\nÜzenet:\n${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ success: false });
        }
        res.status(200).json({ success: true });
    });
});

// Minden egyéb kérésre az index.html-t adja vissza
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`A szerver fut a ${PORT}-es porton!`);
});