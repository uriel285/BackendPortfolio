var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');

const fileUpload = require('express-fileupload');
const cors = require('cors');

var app = express();

// Configura el directorio de vistas
app.set('views', path.join(__dirname, 'views'));


require('dotenv').config();

secured = async(req, res, next) =>{
  try{
    console.log(req.session.id_usuario);
    if(req.session && req.session.id_usuario){
      next();
    }
    else{
      res.redirect('/admin/login');
    }
  }
  catch(error){
    console.log(error);
  }
}

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({

  secret: 'secret-key', //semilla de forma oculta

  resave: false,

  saveUninitialized: true,



}))

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var acercaRouter = require('./routes/acerca');
var productosRouter = require('./routes/productos');
var projectsRouter = require('./routes/admin/projects');
var loginRouter = require('./routes/admin/login');
var apiRouter = require('./routes/api');
/* const fileUpload = require('express-fileupload'); */

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/acerca', acercaRouter);
app.use('/productos', productosRouter);
app.use('/projects', projectsRouter);
app.use('/admin/login', loginRouter);
app.use('/api', cors(), apiRouter);


app.get('/acerca', function(req,res){
  res.render('acerca', {
    title: 'Acerca de'
  })
});
app.get('/productos', function(req,res){
  res.render('productos', {
    title: 'Productos'
  })
});
app.get('/projects', function(req,res){
  res.render('projects', {
    title: 'Projects'
  })
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
