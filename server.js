const db = require('./db');
var express = require('express');
var path = require('path');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

async function initializeDatabase(db) {

  const categoriesCollection = db.collection('categories');
  const destinationsCollection = db.collection('destinations');
const categories = [{
        categoryId: '1',
        name: 'Hiking'
},
{
        categoryId: '2',
        name: 'Islands'
},
{
        categoryId: '3',
        name: 'Cities'
}];

const destinations = [{
        name: 'Bali',
        slug: 'bali',
        categoryId: '2',
        description: 'Famous Indonesian island known for beaches and temples.',
        videoUrl: 'https://www.youtube.com/watch?v=abc456'
      },
      {
        name: 'Santorini',
        slug: 'santorini',
        categoryId: '2',
        description: 'A stunning Greek island famous for white-washed buildings.',
        videoUrl: 'https://www.youtube.com/watch?v=santorini123'
      },
      {
        name: 'Rome',
        slug: 'rome',
        categoryId: '3',
        description: 'The historic capital of Italy.',
        videoUrl: 'https://www.youtube.com/watch?v=rome123'
      },
      {
        name: 'Paris',
        slug: 'paris',
        categoryId: '3',
        description: 'The City of Light.',
        videoUrl: 'https://www.youtube.com/watch?v=paris123'
      },
      {
        name: 'Inca Trail',
        slug: 'inca',
        categoryId: '1',
        description: 'A legendary hiking path in Peru.',
        videoUrl: 'https://www.youtube.com/watch?v=inca123'
      },
      {
        name: 'Annapurna Circuit',
        slug: 'annapurna',
        categoryId: '1',
        description: 'One of the world’s most famous trekking routes.',
        videoUrl: 'https://www.youtube.com/watch?v=annapurna123'
      }];

 const categoryCount = await categoriesCollection.countDocuments();

  if (categoryCount === 0) {
    await categoriesCollection.insertMany(categories);
    console.log('Categories initialized');
  } else {
    console.log('Categories already initialized');
  }

  // ---------- CHECK & INSERT DESTINATIONS ----------
  const destinationCount = await destinationsCollection.countDocuments();

  if (destinationCount === 0) {
    await destinationsCollection.insertMany(destinations);
    console.log('Destinations initialized');
  } else {
    console.log('Destinations already initialized');
  }

}













app.get('/', function(req,res){
  res.render('index',{title: "express"})
});

app.get('/register',function(req,res){
  res.render('registration')
});

app.post('/register',function(req,res){
   const user = {
        username: req.body.username,
        password: req.body.password,
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email
    };

    db.collection('users')
      .insertOne(user)
      .then(() => {
          res.redirect('/login');  // Redirect after success
      })
      .catch(err => {
          console.error(err);
          res.status(500).send("Error saving user");
      });
});

app.get('/login',function(req,res){
  res.render('login')
});

app.post('/login',function(req,res){
  const { username, password } = req.body;

    db.collection('users').findOne({ username: username })
        .then(user => {
            // User not found
            if (!user) {
                return res.status(401).send("User not found");
            }

            // Password does not match
            if (user.password !== password) {
                return res.status(401).send("Incorrect password");
            }

            // Login successful
           res.redirect('/home');
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Server error");
        });
});

app.get('/home',function(req,res){
  res.render('home')
});
app.post('/home', async (req, res) => {

  const page = req.body.page;        // from buttons

 //redirection of pages 
  if (page) {
    switch (page) {
      case 'hiking':
        return res.redirect('/hiking');
      case 'cities':
        return res.redirect('/cities');
      case 'islands':
        return res.redirect('/islands');
      case 'wanttogo':
        return res.redirect('/wanttogo');
      default:
        return res.redirect('/home');
    }
  }
  //redirection to home page if nth happens 
  res.redirect('/home');
});




app.get('/annapurna',function(req,res){
  res.render('annapurna')
});
app.get('/bali',function(req,res){
  res.render('bali')
});
app.get('/cities',function(req,res){
  res.render('cities')
});
app.get('/hiking',function(req,res){
  res.render('hiking')
});


app.post('/search', async (req, res) => {
  const keyword = req.body.search?.trim();

  if (!keyword) {
    return res.render('searchresults', {
      results: [],
      message: 'Destination not found'
    });
  }

  // SUBSTRING SEARCH (case-insensitive)
  const results = await db.collection('destinations').find({
    name: { $regex: keyword, $options: 'i' }
  }).toArray();

  if (results.length === 0) {
    return res.render('searchresults', {
      results: [],
      message: 'Destination not found'
    });
  }

  res.render('searchresults', {
    results,
    message: null
  });
});

app.get('/islands',function(req,res){
  res.render('islands')
});

app.get('/paris',function(req,res){
  res.render('paris')
});
app.get('/rome',function(req,res){
  res.render('rome')
});
app.get('/santorini',function(req,res){
  res.render('santorini')
});
app.get('/searchresults',function(req,res){
  res.render('searchresults')
});
app.get('/wanttogo',function(req,res){
  res.render('wanttogo')
});
app.get('/inca',function(req,res){
  res.render('inca')
});



initializeDatabase(db)
  .then(() => console.log('Database initialization completed'))
  .catch(err => console.error('Database initialization failed:', err));

app.listen(3000);
