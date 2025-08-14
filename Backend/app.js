const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

//View engine setup
app.set('view engine', 'ejs');
app.set('views', 'views');

//Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//Routes
const employeeRoutes = require('./routes/admin/employee');
const vehicleRoutes = require('./routes/admin/vehicle');
const clientRoutes = require('./routes/admin/client');
const outInvoiceRoutes = require('./routes/admin/outInvoice');

const indexRoutes = require('./routes/index');

app.use('/admin/employee', employeeRoutes);
app.use('/admin/vehicle', vehicleRoutes);
app.use('/admin/client', clientRoutes);
 app.use('/admin/outInvoice', outInvoiceRoutes);
app.use(indexRoutes);



// 404 fallback
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

const server = app.listen(3000, () => {
  console.log('Server started on port 3000');
});

// Proper shutdown handler
const { sql } = require('./util/db');
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  server.close(async () => {
    try {
      await sql.close();
      console.log('SQL connection closed.');
    } catch (e) {
      console.log('Error closing SQL connection:', e.message);
    }
    console.log('Server closed. Exiting process.');
    process.exit(0);
  });
});

// Export Express aplikacije za testove
module.exports = app;