IF OBJECT_ID('dbo.sp_InsertInvoiceService', 'P') IS NOT NULL
DROP PROCEDURE dbo.sp_InsertInvoiceService;

IF TYPE_ID('dbo.ItemTvpType') IS NOT NULL
DROP TYPE dbo.ItemTvpType;

IF TYPE_ID('dbo.ServiceTvpType') IS NOT NULL
DROP TYPE dbo.ServiceTvpType;


CREATE TYPE dbo.ServiceTvpType AS TABLE 
(
[ServiceName] VARCHAR(100) NOT NULL,
[Price] DECIMAL (9,2) NOT NULL,
[TransportationType] VARCHAR (10) NULL,
TruckID INT NULL,
TrailerID INT NULL
);
GO

CREATE TYPE dbo.ItemTvpType AS TABLE 
(
    ServiceName        VARCHAR(100) NOT NULL, -- referenca na ono što se nalazi u @Service
    Quantity           INT NOT NULL,
    Discount           DECIMAL(5,2) NULL,
    VATCode            VARCHAR(6) NOT NULL,
    VATExamptionCode   VARCHAR(50) NULL
);
GO

CREATE OR ALTER PROCEDURE dbo.sp_InsertInvoiceService
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
    @Services dbo.ServiceTvpType READONLY,
    @Items dbo.ItemTvpType READONLY,
    @InvoiceID INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- 1) Ubacivanje fakture
        INSERT INTO OutgoingInvoice (
            OutInvoiceNmbr, ReferenceNmbr, OrderNmbr,
            TransDate, IssueDate, DueDate,
            Attachment, Note,
            PaymentStatus, ProcessingStatus,
            TaxID
        )
        VALUES (
            @OutInvoiceNmbr, @ReferenceNmbr, @OrderNmbr,
            @TransDate, @IssueDate, @DueDate,
            @Attachment, @Note,
            @PaymentStatus, @ProcessingStatus,
            @TaxID
        );

        -- Dobavljanje InvoiceID
        SET @InvoiceID = SCOPE_IDENTITY();

        -- 2) Ubacivanje usluga u Service + hvatanje ServiceID
        DECLARE @InsertedServices TABLE (
            ServiceID INT,
            ServiceName VARCHAR(100)
        );

        INSERT INTO Service (
            ServiceName, Price, TransportationType, TruckID, TrailerID
        )
        OUTPUT INSERTED.ServiceID, INSERTED.ServiceName
        INTO @InsertedServices(ServiceID, ServiceName)
        SELECT ServiceName, Price, TransportationType, TruckID, TrailerID
        FROM @Services;

        -- 3) Ubacivanje stavki u Item tabelu
        INSERT INTO Item (
            InvoiceID, ServiceID, Discount, VATCode, VATExamptionCode
        )
        SELECT
            @InvoiceID,
            S.ServiceID,
            I.Discount,
            I.VATCode,
            I.VATExamptionCode
        FROM @Items I
        JOIN @InsertedServices S
            ON I.ServiceName = S.ServiceName;

        COMMIT;
    END TRY
    BEGIN CATCH
        ROLLBACK;
        SET @InvoiceID = NULL;

        DECLARE @ErrMsg NVARCHAR(4000), @ErrSeverity INT;
        SELECT @ErrMsg = ERROR_MESSAGE(), @ErrSeverity = ERROR_SEVERITY();
        RAISERROR(@ErrMsg, @ErrSeverity, 1);
    END CATCH
END;
GO