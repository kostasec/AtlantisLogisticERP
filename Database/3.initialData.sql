--PaymentStatus
INSERT INTO PaymentStatusList VALUES
(0, 'Unpaid'),
(1, 'Paid');

--ProcessingStatus
INSERT INTO ProcessingStatusList VALUES
(0, 'Draft'),
(1, 'Sent'),
(2, 'Approved'),
(3, 'Rejected'),
(4, 'Cancelled');

--VATCodeList
insert into vatcodelist(vatcode, vatpercentage) values ('OE',0)
insert into vatcodelist(vatcode, vatpercentage) values ('O',0)
insert into vatcodelist(vatcode, vatpercentage) values ('N',0)
insert into vatcodelist(vatcode, vatpercentage) values ('E',0)
insert into vatcodelist(vatcode, vatpercentage) values ('AE10',0)
insert into vatcodelist(vatcode, vatpercentage) values ('AE20',0)
insert into vatcodelist(vatcode, vatpercentage) values ('R',0)
insert into vatcodelist(vatcode, vatpercentage) values ('S10',0.1)
insert into vatcodelist(vatcode, vatpercentage) values ('S20',0.2)
insert into vatcodelist(vatcode, vatpercentage) values ('SS',0)
insert into vatcodelist(vatcode, vatpercentage) values ('Z',0)

--VATExamptionReasons
insert into vatexamptionreason(vatcode, vatexamptioncode) values ('Z','PDV-RS-24-1-1') 
insert into vatexamptionreason(vatcode, vatexamptioncode) values ('Z','PDV-RS-24-1-8') 
insert into vatexamptionreason(vatcode, vatexamptioncode) values ('O','PDV-RS-12-4') 
insert into vatexamptionreason(vatcode, vatexamptioncode) values ('OE','PDV-RS-17-4-3') 
insert into VATExamptionReason(vatcode, vatexamptioncode) values ('S20','None') 
insert into vatexamptionreason(vatcode, vatexamptioncode) values ('S10','None')

--Client
INSERT INTO Client (
    TaxID,
    RegNmbr,
    ClientName,
    StreetAndNmbr,
    City,
    ZIP,
    Country,
    IsActive
)
VALUES (
    'RS123456789',
    '08012345',
    'Transport DOO',
    'Bulevar Oslobođenja 100',
    'Novi Sad',
    '21000',
    'Srbija',
    1
);

--Employee
insert into employee(EmplType,FirstName,LastName,Status,StreetAndNmbr,City,ZIPCode,Country,PhoneNmbr,EmailAddress,IDCardNmbr,PassportNmbr,MgrID) 
values('Direktor','Marko','Jovanovic','Active','Bulevar Oslobodjenja 56','Novi Sad','21000','Srbija','061145888','test@test.com','4544554','PT48484',NULL)

insert into employee(EmplType,FirstName,LastName,Status,StreetAndNmbr,City,ZIPCode,Country,PhoneNmbr,EmailAddress,IDCardNmbr,PassportNmbr,MgrID) 
values('Vozac','Srdjan','Petrovic','Active','27. Marta','Beograd','11000','Srbija','061145888','test@test.com','4522554','PT45154684',1)

insert into employee(EmplType,FirstName,LastName,Status,StreetAndNmbr,City,ZIPCode,Country,PhoneNmbr,EmailAddress,IDCardNmbr,PassportNmbr,MgrID) 
values('Vozac','Milan','Ristic','Active','Matije Gupca 53','Subotica','24000','Srbija','061145888','test3@test.com','4522554','PT45154684',1)

--Vehicle
INSERT INTO Vehicle (VehicleType, Make, Model, RegistrationTag, EmplID)
VALUES 
('Truck',  'Mercedes-Benz', 'Actros',    'NS-123-AA', 2),
('Trailer','Schmitz',       'S.CS',      'NS-456-BB', 2),
('Car',    'Skoda',         'Superb',   'NS-789-CC', 1),
('Trailer','Schmitz',       'S.CS',      'NS-556-AA', 3),
('Truck',    'Mercedes',         'Octavia',  'AA-789-CC', 3);

--Composition
insert into composition (truckID, trailerID) values (1,2)
insert into composition (truckID, trailerID) values (5,4)
insert into composition (truckID, trailerID) values (1,4)

--Service 1 - Goods transportation – Import
INSERT INTO Service (
    ServiceName, Price, Currency, TransportationType, TruckID, TrailerID
)
VALUES (
    'Prevoz robe - uvoz',
    76082.00,
    'RSD',
    'Our',
    1, 2 
);

-- Service 2 - FITO tax
INSERT INTO Service (
    ServiceName, Price, Currency
)
VALUES (
    'FITO taksa',
    4510.00,
    'RSD'
);
GO

--OutgoingInvoice 1
INSERT INTO OutgoingInvoice (
    OutInvoiceNmbr,
    ReferenceNmbr,
    OrderNmbr,
    TransDate,
    IssueDate,
    DueDate,
    Attachment,
    Note,
    PaymentStatus,
	ProcessingStatus,
    TaxID
)
VALUES (
    '1-25',
    'REF-001',
    'ORD-001',
    '2025-07-18',
    '2025-07-18',
    '2025-07-25',
    NULL,
    'Napomena za prvu fakturu',
    0,
	1,
    'RS123456789'
);

-- 2 Items - with no VAT
INSERT INTO Item (
    InvoiceID,
    ServiceID,
    Discount,
    VATCode,
    VATExamptionCode
)
VALUES 
(1, 1, 0.00, 'Z', 'PDV-RS-24-1-1'),
(1, 2, 0.00, 'OE', 'PDV-RS-17-4-3')

--Service 2 - with external carrier
insert into Service(ServiceName, Price, Currency, TransportationType) values('Domaci Prevoz',28000,'RSD','External')

--OutgoingInvoice 2
insert into OutgoingInvoice(OutInvoiceNmbr,ReferenceNmbr,TransDate,IssueDate,DueDate,PaymentStatus,ProcessingStatus,TaxID)
values ('2-25', '2-25', '2025-08-09','2025-08-09','2025-08-09',0,1,'RS123456789')

--Item 3 - 20% VAT
INSERT INTO Item (
    InvoiceID,
    ServiceID,
    Discount,
    VATCode,
    VATExamptionCode
)
VALUES 
(2, 3, 0.00, 'S20', 'None')

--Service 4 - International Transport
insert into Service(ServiceName, Price, Currency,TransportationType, TruckID, TrailerID)
values('MASTERPLAST HU KFT',280,'EUR','Our',5,4)

-- Invoice 3
insert into OutgoingInvoice(OutInvoiceNmbr,ReferenceNmbr,TransDate,IssueDate,DueDate,PaymentStatus,ProcessingStatus,TaxID)
values ('25-25', '23-25', '2025-08-09','2025-08-09','2025-08-09',0,1,'RS123456789')

--Item 4 - no VAT
INSERT INTO Item (
    InvoiceID,
    ServiceID,
    Discount,
    VATCode,
    VATExamptionCode
)
VALUES 
(3, 4, 0.00, 'O', 'PDV-RS-12-4')

--Inspection
insert into inspection values ('Regtistracija'), ('Kasko'),('Bela Lista'),('Vatrogasni aparat'),('CMR Osiguranje'),('Tahograf'),
('Lekarski'),('Polisa Putnog Osiguranja'),('Zona 2'),('Polisa osiguranja od nesrecnog slucaja');

--EmployeeInspection
insert into EmployeeInspection values(1,8,'01-05-2025'),(2,8,'01-05-2025'),(3,8,'01-05-2025');

--VehicleInspection
insert into VehicleInspection values (1,1,'06-08-2025'), (1,2,'08-09-2025')
insert into VehicleInspection values (2,3,'01-02-2026'), (2,4,'05-07-2025')

--TravelExpenses
insert into TravelExpensesEUR values ('O11223','06-06-2025',300,150,1), ('O11224','10-06-2025',300,200,2)
insert into TravelExpensesRSD values ('O11223','06-06-2025',18000,3000,1), ('O11224','10-06-2025',27000,2000,2)

