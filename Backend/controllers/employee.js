// routes/employee.js
const { sql, getPool } = require('../util/db');
const Employee = require('../models/Employee');
const EmployeeInspection = require('../models/EmployeeInspection');
const DriverComposition = require('../models/DriverComposition');
const Composition = require('../models/Composition');
const Car = require('../models/Car');
const EmployeeCar = require('../models/EmployeeCar');

// READ all employees
exports.getReadEmployee = async (req, res) => {
  try {
    const employees = await Employee.fetchAll();
    res.render('employee/read-employee', {
      pageTitle: 'All Employees',
      path: '/admin/employee/read',
      employees: employees.recordset
    });
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).send('Database Error');
  }
};

// GET insert form
exports.getInsertEmployee = async (req, res) => {
  try {
    const managers = await Employee.fetchManagers();
    const compositions = await Composition.fetchAll();
    const inspections = await EmployeeInspection.fetchAll();
    const cars = await Car.fetchAll();

    res.render('employee/insert-employee', {
      pageTitle: 'Add Employee',
      path: '/admin/employee/insert',
      managers: managers.recordset,
      compositions: compositions.recordset,
      inspections: inspections.recordset,
      cars: cars.recordset
    });
  } catch (err) {
    console.error('Error fetching data for insert:', err);
    res.status(500).send('Database error');
  }
};

// POST insert employee
exports.postInsertEmployee = async (req, res) => {
  const pool = await getPool();
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    // Insert Employee
    const insertedEmployeeID = await Employee.insert(req.body, transaction);

    // Insert Inspections
    for (const key in req.body) {
      if (key.startsWith('emplInspections_')) {
        const inspectionId = parseInt(key.split('_')[1], 10);
        const expiryDate = req.body[key];
        if (expiryDate && expiryDate.trim() !== '') {
          await EmployeeInspection.insert(
            insertedEmployeeID,
            inspectionId,
            expiryDate,
            transaction
          );
        }
      }
    }

    // Vehicle (car or composition)
    const vehicleValue = (req.body.Vehicle || '').trim();
    if (vehicleValue.startsWith('composition:')) {
      const [truckId, trailerId] = vehicleValue.replace('composition:', '').split(',').map(Number);
      await DriverComposition.insert(insertedEmployeeID, truckId, trailerId, transaction);
    } else if (vehicleValue.startsWith('car:')) {
      const carId = parseInt(vehicleValue.replace('car:', ''), 10);
      await EmployeeCar.insert(insertedEmployeeID, carId, transaction);
    }

    await transaction.commit();
    console.log('Employee inserted successfully.');
    res.redirect('/employee/read');
  } catch (err) {
    if (transaction && transaction._aborted !== true) {
      await transaction.rollback();
    }
    console.error('Error inserting employee:', err);
    res.status(500).send('Database error');
  }
};

// GET update form
exports.getUpdateEmployee = async (req, res) => {
  try {
    const employeeResult = await Employee.findById(req.params.id);
    if (employeeResult.recordset.length === 0) {
      return res.status(404).send('Employee not found.');
    }

    // Uzimamo i trenutnu kompoziciju zaposlenog radi pre-selekcije u EJS-u
    const driverCompositionResult = await DriverComposition.findByDriverId(req.params.id);
    const managers = await Employee.fetchManagers();
    const compositions = await Composition.fetchAll();
    const cars = await Car.fetchAll();
    const employeeCarResult = await EmployeeCar.findByEmployeeId(req.params.id);

    res.render('employee/update-employee', {
      employee: employeeResult.recordset[0],
      managers: managers.recordset,
      compositions: compositions.recordset,
      driverComposition: driverCompositionResult.recordset[0] || null,
      cars: cars.recordset,
      employeeCar: employeeCarResult.recordset[0] || null
    });
  } catch (err) {
    console.error('Error loading employee for update:', err);
    res.status(500).send('Database error');
  }
};

exports.postUpdateEmployee = async (req, res) => {
  const pool = await getPool();
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    await Employee.update(req.params.id, req.body, transaction);

    // Vehicle
    const vehicleValue = (req.body.Vehicle || '').trim();
    if (vehicleValue.startsWith('composition:')) {
      const [truckId, trailerId] = vehicleValue.replace('composition:', '').split(',').map(Number);
      await DriverComposition.upsert(parseInt(req.params.id), truckId, trailerId, transaction);
      await EmployeeCar.delete(parseInt(req.params.id), transaction);
    } else if (vehicleValue.startsWith('car:')) {
      const carId = parseInt(vehicleValue.replace('car:', ''), 10);
      await EmployeeCar.upsert(parseInt(req.params.id), carId, transaction);
      await DriverComposition.delete(parseInt(req.params.id), transaction);
    } else {
      await DriverComposition.delete(parseInt(req.params.id), transaction);
      await EmployeeCar.delete(parseInt(req.params.id), transaction);
    }

    await transaction.commit();
    res.redirect('/employee/read');
  } catch (err) {
    if (transaction && transaction._aborted !== true) {
      await transaction.rollback();
    }
    console.error('Error updating employee:', err);
    res.status(500).send('Database error');
  }
};

// POST delete (soft delete)
exports.postDeleteEmployee = async (req, res) => {
  const pool = await getPool();
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();
    await Employee.softDelete(req.params.id, transaction);
    await EmployeeCar.delete(parseInt(req.params.id), transaction);
    await transaction.commit();
    console.log('Employee deleted successfully.');
    res.redirect('/employee/read');
  } catch (err) {
    if (transaction && transaction._aborted !== true) {
      await transaction.rollback();
    }
    console.error('Error deleting employee:', err);
    res.status(500).send('Database error');
  }
};
