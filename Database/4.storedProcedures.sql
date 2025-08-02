-- ============================
-- DROP InsertEmployeeProcedure
-- ============================
IF OBJECT_ID('sp_InsertEmployee', 'P') IS NOT NULL
    DROP PROCEDURE sp_InsertEmployee;
GO
-- ============================
-- DROP InsertVehicleProcedure
-- ============================
IF OBJECT_ID('sp_InsertVehicle', 'P') IS NOT NULL
    DROP PROCEDURE sp_InsertVehicle;
GO
-- ============================
-- DROP InsertServiceProcedure
-- ============================
IF OBJECT_ID('sp_InsertService', 'P') IS NOT NULL
    DROP PROCEDURE sp_InsertService;
GO
-- ===================================
-- DROP InsertOutgoingInvoiceProcedure
-- ====================================
IF OBJECT_ID('sp_InsertOutgoingInvoice', 'P') IS NOT NULL
    DROP PROCEDURE sp_InsertOutgoingInvoice;
GO
-- ========================================
-- StoredProcedure: InsertOutgoingInvoice
-- ========================================
CREATE PROCEDURE sp_InsertOutgoingInvoice
    @OutInvoiceNmbr VARCHAR(50),
    @ReferenceNmbr VARCHAR(50),
    @OrderNmbr VARCHAR(50) = NULL,
    @TransDate DATE,
    @IssueDate DATE,
    @DueDate DATE,
    @Attachment NVARCHAR(500) = NULL,
    @Note VARCHAR(255) = NULL,
    @PaymentStatus TINYINT,
	@ProcessingStatus TINYINT,
    @TaxID VARCHAR(50),
    @InvoiceID INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
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
            @OutInvoiceNmbr,
            @ReferenceNmbr,
            @OrderNmbr,
            @TransDate,
            @IssueDate,
            @DueDate,
            @Attachment,
            @Note,
            @PaymentStatus,
			@ProcessingStatus,
            @TaxID
        );

        -- Dohvatanje novog identiteta
        SET @InvoiceID = SCOPE_IDENTITY();
    END TRY
    BEGIN CATCH
        SET @InvoiceID = NULL;

        DECLARE @ErrMsg NVARCHAR(4000), @ErrSeverity INT;
        SELECT @ErrMsg = ERROR_MESSAGE(), @ErrSeverity = ERROR_SEVERITY();
        RAISERROR(@ErrMsg, @ErrSeverity, 1);
    END CATCH
END;
GO
-- =================================
-- StoredProcedure: InsertService
-- =================================
CREATE PROCEDURE sp_InsertService
    @ServiceName VARCHAR(100),
    @Price DECIMAL(18,2),
	@Currency VARCHAR(10),
	@TransportationType VARCHAR(10),
	@TruckID INT = NULL,
    @TrailerID INT = NULL,
    @ServiceID INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        -- Ubacivanje u tabelu Service
        INSERT INTO Service (
            ServiceName,
            Price,
			Currency,
            TransportationType,
            TruckID,
            TrailerID
        )
        VALUES (
            @ServiceName,
            @Price,
			@Currency,
            @TransportationType,
            @TruckID,
            @TrailerID
        );

        -- Dohvatanje ID-a nove usluge
        SET @ServiceID = SCOPE_IDENTITY();
    END TRY
    BEGIN CATCH
        -- U slučaju greške, vraća NULL i re-izbacuje grešku
        SET @ServiceID = NULL;

        DECLARE @ErrMsg NVARCHAR(4000), @ErrSeverity INT;
        SELECT @ErrMsg = ERROR_MESSAGE(), @ErrSeverity = ERROR_SEVERITY();
        RAISERROR(@ErrMsg, @ErrSeverity, 1);
    END CATCH
END;
GO
-- ================================
-- StoredProcedure: InsertVehicle
-- ================================
CREATE PROCEDURE sp_InsertVehicle
    @VehicleType VARCHAR(20),
    @Make VARCHAR(50),
    @Model VARCHAR(50),
    @RegistrationTag VARCHAR(20),
    @EmplID INT = NULL,
    @VehicleID INT OUTPUT  -- Vrati novi ID
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        INSERT INTO Vehicle (
            VehicleType, Make, Model, RegistrationTag, EmplID
        )
        VALUES (
            @VehicleType, @Make, @Model, @RegistrationTag, @EmplID
        );

        SET @VehicleID = SCOPE_IDENTITY();
    END TRY
    BEGIN CATCH
        SET @VehicleID = NULL;
        DECLARE @ErrMsg NVARCHAR(4000), @ErrSeverity INT;
        SELECT @ErrMsg = ERROR_MESSAGE(), @ErrSeverity = ERROR_SEVERITY();
        RAISERROR(@ErrMsg, @ErrSeverity, 1);
    END CATCH
END;
GO
-- =================================
-- StoredProcedure: InsertEmployee
-- =================================
CREATE PROCEDURE sp_InsertEmployee
    @EmplType VARCHAR(50),
    @FirstName VARCHAR(50),
    @LastName VARCHAR(50),
    @Status VARCHAR(20),
    @StreetAndNmbr VARCHAR(100),
    @City VARCHAR(50),
    @ZIPCode VARCHAR(10),
    @Country VARCHAR(50),
    @PhoneNmbr VARCHAR(50),
    @EmailAddress VARCHAR(50),
    @IDCardNmbr VARCHAR(20),
    @PassportNmbr VARCHAR(20),
    @MgrID INT = NULL,
    @EmplID INT OUTPUT  -- Vrati novi ID
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        INSERT INTO Employee (
            EmplType, FirstName, LastName, Status,
            StreetAndNmbr, City, ZIPCode, Country,
            PhoneNmbr, EmailAddress, IDCardNmbr, PassportNmbr, MgrID
        )
        VALUES (
            @EmplType, @FirstName, @LastName, @Status,
            @StreetAndNmbr, @City, @ZIPCode, @Country,
            @PhoneNmbr, @EmailAddress, @IDCardNmbr, @PassportNmbr, @MgrID
        );

        SET @EmplID = SCOPE_IDENTITY();
    END TRY
    BEGIN CATCH
        SET @EmplID = NULL;
        DECLARE @ErrMsg NVARCHAR(4000), @ErrSeverity INT;
        SELECT @ErrMsg = ERROR_MESSAGE(), @ErrSeverity = ERROR_SEVERITY();
        RAISERROR(@ErrMsg, @ErrSeverity, 1);
    END CATCH
END;
GO
