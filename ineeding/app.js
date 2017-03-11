var express      = require('express');
var path         = require('path');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var RedisStore   = require('connect-redis')(session);
var auth         = require('./middlewares/auth');
var morgan       = require('morgan');
var io_redis     = require("socket.io-redis");
var http         = require('http');

var route        = require('./web_router');
var config       = require('./config');

var app          = express();

var rtmessage    = require('./controllers/rtmessage');
var server       = http.createServer(app);
var io           = require("socket.io")(server);

app.use(morgan('dev'));
/**
 * 配置cookies,session
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(config.session_secret));
/**
 * 设定渲染引擎
 */
app.use(express.static(path.join(__dirname, '/public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html',require('ejs').renderFile);

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: config.session_secret,
  store: new RedisStore({
    port: config.redis_port,
    host: config.redis_host
  })
}));

//app.use(auth.isPhoneBrowser);
//配置中间件
app.use(auth.authUser);
app.use(auth.blocked);

//配置路由
app.use('/',route);

io.on("connection", rtmessage.rtMessage);
io.adapter(io_redis({
  host:config.redis_host,
  port:config.redis_port
}));

/**
 * 捕捉开发时的错误
 */
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

/**
 * 监听端口
 */
if(!module.parent){
  server.listen(config.port);
  console.log('listening ' + config.port);
}

module.exports = app;
