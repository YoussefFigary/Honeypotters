const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render("home", { query: "" });
});
app.get('/about', (req, res) => {
    res.render('registration', { name: 'Chris' });
});
app.get('/home', (req, res) => {
    res.render('home', { name: 'Chris' });
});

app.get("/search", (req, res) => {
  const query = req.query.q || "";
  res.render("searchresults", { query });
});

app.get("/api/search", (req, res) => {
  const query = req.query.query || "";
  // هنا استخدم data حقيقية أو dummy array
  const products = [
    "rome",
    "paris",
    "santorini"
  ];
  const results = products.filter(p => p.toLowerCase().includes(query.toLowerCase()));
  res.json(results);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));