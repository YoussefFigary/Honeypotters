const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('login', { name: 'Chris' });
});
app.get('/about', (req, res) => {
    res.render('registration', { name: 'Chris' });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));