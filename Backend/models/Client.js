class Client {
    constructor({
        TaxID,
        RegNmbr,
        ClientName,
        StreetAndNmbr,
        City,
        ZIP,
        Country,
        IsActive
    }) {
        this.TaxID = TaxID;
        this.RegNmbr = RegNmbr;
        this.ClientName = ClientName;
        this.StreetAndNmbr = StreetAndNmbr;
        this.City = City;
        this.ZIP = ZIP;
        this.Country = Country;
        this.IsActive = IsActive;
    }
}

module.exports = Client;
