var express = require('express');
var path = require('path');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req,res){
  res.render('index',{title: "express"})
});

app.get('/registration',function(req,res){
  res.render('registration')
});

app.post('/register',function(req,res){
   try {
      var x = req.body.username;
      var y = req.body.password;

      const newUser = new User({
          username: x,
          password: y
      });

      newUser.save();

      res.send("User registered successfully!");
   } catch (err) {
      console.error(err);
      res.status(500).send("Error saving user.");
   }
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
app.get('/home',function(req,res){
  res.render('home')
});

app.post('/search',function(req,res){
  const searchValue = req.body.Search;
  console.log("User searched for:", searchValue);
  res.render("searchresults", { search: searchValue });
});

app.get('/islands',function(req,res){
  res.render('islands')
});
app.get('/login',function(req,res){
  res.render('login')
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

app.listen(3000);
