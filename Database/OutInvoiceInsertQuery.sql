select * from service
select * from Composition
select * from PaymentStatusList
select * from ProcessingStatusList
select * from DocumentStatusList
select * from VATExamptionReason
select * from TransportationService
select * from TaxService
select * from OutgoingInvoice
select * from item
SELECT * FROM Client

INSERT INTO OutgoingInvoice values('605-25','605-25',null,'2025-08-22','2025-08-22','2025-08-22','cmr',null,0,5,'TEST1236545','RSD',0);
INSERT INTO OutgoingInvoice values('601-25','605-25',null,'2025-08-22','2025-08-22','2025-08-22','cmr',null,0,5,'TEST1236545','EUR',0);
INSERT INTO OutgoingInvoice values('74-25','74-25',null,'2025-08-22','2025-08-22','2025-08-22','cmr',null,0,5,'TEST1236545','RSD',0)
INSERT INTO OutgoingInvoice values('595-25','595-25',null,'2025-08-22','2025-08-22','2025-08-22','cmr',null,0,5,'TEST1236545','RSD',0);
INSERT INTO OutgoingInvoice values('510-25','510-25', null,'2025-08-22','2025-08-22','2025-08-22','cmr',null,0,5,'TEST1236545','RSD',0)
INSERT INTO OutgoingInvoice values('5100-25','5100-25', null,'2025-08-22','2025-08-22','2025-08-22','cmr',null,0,5,'TEST1236545','RSD',0)


INSERT INTO TransportationService values ('1','Kunszentmiklos(HU) - Subotica(SRB)', 50000, 2011, 2003)
INSERT INTO TransportationService values (1002,'Subotica(SRB) - SarszentMihaly(HU)', 380, 2011, 2003)
INSERT INTO TransportationService values (1004,'Subotica(SRB) - Budapest(HU)', 76082, 2011, 2003)
INSERT INTO TransportationService values (1005,'Subotica-Ruma', 25000, 2011, 2003)

INSERT INTO TaxService VALUES(1003,'Fito Taksa',4510)
INSERT INTO TaxService VALUES(1008,'Fito Taksa',4000)


INSERT INTO OutsorcingService VALUES (1006,'Kucevo-Ludus', 117180, 'NP 151-IK/AF-271 NP')
INSERT INTO OutsorcingService VALUES (1007,'Kucevo-Ludus', 60000, 'NS 151-IK/AF-271 NS')

INSERT INTO Item values (4004, 1, null, 'Z', 'PDV-RS-24-1-1')
insert into item values(4006,1002,0.2,'O','PDV-RS-12-4')
insert into item values(4008,1004,null,'Z','PDV-RS-24-1-1')
insert into item values(4008,1003,null,'OE','PDV-RS-17-4-3')
insert into item values(4009,1005,null,'S20','None')
insert into item values(4010,1006,null,'Z','PDV-RS-24-1-8')
insert into item values(4011,1007,null,'S20','none')
insert into item values(4011,1008,null,'S20','none')


select * from OutgoingInvoice

select * from OutsorcingService