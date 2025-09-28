# Snapshot projekta za React frontend migraciju

Ovo je snapshot trenutne strukture i ključnih fajlova backend projekta (Node.js/Express, EJS, SQL Server) koji služi kao osnova za izradu React frontenda.

## Struktura projekta

```
Backend/
├── app.js
├── package.json
├── package-lock.json
├── .gitignore
├── util/
│   └── db.js
├── controllers/
│   ├── client.js
│   ├── employee.js
│   ├── error.js
│   ├── index.js
│   ├── outInvoice.js
│   └── vehicle/
│       ├── trailerComposition.js
│       └── truckComposition.js
├── models/
│   ├── Car.js
│   ├── Client.js
│   ├── Composition.js
│   ├── DocumentStatus.js
│   ├── DriverComposition.js
│   ├── Employee.js
│   ├── EmployeeCar.js
│   ├── EmployeeInspection.js
│   ├── OutInvoice.js
│   ├── PaymentStatus.js
│   ├── ProcessingStatus.js
│   ├── Trailer.js
│   ├── Truck.js
│   ├── Vat.js
│   └── VehicleInspection.js
├── routes/
│   ├── admin/
│   │   ├── client.js
│   │   └── vehicle/
│   │       ├── trailerComposition.js
│   │       └── truckComposition.js
│   ├── client.js
│   ├── employee.js
│   ├── index.js
│   ├── outInvoice.js
│   └── vehicle/
│       ├── car.js
│       ├── trailerComposition.js
│       └── truckComposition.js
├── tests/
│   ├── client-insert.test.js
│   ├── client.test.js
│   ├── employee.test.js
│   └── outInvoice.test.js
├── views/
│   ├── 404.ejs
│   ├── includes/
│   │   └── end.ejs
│   ├── index.ejs
│   ├── client/
│   │   ├── read-client.ejs
│   │   └── upsert-client.ejs
│   ├── employee/
│   │   ├── insert-employee.ejs
│   │   ├── read-employee.ejs
│   │   └── update-employee.ejs
│   ├── outInvoice/
│   │   ├── insert-outInvoice.ejs
│   │   └── read-invoices.ejs
│   └── vehicle/
│       ├── insert-trailerComposition.ejs
│       ├── insert-truckComposition.ejs
│       ├── read-vehicles.ejs
│       └── update-vehicle.ejs
```

## Ključne funkcionalnosti
- Upravljanje klijentima, zaposlenima, vozilima, prikolicama, kamionima, fakturama
- EJS view-ovi za prikaz i unos podataka (za migraciju u React komponente)
- SQL Server kao baza (konekcija u `util/db.js`)
- REST rute za CRUD operacije (u `routes/` i `controllers/`)
- Testovi za osnovne rute

## Preporuka za migraciju
- Svaki EJS view postaje React komponenta (form, tabela, modal, itd.)
- API pozivi iz React-a idu na postojeće Express rute
- Modeli i logika ostaju na backendu, frontend šalje/uzima podatke preko API-ja

---

Ovaj snapshot možeš koristiti kao osnovu za generisanje React frontenda u Copilot-u ili drugom generatoru.