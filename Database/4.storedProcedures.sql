-- ===========================
-- DROP InsertClientAndContact
-- ===========================
IF OBJECT_ID('sp_InsertClientAndContact', 'P') IS NOT NULL
    DROP PROCEDURE sp_InsertClientAndContact;

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

-- =======================================
-- StoredProcedure: InsertClientAndContact
-- =======================================
CREATE PROCEDURE sp_InsertClientAndContact
    @TaxID VARCHAR(50),
    @RegNmbr VARCHAR(50),
    @ClientName VARCHAR(100),
    @StreetAndNmbr VARCHAR(100),
    @City VARCHAR(50),
    @ZIP VARCHAR(10),
    @Country VARCHAR(50),
    @Email VARCHAR(100),           -- Email za Client
    @ContactName VARCHAR(100) = NULL,
    @Description VARCHAR(100) = NULL,
    @PhoneNmbr VARCHAR(30) = NULL,
    @PersonEmail VARCHAR(100) = NULL -- Email za ContactPerson
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;

        -- Unesi klijenta ako ne postoji
        IF NOT EXISTS (SELECT 1 FROM Client WHERE TaxID = @TaxID)
        BEGIN
            INSERT INTO Client (TaxID, RegNmbr, ClientName, StreetAndNmbr, City, ZIP, Country, Email)
            VALUES (@TaxID, @RegNmbr, @ClientName, @StreetAndNmbr, @City, @ZIP, @Country, @Email);
        END

        -- Unesi kontakt osobu samo ako je prosleđena ContactName
        IF (@ContactName IS NOT NULL AND LTRIM(RTRIM(@ContactName)) <> '')
        BEGIN
            INSERT INTO ContactPerson (ContactName, Description, PhoneNmbr, PersonEmail, TaxID)
            VALUES (@ContactName, @Description, @PhoneNmbr, @PersonEmail, @TaxID);
        END

        COMMIT;
        SELECT 'Success' AS Status, @TaxID AS TaxID;
    END TRY
    BEGIN CATCH
        ROLLBACK;
        SELECT ERROR_MESSAGE() AS ErrorMessage;
    END CATCH
END