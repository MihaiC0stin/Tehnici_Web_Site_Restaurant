/*

ATENTIE!
inca nu am implementat protectia contra SQL injection
*/

const {Client, Pool}=require("pg"); //pg este un client pentru baza de date PostgreSQL

// AccesBD este o clasa care implementeaza un model de design Singleton pentru a avea o singura instanta a conexiunii la baza de date
class AccesBD{ // proprietatile statice tin de clasa 
    static #instanta=null; // instanta unica a clasei AccesBD (obiectul ei), static si privat pentru a preveni accesul direct la ea
    static #initializat=false; // flag pentru a verifica daca instanta a fost initializata, static si privat pentru a preveni accesul direct la ea

    constructor() { // constructorul este privat pentru a preveni instantierea directa a clasei, creaza un obiect de tip Client pentru a se conecta la baza de date
        if(AccesBD.#instanta){ // fiindca clasa este Singleton, daca exista deja o instanta, aruncam o eroare
            throw new Error("Deja a fost instantiat");
        }
        else if(!AccesBD.#initializat){ 
            throw new Error("Trebuie apelat doar din getInstanta; fara sa fi aruncat vreo eroare");
        }
    }

    initLocal(){
        this.client= new Client({
            database:"tehniciweb",
            user:"mihai", 
            password:"mihai", 
            host:"localhost", 
            port:5432});
        this.client.connect();
    }

    getClient(){
        if(!AccesBD.#instanta ){
            throw new Error("Nu a fost instantiata clasa");
        }
        return this.client;
    }

    /**
     * @typedef {object} ObiectConexiune - obiect primit de functiile care realizeaza un query
     * @property {string} init - tipul de conexiune ("init", "render" etc.)
     * 
     * /

    /**
     * Returneaza instanta unica a clasei
     *
     * @param {ObiectConexiune} init - un obiect cu datele pentru query
     * @returns {AccesBD}
     */
    static getInstanta({init="local"}={}){ //metoda statica care returneaza instanta unica a clasei, parametrul init are valoarea "local" in mod implicit, util pentru getInstanta()
        console.log(this);//this-ul e clasa nu instanta pt ca metoda statica
        if(!this.#instanta){
            this.#initializat=true;
            this.#instanta=new AccesBD();

            //initializarea poate arunca erori
            //vom adauga aici cazurile de initializare 
            //pentru baza de date cu care vrem sa lucram
            try{
                switch(init){
                    case "local":this.#instanta.initLocal();
                }
                //daca ajunge aici inseamna ca nu s-a produs eroare la initializare
                
            }
            catch (e){
                console.error("Eroare la initializarea bazei de date!");
            }

        }
        return this.#instanta;
    }




    /**
     * @typedef {object} ObiectQuerySelect - obiect primit de functiile care realizeaza un query
     * @property {string} tabel - numele tabelului
     * @property {string []} campuri - o lista de stringuri cu numele coloanelor afectate de query; poate cuprinde si elementul "*"
     * @property {string[]} conditiiAnd - lista de stringuri cu conditii pentru where
     */


    
    /**
     * callback pentru queryuri.
     * @callback QueryCallBack
     * @param {Error} err Eventuala eroare in urma queryului
     * @param {Object} rez Rezultatul query-ului
     */
    /**
     * Selecteaza inregistrari din baza de date
     *
     * @param {ObiectQuerySelect} obj - un obiect cu datele pentru query
     * @param {QueryCallBack} callback - o functie callback cu 2 parametri: eroare si rezultatul queryului
     */




    select({tabel="",campuri=[],conditiiAnd=[]} = {}, callback, parametriQuery=[]){ // tabelul, coloanele si conditiile
        //select({tabel:"produse", campuri:["nume", "pret", "descriere"], conditiiAnd:["pret>10", "calorii<700"]}, function(err, rez){
        let conditieWhere="";
        if(conditiiAnd.length>0)
            // "where pret > 10 and calorii < 700"
            conditieWhere=`where ${conditiiAnd.join(" and ")}`; // join() uneste elementele unui array cu un separator, in cazul nostru " and "
        let comanda=`select ${campuri.join(",")} from ${tabel} ${conditieWhere}`;
        console.error(comanda); // afisam comanda in consola pentru debugging
        /*
        comanda=`select id, camp1, camp2 from tabel where camp1=$1 and camp2=$2;
        this.client.query(comanda,[val1, val2],callback)

        */
        this.client.query(comanda, parametriQuery, callback)
    }


    /**
     * @typedef {object} ObiectQuerySelect - obiect primit de functiile care realizeaza un query
     * @property {string} tabel - numele tabelului
     * @property {string []} campuri - o lista de stringuri cu numele coloanelor afectate de query; poate cuprinde si elementul "*"
     * @property {string[]} conditiiAnd - lista de stringuri cu conditii pentru where
     */

    /**
     * Selectează asincron înregistrări din baza de date.
     * @param {ObiectQuerySelect} obj - Obiect cu informațiile pentru query.
     * @returns {Promise<Object|null>} - Promisiune care conține rezultatul queryului sau `null` dacă a eșuat.
     */

    async selectAsync({tabel="",campuri=[],conditiiAnd=[]} = {}){
        let conditieWhere="";
        if(conditiiAnd.length>0)
            conditieWhere=`where ${conditiiAnd.join(" and ")}`;
        
        let comanda=`select ${campuri.join(",")} from ${tabel} ${conditieWhere}`;
        console.error("selectAsync:",comanda);
        try{
            let rez=await this.client.query(comanda);
            console.log("selectasync: ",rez);
            return rez;
        }
        catch (e){
            console.log(e);
            return null;
        }
    }
    insert({tabel="",campuri={}} = {}, callback){
                /*
        campuri={
            nume:"savarina",
            pret: 10,
            calorii:500
        }
        */
        console.log("-------------------------------------------")
        console.log(Object.keys(campuri).join(","));
        console.log(Object.values(campuri).join(","));
        let comanda=`insert into ${tabel}(${Object.keys(campuri).join(",")}) values ( ${Object.values(campuri).map((x) => `'${x}'`).join(",")})`;
        console.log(comanda);
        this.client.query(comanda,callback)
    }

     /**
     * @typedef {object} ObiectQuerySelect - obiect primit de functiile care realizeaza un query
     * @property {string} tabel - numele tabelului
     * @property {string []} campuri - o lista de stringuri cu numele coloanelor afectate de query; poate cuprinde si elementul "*"
     * @property {string[]} conditiiAnd - lista de stringuri cu conditii pentru where
     */   
    // update({tabel="",campuri=[],valori=[], conditiiAnd=[]} = {}, callback, parametriQuery){
    //     if(campuri.length!=valori.length)
    //         throw new Error("Numarul de campuri difera de nr de valori")
    //     let campuriActualizate=[];
    //     for(let i=0;i<campuri.length;i++)
    //         campuriActualizate.push(`${campuri[i]}='${valori[i]}'`);
    //     let conditieWhere="";
    //     if(conditiiAnd.length>0)
    //         conditieWhere=`where ${conditiiAnd.join(" and ")}`;
    //     let comanda=`update ${tabel} set ${campuriActualizate.join(", ")}  ${conditieWhere}`;
    //     console.log(comanda);
    //     this.client.query(comanda,callback)
    // }

    update({tabel="",campuri={}, conditiiAnd=[]} = {}, callback, parametriQuery){
        //update({tabel:"produse", campuri:{nume:"nume_nou", pret:17}})
        let campuriActualizate=[];
        for(let prop in campuri) //parcurgem proprietatile obiectului campuri "nume", "pret" etc.
            campuriActualizate.push(`${prop}='${campuri[prop]}'`); // adaugam in array-ul campuriActualizate numele proprietatii si valoarea acesteia
        let conditieWhere="";
        if(conditiiAnd.length>0)
            conditieWhere=`where ${conditiiAnd.join(" and ")}`;
        let comanda=`update ${tabel} set ${campuriActualizate.join(", ")}  ${conditieWhere}`;
        console.log(comanda);
        this.client.query(comanda,callback)
    }

    /**
     * @typedef {object} ObiectQuerySelect - obiect primit de functiile care realizeaza un query
     * @property {string} obj.tabel - Numele tabelului.
     * @property {string[]} obj.campuri - Lista de nume de coloane care vor fi actualizate.
     * @property {any[]} obj.valori - Lista de valori corespunzătoare coloanelor specificate în `campuri`.
     * @property {string[]} obj.conditiiAnd - Lista de condiții pentru clauza WHERE.
     */

    /**
     * callback pentru queryuri.
     * @callback QueryCallBack
     * @param {Error} err Eventuala eroare in urma queryului
     * @param {Object} rez Rezultatul query-ului
     */

    /**
     * Actualizează înregistrări în baza de date cu parametri specificați.
     * @param {ObiectQuerySelect} obj - Obiect cu informațiile pentru query.
     * @param {QueryCallBack} callback - o functie callback cu 2 parametri: eroare si rezultatul queryului
     */



    updateParametrizat({tabel="",campuri=[],valori=[], conditiiAnd=[]} = {}, callback, parametriQuery){
        if(campuri.length!=valori.length)
            throw new Error("Numarul de campuri difera de nr de valori")
        let campuriActualizate=[];
        for(let i=0;i<campuri.length;i++)
            campuriActualizate.push(`${campuri[i]}=$${i+1}`);
        let conditieWhere="";
        if(conditiiAnd.length>0)
            conditieWhere=`where ${conditiiAnd.join(" and ")}`;
        let comanda=`update ${tabel} set ${campuriActualizate.join(", ")}  ${conditieWhere}`;
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1111",comanda);
        this.client.query(comanda,valori, callback)
    }

    /**
     * @typedef {object} ObiectQuerySelect - obiect primit de functiile care realizeaza un query
     * @property {string} obj.tabel - Numele tabelului.
     * @property {string[]} obj.conditiiAnd - Lista de condiții pentru clauza WHERE.
     */

    /**
     * callback pentru queryuri.
     * @callback QueryCallBack
     * @param {Error} err Eventuala eroare in urma queryului
     * @param {Object} rez Rezultatul query-ului
     */

    /**
     * Actualizează înregistrări în baza de date cu parametri specificați.
     * @param {ObiectQuerySelect} obj - Obiect cu informațiile pentru query.
     * @param {QueryCallBack} callback - o functie callback cu 2 parametri: eroare si rezultatul queryului
     */

    delete({tabel="",conditiiAnd=[]} = {}, callback){
        let conditieWhere="";
        if(conditiiAnd.length>0)
            conditieWhere=`where ${conditiiAnd.join(" and ")}`;
        
        let comanda=`delete from ${tabel} ${conditieWhere}`;
        console.log(comanda);
        this.client.query(comanda,callback)
    }

    /**
     * Execută o comandă SQL direct în baza de date.
     * @param {string} comanda - Comanda SQL de executat.
     * @param {QueryCallBack} callback - Funcție callback cu 2 parametri: eroare și rezultat al query-ului.
     */
    
    query(comanda, callback){
        this.client.query(comanda,callback);
    }

}

module.exports=AccesBD;