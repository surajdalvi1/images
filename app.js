/**
 * Module dependencies.
 */
var express = require('express'),
    compression = require('compression'),
    basicAuth = require('basic-auth-connect'),
    nunjucks = require('nunjucks'),
    bodyParser = require('body-parser'),
    logger = require('morgan'),
    path = require('path'),
    Contentstack = require('contentstack');

var app = express();
app.use(compression())
app.use(basicAuth('built', 'built1234'));
var env = process.env.NODE_ENV || "dev",
    _dirname = (process.env.SITE_PATH) ? path.resolve(process.env.SITE_PATH) : process.cwd(),
    _env;

try {
  // load environment based configurations
  var _path = path.join(_dirname, 'config');
  if(env === 'dev')
    _env = require(path.join(_path, 'default'));
  else
    _env = require(path.join(_path, env));

  // load globals
  global['config'] = _env;
  global['Stack'] = Contentstack.Stack({
    api_key: config.contentstack.api_key ,
    access_token: config.contentstack.access_token,
    environment: config.contentstack.environment
  });

  // load port
  var PORT = process.env.PORT || 5000;

  // Client side pages to fall under ~/views directory
  app.set('views', path.join(__dirname, 'views'));

  // Setting Nunjucks as default view
  nunjucks.configure('views', {
    autoescape: false,
    express   : app
  });

  app.set('view engine', 'html');
  app.use(logger('dev'));
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  app.use(express.static(path.join(__dirname, 'public')));

  // Routes
  require('./routes')(app);

  app.listen(PORT, function() {
    console.log('Start your browser to http://localhost:' + PORT);
  });

} catch (error) {
  console.error('Did not find configuration for the specified environment');
  console.error(error);
  console.error('exiting!');
}

module.exports = app;

