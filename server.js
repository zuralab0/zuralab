const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios'); // Kelleni fog az axios: npm install axios
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.post('/send-email', async (req, res) => {
    const { name, email, message, subject } = req.body;

    try {
        const response = await axios.post('https://api.brevo.com/v3/smtp/email', {
            sender: { name: "Zura Lab Web", email: "noreply@zuralab.hu" },
            to: [{ email: process.env.EMAIL_USER }], // Ide érkezik a levél
            subject: `Új üzenet: ${name} - ${subject || 'Érdeklődés'}`,
            textContent: `Név: ${name}\nEmail: ${email}\n\nÜzenet:\n${message}`
        }, {
            headers: {
                'api-key': process.env.BREVO_API_KEY, // Ezt add meg a Railway-en!
                'Content-Type': 'application/json'
            }
        });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Hiba a küldésnél:", error.response ? error.response.data : error.message);
        res.status(500).json({ success: false });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Szerver fut: ${PORT}`);
});