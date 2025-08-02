-- Index for optimizing client-based filtering in outgoing invoices
CREATE NONCLUSTERED INDEX idx_OutgoingInvoice_TaxID ON OutgoingInvoice(TaxID);

-- Index for optimizing client-based filtering in incoming invoices
CREATE NONCLUSTERED INDEX idx_IncomingInvoice_TaxID ON IncomingInvoice(TaxID);