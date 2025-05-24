
const Drepturi=require('./drepturi.js');


class Rol{
    static get tip() {return "generic"}
    static get drepturi() {return []}
    constructor (){
        this.cod=this.constructor.tip;
    }

    areDreptul(drept){ //drept trebuie sa fie tot Symbol
        console.log("in metoda rol!!!!")
        return this.constructor.drepturi.includes(drept); //verificam daca dreptul este in array-ul de drepturi al rolului
    }
}

class RolAdmin extends Rol{
    
    static get tip() {return "admin"}
    constructor (){
        super();
    }

    areDreptul(){
        return true; //pentru ca e admin
    }
}

class RolModerator extends Rol{
    
    static get tip() {return "moderator"} //returneaza stringul "moderator"
    static get drepturi() { return [ // returneaza un array de cu drepturile de moderator
        Drepturi.vizualizareUtilizatori,
        Drepturi.stergereUtilizatori
    ] }
    constructor (){
        super() // apelam constructorul clasei de baza Rol
    }
}

class RolClient extends Rol{
    static get tip() {return "comun"}
    static get drepturi() { return [
        Drepturi.cumparareProduse
    ] }
    constructor (){
        super()
    }
}

class AdministratorProduse extends Rol{
    static get tip() {return "administratorProduse"}
    static get drepturi() { return [
        Drepturi.modificareProduse,
        Drepturi.stergereProduse,
        Drepturi.creareProduse
    ] }
    constructor (){
        super()
    }
}


class RolFactory{
    static creeazaRol(tip) {
        switch(tip){
            case RolAdmin.tip : return new RolAdmin();
            case RolModerator.tip : return new RolModerator();
            case RolClient.tip : return new RolClient();
            case AdministratorProduse.tip : return new AdministratorProduse();
        }
    }
}


module.exports={
    RolFactory:RolFactory,
    RolAdmin:RolAdmin
}