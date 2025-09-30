const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const errorController = require('./controllers/error');

const app = express();

//View engine setup
app.set('view engine', 'ejs');
app.set('views', 'views');

//Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'], // Vite ports
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname, 'public')));

//Routes
const employeeRoutes = require('./routes/employee');
const clientRoutes = require('./routes/client');
const outInvoiceRoutes = require('./routes/outInvoice');
const vehicleTruckCompositionRoutes = require('./routes/vehicle/truckComposition');
const vehicleTrailerCompositionRoutes = require('./routes/vehicle/trailerComposition');
const vehicleCarRoutes = require('./routes/vehicle/car');
const indexRoutes = require('./routes/index');

app.use('/employee', employeeRoutes);
app.use('/client', clientRoutes);
app.use('/outInvoice', outInvoiceRoutes);
app.use('/vehicle/truckComposition', vehicleTruckCompositionRoutes);
app.use('/vehicle/trailerComposition', vehicleTrailerCompositionRoutes);
app.use('/vehicle/car', vehicleCarRoutes);

app.use(indexRoutes);
app.use(errorController.get404);


const server = app.listen(5000, () => {
  console.log('Server started on port 5000');
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