const db = require('./db');
const express = require('express');
const path = require('path');
const session = require('express-session');

const app = express();
const port = 3000;

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Session Setup
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 }
}));

// Auth Middleware
function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
}

// Initialize Database
async function initializeDatabase(db) {
  const categoriesCollection = db.collection('categories');
  const destinationsCollection = db.collection('destinations');

  const categories = [4
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
app.get('/', (req, res) => res.render('home', { title: "express" }));
app.get('/register', (req, res) => res.render('registration'));
app.get('/login', (req, res) => res.render('login'));

// Register
app.post('/register', async (req, res) => {
  const user = {
    username: req.body.username,
    password: req.body.password,
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email
  };

  try {
    await db.collection('users').insertOne(user);
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving user");
  }
});

// Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await db.collection('users').findOne({ username });
    if (!user) return res.status(401).send("User not found");
    if (user.password !== password) return res.status(401).send("Incorrect password");

    req.session.user = { username: user.username, _id: user._id };
    res.redirect('/home');
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// Home
app.get('/home', requireLogin, (req, res) => res.render('home'));

// Destination pages
['annapurna', 'bali', 'cities', 'hiking', 'islands', 'paris', 'rome', 'santorini', 'inca'].forEach(page => {
  app.get(`/${page}`, requireLogin, (req, res) => res.render(page));
});


app.get('/categories', async (req, res) => {
  try {
    const categories = await db.collection('categories').find().toArray();
    res.render('categories', { categories });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// ---------- Add to Want-to-Go ----------
app.post('/want-to-go', requireLogin, async (req, res) => {
  const { slug } = req.body;
  const usersCollection = db.collection('users');

// ---------- SEARCH ----------

  try {
    // Get current user's wantToGo list
    const user = await usersCollection.findOne({ username: req.session.user.username });

    if (!user.wantToGo) user.wantToGo = [];

    // Check if already exists
    if (user.wantToGo.includes(slug)) {
      return res.status(400).send("Destination already in your Want-to-Go list");
    }

    // Add new destination
    user.wantToGo.push(slug);

    // Update user document
    await usersCollection.updateOne(
      { username: req.session.user.username },
      { $set: { wantToGo: user.wantToGo } }
    );

    res.status(200).send("Added successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// ---------- View user's Want-to-Go list ----------
app.get('/wanttogo', requireLogin, async (req, res) => {
  const usersCollection = db.collection('users');
  const destinationsCollection = db.collection('destinations');

  try {
    const user = await usersCollection.findOne({ username: req.session.user.username });
    const slugs = user.wantToGo || [];

    // Fetch destinations
    const destinations = await destinationsCollection.find({ slug: { $in: slugs } }).toArray();

    res.render('wanttogo', { destinations });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// ---------- Initialize DB & Start Server ----------
initializeDatabase(db)
  .then(() => console.log('Database initialized'))
  .catch(err => console.error('Database init failed', err));

app.listen(3000);
