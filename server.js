const db = require('./db');
const express = require('express');
const path = require('path');

const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// ---------- Database Initialization ----------
async function initializeDatabase(db) {
  const categoriesCollection = db.collection('categories');
  const destinationsCollection = db.collection('destinations');

  const categories = [
    { categoryId: '1', name: 'Hiking' },
    { categoryId: '2', name: 'Islands' },
    { categoryId: '3', name: 'Cities' }
  ];

  const destinations = [
    { name: 'Bali', slug: 'bali', categoryId: '2', description: 'Famous Indonesian island known for beaches and temples.', videoUrl: 'https://www.youtube.com/watch?v=abc456' },
    { name: 'Santorini', slug: 'santorini', categoryId: '2', description: 'A stunning Greek island famous for white-washed buildings.', videoUrl: 'https://www.youtube.com/watch?v=santorini123' },
    { name: 'Rome', slug: 'rome', categoryId: '3', description: 'The historic capital of Italy.', videoUrl: 'https://www.youtube.com/watch?v=rome123' },
    { name: 'Paris', slug: 'paris', categoryId: '3', description: 'The City of Light.', videoUrl: 'https://www.youtube.com/watch?v=paris123' },
    { name: 'Inca Trail', slug: 'inca', categoryId: '1', description: 'A legendary hiking path in Peru.', videoUrl: 'https://www.youtube.com/watch?v=inca123' },
    { name: 'Annapurna Circuit', slug: 'annapurna', categoryId: '1', description: 'One of the world’s most famous trekking routes.', videoUrl: 'https://www.youtube.com/watch?v=annapurna123' }
  ];

  if ((await categoriesCollection.countDocuments()) === 0) {
    await categoriesCollection.insertMany(categories);
    console.log('Categories initialized');
  }

  if ((await destinationsCollection.countDocuments()) === 0) {
    await destinationsCollection.insertMany(destinations);
    console.log('Destinations initialized');
  }
}

// ---------- Routes ----------
app.get('/', (req, res) => res.render('index', { title: "express" }));
app.get('/register', (req, res) => res.render('registration'));
app.post('/register', (req, res) => {
  const user = { username: req.body.username, password: req.body.password, fname: req.body.fname, lname: req.body.lname, email: req.body.email };
  db.collection('users').insertOne(user)
    .then(() => res.redirect('/login'))
    .catch(err => res.status(500).send("Error saving user"));
});

app.get('/login', (req, res) => res.render('login'));
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.collection('users').findOne({ username })
    .then(user => {
      if (!user) return res.status(401).send("User not found");
      if (user.password !== password) return res.status(401).send("Incorrect password");
      res.redirect('/home');
    })
    .catch(err => res.status(500).send("Server error"));
});

app.get('/home', (req, res) => res.render('home'));
app.post('/home', (req, res) => {
  const page = req.body.page;
  switch(page) {
    case 'hiking': return res.redirect('/hiking');
    case 'cities': return res.redirect('/cities');
    case 'islands': return res.redirect('/islands');
    case 'wanttogo': return res.redirect('/wanttogo');
    default: return res.redirect('/home');
  }
});

// Destination pages
['annapurna', 'bali', 'cities', 'hiking', 'islands', 'paris', 'rome', 'santorini', 'wanttogo', 'inca'].forEach(page => {
  app.get(`/${page}`, (req, res) => res.render(page));
});

// ---------- SEARCH ----------

// POST search from form
app.post('/search', (req, res) => {
  const keyword = req.body.search?.trim();
  if (!keyword) return res.redirect('/searchresults');
  // redirect to GET route with query
  res.redirect(`/searchresults?q=${encodeURIComponent(keyword)}`);
});

// GET search results page
app.get('/searchresults', async (req, res) => {
  const query = req.query.q?.trim();
  if (!query) {
    return res.render('searchresults', { query: '', results: [], message: null });
  }

  const results = await db.collection('destinations').find({
    name: { $regex: query, $options: 'i' }
  }).toArray();

  res.render('searchresults', {
    query,
    results,
    message: results.length === 0 ? 'Destination not found' : null
  });
});

// ---------- Initialize DB & Start Server ----------
initializeDatabase(db)
  .then(() => console.log('Database initialized'))
  .catch(err => console.error('Database init failed', err));

app.listen(3000, () => console.log('Server running on port 3000'));
