const Drepturi=require('./drepturi.js');

/**
 * Clasă de bază pentru toate rolurile.
 * Furnizează o metodă pentru verificarea drepturilor de acces.
 */

class Rol{
    /**
     * Tipul rolului.
     * @returns {string}
     */
    static get tip() {return "generic"}
    /**
     * Drepturile asociate cu acest rol.
     * @returns {Symbol[]}
     */
    static get drepturi() {return []}
    /**
     * Constructorul clasei Rol.
     * Inițializează tipul rolului.
     */
    constructor (){
        this.cod=this.constructor.tip;
    }
    /**
     * Verifică dacă rolul are un anumit drept.
     * @param {Symbol} drept - Dreptul de verificat.
     * @returns {boolean} - True dacă rolul are dreptul, false altfel.
     */
    areDreptul(drept){ //drept trebuie sa fie tot Symbol
        console.log("in metoda rol!!!!")
        return this.constructor.drepturi.includes(drept); //verificam daca dreptul este in array-ul de drepturi al rolului
    }
}

/**
 * Clasă pentru rolul de administrator complet.
 * Are acces la toate funcționalitățile.
 */
class RolAdmin extends Rol{
    
    static get tip() {return "admin"}
    constructor (){
        super(); // apelam constructorul clasei de baza Rol
    }

    areDreptul(){
        return true; //pentru ca e admin
    }
}

/**
 * Clasă pentru rolul de moderator.
 * Are dreptul de a gestiona utilizatorii din baza de date.
 */
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

/**
 * Clasă pentru rolul de client.
 * Are dreptul de a cumpăra produse.
 */
class RolClient extends Rol{
    static get tip() {return "comun"}
    static get drepturi() { return [
        Drepturi.cumparareProduse
    ] }
    constructor (){
        super()
    }
}

/**
 * Clasă pentru rolul de administrator de produse.
 * Are drepturi de gestionare a produselor din baza de date.
 */
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

/**
 * Fabrică de roluri - creează instanțe de roluri în funcție de tipul dat.
 */
class RolFactory{ // clasa de tip factory
    /**
     * Creează un rol pe baza tipului.
     * @param {string} tip - Tipul rolului ("admin", "moderator", etc.)
     * @returns {Rol|undefined} Instanță de rol corespunzătoare sau `undefined`
     */
    static creeazaRol(tip) {
        switch(tip){
            case RolAdmin.tip : return new RolAdmin();
            case RolModerator.tip : return new RolModerator();
            case RolClient.tip : return new RolClient();
            case AdministratorProduse.tip : return new AdministratorProduse();
        }
    }
}

/**
 * @typedef {object} ModuleExportatRoluri
 * @property {typeof RolFactory} RolFactory - Fabrică de roluri (admin, moderator etc.)
 * @property {typeof RolAdmin} RolAdmin - Clasa pentru rolul de administrator
 * @property {typeof RolModerator} RolModerator - Clasa pentru rolul de moderator
 * @property {typeof RolClient} RolClient - Clasa pentru rolul de client
 * @property {typeof AdministratorProduse} AdministratorProduse - Clasa pentru rolul de administrator de produse
 */

/**
 * Exportă clasa RolAdmin și fabrică de roluri.
 * @type {ModuleExportatRoluri}
 */
module.exports={
    RolFactory:RolFactory,
    RolAdmin:RolAdmin
}