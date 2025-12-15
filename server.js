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

// Destination routes
app.get('/inca', (req, res) => {
    res.render('inca', {
        title: 'Inca Trail Adventure',
        destination: 'inca',
        description: 'Explore the ancient Inca Trail to Machu Picchu',
        image: '/images/inca.png',
        // Add more data as needed
    });
});

app.get('/paris', (req, res) => {
    res.render('paris')
});

app.get('/annapurna', (req, res) => {
    res.render('annapurna')
});

app.get('/santorini', (req, res) => {
    res.render('santorini')
});

app.get('/rome', (req, res) => {
    res.render('rome')
});

app.get('/bali', (req, res) => {
    res.render('bali')
});

// If you have other pages (like categories)
app.get('/hiking', (req,res)=>{
    res.render('hiking')
})

app.get('/cities', (req, res) => {
    res.render('cities')
});


app.get('/islands', (req,res)=>{
    res.render('islands')
})
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));