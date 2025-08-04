const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

//View engine setup
app.set('view engine', 'ejs');
app.set('views', 'views');

//Middleware
app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

//Routes

const employeeRoutes = require('./routes/admin/employee');

const homeRoutes = require('./routes');

app.use('/admin/employee', employeeRoutes);
app.use(homeRoutes);



// 404 fallback
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(3000);