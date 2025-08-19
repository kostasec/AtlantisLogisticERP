-- ================================
-- Drop all foreign key constraints
-- ================================
DECLARE @sql NVARCHAR(MAX) = '';

SELECT @sql += '
ALTER TABLE [' + SCHEMA_NAME(t.schema_id) + '].[' + OBJECT_NAME(fk.parent_object_id) + '] 
DROP CONSTRAINT [' + fk.name + '];'
FROM sys.foreign_keys fk
JOIN sys.tables t ON fk.parent_object_id = t.object_id;
EXEC sp_executesql @sql;
GO

-- ==============================
-- DROP trigger InsertVehicleType
-- ==============================
IF OBJECT_ID('trg_InsertVehicleType', 'TR') IS NOT NULL
    DROP TRIGGER trg_InsertVehicleType;
GO
-- ===========================
-- DROP view VATRecapitulation
-- ===========================
IF OBJECT_ID('vw_VATRecapitulation', 'V') IS NOT NULL
    DROP VIEW vw_VATRecapitulation;
GO
-- ===============================
-- DROP view OutgoingInvoiceAmount
-- ===============================
IF OBJECT_ID('vw_OutgoingInvoiceAmount', 'V') IS NOT NULL
    DROP VIEW vw_OutgoingInvoiceAmount;
GO
-- ===========================
-- DROP Tables
-- ============================
IF OBJECT_ID('VehicleInspection', 'U') IS NOT NULL
    DROP TABLE VehicleInspection;
GO
IF OBJECT_ID('EmployeeInspection', 'U') IS NOT NULL
    DROP TABLE EmployeeInspection;
GO
IF OBJECT_ID('Inspection', 'U') IS NOT NULL
    DROP TABLE Inspection;
GO
IF OBJECT_ID('WithdrawalEUR', 'U') IS NOT NULL
    DROP TABLE WithdrawalEUR;
GO
IF OBJECT_ID('WithdrawalRSD', 'U') IS NOT NULL
    DROP TABLE WithdrawalRSD;
GO
IF OBJECT_ID('TravelExpensesRSD', 'U') IS NOT NULL
    DROP TABLE TravelExpensesRSD;
GO
IF OBJECT_ID('TravelExpensesEUR', 'U') IS NOT NULL
    DROP TABLE TravelExpensesEUR;
GO
IF OBJECT_ID('ExternalCarrierService', 'U') IS NOT NULL
    DROP TABLE ExternalCarrierService;
GO
IF OBJECT_ID('Service', 'U') IS NOT NULL
    DROP TABLE Service;
GO
IF OBJECT_ID('VATExamptionReason', 'U') IS NOT NULL
    DROP TABLE VATExamptionReason;
GO
IF OBJECT_ID('Composition', 'U') IS NOT NULL
    DROP TABLE Composition;
GO
IF OBJECT_ID('Trailer', 'U') IS NOT NULL
    DROP TABLE Trailer;
GO
IF OBJECT_ID('Truck', 'U') IS NOT NULL
    DROP TABLE Truck;
GO
IF OBJECT_ID('dbo.PaymentStatusList', 'U') IS NOT NULL
    DROP TABLE dbo.PaymentStatusList;
GO
IF OBJECT_ID('dbo.ProcessingStatusList', 'U') IS NOT NULL
    DROP TABLE dbo.ProcessingStatusList;
GO
IF OBJECT_ID('OutgoingInvoice', 'U') IS NOT NULL
    DROP TABLE OutgoingInvoice;
GO
IF OBJECT_ID('Item', 'U') IS NOT NULL
    DROP TABLE Item;
GO
IF OBJECT_ID('IncomingInvoice', 'U') IS NOT NULL
    DROP TABLE IncomingInvoice;
GO
IF OBJECT_ID('ContactPerson', 'U') IS NOT NULL
    DROP TABLE ContactPerson;
GO
IF OBJECT_ID('VATCodeList', 'U') IS NOT NULL
    DROP TABLE VATCodeList;
GO
IF OBJECT_ID('Client', 'U') IS NOT NULL
    DROP TABLE Client;
GO
IF OBJECT_ID('Employee', 'U') IS NOT NULL
    DROP TABLE Employee;
GO
IF OBJECT_ID('Vehicle', 'U') IS NOT NULL
    DROP TABLE Vehicle;
GO

-- =============
-- Table: Client
-- =============
CREATE TABLE Client (
    TaxID VARCHAR(50) PRIMARY KEY,
    RegNmbr VARCHAR(30) UNIQUE,
    ClientName VARCHAR(100) NOT NULL,
    StreetAndNmbr VARCHAR(100) NOT NULL,
    City VARCHAR(50) NOT NULL,
    ZIP VARCHAR(10) NOT NULL,
    Country VARCHAR(50) NOT NULL,
	IsActive BIT NOT NULL DEFAULT 1
);
GO
-- ====================
-- Table: ContactPerson
-- ====================
CREATE TABLE ContactPerson(
    ContactName VARCHAR(255) NOT NULL,
    Description VARCHAR(255),
    PhoneNmbr VARCHAR(50),
    Email VARCHAR(100),
    TaxID VARCHAR(50) NOT NULL,
    CONSTRAINT fk_ContactPerson_TaxID FOREIGN KEY (TaxID) REFERENCES Client(TaxID),
    CONSTRAINT pk_ContactPerson PRIMARY KEY(TaxID, ContactName)
);
GO
-- ========================
-- Table: PaymentStatusList 
-- ========================
CREATE TABLE PaymentStatusList (
    PaymentStatusID TINYINT PRIMARY KEY,
    PaymentStatusName VARCHAR(10) NOT NULL,
    
);
GO
-- ===========================
-- Table: ProcessingStatusList
-- ===========================
CREATE TABLE ProcessingStatusList (
    ProcessingStatusID TINYINT PRIMARY KEY,
    ProcessingStatusName VARCHAR(20) NOT NULL,
);
GO
-- ======================
-- Table: IncomingInvoice
-- ======================
CREATE TABLE IncomingInvoice (
    InvoiceNmbr INT PRIMARY KEY,
    Amount NUMERIC(18, 2) NOT NULL,
    DueDate DATE NOT NULL,
    IssueDate DATE NOT NULL,
    PaymentStatus TINYINT NOT NULL
	CONSTRAINT fk_IncomingInvoice_PaymentStatusID FOREIGN KEY (PaymentStatus) REFERENCES PaymentStatusList(PaymentStatusID),
	ProcessingStatus TINYINT NOT NULL
	CONSTRAINT fk_IncomingInvoice_ProcessingStatusID FOREIGN KEY (ProcessingStatus) REFERENCES ProcessingStatusList (ProcessingStatusID),
    TaxID VARCHAR(50) NOT NULL,
    CONSTRAINT fk_IncomingInvoice_TaxID FOREIGN KEY (TaxID) REFERENCES Client(TaxID)
);
GO
-- ======================
-- Table: OutgoingInvoice
-- ======================
CREATE TABLE OutgoingInvoice (
    InvoiceID INT IDENTITY(1,1) PRIMARY KEY,
    OutInvoiceNmbr VARCHAR(50) UNIQUE NOT NULL,
    ReferenceNmbr VARCHAR(50) NOT NULL,
    OrderNmbr VARCHAR(50),
    TransDate DATE NOT NULL,
    IssueDate DATE NOT NULL,
    DueDate DATE NOT NULL,
    Attachment NVARCHAR(500), -- file path
    Note VARCHAR(255),
    PaymentStatus TINYINT NOT NULL
	CONSTRAINT fk_OutgoingInvoice_PaymentStatusID FOREIGN KEY (PaymentStatus) REFERENCES PaymentStatusList(PaymentStatusID),
	ProcessingStatus TINYINT NOT NULL
	CONSTRAINT fk_OutgoingInvoice_ProcessingStatusID FOREIGN KEY (ProcessingStatus) REFERENCES ProcessingStatusList (ProcessingStatusID),
    TaxID VARCHAR(50) NOT NULL,
    CONSTRAINT fk_OutgoingInvoice_TaxID FOREIGN KEY (TaxID) REFERENCES Client(TaxID)
);
GO
-- ===============
-- Table: Employee
-- ================
CREATE TABLE Employee (
    EmplID INT IDENTITY(1,1) PRIMARY KEY,
    EmplType VARCHAR(50) NOT NULL,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Status VARCHAR(20) NOT NULL,
    CONSTRAINT ck_Employee_Status CHECK (Status IN ('Active','Inactive')),
    StreetAndNmbr VARCHAR(100) NOT NULL,
    City VARCHAR(50) NOT NULL,
    ZIPCode VARCHAR(10) NOT NULL,
    Country VARCHAR(50) NOT NULL,
    PhoneNmbr VARCHAR(50) NOT NULL,
    EmailAddress VARCHAR(50),
    IDCardNmbr VARCHAR(20) NOT NULL,
    PassportNmbr VARCHAR(20) NOT NULL,
    MgrID INT,
    CONSTRAINT fk_Employee_MgrID FOREIGN KEY (MgrID) REFERENCES Employee(EmplID)
);
GO
-- ==============
-- Table: Vehicle
-- ==============
CREATE TABLE Vehicle (
    VehicleID INT IDENTITY(1,1) PRIMARY KEY,
    VehicleType VARCHAR(20) NOT NULL,
    Make VARCHAR(50) NOT NULL,
    Model VARCHAR(50) NOT NULL,
    RegistrationTag VARCHAR(20) NOT NULL,
    EmplID INT NULL,
    CONSTRAINT fk_Vehicle_EmplID FOREIGN KEY (EmplID) REFERENCES Employee(EmplID)
);
GO
-- ============
-- Table: Truck
-- ============
CREATE TABLE Truck (
    TruckID INT PRIMARY KEY,
    FOREIGN KEY (TruckID) REFERENCES Vehicle(VehicleID)
);
GO
-- ==============
-- Table: Trailer
-- ==============
CREATE TABLE Trailer (
    TrailerID INT PRIMARY KEY,
    FOREIGN KEY (TrailerID) REFERENCES Vehicle(VehicleID)
);
GO

-- ==============
-- Table: Car
-- ==============
CREATE TABLE Car (
    CarID INT PRIMARY KEY,
    FOREIGN KEY (CarID) REFERENCES Vehicle(VehicleID)
);
GO

-- ==========================
-- Trigger: InsertVehicleType
-- ==========================
CREATE TRIGGER trg_InsertVehicleType
ON Vehicle
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Truck (TruckID)
    SELECT VehicleID FROM inserted WHERE VehicleType = 'Truck';

    INSERT INTO Trailer (TrailerID)
    SELECT VehicleID FROM inserted WHERE VehicleType = 'Trailer';

    INSERT INTO Car(CarID)
    SELECT VehicleID FROM inserted WHERE VehicleType = 'Car';

END;
GO
-- ==================
-- Table: Composition
-- ==================
CREATE TABLE Composition (
    TruckID INT NOT NULL,
    TrailerID INT NOT NULL,
    FOREIGN KEY (TruckID) REFERENCES Truck(TruckID),
    FOREIGN KEY (TrailerID) REFERENCES Trailer(TrailerID),
    CONSTRAINT pk_Composition PRIMARY KEY (TruckID, TrailerID)
);
GO
-- ==================
-- Table: VATCodeList
-- ==================
CREATE TABLE VATCodeList(
    VATCode VARCHAR(6) PRIMARY KEY,
    VATPercentage DECIMAL(3,2)
);
GO
-- =========================
-- Table: VATExamptionReason
-- =========================
CREATE TABLE VATExamptionReason(
    VATCode VARCHAR(6) NOT NULL,
	VATExamptionCode VARCHAR(50) NOT NULL,
    CONSTRAINT fk_VATExamptionReason_VATCode FOREIGN KEY (VATCode) REFERENCES VATCodeList (VATCode),
    CONSTRAINT pk_VATExamptionReason PRIMARY KEY (VATCode,VATExamptionCode)
);
GO
-- ==============
-- Table: Service
-- ==============
CREATE TABLE Service (
    ServiceID INT IDENTITY(1,1) PRIMARY KEY,
    ServiceName VARCHAR(100) NOT NULL,
    Price DECIMAL(18, 2) NOT NULL,
	Currency VARCHAR(10) NOT NULL,
	TransportationType VARCHAR(10)
	CONSTRAINT ck_Service_TransportationType CHECK (TransportationType IN ('Our', 'External')), 
    TruckID INT NULL,
    TrailerID INT NULL,
    CONSTRAINT fk_Service_TruckTrailer FOREIGN KEY (TruckID, TrailerID)
    REFERENCES Composition(TruckID, TrailerID),
   
);
GO
-- =============================
-- Table: ExternalCarrierService
-- =============================
CREATE TABLE ExternalCarrierService(
	ServiceID INT IDENTITY(1,1) PRIMARY KEY,
	RegistrationTag VARCHAR(50) NOT NULL
);
GO
-- ============
-- Table: Item
-- ============
CREATE TABLE Item(
	InvoiceID INT NOT NULL,
	ServiceID INT NOT NULL,
	Discount DECIMAL(18, 2),
	VATCode VARCHAR(6) NOT NULL,
	VATExamptionCode VARCHAR(50),
	CONSTRAINT pk_Item PRIMARY KEY(InvoiceID, ServiceID),
	CONSTRAINT fk_Item_Vat FOREIGN KEY (VATCode, VATExamptionCode) REFERENCES VATExamptionReason (VATCode, VATExamptionCode)
);
-- =========================
-- Table: TravelExpensesRSD
-- =========================
CREATE TABLE TravelExpensesRSD (
    OrderNmbr VARCHAR(50) PRIMARY KEY,
    Date DATE NOT NULL,
    AllowanceRSD DECIMAL(18,2),
    CostsRSD DECIMAL(18, 2),
    EmplID INT NOT NULL,
    CONSTRAINT fk_TravelRSD_EmplID FOREIGN KEY (EmplID) REFERENCES Employee (EmplID)
);
GO
-- =========================
-- Table: TravelExpensesEUR
-- =========================
CREATE TABLE TravelExpensesEUR (
    OrderNmbr VARCHAR(50) PRIMARY KEY,
    Date DATE NOT NULL,
    AllowanceEUR DECIMAL(18,2),
    CostsEUR DECIMAL(18, 2),
    EmplID INT NOT NULL,
    CONSTRAINT fk_TravelEUR_EmplID FOREIGN KEY (EmplID) REFERENCES Employee (EmplID)
);
GO
-- ====================
-- Table: WithdrawalRSD
-- ====================
CREATE TABLE WithdrawalRSD(
    TransactionID INT IDENTITY(1,1) PRIMARY KEY,
    AmountRSD INT,
    Date DATE NOT NULL,
    EmplID INT NOT NULL,
    CONSTRAINT fk_WithdrawlRSD_EmplID FOREIGN KEY (EmplID) REFERENCES Employee(EmplID)
);
GO
-- ====================
-- Table: WithdrawalEUR
-- ====================
CREATE TABLE WithdrawalEUR(
    TransactionID INT IDENTITY(1,1) PRIMARY KEY,
    AmountEUR INT,
    Date DATE NOT NULL,
    EmplID INT NOT NULL,
    CONSTRAINT fk_WithdrawlEUR_EmplID FOREIGN KEY (EmplID) REFERENCES Employee(EmplID)
);
GO
-- =================
-- Table: Inspection
-- =================
CREATE TABLE Inspection (
    InspectionID INT IDENTITY(1,1) PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,

);
GO
-- ========================
-- Table: EmployeeInspection
-- =========================
CREATE TABLE EmployeeInspection (
    EmployeeID INT NOT NULL,
    InspectionID INT NOT NULL,
	Date DATE NOT NULL,

    CONSTRAINT fk_EmployeeInspection_EmployeeID FOREIGN KEY (EmployeeID) REFERENCES Employee(EmplID),
    CONSTRAINT fk_EmployeeInspection_InspectionID FOREIGN KEY (InspectionID) REFERENCES Inspection(InspectionID),
	PRIMARY KEY (EmployeeID, InspectionID)
);
GO
-- =========================
-- Table: VehicleInspection
-- =========================
CREATE TABLE VehicleInspection (
    VehicleID INT NOT NULL,
    InspectionID INT NOT NULL,
    Date DATE NOT NULL,
	
    CONSTRAINT fk_VehicleInspection_VehicleID FOREIGN KEY (VehicleID) REFERENCES Vehicle(VehicleID),
    CONSTRAINT fk_VehicleInspection_DateID FOREIGN KEY (InspectionID) REFERENCES Inspection(InspectionID),
	PRIMARY KEY (VehicleID, InspectionID)
);
GO

-- ==========================
-- View: OutgoingInvoicePrice
-- ==========================
CREATE VIEW vw_OutgoingInvoiceAmount AS
SELECT 
    i.InvoiceID,

    CAST(SUM(s.Price) AS DECIMAL(18, 2)) AS Price,
    CAST(SUM(s.Price * ISNULL(i.Discount, 0)) AS DECIMAL(18, 2)) AS Discount,
    CAST(SUM(s.Price * (1 - ISNULL(i.Discount, 0))) AS DECIMAL(18, 2)) AS Amount,
    CAST(SUM(s.Price * (1 - ISNULL(i.Discount, 0)) * ISNULL(v.VATPercentage, 0)) AS DECIMAL(18, 2)) AS VAT,
    CAST(SUM(s.Price * (1 - ISNULL(i.Discount, 0)) * (1 + ISNULL(v.VATPercentage, 0))) AS DECIMAL(18, 2)) AS TotalAmount,

    MAX(s.Currency) AS Currency

FROM Item i
JOIN Service s ON i.ServiceID = s.ServiceID
JOIN VATCodeList v ON i.VATCode = v.VATCode
GROUP BY i.InvoiceID;
GO

-- =======================
-- View: VATRecapitulation
-- =======================
CREATE VIEW vw_VATRecapitulation AS
SELECT 
    i.InvoiceID,
    i.ServiceID,
    i.VATCode,
    CAST(s.Price * (1 - ISNULL(i.Discount, 0)) AS DECIMAL(18,2)) AS NetAmount,
    CAST(s.Price * (1 - ISNULL(i.Discount, 0)) * ISNULL(v.VATPercentage, 0) AS DECIMAL(18,2)) AS VATAmount
FROM Item i
JOIN Service s ON i.ServiceID = s.ServiceID
JOIN VATCodeList v ON i.VATCode = v.VATCode;
GO


