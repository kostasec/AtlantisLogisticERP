# 🚚 Transportation Company Management System

A modern, full-featured transportation and logistics management system built with React, Material-UI, and Vite. This application provides comprehensive tools for managing clients, employees, vehicles, invoices, and financial operations for transportation companies.

![Version](https://img.shields.io/badge/version-4.0.0-blue.svg)
![React](https://img.shields.io/badge/react-19.0.0-61dafb.svg)
![MUI](https://img.shields.io/badge/MUI-6.4.6-007fff.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Setup](#-environment-setup)
- [Available Scripts](#-available-scripts)
- [Internationalization](#-internationalization)
- [Mock Data](#-mock-data)
- [Routing](#-routing)
- [Authentication](#-authentication)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🏢 Client Management (CEV)
- **Client Directory**: View and manage all clients with grid/list layouts
- **Contact Person Management**: Expandable contact details for each client
- **Advanced Search & Filtering**: Quick search and role-based filtering
- **Pagination**: Efficient data browsing with configurable items per page

### 👥 Employee Management
- **Employee Profiles**: Complete employee information including passport, vehicle assignments, and manager hierarchy
- **Role-based Organization**: Filter by employee type (driver, manager, admin, etc.)
- **Live Data Integration**: Real-time sync with backend API or mock data mode
- **Vehicle Assignment Tracking**: See which vehicles are assigned to each employee

### 🚛 Vehicle Fleet Management
- **Truck & Trailer Management**: Separate tracking for trucks and trailers
- **Expandable Vehicle Details**: Click to reveal Make, Model, and Registration Tag
- **Driver Assignment**: Track which driver is assigned to each vehicle
- **Fleet Overview**: Grid-based visualization of entire fleet

### 💰 Financial Management
- **Incoming Invoices**: Track receivables with status monitoring (Pending, Paid, Overdue)
- **Outgoing Invoices**: Manage payables and supplier invoices
- **Invoice Creation**: Multi-step wizard for creating detailed invoices with:
  - Client selection
  - Item management (add/remove multiple items)
  - VAT calculation support
  - PDF generation capability
- **Payment Tracking**: Monitor payment status and due dates
- **Currency Formatting**: Locale-aware currency display (RSD, EUR, USD)

### 📊 Dashboard & Analytics
- **Statistical Overview**: Real-time metrics and KPIs
- **Recent Transactions**: Quick view of latest financial activities
- **Visual Charts**: ApexCharts integration for data visualization
- **Coming Soon Pages**: Placeholder pages for:
  - Akontacija (Withdrawal)
  - Putni troškovi i dnevnice (Expenses)
  - Važni datumi (Inspections)

### 🌐 Internationalization (i18n)
- **Serbian (Default)**: Full Serbian translation with Latin script
- **English**: Complete English localization
- **Modular Translation System**: Domain-separated translation files for:
  - Common terms
  - Finance module
  - Logistics module
  - Invoice system
  - Client management
  - Status labels
- **Easy Language Switching**: Toggle between languages in UI
- **Date Localization**: Using date-fns for locale-aware date formatting

### 🎨 UI/UX Features
- **Dark/Light Theme**: Automatic theme switching with user preference storage
- **Responsive Design**: Mobile-first design with breakpoint optimizations
- **Material-UI Components**: Consistent, professional UI with MUI v6
- **Smooth Animations**: Transitions and micro-interactions for better UX
- **Custom Icons**: Extensive custom icon library
- **Scrollbar Customization**: Styled scrollbars for better aesthetics

### 🔐 Authentication & Authorization
- **Multiple Auth Providers**:
  - JWT Authentication
  - AWS Amplify
  - Auth0
  - Firebase
- **Protected Routes**: Route guards for authenticated access
- **Session Management**: Persistent login state
- **User Profile**: Account settings and preferences

---

## 🛠 Tech Stack

### Frontend Core
- **React 19.0.0** - Latest React with concurrent features
- **TypeScript** - Type-safe JavaScript
- **Vite** - Next-generation frontend tooling
- **React Router 7.2.0** - Client-side routing

### UI Framework
- **Material-UI (MUI) 6.4.6** - React component library
- **@mui/x-data-grid** - Advanced data tables
- **@mui/x-date-pickers** - Date/time pickers
- **@emotion** - CSS-in-JS styling
- **ApexCharts** - Interactive charts and graphs

### State & Data Management
- **React Hook Form** - Performant form handling
- **Yup** - Schema validation
- **Axios** - HTTP client
- **TanStack Table** - Headless table utilities

### Internationalization
- **i18next** - i18n framework
- **react-i18next** - React bindings for i18next
- **date-fns** - Date formatting and localization

### Authentication
- **AWS Amplify** - AWS integration
- **Auth0 SPA JS** - Auth0 authentication
- **JWT** - JSON Web Tokens

### Developer Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript Compiler** - Type checking

---

## 📁 Project Structure

```
Frontend/
├── public/                      # Static assets
│   ├── static/
│   │   ├── logo/               # Company logos
│   │   ├── brands/             # Brand images
│   │   ├── avatar/             # User avatars
│   │   └── ...
│   └── index.html
│
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── auth/              # Authentication components
│   │   ├── avatar-badge/      # Avatar with badge
│   │   ├── carousel/          # Carousel component
│   │   ├── dropzone/          # File upload
│   │   ├── form/              # Form components
│   │   ├── modal/             # Modal dialogs
│   │   ├── table/             # Table components
│   │   └── ...
│   │
│   ├── contexts/              # React contexts
│   │   ├── settingsContext.jsx    # App settings (theme, language)
│   │   ├── jwtContext.jsx         # JWT authentication
│   │   ├── auth0Context.jsx       # Auth0 provider
│   │   ├── firebaseContext.jsx    # Firebase provider
│   │   └── amplifyContext.jsx     # AWS Amplify provider
│   │
│   ├── data/                  # Static data & configuration
│   │   ├── navigation-1.js        # Sidebar navigation items
│   │   ├── footer.js              # Footer links
│   │   └── ...
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAuth.js            # Authentication hook
│   │   ├── useSettings.js        # Settings hook
│   │   ├── useChartOptions.js    # Chart configuration
│   │   └── ...
│   │
│   ├── i18n/                  # Internationalization
│   │   ├── index.js              # i18n configuration
│   │   └── locales/              # Modular translations
│   │       ├── index.js          # Aggregator
│   │       ├── en/               # English translations
│   │       │   ├── common.js
│   │       │   ├── finance.js
│   │       │   ├── logistics.js
│   │       │   ├── invoice.js
│   │       │   ├── client.js
│   │       │   └── status.js
│   │       └── ser/              # Serbian translations
│   │           ├── common.js
│   │           ├── finance.js
│   │           ├── logistics.js
│   │           ├── invoice.js
│   │           ├── client.js
│   │           └── status.js
│   │
│   ├── icons/                 # Custom icon components
│   │   ├── duotone/              # Duotone style icons
│   │   └── *.jsx                 # Individual icon files
│   │
│   ├── layouts/               # Layout components
│   │   ├── layout-1/             # Dashboard layout
│   │   │   ├── components/
│   │   │   │   ├── DashboardHeader.jsx
│   │   │   │   ├── DashboardSidebar.jsx
│   │   │   │   ├── MobileSidebar.jsx
│   │   │   │   └── MultiLevelMenu.jsx
│   │   │   ├── context/
│   │   │   └── DashboardLayout.jsx
│   │   └── root/                 # Root/landing layout
│   │
│   ├── mocks/                 # Mock data for development
│   │   ├── mockConfig.js         # Mock mode configuration
│   │   └── data/
│   │       ├── clients.js        # Mock clients (10 entries)
│   │       ├── employees.js      # Mock employees (10 entries)
│   │       ├── vehicles.js       # Mock vehicles (3 entries)
│   │       ├── incomingInvoices.js   # Mock invoices (10 entries)
│   │       └── outgoingInvoices.js
│   │
│   ├── page-sections/         # Page-specific sections
│   │   ├── cev/                  # Client-Employee-Vehicle module
│   │   │   ├── page-view/
│   │   │   │   ├── client.jsx
│   │   │   │   ├── employee.jsx
│   │   │   │   └── vehicle.jsx
│   │   │   ├── GridCard.jsx      # Reusable card with expand
│   │   │   ├── HeadingArea.jsx   # Page header
│   │   │   └── SearchArea.jsx    # Search and view toggle
│   │   ├── invoice/              # Invoice sections
│   │   └── ...
│   │
│   ├── pages/                 # Page components
│   │   ├── coming-soon/          # Coming Soon placeholder
│   │   ├── invoice/              # Invoice pages
│   │   └── ...
│   │
│   ├── routes/                # Route configuration
│   │   ├── index.jsx             # Main router
│   │   ├── dashboard.jsx         # Dashboard routes
│   │   ├── auth.jsx              # Auth routes
│   │   └── ...
│   │
│   ├── services/              # API services
│   │   ├── clientService.js      # Client CRUD operations
│   │   ├── employeeService.js    # Employee operations
│   │   ├── incomingInvoiceService.js # Incoming Invoice
│   │   └── outgoingInvoiceService.js # Outgoing Invoice
│   │
│   ├── theme/                 # MUI theme configuration
│   │   ├── index.ts              # Theme provider
│   │   └── components.ts         # Component overrides
│   │
│   ├── utils/                 # Utility functions
│   │   ├── paginate.js           # Pagination helper
│   │   ├── currency.js           # Currency formatter
│   │   └── ...
│   │
│   ├── App.jsx                # Main App component
│   └── main.jsx               # Application entry point
│
├── .env                       # Environment variables
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
├── vite.config.ts             # Vite configuration
└── README.md                  # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.x or higher
- **npm** or **yarn**: Latest version
- **Git**: For version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kostasec/TransportationCompany.git
   cd TransportationCompany/Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example env file
   cp .env.example .env
   
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:5173
   ```

---

## 🔧 Environment Setup

Create a `.env` file in the root directory:

```env
# Mock Data Configuration
VITE_USE_MOCK=true              # Enable/disable mock data (true/false)

# API Configuration
VITE_API_BASE_URL=http://localhost:5000

# Authentication (Choose one)
# JWT
VITE_JWT_SECRET=your-secret-key
VITE_JWT_TIMEOUT=86400000

# Auth0
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id


---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production (TypeScript + Vite) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |
| `npm run fix:prettier` | Format code with Prettier |

---

## 🌍 Internationalization

### Default Language
The application defaults to **Serbian (ser)** on initial load.

### Switching Languages
Users can switch languages via the language selector in the header.

### Adding New Languages

1. **Create new locale folder**
   ```
   src/i18n/locales/de/  (for German)
   ```

2. **Add translation files**
   ```javascript
   // src/i18n/locales/de/common.js
   export default {
     Dashboard: 'Armaturenbrett',
     Clients: 'Kunden',
     // ... more translations
   };
   ```

3. **Register in locales/index.js**
   ```javascript
   import deCommon from './de/common';
   
   export const modularResources = {
     de: { translation: { ...deCommon, ...deFinance } }
   };
   
   export const availableLanguages = ['en', 'ser', 'de'];
   ```

### Translation Structure
- **common.js**: Shared terms (Dashboard, Edit, Delete, etc.)
- **finance.js**: Financial terms (Invoice, Payment, etc.)
- **logistics.js**: Logistics terms (Shipment, Delivery, etc.)
- **invoice.js**: Invoice-specific terms
- **client.js**: Client module terms
- **status.js**: Status labels (Pending, Complete, etc.)

---

## 🎭 Mock Data

The application includes a comprehensive mock data system for development and demo purposes.

### Enabling Mock Mode

Set in `.env`:
```env
VITE_USE_MOCK=true
```

Or toggle in `src/mocks/mockConfig.js`:
```javascript
export const isMockEnabled = () => {
  return import.meta.env.VITE_USE_MOCK === 'true';
};
```

### Mock Data Features
- **Simulated API Delay**: 800ms delay to simulate real network requests
- **Rich Datasets**: 10 clients, 10 employees, 10 invoices, 3 vehicles
- **Realistic Data**: Serbian names, addresses, and business information
- **Easy Toggle**: Switch between mock and real API without code changes

### Mock Data Files
- `mocks/data/clients.js` - Client records
- `mocks/data/employees.js` - Employee records
- `mocks/data/vehicles.js` - Vehicle fleet data
- `mocks/data/incomingInvoices.js` - Receivables
- `mocks/data/outgoingInvoices.js` - Payables

---

## 🛣 Routing

### Main Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Dashboard | Redirects to `/dashboard/client` |
| `/dashboard/client` | Clients | Client management grid |
| `/dashboard/employee` | Employees | Employee directory |
| `/dashboard/vehicle` | Vehicles | Fleet management |
| `/dashboard/incoming-invoices` | Invoices | Receivables tracking |
| `/dashboard/outgoing-invoices` | Invoices | Payables tracking |
| `/dashboard/create-invoice` | New Invoice | Invoice creation wizard |
| `/dashboard/withdrawal` | Coming Soon | Akontacija module (placeholder) |
| `/dashboard/expenses` | Coming Soon | Expenses module (placeholder) |
| `/dashboard/inspections` | Coming Soon | Important dates (placeholder) |

### Protected Routes
All dashboard routes require authentication. Unauthenticated users are redirected to `/login`.

---

## 🔐 Authentication

The application supports multiple authentication providers:

### JWT (Default)
```javascript
import { useAuth } from '@/hooks/useAuth';

const { login, logout, user } = useAuth();

// Login
await login(email, password);

// Logout
logout();
```

### Auth0
Configure in `src/contexts/auth0Context.jsx`

### AWS Amplify
Configure in `src/contexts/amplifyContext.jsx`

### Firebase
Configure in `src/contexts/firebaseContext.jsx`

---

## 🎨 Theming

### Theme Customization

Edit `src/theme/index.ts`:
```typescript
const lightTheme = {
  palette: {
    mode: 'light',
    primary: { main: '#007fff' },
    secondary: { main: '#ff6b35' },
    // ... custom colors
  }
};
```

### Switching Themes
```javascript
import { useSettings } from '@/hooks/useSettings';

const { settings, saveSettings } = useSettings();

// Toggle theme
saveSettings({ ...settings, theme: 'dark' });
```

---

## 📊 Key Features Implementation

### Expandable Vehicle Cards
Trucks and trailers display expandable details (Make, Model, Registration Tag):
```jsx
<GridCard
  fields={[
    {
      label: 'Truck',
      value: 'SU-085-TT',
      expandFields: [
        { label: 'Make', value: 'Scania' },
        { label: 'Model', value: 'R450' },
        { label: 'Registration Tag', value: 'SU-085-TT' }
      ]
    }
  ]}
/>
```

### Invoice Creation Wizard
Multi-step form with validation:
1. Client selection
2. Invoice details (number, date, due date)
3. Item management (add/remove rows)
4. VAT calculation
5. Review & submit

### Modular i18n System
Domain-separated translations prevent bloat:
```javascript
// Instead of one huge file
import common from './locales/en/common';
import finance from './locales/en/finance';

// Merge at runtime
const resources = { ...common, ...finance };
```

---

## Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Code Style
- Use Prettier for formatting
- Follow React best practices
- Write meaningful commit messages
- Add comments for complex logic

---

## 🐛 Known Issues & Roadmap

### Current Limitations
- [ ] Yup validation messages not yet localized
- [ ] VAT option labels hardcoded
- [ ] No persistent language preference storage
- [ ] Date localization not fully implemented

### Planned Features
- 
- [ ] Advanced filtering and search
- [ ] Export to Excel/PDF
- [ ] Email notifications
- [ ] Mobile app version
- [ ] Role-based permissions (Admin, Manager, Viewer)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Kostasec**  
GitHub: [@kostasec](https://github.com/kostasec)

---





