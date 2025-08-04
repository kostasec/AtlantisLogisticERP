class Employee {
    constructor({
        EmplID,
        EmplType,
        FirstName,
        LastName,
        Status,
        StreetAndNmbr,
        City,
        ZIPCode,
        Country,
        PhoneNmbr,
        EmailAddress,
        IDCardNmbr,
        PassportNmbr,
        MgrID
    }) {
        this.EmplID = EmplID;
        this.EmplType = EmplType;
        this.FirstName = FirstName;
        this.LastName = LastName;
        this.Status = Status;
        this.StreetAndNmbr = StreetAndNmbr;
        this.City = City;
        this.ZIPCode = ZIPCode;
        this.Country = Country;
        this.PhoneNmbr = PhoneNmbr;
        this.EmailAddress = EmailAddress;
        this.IDCardNmbr = IDCardNmbr;
        this.PassportNmbr = PassportNmbr;
        this.MgrID = MgrID;
    }
}

module.exports = Employee;