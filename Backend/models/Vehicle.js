class Vehicle {
    constructor({
        VehicleID,
        VehicleType,
        Make,
        Model,
        RegistrationTag,
        EmplID,
    }) {
        this.Vehicle=VehicleID;
        this.VehicleType=VehicleType;
        this.Make=Make;
        this.Model=Model;
        this.RegistrationTag=RegistrationTag;
        this.EmplID=EmplID;
    }
}

module.exports= Vehicle;