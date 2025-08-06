class Client {
    constructor({
        TaxID,
        RegNmbr,
        ClientName,
        StreetAndNmbr,
        City,
        ZIP,
        Country,
        IsActive,
        Email
    }) {
        this.TaxID = TaxID;
        this.RegNmbr = RegNmbr;
        this.ClientName = ClientName;
        this.StreetAndNmbr = StreetAndNmbr;
        this.City = City;
        this.ZIP = ZIP;
        this.Country = Country;
        this.IsActive = IsActive;
        this.Email = Email;
    }
}

module.exports = Client;
