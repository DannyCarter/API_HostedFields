const express = require("express")
require('dotenv').config()
const path = require('path')
const logger = require('morgan');

const braintreeRouter = require('./routes/braintree');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', braintreeRouter);

const PORT = process.env.PORT || 3000
app.set('port', PORT)
app.listen(PORT);

module.exports = app;