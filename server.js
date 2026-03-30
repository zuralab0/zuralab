const express = require('express');
const path = require('path');
const app = express();

// A Railway automatikusan adja a portot, de helyben 3000
const PORT = process.env.PORT || 3000;

// Kiszolgálja a HTML, CSS, JS fájlokat a mappából
app.use(express.static(__dirname));

// Az összes útvonalra az index.html-t tölti be
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Zura Lab szerver elindult a ${PORT} porton!`);
});