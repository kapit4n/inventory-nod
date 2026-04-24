var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

var indexRouter = require('./routes/index');
var productsRouter = require('./routes/products');
var productPresentationsRouter = require('./routes/productPresentations');
var clientsRouter = require('./routes/clients');
var cashiersRouter = require('./routes/cashiers');
var categoriesRouter = require('./routes/categories');
var vendorsRouter = require('./routes/vendors');
var unitOfMeasuresRouter = require('./routes/unitOfMeasures');
var uploadProductImage = require('./routes/upload-product-image');

var app = express();

function looksLikeApiRequest(req) {
  var u = req.originalUrl || req.url || '';
  return /^\/(products|productPresentations|clients|cashiers|categories|vendors|unitOfMeasures|uploads)(\/|\?|$)/.test(u);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(cors());
app.use(cookieParser());
/**
 * Multipart upload must run before express.json / urlencoded so the stream is not consumed.
 * Primary: POST /products/upload-image (same prefix as the rest of the API — reliable behind proxies).
 * Alias: POST /uploads/product-image (documented path; static files still served from /uploads/products/...).
 */
app.post('/products/upload-image', uploadProductImage);
app.post('/uploads/product-image', uploadProductImage);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/products', productsRouter);
app.use('/productPresentations', productPresentationsRouter);
app.use('/clients', clientsRouter);
app.use('/cashiers', cashiersRouter);
app.use('/categories', categoriesRouter);
app.use('/vendors', vendorsRouter);
app.use('/unitOfMeasures', unitOfMeasuresRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  var status = err.status || 500;
  var accept = req.headers.accept || '';
  var wantsJson =
    looksLikeApiRequest(req) ||
    req.xhr ||
    (accept.indexOf('application/json') !== -1);

  if (wantsJson) {
    var body = { error: err.message };
    if (req.app.get('env') === 'development' && err.stack) {
      body.stack = err.stack;
    }
    return res.status(status).json(body);
  }

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(status);
  res.render('error');
});

module.exports = app;
