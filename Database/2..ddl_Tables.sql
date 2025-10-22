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

-- ==============
-- DROP Tables
-- ===============
IF OBJECT_ID('CarInspection', 'U') IS NOT NULL
    DROP TABLE CarInspection;
GO
IF OBJECT_ID('TruckInspection', 'U') IS NOT NULL
    DROP TABLE TruckInspection;
GO
IF OBJECT_ID('TrailerInspection', 'U') IS NOT NULL
    DROP TABLE TrailerInspection;
GO
IF OBJECT_ID('EmployeeInspection', 'U') IS NOT NULL
    DROP TABLE EmployeeInspection;
GO
IF OBJECT_ID('Inspection', 'U') IS NOT NULL
    DROP TABLE Inspection;
GO
IF OBJECT_ID('PaymentEUR', 'U') IS NOT NULL
    DROP TABLE PaymentEUR;
GO
IF OBJECT_ID('PaymentRSD', 'U') IS NOT NULL
    DROP TABLE PaymentRSD;
GO
IF OBJECT_ID('PaySlipItemRSD', 'U') IS NOT NULL
    DROP TABLE PaySlipItemRSD;
GO
IF OBJECT_ID('PaySlipRSD', 'U') IS NOT NULL
    DROP TABLE PaySlipRSD;
GO
IF OBJECT_ID('PaySlipItemEUR', 'U') IS NOT NULL
    DROP TABLE PaySlipItemEUR;
GO
IF OBJECT_ID('PaySlipEUR', 'U') IS NOT NULL
    DROP TABLE PaySlipEUR;
GO
IF OBJECT_ID('TaxService', 'U') IS NOT NULL
    DROP TABLE TaxService;
GO
IF OBJECT_ID('TransportationService', 'U') IS NOT NULL
    DROP TABLE TransportationService;
GO
IF OBJECT_ID('OutsorcingService', 'U') IS NOT NULL
    DROP TABLE OutsorcingService;
GO
IF OBJECT_ID('Service', 'U') IS NOT NULL
    DROP TABLE Service;
GO
IF OBJECT_ID('VATExamptionReason', 'U') IS NOT NULL
    DROP TABLE VATExamptionReason;
GO
IF OBJECT_ID('EmployeeCar', 'U') IS NOT NULL
    DROP TABLE EmployeeCar;
GO
IF OBJECT_ID('DriverComposition', 'U') IS NOT NULL
    DROP TABLE DriverComposition;
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
IF OBJECT_ID('Car', 'U') IS NOT NULL
    DROP TABLE Car;
GO
IF OBJECT_ID('dbo.DocumentStatusList', 'U') IS NOT NULL
    DROP TABLE dbo.DocumentStatusList;
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
IF OBJECT_ID('LoadingItem', 'U') IS NOT NULL
    DROP TABLE LoadingItem;
GO
IF OBJECT_ID('UnloadingItem', 'U') IS NOT NULL
    DROP TABLE UnloadingItem;
GO
IF OBJECT_ID('WorkOrder', 'U') IS NOT NULL
    DROP TABLE WorkOrder;
GO

IF OBJECT_ID('Client', 'U') IS NOT NULL
    DROP TABLE Client;
GO
IF OBJECT_ID('Employee', 'U') IS NOT NULL
    DROP TABLE Employee;
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
    PersonEmail VARCHAR(100),
    TaxID VARCHAR(50) NOT NULL,
    ClientType VARCHAR(10) NOT NULL CHECK (ClientType IN ('Supplier',       'Transportation')),
    CONSTRAINT fk_ContactPerson_TaxID FOREIGN KEY (TaxID) REFERENCES Client(TaxID),
    CONSTRAINT pk_ContactPerson PRIMARY KEY(TaxID, ContactName)
);
GO

-- =================
-- Table: WorkOrder
-- =================
CREATE TABLE WorkOrder(
    OrderID INT IDENTITY(1,1) PRIMARY KEY,
    OrderDate DATE NOT NULL DEFAULT GETDATE(),
    OrderCode AS (
        'N-' + CAST(OrderID AS VARCHAR(10)) + '/' + CAST(YEAR(OrderDate) AS VARCHAR(4))
    ) PERSISTED,
    Amount DECIMAL (18,2) NOT NULL,
    Currency VARCHAR(5) NOT NULL,
    Note VARCHAR(30),
    ClientID VARCHAR(50) NOT NULL,
    CONSTRAINT fk_WorkORder_ClientID FOREIGN KEY (ClientID) REFERENCES Client (TaxID)
);
-- ===================
-- Table: LoadingItem
-- ===================
CREATE TABLE LoadingItem(
	LoadingID INT IDENTITY PRIMARY KEY,
	Firm VARCHAR (50) NOT NULL,
	LoadingDate DATE NOT NULL,
	LoadingAdress VARCHAR (50) NOT NULL,
	Goods VARCHAR(50) NOT NULL,
	Customs VARCHAR(50) NOT NULL,
	ForwAgency VARCHAR(50) NOT NULL,
	Border VARCHAR(50) NOT NULL,
	Note VARCHAR(50) NOT NULL,
	OrderID INT NOT NULL,
	CONSTRAINT fk_LoadingOrder FOREIGN KEY (OrderID) REFERENCES WorkOrder(OrderID)
);

-- ====================
-- Table: UnloadingItem
-- ====================
CREATE TABLE UnloadingItem(
	UnloadingID INT IDENTITY PRIMARY KEY,
	Firm VARCHAR (50) NOT NULL,
	UnloadingDate DATE NOT NULL,
	UnloadingAdress VARCHAR(50) NOT NULL,
	Customs VARCHAR(50) NOT NULL,
	ForwAgency VARCHAR(50) NOT NULL,
	Note VARCHAR(50) NOT NULL,
	OrderID INT NOT NULL,
	CONSTRAINT fk_UnloadingOrder FOREIGN KEY (OrderID) REFERENCES WorkOrder(OrderID)
);

-- =========================
-- Table: DocumentStatusList 
-- =========================
CREATE TABLE DocumentStatusList (
    DStatusID TINYINT PRIMARY KEY,
    DStatusName VARCHAR(10) NOT NULL,
    
);
GO

-- ===========================
-- Table: ProcessingStatusList 
-- ===========================
CREATE TABLE ProcessingStatusList (
    ProcessingStatusID TINYINT PRIMARY KEY,
    ProcessingStatusName VARCHAR(10) NOT NULL,
    
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

-- ======================
-- Table: IncomingInvoice
-- ======================
CREATE TABLE IncomingInvoice (
    IncInvID INT IDENTITY(1,1) PRIMARY KEY,
    IncInvNmbr VARCHAR(15) NOT NULL,
    Amount NUMERIC(18, 2) NOT NULL,
	Currency VARCHAR(10) NOT NULL,
    TransactionDate DATE NOT NULL,
    DueDate DATE NOT NULL,
    IssueDate DATE NOT NULL,
    DocumentStatus INT NOT NULL
	CONSTRAINT fk_IncomingInvoice_DocumentStatus FOREIGN KEY (DocumentStatus) REFERENCES
	DocumentStatusList(DStatusID),
    PaymentStatus TINYINT NOT NULL
    CONSTRAINT fk_IncomingInvoice_PaymentStatusID FOREIGN KEY (PaymentStatus) REFERENCES           
	PaymentStatusList(PaymentStatusID),
    ProcessingStatus TINYINT NOT NULL
	CONSTRAINT fk_IncomingInvoice_ProcessingStatusID FOREIGN KEY (ProcessingStatus) REFERENCES
	ProcessingStatusList (ProcessingStatusID),
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
    Currency VARCHAR(10) NOT NULL,
    ReferenceNmbr VARCHAR(50) NOT NULL,
    OrderNmbr VARCHAR(50),
    TransDate DATE NOT NULL,
    IssueDate DATE NOT NULL,
    DueDate DATE NOT NULL,
    Attachment NVARCHAR(500), -- file path
    Note VARCHAR(255),
    DocumentStatus TINYINT NOT NULL
	CONSTRAINT fk_OutgoingInvoice_DocumentStatus FOREIGN KEY (DocumentStatus)
	REFERENCES DocumentStatusList(DStatusID),
    PaymentStatus TINYINT NOT NULL
	CONSTRAINT fk_OutgoingInvoice_PaymentStatusID FOREIGN KEY (PaymentStatus) 
	REFERENCES PaymentStatusList(PaymentStatusID),
    ProcessingStatus TINYINT NOT NULL
	CONSTRAINT fk_OutgoingInvoice_ProcessingStatusID FOREIGN KEY (ProcessingStatus) 
	REFERENCES ProcessingStatusList (ProcessingStatusID),
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

-- ============
-- Table: Truck
-- ============
CREATE TABLE Truck (
    TruckID INT IDENTITY(1,1) PRIMARY KEY,
    Make VARCHAR(50) NOT NULL,
    Model VARCHAR(50) NOT NULL,
    RegistrationTag VARCHAR(20) NOT NULL,
    Status VARCHAR(10) NOT NULL

);
GO

-- ==============
-- Table: Trailer
-- ==============
CREATE TABLE Trailer (
    TrailerID INT IDENTITY(1,1) PRIMARY KEY,
    Make VARCHAR(50) NOT NULL,
    Model VARCHAR(50) NOT NULL,
    RegistrationTag VARCHAR(20) NOT NULL,
    Status VARCHAR(10) NOT NULL
);
GO

-- ==========
-- Table: Car
-- ==========
CREATE TABLE Car(
    CarID INT IDENTITY(1,1) PRIMARY KEY,
    Make VARCHAR(50) NOT NULL,
    Model VARCHAR(50) NOT NULL,
    RegistrationTag VARCHAR(20) NOT NULL,
    Status VARCHAR(10) NOT NULL
);
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

-- ========================
-- Table: DriverComposition
-- ========================
CREATE TABLE DriverComposition (
    DriverID INT NOT NULL,
    TruckID INT NOT NULL,
    TrailerID INT NOT NULL,
    FOREIGN KEY (DriverID) REFERENCES Employee(EmplID),
    FOREIGN KEY (TruckID) REFERENCES Truck(TruckID),
    FOREIGN KEY (TrailerID) REFERENCES Trailer(TrailerID),
    CONSTRAINT pk_DriverComposition PRIMARY KEY (DriverID, TruckID, TrailerID)
);
GO

-- ==================
-- Table: EmployeeCar
-- ==================
CREATE TABLE EmployeeCar (
    EmplID INT NOT NULL,
    CarID INT NOT NULL,
    FOREIGN KEY (EmplID) REFERENCES Employee(EmplID),
    FOREIGN KEY (CarID) REFERENCES Car(CarID),
    CONSTRAINT pk_EmployeeCar PRIMARY KEY (EmplID, CarID)
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
CREATE TABLE Service(
	ServiceID INT IDENTITY(1,1) PRIMARY KEY,
	ServiceType VARCHAR(20)
);
GO

-- ============================
-- Table: TransportationService
-- ============================
CREATE TABLE TransportationService (
    ServiceID INT,
    Route VARCHAR(100) NOT NULL,
    Price DECIMAL(18, 2) NOT NULL,
    TruckID INT NULL,
    TrailerID INT NULL,
    CONSTRAINT fk_TranService_ServiceID FOREIGN KEY(ServiceID)
    REFERENCES Service(ServiceID),
    CONSTRAINT fk_TransServiceComposition FOREIGN KEY(TruckID, TrailerID)
    REFERENCES Composition(TruckID, TrailerID)
    CONSTRAINT pk_TransportationService PRIMARY KEY(ServiceID)
    
   
);
GO

-- =================
-- Table: TaxService
-- =================
CREATE TABLE TaxService(
	ServiceID INT,
	Name VARCHAR(100),
	Price DECIMAL(18,2),
	CONSTRAINT fk_TaxService_ServiceID FOREIGN KEY(ServiceID)
    REFERENCES Service(ServiceID),
    CONSTRAINT pk_TaxService PRIMARY KEY(ServiceID)	
);
GO

-- ==============================
-- Table: OutsourcingServiceTable
-- ==============================
CREATE TABLE OutsourcingServiceTable (
	ServiceID INT,
	Route VARCHAR(100),
	Price DECIMAL(18,2),
	RegTag VARCHAR(50),
	CONSTRAINT fk_TaxService_ServiceID FOREIGN KEY(ServiceID)
    REFERENCES Service(ServiceID),
    CONSTRAINT pk_TaxService PRIMARY KEY(ServiceID)	
);
GO

-- ===========
-- Table: Item
-- ===========
CREATE TABLE Item(
	InvoiceID INT NOT NULL,
	ServiceID INT NOT NULL,
	Discount DECIMAL(18, 2),
	VATCode VARCHAR(6) NOT NULL,
	VATExamptionCode VARCHAR(50),
	CONSTRAINT pk_Item PRIMARY KEY(InvoiceID, ServiceID),
	CONSTRAINT fk_Item_Vat FOREIGN KEY (VATCode, VATExamptionCode) REFERENCES VATExamptionReason (VATCode, VATExamptionCode)
);
GO

-- ==================
-- Table: PaySlipEUR
-- ==================
CREATE TABLE PaySlipEUR (
    PaySlipEUR_ID VARCHAR(50) PRIMARY KEY,
    IssueDate DATE NOT NULL,
    EmplID INT NOT NULL,
    CONSTRAINT fk_PaySlipEUR_EmplID FOREIGN KEY (EmplID) REFERENCES Employee (EmplID)
);
GO

-- ======================
-- Table: PaySlipItemEUR
-- ======================
CREATE TABLE PaySlipItemEUR (
    OrderNmbr VARCHAR(50) PRIMARY KEY,
    Date DATE NOT NULL,
    AllowanceEUR DECIMAL(18,2),
    CostsEUR DECIMAL(18, 2),
	PaySlipEUR_ID VARCHAR (50) NOT NULL,
	CONSTRAINT fk_PaySlipItemEUR_PaySlipID FOREIGN KEY (PaySlipEUR_ID) REFERENCES PaySlipEUR (PaySlipEUR_ID)
);
GO

-- ==================
-- Table: PaySlipRSD
-- ==================
CREATE TABLE PaySlipRSD (
    PaySlipRSD_ID VARCHAR(50) PRIMARY KEY,
    IssueDate DATE NOT NULL,
    EmplID INT NOT NULL,
    CONSTRAINT fk_PaySlipRSD_EmplID FOREIGN KEY (EmplID) REFERENCES Employee (EmplID)
);
GO

-- =====================
-- Table: PaySlipItemRSD
-- ======================
CREATE TABLE PaySlipItemRSD (
    OrderNmbr VARCHAR(50) PRIMARY KEY,
    Date DATE NOT NULL,
    AllowanceRSD DECIMAL(18,2),
	PaySlipID INT NOT NULL,
    CostsRSD DECIMAL(18, 2),
	PaySlipRSD_ID VARCHAR(50) NOT NULL,
	CONSTRAINT fk_PaySlipItemRSD_PaySlipID FOREIGN KEY (PaySlipRSD_ID) REFERENCES PaySlipRSD (PaySlipRSD_ID)
);
GO

-- =================
-- Table: PaymentRSD
-- =================
CREATE TABLE PaymentRSD(
    PaymentID_RSD INT IDENTITY(1,1) PRIMARY KEY,
    AmountRSD INT,
    Date DATE NOT NULL,
    EmplID INT NOT NULL,
    CONSTRAINT fk_PaymentRSD_EmplID FOREIGN KEY (EmplID) REFERENCES Employee(EmplID)
);
GO

-- =================
-- Table: PaymentEUR
-- =================
CREATE TABLE PaymentEUR(
    PaymentID_EUR INT IDENTITY(1,1) PRIMARY KEY,
    AmountEUR INT,
    Date DATE NOT NULL,
    EmplID INT NOT NULL,
    CONSTRAINT fk_PaymentEUR_EmplID FOREIGN KEY (EmplID) REFERENCES Employee(EmplID)
);
GO

-- =================
-- Table: Inspection
-- =================
CREATE TABLE Inspection (
    InspectionID INT IDENTITY(1,1) PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    InspectionType VARCHAR(10) NOT NULL

);
GO

-- =========================
-- Table: EmployeeInspection
-- =========================
CREATE TABLE EmployeeInspection (
    EmployeeID INT NOT NULL,
    InspectionID INT NOT NULL,
    Date DATE NOT NULL,
    CONSTRAINT fk_EmployeeInspection_EmployeeID FOREIGN KEY (EmployeeID) 
    REFERENCES Employee(EmplID),
    CONSTRAINT fk_EmployeeInspection_InspectionID FOREIGN KEY (InspectionID) 
    REFERENCES Inspection(InspectionID),
    PRIMARY KEY (EmployeeID, InspectionID)
);
GO

-- ======================
-- Table: TruckInspection
-- ======================
CREATE TABLE TruckInspection (
    TruckID INT NOT NULL,
    InspectionID INT NOT NULL,
    Date DATE NOT NULL,
    CONSTRAINT fk_TruckInspection_TruckID FOREIGN KEY (TruckID) 
    REFERENCES Truck(TruckID),
    CONSTRAINT fk_TruckInspection_InspectionID FOREIGN KEY (InspectionID) 
    REFERENCES Inspection(InspectionID),
    PRIMARY KEY (TruckID, InspectionID)
);
GO

-- ========================
-- Table: TrailerInspection
-- ========================
CREATE TABLE TrailerInspection (
    TrailerID INT NOT NULL,
    InspectionID INT NOT NULL,
    Date DATE NOT NULL,
    CONSTRAINT fk_TrailerInspection_TrailerID FOREIGN KEY (TrailerID) 
    REFERENCES Trailer(TrailerID),
    CONSTRAINT fk_TrailerInspection_InspectionID FOREIGN KEY (InspectionID) 
    REFERENCES Inspection(InspectionID),
    PRIMARY KEY (TrailerID, InspectionID)
);
GO

-- ====================
-- Table: CarInspection
-- ====================
CREATE TABLE CarInspection (
    CarID INT NOT NULL,
    InspectionID INT NOT NULL,
    Date DATE NOT NULL,
    CONSTRAINT fk_CarInspection_CarID FOREIGN KEY (CarID) 
    REFERENCES Car(CarID),
    CONSTRAINT fk_CarInspection_InspectionID FOREIGN KEY (InspectionID) 
    REFERENCES Inspection(InspectionID),
    PRIMARY KEY (CarID, InspectionID)
);
GO