const AccesBD=require('./accesbd.js');
const parole=require('./parole.js');

const {RolFactory}=require('./roluri.js');
const crypto=require("crypto");
const nodemailer=require("nodemailer");


class Utilizator{
    static tipConexiune="local";
    static tabel="utilizatori"
    static parolaCriptare="tehniciweb";
    static emailServer="restaurantulcelmaismecher@gmail.com";
    static lungimeCod=64;
    static numeDomeniu="localhost:8080";
    #eroare;

    /**
     * Creează un obiect de tip Utilizator.
     * @param {Object} [param={}] - Obiect cu datele utilizatorului.
     * @param {number} [param.id] - ID-ul utilizatorului.
     * @param {string} param.username - Username-ul utilizatorului.
     * @param {string} param.nume - Numele utilizatorului.
     * @param {string} param.prenume - Prenumele utilizatorului.
     * @param {string} param.email - Emailul utilizatorului.
     * @param {string} param.parola - Parola utilizatorului (în clar, înainte de criptare).
     * @param {string|object} [param.rol] - Rolul utilizatorului.
     * @param {string} [param.culoare_chat="black"] - Culoarea preferată pentru chat.
     * @param {string} [param.poza] - Numele fișierului pentru poza utilizatorului.
     */
    constructor({id, username, nume, prenume, email, parola, rol, culoare_chat="black", poza}={}) {
        this.id=id;

        //optional sa facem asta in constructor
        try{
            if(this.checkUsername(username))
                this.username = username;
            else throw new Error("Username incorect");

        }
        catch(e){ this.#eroare=e.message}

        for(let prop in arguments[0]){
            this[prop]=arguments[0][prop]
        }
        if(this.rol)
            this.rol=this.rol.cod ? RolFactory.creeazaRol(this.rol.cod) : RolFactory.creeazaRol(this.rol);
        console.log(this.rol);

        this.#eroare="";
    }

    /**
     * Verifică dacă numele este valid.
     * @param {string} nume - Numele de verificat.
     * @returns {boolean} True dacă este valid.
     */
    checkName(nume){
        return nume!="" && nume.match(new RegExp("^[A-Z][a-z]+$")) ;
    }

    /**
     * Setează numele utilizatorului după validare.
     * @param {string} nume - Nume valid.
     * @throws {Error} Dacă numele nu este valid.
     */
    set setareNume(nume){
        if (this.checkName(nume)) this.nume=nume
        else{
            throw new Error("Nume gresit")
        }
    }

    /**
     * Setează username-ul utilizatorului după validare.
     * folosit doar la inregistrare si modificare profil
     * @param {string} username - Username valid.
     * @throws {Error} Dacă username-ul nu este valid.
     */
    set setareUsername(username){
        if (this.checkUsername(username)) this.username=username
        else{
            throw new Error("Username gresit")
        }
    }

    /**
     * Verifică dacă username-ul este valid.
     * @param {string} username - Username-ul de verificat.
     * @returns {boolean} True dacă este valid.
     */
    checkUsername(username){
        return username!="" && username.match(new RegExp("^[A-Za-z0-9#_./]+$")) ;
    }

    /**
     * Criptează parola folosind algoritmul scryptSync.
     * @param {string} parola - Parola în clar.
     * @returns {string} Parola criptată în format hex.
     */
    static criptareParola(parola){
        return crypto.scryptSync(parola,Utilizator.parolaCriptare,Utilizator.lungimeCod).toString("hex");
    }

    /**
     * Salvează utilizatorul în baza de date și trimite un email de confirmare.
     */
    salvareUtilizator(){
        let parolaCriptata=Utilizator.criptareParola(this.parola);
        let utiliz=this;
        let token=parole.genereazaToken(100);
        AccesBD.getInstanta(Utilizator.tipConexiune).insert({tabel:Utilizator.tabel,
            campuri:{
                username:this.username,
                nume: this.nume,
                prenume:this.prenume,
                parola:parolaCriptata,
                email:this.email,
                culoare_chat:this.culoare_chat,
                cod:token,
                poza:this.poza}
            }, function(err, rez){
            if(err)
                console.log(err);
            else
                utiliz.trimiteMail("Te-ai inregistrat cu succes","Username-ul tau este "+utiliz.username,
            `<h1>Salut!</h1><p style='color:blue'>Username-ul tau este ${utiliz.username}.</p> <p><a href='http://${Utilizator.numeDomeniu}/cod/${utiliz.username}/${token}'>Click aici pentru confirmare</a></p>`,
            )
        });
    }
//xjxwhotvuuturmqm

    /**
     * Trimite un email utilizatorului.
     * @param {string} subiect - Subiectul emailului.
     * @param {string} mesajText - Conținutul emailului ca text simplu.
     * @param {string} mesajHtml - Conținutul emailului ca HTML.
     * @param {Object[]} [atasamente=[]] - Lista de fișiere atașate (format nodemailer).
     */
    async trimiteMail(subiect, mesajText, mesajHtml, atasamente=[]){
        var transp= nodemailer.createTransport({
            service: "gmail",
            secure: false,
            auth:{//date login 
                user:Utilizator.emailServer,
                pass:"epaudgrzrhakzlmm" //parola de la email
            },
            tls:{
                rejectUnauthorized:false
            }
        });
        //genereaza html
        await transp.sendMail({
            from:Utilizator.emailServer,
            to:this.email, //TO DO
            subject:subiect,//"Te-ai inregistrat cu succes",
            text:mesajText, //"Username-ul tau este "+username
            html: mesajHtml,// `<h1>Salut!</h1><p style='color:blue'>Username-ul tau este ${username}.</p> <p><a href='http://${numeDomeniu}/cod/${username}/${token}'>Click aici pentru confirmare</a></p>`,
            attachments: atasamente
        })
        console.log("trimis mail");
    }

    /**
     * Găsește un utilizator după username, versiune asincronă.
     * @param {string} username - Username-ul căutat.
     * @returns {Promise<Utilizator|null>} Un obiect Utilizator sau null dacă nu s-a găsit.
     */
    static async getUtilizDupaUsernameAsync(username){
        if (!username) return null;
        try{
            let rezSelect= await AccesBD.getInstanta(Utilizator.tipConexiune).selectAsync(
                {tabel:"utilizatori",
                campuri:['*'],
                conditiiAnd:[`username='${username}'`]
            });
            if(rezSelect.rowCount!=0){
                return new Utilizator(rezSelect.rows[0])
            }
            else {
                console.log("getUtilizDupaUsernameAsync: Nu am gasit utilizatorul");
                return null;
            }
        }
        catch (e){
            console.log(e);
            return null;
        }
        
    }
    
    /**
     * Găsește un utilizator după username.
     * @param {string} username - Username-ul căutat.
     * @param {Object} obparam - Obiect cu date suplimentare.
     * @param {function(Utilizator, Object, number):void} proceseazaUtiliz - Funcția callback care procesează utilizatorul.
     */

    static getUtilizDupaUsername (username,obparam, proceseazaUtiliz){
        if (!username) return null;
        let eroare=null;
        AccesBD.getInstanta(Utilizator.tipConexiune).select(
                {tabel:"utilizatori",
                campuri:['*'],
                conditiiAnd:[`username='${username}'`]}
        , function (err, rezSelect){
            let u = null;
            if(err){
                console.error("Utilizator:", err);
                //throw new Error()
                eroare=-2;
            }
            else if(rezSelect.rowCount==0){
                eroare=-1;
            } else {
            //constructor({id, username, nume, prenume, email, rol, culoare_chat="black", poza}={})
                u = new Utilizator(rezSelect.rows[0])
            }
            proceseazaUtiliz(u, obparam, eroare);
        });
    }

    /**
     * Verifică dacă utilizatorul are un anumit drept.
     * Metoda apelează intern `this.rol.areDreptul(drept)`.
     *
     * @param {Symbol} drept - Dreptul de verificat (din obiectul `Drepturi`).
     * @returns {boolean} True dacă utilizatorul are dreptul respectiv.
     */
    areDreptul(drept){
        return this.rol.areDreptul(drept);
    }

    /**
     * Actualizează datele utilizatorului în baza de date.
     * @param {Object} obNou - Obiect cu noile proprietăți.
     * @throws {Error} Dacă utilizatorul nu are id.
     */
    modifica(obNou) {
        if (!this.id) throw new Error("Utilizatorul nu există (id lipsă)");

        const campuri = {};
        for (let prop in obNou) {
            if (prop !== "id" && obNou[prop] !== undefined) {
                campuri[prop] = obNou[prop];
                this[prop] = obNou[prop]; // actualizează și în obiectul curent
            }
        }

        AccesBD.getInstanta(Utilizator.tipConexiune).update({
            tabel: Utilizator.tabel,
            campuri: campuri,
            conditiiAnd: [`id=${this.id}`]
        }, (err, rez) => {
            if (err) throw err;
        });
    }

    /**
     * Șterge utilizatorul din baza de date.
     * @throws {Error} Dacă utilizatorul nu are id.
     */
    sterge() {
        if (!this.id) throw new Error("Utilizatorul nu există (id lipsă)");

        AccesBD.getInstanta(Utilizator.tipConexiune).delete({
            tabel: Utilizator.tabel,
            conditiiAnd: [`id=${this.id}`]
        }, (err, rez) => {
            if (err) throw err;
        });
    }

    /**
     * Caută utilizatori care respectă anumite criterii.
     * @param {Object} obParam - Obiect cu criterii de căutare (ex: {username: "ionel"}).
     * @param {function(Error|null, Utilizator[]):void} callback - Funcție care primește rezultatul căutării.
     */
    static cauta(obParam, callback) {
        const conditii = [];
        for (let prop in obParam) {
            if (obParam[prop] !== undefined) {
                conditii.push(`${prop}='${obParam[prop]}'`);
            }
        }

        AccesBD.getInstanta(Utilizator.tipConexiune).select({
            tabel: Utilizator.tabel,
            campuri: ["*"],
            conditiiAnd: conditii
        }, (err, rez) => {
            if (err) callback(err, []);
            else {
                const listaUtiliz = rez.rows.map(row => new Utilizator(row));
                callback(null, listaUtiliz);
            }
        });
    }

    /**
     * Caută utilizatori (versiune asincronă).
     * @param {Object} obParam - Obiect cu criterii de căutare.
     * @returns {Promise<Utilizator[]>} Lista de utilizatori găsiți (poate fi vidă).
     */
    static async cautaAsync(obParam) {
        const conditii = [];
        for (let prop in obParam) {
            if (obParam[prop] !== undefined) {
                conditii.push(`${prop}='${obParam[prop]}'`);
            }
        }

        try {
            const rez = await AccesBD.getInstanta(Utilizator.tipConexiune).selectAsync({
                tabel: Utilizator.tabel,
                campuri: ["*"],
                conditiiAnd: conditii
            });
            return rez.rows.map(row => new Utilizator(row));
        } catch (e) {
            console.error("Eroare cautaAsync:", e);
            return [];
        }
    }    
}
module.exports={Utilizator:Utilizator}