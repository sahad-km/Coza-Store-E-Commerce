if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path')
const bodyParser = require('body-parser')
const flash = require('connect-flash');

app.use(flash());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());

const dbConnect = process.env.MONGO_URL;
mongoose.connect(dbConnect);

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static('files'));
app.use(express.static(path.join(__dirname,'public')));
app.use(methodOverride('_method'));


const pages = require('./routes/pages');
const users = require('./routes/users');
const adminPages=require('./routes/admin_pages');


const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({
    uri: dbConnect,
    collection: 'sessionStore'
  });
  store.on('error', function(error) {
    console.log(error);
  });
  app.use(session({
    secret: 'This is a secret',
    cookie: {
      maxAge: 1000 * 60 * 60 // 1 hour
    },
    store: store,
    resave: false,
    saveUninitialized: false
  }));
  app.use(function (req, res, next) {
    res.set(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    next();
  });

app.use((req,res,next)=>{
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  next();
});
app.use(function(req, res, next) {
  res.locals.user = req.session.userId;
  next();
});

app.use('/admin',adminPages);
app.use('/users',users);
app.use('/',pages);

app.get('*', (req, res, next) => {
  res.render("404NotFound")
});


app.listen(3000,()=>console.log('Server live on 3000...'));