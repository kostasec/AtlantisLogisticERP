# Atlantis IS - Transportation Company Management System

## 📋 Overview

Atlantis IS is a comprehensive transportation company management system built with modern web technologies. The system consists of three main components: a Node.js backend API, a React frontend application, and a SQL Server database. This full-stack solution manages vehicles, employees, clients, invoices, and inspections for transportation companies.

## 🏗️ Architecture

```
Atlantis IS/
├── Backend/          # Node.js Express API Server
├── Frontend/         # React + Vite Client Application  
├── Database/         # SQL Server Database Schema
└── README.md         # This file
```

## 🚀 Features

### Backend Features
- **RESTful API** with Express.js
- **SQL Server Integration** with mssql driver
- **CORS Configuration** for frontend communication
- **MVC Architecture** with controllers, models, and routes
- **Error Handling** middleware
- **Vehicle Management** (Cars, Trucks, Trailers)
- **Employee Management** with driver compositions
- **Client Management** 
- **Invoice Processing** (Incoming/Outgoing)
- **Vehicle Inspections** tracking
- **Automated Testing** with Mocha and Chai

### Frontend Features
- **Modern React 19** with Hooks and Context API
- **Material-UI (MUI)** component library
- **Vite** for fast development and building
- **TypeScript** support
- **Responsive Design** for all devices
- **Multi-language Support** (i18next)
- **Data Grid** for complex data display
- **Date Pickers** for date management
- **Form Validation** with React Hook Form and Yup
- **Charts and Visualizations** with ApexCharts
- **Authentication** ready (Auth0 integration)
- **RTL Support** for right-to-left languages

### Database Features
- **SQL Server** relational database
- **Comprehensive Schema** for transportation management
- **Foreign Key Constraints** for data integrity
- **Views** for complex queries
- **Proper Indexing** for performance
- **Entity Models**: Cars, Trucks, Trailers, Employees, Clients, Invoices, Inspections

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQL Server** - Database (mssql driver)
- **EJS** - Template engine
- **CORS** - Cross-origin resource sharing
- **Mocha & Chai** - Testing framework
- **TypeScript** - Type safety (dev dependency)

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **Material-UI (MUI)** - Component library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Hook Form** - Form management
- **Yup** - Schema validation
- **i18next** - Internationalization
- **ApexCharts** - Data visualization
- **Auth0** - Authentication (ready to use)
- **Date-fns** - Date manipulation

### Database
- **Microsoft SQL Server** - Primary database
- **T-SQL** - Database programming language

## 📦 Installation & Setup

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **SQL Server** (LocalDB, Express, or full version)
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/kostasec/TransportationCompany.git
cd TransportationCompany
```

### 2. Database Setup
```bash
cd Database
# Execute the SQL scripts in SQL Server Management Studio or sqlcmd
# 1. Run 1.ddl_Tables.sql to create tables and schema
# 2. Run 2.ddl_Views.txt to create database views
```

### 3. Backend Setup
```bash
cd Backend
npm install
# Configure database connection in util/db.js
npm start
# Server will run on http://localhost:5000
```

### 4. Frontend Setup
```bash
cd Frontend
npm install
npm run dev
# Application will run on http://localhost:5173
```

## 🔧 Configuration

### Backend Configuration
Update the database connection in `Backend/util/db.js`:
```javascript
const config = {
  server: 'your-server-name',
  database: 'your-database-name',
  authentication: {
    type: 'default',
    options: {
      userName: 'your-username',
      password: 'your-password'
    }
  },
  options: {
    encrypt: true, // for Azure
    trustServerCertificate: true // for local dev
  }
};
```

### Frontend Configuration
The frontend is configured to proxy API requests to `http://localhost:5000`. Update the proxy in `package.json` if your backend runs on a different port.

## 🗃️ Database Schema

The database includes the following main entities:

### Core Tables
- **Car** - Car vehicle information
- **Truck** - Truck vehicle information  
- **Trailer** - Trailer information
- **Employee** - Employee details and roles
- **Client** - Client company information
- **IncInvoice** - Incoming invoices
- **OutInvoice** - Outgoing invoices

### Relationship Tables
- **EmployeeCar** - Employee-vehicle assignments
- **DriverComposition** - Driver scheduling
- **VehicleInspection** - Vehicle inspection records
- **EmployeeInspection** - Employee inspection assignments

### Lookup Tables
- **DocumentStatus** - Document status types
- **PaymentStatus** - Payment status types
- **ProcessingStatus** - Processing status types
- **Vat** - VAT rates and information

## 🧪 Testing

### Backend Testing
```bash
cd Backend
npm test
# Runs Mocha test suite for API endpoints
```

Test files include:
- `client.test.js` - Client management tests
- `employee.test.js` - Employee management tests
- `outInvoice.test.js` - Invoice processing tests

## 📡 API Endpoints

### Vehicle Management
- `GET /api/vehicles` - Get all vehicles
- `POST /api/vehicles` - Create new vehicle
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle

### Employee Management
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Client Management
- `GET /api/clients` - Get all clients
- `POST /api/clients` - Create new client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Invoice Management
- `GET /api/invoices/incoming` - Get incoming invoices
- `GET /api/invoices/outgoing` - Get outgoing invoices
- `POST /api/invoices` - Create new invoice
- `PUT /api/invoices/:id` - Update invoice

## 🚀 Deployment

### Backend Deployment
1. Set environment variables for production database
2. Update CORS settings for production frontend URL
3. Deploy to platforms like Heroku, DigitalOcean, or AWS

### Frontend Deployment
1. Build the production version:
   ```bash
   npm run build
   ```

### Database Deployment
1. Use Azure SQL Database, AWS RDS, or dedicated SQL Server
2. Execute the DDL scripts in production environment
3. Update connection strings in backend configuration



## 📄 License

This project is licensed under the ISC License - see the package.json files for details.

## 👥 Authors

- **Konstantin Šec** - Initial work and development


## Future Enhancements

- [ ] Real-time notifications with WebSocket
- [ ] Mobile app with React Native
- [ ] Advanced reporting and analytics
- [ ] GPS tracking integration
- [ ] Document management system
- [ ] Multi-tenant architecture
- [ ] API rate limiting and caching
- [ ] Automated backup system


