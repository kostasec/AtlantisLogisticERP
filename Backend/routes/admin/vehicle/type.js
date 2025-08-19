const express = require('express');
const router = express.Router();
const { sql, getPool } = require('../../../util/db');


// GET /admin/vehicle.js
router.get('/insert', (req, res) => {
  res.render('vehicle/insert-vehicle', {
    pageTitle: 'Choose Vehicle Type',
    path: '/admin/vehicle/type/insert'
  });
});


//POST /admin/vehicle.js
router.post('/insert', (req, res) => {
const { vehicleType } = req.body;

  if (vehicleType === 'Truck') {
    return res.redirect('/admin/vehicle/truck/insert');
  } else if (vehicleType === 'Trailer') {
    return res.redirect('/admin/vehicle/trailer/insert');
  } else {
    return res.status(400).send('Invalid vehicle type');
  }
});


module.exports = router;
