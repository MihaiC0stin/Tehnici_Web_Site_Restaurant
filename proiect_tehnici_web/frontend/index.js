const express = require('express');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const sass = require('sass');
const pg = require('pg');


const formidable=require("formidable");
const {Utilizator}=require("./module_proprii/utilizator.js")
const session=require('express-session');
const Drepturi = require("./module_proprii/drepturi.js");
const AccesBD = require('./module_proprii/accesbd.js');

const cookieParser = require('cookie-parser');

// AccesBD.getInstanta().select({tabel:"produse", campuri: ["*"]}, function(err, rez){
//     if (err){
//         console.log(err);
//     }
//     else{
//         console.log("Produse din baza de date:");
//         console.log(rez);
//     }
// })



// const Client=pg.Client;

// client=new Client({
//     database:"tehniciweb",
//     user:"mihai",
//     password:"mihai",
//     host:"localhost",
//     port:5432
// })

// client.connect()


app = express();

app.set("view engine","ejs");



console.log("__dirname:", __dirname);
console.log("__filename:", __filename);
console.log("process.cwd():", process.cwd());

app.use(cookieParser()); // pentru a putea folosi cookies

app.use("/{*any}", function(req, res, next){
    res.locals.optiuniMeniu=obGlobal.optiuniMeniu;
    next();
})

app.use("/resurse", express.static(path.join(__dirname, "resurse")));
app.use("/node_modules", express.static(path.join(__dirname, "node_modules")));


app.use((req, res, next) => {
    // verificăm dacă cookie-ul acceptat_banner există
    const acceptat = req.cookies.acceptat_banner == "true";

    const esteRutaHTML = !req.originalUrl.startsWith("/resurse") && !req.originalUrl.startsWith("/node_modules") && !req.originalUrl.startsWith("/.")
    if(acceptat && esteRutaHTML) {
        res.cookie("ultima_pagina", req.originalUrl, {
            maxAge: 30000, // 30 secunde
            httpOnly: false // permite accesul din JavaScript dacă vrei
        });
    }
    next();
});



app.get("/favicon.ico", function(req, res, next){
    res.sendFile(path.join(__dirname, "resurse/ico/favicon.ico"));
})

app.get(["/", "/index", "/home"], function(req, res, next){
    const cookiePermis = req.cookies.acceptat_banner == "true";
    const ultimaPagina = cookiePermis ? req.cookies.ultima_pagina : null ; // dacă nu există cookie, setăm o valoare implicită
    res.render("pagini/index", {ip: req.ip, imagini: obGlobal.obImagini.imagini, ultimaPagina : ultimaPagina});
});


app.get("/galerie-statica", function(req, res, next){
    res.render("pagini/galerie-statica", {imagini: obGlobal.obImagini.imagini});
});

app.get("/galerie-dinamica", function(req, res, next){
    res.render("pagini/galerie-dinamica", {imagini: obGlobal.obImagini.imagini});
});

obGlobal = {
    obErori: null,
    obImagini: null,
    folderScss: path.join(__dirname, "resurse/scss"),
    folderCss: path.join(__dirname, "resurse/css"),
    folderBackup: path.join(__dirname, "resurse/backup"),
    optiuniMeniu: null,
    lungimeNumeMin: null,
    lungimeNumeMax: null,
    pretMinim: null,
    pretMaxim: null,
    numeProduse: null,
    caloriiMin: null,
    caloriiMax: null,
    contineAlcoolOptiuni: null,
    numarProduseNonAlcool: null,
    numarProduseAlcool: null,
    lungimeDescriereMin: null,
    lungimeDescriereMax: null,
    optiuniMeseleZilei: null,
    optiuniIngrediente: null
}


// PENTRU INPUT FILTRARE nume (TEXT)
// client.query("SELECT MIN(CHAR_LENGTH(nume)) AS lungime_min, MAX(CHAR_LENGTH(nume)) AS lungime_max FROM produse;", function(err, rez){
//     if (err){
//         // console.log(err);
//         afisareEroare(res, 2);
//     }        
//     else{
//         if (rez.rowCount==0){
//                 afisareEroare(res, 404);
//             }
//         else{
//             // console.log(rez.rows);
//             obGlobal.lungimeNumeMin=parseInt(rez.rows[0].lungime_min);
//             obGlobal.lungimeNumeMax=parseInt(rez.rows[0].lungime_max);
//         }
//     }
// })

AccesBD.getInstanta().select(
    {
        tabel: "produse",
        campuri: ["MIN(CHAR_LENGTH(nume)) AS lungime_min", "MAX(CHAR_LENGTH(nume)) AS lungime_max"]
    },
    function(err, rez){
        if (err){
            afisareEroare(res, 2);
        }
        else{
            if (rez.rowCount == 0){
                afisareEroare(res, 404);
            }
            else{
                obGlobal.lungimeNumeMin = parseInt(rez.rows[0].lungime_min);
                obGlobal.lungimeNumeMax = parseInt(rez.rows[0].lungime_max);
            }
        }
    }
);


// PENTRU INPUT FILTRARE pret (RANGE)
// client.query("SELECT MIN(pret) AS pret_minim, MAX(pret) AS pret_maxim FROM produse", function(err, rez){
//     if (err){
//         // console.log(err);
//         afisareEroare(res, 2);
//     }        
//     else{
//         if (rez.rowCount==0){
//                 afisareEroare(res, 404);
//             }
//         else{
//             // console.log(rez.rows);
//             obGlobal.pretMinim=parseFloat(rez.rows[0].pret_minim);
//             obGlobal.pretMaxim=parseFloat(rez.rows[0].pret_maxim);
//         }
//     }
// })

AccesBD.getInstanta().select(
    {
        tabel: "produse",
        campuri: ["MIN(pret) AS pret_minim", "MAX(pret) AS pret_maxim"]
    },
    function(err, rez){
        if (err){
            afisareEroare(res, 2);
        }
        else{
            if (rez.rowCount == 0){
                afisareEroare(res, 404);
            }
            else{
                obGlobal.pretMinim = parseFloat(rez.rows[0].pret_minim);
                obGlobal.pretMaxim = parseFloat(rez.rows[0].pret_maxim);
            }
        }
    }
);

// PENTRU INPUT FILTRARE nume (DATALIST)
// client.query("SELECT DISTINCT nume FROM produse", function(err, rez){
//     if (err){
//         // console.log(err);
//         afisareEroare(res, 2);
//     }        
//     else{
//         if (rez.rowCount==0){
//                 afisareEroare(res, 404);
//             }
//         else{
//             // console.log(rez.rows);
//             obGlobal.numeProduse=rez.rows.map(rez => rez.nume);
//             // console.log(obGlobal.numeProduse);

//         }
//     }
// })

AccesBD.getInstanta().select(
    {
        tabel: "produse",
        campuri: ["DISTINCT nume"]
    },
    function(err, rez){
        if (err){
            afisareEroare(res, 2);
        }
        else{
            if (rez.rowCount == 0){
                afisareEroare(res, 404);
            }
            else{
                obGlobal.numeProduse = rez.rows.map(rez => rez.nume);
            }
        }
    }
);

// PENTRU INPUT FILTRARE calorii (RADIO)
// client.query("SELECT MIN(calorii) AS calorii_min, MAX(calorii) AS calorii_max FROM produse", function(err, rez){
//     if (err){
//         // console.log(err);
//         afisareEroare(res, 2);
//     }        
//     else{
//         if (rez.rowCount==0){
//                 afisareEroare(res, 404);
//             }
//         else{
//             // console.log(rez.rows);
//             obGlobal.caloriiMin=parseInt(rez.rows[0].calorii_min);
//             obGlobal.caloriiMax=parseInt(rez.rows[0].calorii_max);
//             // console.log(obGlobal.caloriiMin);
//         }
//     }
// })

AccesBD.getInstanta().select(
    {
        tabel: "produse",
        campuri: ["MIN(calorii) AS calorii_min", "MAX(calorii) AS calorii_max"]
    },
    function(err, rez){
        if (err){
            afisareEroare(res, 2);
        }
        else{
            if (rez.rowCount == 0){
                afisareEroare(res, 404);
            }
            else{
                obGlobal.caloriiMin = parseInt(rez.rows[0].calorii_min);
                obGlobal.caloriiMax = parseInt(rez.rows[0].calorii_max);
            }
        }
    }
);

// PENTRU INPUT FILTRARE contine_alcool (CHECKBOX)
AccesBD.getInstanta().query("SELECT contine_alcool, COUNT(*) AS nr FROM produse GROUP BY contine_alcool", function(err, rez){
    if (err){
        // console.log(err);
        afisareEroare(res, 2);
    }        
    else{
        if (rez.rowCount==0){
                afisareEroare(res, 404);
            }
        else{
            obGlobal.contineAlcoolOptiuni=rez.rows.map(el => el.contine_alcool);
            // console.log(obGlobal.contineAlcoolOptiuni);
            obGlobal.numarProduseNonAlcool=parseInt(rez.rows[0].nr);
            // console.log(obGlobal.numarProduseNonAlcool);
            obGlobal.numarProduseAlcool=parseInt(rez.rows[1].nr);
            // console.log(obGlobal.numarProduseAlcool);         

        }
    }
})


// PENTRU INPUT FILTRARE descriere (TEXTAREA)
// client.query("SELECT MIN(CHAR_LENGTH(descriere)) AS lungime_min, MAX(CHAR_LENGTH(descriere)) AS lungime_max FROM produse;", function(err, rez){
//     if (err){
//         // console.log(err);
//         afisareEroare(res, 2);
//     }        
//     else{
//         if (rez.rowCount==0){
//                 afisareEroare(res, 404);
//             }
//         else{
//             // console.log(rez.rows);
//             obGlobal.lungimeDescriereMin=parseInt(rez.rows[0].lungime_min);
//             obGlobal.lungimeDescriereMax=parseInt(rez.rows[0].lungime_max);
//             // console.log(obGlobal.lungimeDescriereMin);
//         }
//     }
// })

AccesBD.getInstanta().select(
    {
        tabel: "produse",
        campuri: ["MIN(CHAR_LENGTH(descriere)) AS lungime_min", "MAX(CHAR_LENGTH(descriere)) AS lungime_max"]
    },
    function(err, rez){
        if (err){
            afisareEroare(res, 2);
        }
        else{
            if (rez.rowCount == 0){
                afisareEroare(res, 404);
            }
            else{
                obGlobal.lungimeDescriereMin = parseInt(rez.rows[0].lungime_min);
                obGlobal.lungimeDescriereMax = parseInt(rez.rows[0].lungime_max);
            }
        }
    }
);

// PENTRU INPUT FILTRARE specifice_mesei_zilei (SELECT)
AccesBD.getInstanta().query("select * from unnest(enum_range(null::specifice_mesei_zilei)) as optiune_masa_zi",
    function(err, rezOptiuni){
    if (err){
        // console.log(err);
        afisareEroare(res, 2);
    }        
    else{
        if (rezOptiuni.rowCount==0){
                afisareEroare(res, 404);
            }
        else{
            // console.log(rezOptiuni.rows);
            obGlobal.optiuniMeseleZilei=rezOptiuni.rows.map(rez => rez.optiune_masa_zi);
            // console.log(obGlobal.optiuniMeseleZilei);
        }
    }
});



// PENTRU INPUT FILTRARE ingrediente (SELECT MULTIPLU)
AccesBD.getInstanta().query("SELECT DISTINCT unnest(ingrediente) AS ingredient FROM produse ORDER BY ingredient", function(err, rezOptiuni){
    if (err){
        // console.log(err);
        afisareEroare(res, 2);
    }
    else{
        if (rezOptiuni.rowCount==0){
                afisareEroare(res, 404);
            }
        else{
            // console.log(rezOptiuni.rows);
            obGlobal.optiuniIngrediente=rezOptiuni.rows.map(rez => rez.ingredient);
            // console.log(obGlobal.optiuniIngrediente);

        }
    }
});

// PENTRU SELECT DIN MENIUL DE NAVIGARE
AccesBD.getInstanta().query("select * from unnest(enum_range(null::categorie_produse)) as optiune_meniu", function(err, rezOptiuni){
    if (err){
        // console.log(err);
        afisareEroare(res, 2);
    }        
    else{
        if (rezOptiuni.rowCount==0){
                afisareEroare(res, 404);
            }
        else{
            // console.log(rezOptiuni.rows);
            obGlobal.optiuniMeniu=rezOptiuni.rows.map(rez => rez.optiune_meniu);
            // console.log(obGlobal.optiuniMeniu);
        }
    }
});





vect_foldere = ["temp", "backup", "temp1"]
for(let folder of vect_foldere){
    if (!fs.existsSync(path.join(__dirname, folder))) {
        fs.mkdirSync(path.join(__dirname, folder));
    }
}



function compileazaScss(caleScss, caleCss){
    if(!caleCss){
        // daca nu avem caleCss, o generam
        let numeFisExt=path.basename(caleScss);
        // scoatem doar numele fisierului si extensia
        let numeFis=numeFisExt.split(".")[0]   /// "a.scss"  -> ["a","scss"]
        caleCss=numeFis+".css"; /// adaugam extensia css
    }
    
    if (!path.isAbsolute(caleScss))
        caleScss=path.join(obGlobal.folderScss,caleScss ) // caleScss devine cale absoluta
    if (!path.isAbsolute(caleCss))
        caleCss=path.join(obGlobal.folderCss,caleCss ) // caleCss devine cale absoluta
    

    let caleBackup=path.join(obGlobal.folderBackup, "resurse/css");
    if (!fs.existsSync(caleBackup)) { // verifica daca exista folderul backup
        fs.mkdirSync(caleBackup,{recursive:true}) // creeaza folderul backup recursiv, adica daca nu avem folderul resurse, il creeaza, la fel si pe css
    }
    
    // la acest punct avem cai absolute in caleScss si  caleCss

    // let numeFisCss=path.basename(caleCss, ".css")+ "_" + (new Date()).getTime() + ".css"; // cu basename luam numele fisierului fara extensie, adaugam _ si apoi timestamp si extensia
    // if (fs.existsSync(caleCss)){ // verifica daca exista fisierul css
    //     fs.copyFileSync(caleCss, path.join(caleBackup, numeFisCss )); // copiaza fisierul css in folderul backup unind cele doua cai
    // }

    rez=sass.compile(caleScss, { // compileaza fisierul scss
        "sourceMap": true,
        "quietDeps": true});
    fs.writeFileSync(caleCss,rez.css);
    // fs.writeFileSync(caleScss + ".map", JSON.stringify(rez.sourceMap)); //stringify transforma un obiect JavaScript in string JSON
}

vFisiere=fs.readdirSync(obGlobal.folderScss); // citeste fisierele din folderul scss
for( let numeFis of vFisiere ){
    if (path.extname(numeFis)==".scss"){ // verifica extensia fisierului
        compileazaScss(numeFis);
    }
}


fs.watch(obGlobal.folderScss, function(eveniment, numeFis){  // asculta evenimentele din folderul scss si apeleaza functia callback
    console.log(eveniment, numeFis);
    if (eveniment=="change" || eveniment=="rename"){ // verifica daca evenimentul este de tip change sau rename
        let caleCompleta=path.join(obGlobal.folderScss, numeFis); // genereaza calea completa
        if (fs.existsSync(caleCompleta)){ // verifica daca fisierul exista
            compileazaScss(caleCompleta); // compileaza fisierul
        }
    }
})




function initErori(){
    let continut = fs.readFileSync(path.join(__dirname,"resurse/json/erori.json")).toString("utf-8");
    
    obGlobal.obErori=JSON.parse(continut)
    
    obGlobal.obErori.eroare_default.imagine=path.join(obGlobal.obErori.cale_baza, obGlobal.obErori.eroare_default.imagine)
    for (let eroare of obGlobal.obErori.info_erori){
        eroare.imagine=path.join(obGlobal.obErori.cale_baza, eroare.imagine)
    }
    // console.log(obGlobal.obErori)

}
initErori()

function pathBrowser(caleFisier) {
    return caleFisier.replaceAll("\\", "/");
}

function initImagini(){
    var continut= fs.readFileSync(path.join(__dirname,"resurse/json/galerie.json")).toString("utf-8"); // citim fisierul json ca text


    obGlobal.obImagini=JSON.parse(continut); //parsam textul in obiect javascript
    let vImagini=obGlobal.obImagini.imagini; // extragem vectorul de imagini

    let caleAbs=path.join(__dirname,obGlobal.obImagini.cale_galerie); // generam calea absoluta
    let caleAbsMediu=path.join(__dirname,obGlobal.obImagini.cale_galerie, "mediu"); // generam calea absoluta pentru mediu
    if (!fs.existsSync(caleAbsMediu))
        fs.mkdirSync(caleAbsMediu); // creaza folderul mediu
    let caleAbsMic=path.join(__dirname,obGlobal.obImagini.cale_galerie, "mic"); // generam calea absoluta pentru mic
    if (!fs.existsSync(caleAbsMic))
        fs.mkdirSync(caleAbsMic); // creaza folderul mic

    for (let imag of vImagini){ // parcurgem vectorul de imagini 1 cate 1
        [numeFis, ext]=imag.fisier_imagine.split(".");  //imaginea are numele si extensia
        let caleFisAbs=path.join(caleAbs,imag.fisier_imagine); // generam calea absoluta
        let caleFisMediuAbs=path.join(caleAbsMediu, numeFis+".webp"); // generam calea absoluta pentru mediu
        let caleFisMicAbs=path.join(caleAbsMic, numeFis+".webp"); // generam calea absoluta pentru mic
        sharp(caleFisAbs).resize(300).toFile(caleFisMediuAbs); // redimensionam imaginea la 300px
        sharp(caleFisAbs).resize(200).toFile(caleFisMicAbs); // redimensionam imaginea la 200px
        imag.fisier_imagine_mediu=pathBrowser(path.join("/", obGlobal.obImagini.cale_galerie, "mediu",numeFis+".webp" )); // generam calea pentru imaginea medie
        imag.fisier_imagine_mic=pathBrowser(path.join("/", obGlobal.obImagini.cale_galerie, "mic",numeFis+".webp" )); // generam calea pentru imaginea mica
        imag.fisier_imagine=pathBrowser(path.join("/", obGlobal.obImagini.cale_galerie, imag.fisier_imagine )); // generam calea pentru imaginea mare
    }
    // console.log(obGlobal.obImagini)
}
initImagini();


function afisareEroare(res, identificator, titlu, text, imagine){
    let eroare= obGlobal.obErori.info_erori.find(function(elem){ 
                        return elem.identificator==identificator
                    });
    if(eroare){
        if(eroare.status)
            res.status(identificator)
        var titluCustom=titlu || eroare.titlu;
        var textCustom=text || eroare.text;
        var imagineCustom=imagine || eroare.imagine;


    }
    else{
        var err=obGlobal.obErori.eroare_default
        var titluCustom=titlu || err.titlu;
        var textCustom=text || err.text;
        var imagineCustom=imagine || err.imagine;


    }
    res.render("pagini/eroare", { //transmit obiectul locals
        titlu: titluCustom,
        text: textCustom,
        imagine: imagineCustom
    })

}

app.get("/meniu", function(req, res){
    

    var conditieQuery= []; // TO DO where din parametri

    if(req.query.categorie)
        // conditieQuery=` where categorie_produs='${req.query.categorie}'`; //string in string
        conditieQuery = [`categorie_produs='${req.query.categorie}'`]; //string in array




    AccesBD.getInstanta().select(
        {
            tabel: "produse",
            campuri: ["*"],
            conditiiAnd: conditieQuery
        },
        function(err, rez){
            if (err){
                console.log(err);
                afisareEroare(res, 2);
            }
            else{
                res.render("pagini/meniu", {
                    produse: rez.rows,
                    lungimeNumeMin: obGlobal.lungimeNumeMin,
                    lungimeNumeMax: obGlobal.lungimeNumeMax,
                    pretMinim: obGlobal.pretMinim,
                    pretMaxim: obGlobal.pretMaxim,
                    numeProduse: obGlobal.numeProduse,
                    caloriiMin: obGlobal.caloriiMin,
                    caloriiMax: obGlobal.caloriiMax,
                    contineAlcoolOptiuni: obGlobal.contineAlcoolOptiuni,
                    numarProduseNonAlcool: obGlobal.numarProduseNonAlcool,
                    numarProduseAlcool: obGlobal.numarProduseAlcool,
                    lungimeDescriereMin: obGlobal.lungimeDescriereMin,
                    lungimeDescriereMax: obGlobal.lungimeDescriereMax,
                    optiuniMeseleZilei: obGlobal.optiuniMeseleZilei,
                    optiuniIngrediente: obGlobal.optiuniIngrediente
                });
            }
        }
    );
});

app.get("/produs/:id", function(req, res){ //:id este parametru de ruta, get accepta calea dinamica trimisa
//  de client /produs/ceva
    // client.query(`select * from produse where id=${req.params.id}`, function(err, rez){
    AccesBD.getInstanta().select(
        {
            tabel: "produse",
            campuri: ["*"],
            conditiiAnd: [`id=${req.params.id}`]
        },
        function(err, rez){
            if (err){
                console.log(err);
                afisareEroare(res, 2);
            }
            else{
                if (rez.rowCount==0){
                    afisareEroare(res, 404);
                }
                else{
                    // console.log(rez.rows[0]);
                    // console.log(rez.rows);
                    res.render("pagini/produs", {prod: rez.rows[0]})
                }
            }
        }
    );
});

app.post("/inregistrare",function(req, res){ // post este pentru a trimite date catre server, de obicei pentru a crea sau modifica resurse
    var username;
    var poza;
    var formular= new formidable.IncomingForm() // creaza un formular nou, IncomingForm este o clasa din formidable care se ocupa cu parsarea datelor din formular
    formular.parse(req, function(err, campuriText, campuriFisier ){//4
        console.log("Inregistrare:",campuriText);


        console.log(campuriFisier);
        console.log(poza, username);
        var eroare="";


        // TO DO var utilizNou = creare utilizator
        var utilizNou =new Utilizator();
        try{
            utilizNou.setareNume=campuriText.nume[0];
            utilizNou.setareUsername=campuriText.username[0];
            utilizNou.email=campuriText.email[0]
            utilizNou.prenume=campuriText.prenume[0]
           
            utilizNou.parola=campuriText.parola[0];
            utilizNou.culoare_chat=campuriText.culoare_chat[0];
            utilizNou.poza= poza;
            Utilizator.getUtilizDupaUsername(campuriText.username[0], {}, function(u, parametru ,eroareUser ){
                if (eroareUser==-1){//nu exista username-ul in BD
                    //TO DO salveaza utilizator
                    utilizNou.salvareUtilizator()
                }
                else{
                    eroare+="Mai exista username-ul";
                }


                if(!eroare){
                    res.render("pagini/inregistrare", {raspuns:"Inregistrare cu succes!"})
                   
                }
                else
                    res.render("pagini/inregistrare", {err: "Eroare: "+eroare});
            })
           


        }
        catch(e){
            console.log(e);
            eroare+= "Eroare site; reveniti mai tarziu";
            console.log(eroare);
            res.render("pagini/inregistrare", {err: "Eroare: "+eroare})
        }
   

    });
    formular.on("field", function(nume,val){  // 1
   
        console.log(`--- ${nume}=${val}`);
       
        if(nume=="username")
            username=val;
    })
    formular.on("fileBegin", function(nume,fisier){ //2
        console.log("fileBegin");
       
        console.log(nume,fisier);
        //TO DO adaugam folderul poze_uploadate ca static si sa fie creat de aplicatie
        //TO DO in folderul poze_uploadate facem folder cu numele utilizatorului (variabila folderUser)
        var folderUser=path.join(__dirname, "poze_uploadate", username);
        if (!fs.existsSync(folderUser))
            fs.mkdirSync(folderUser)
       
        fisier.filepath=path.join(folderUser, fisier.originalFilename)
        poza=fisier.originalFilename;
        //fisier.filepath=folderUser+"/"+fisier.originalFilename
        console.log("fileBegin:",poza)
        console.log("fileBegin, fisier:",fisier)


    })    
    formular.on("file", function(nume,fisier){//3
        console.log("file");
        console.log(nume,fisier);
    });
});

app.get(/^\/resurse\/[a-zA-Z0-9_\/]*$/, function(req, res, next){
    afisareEroare(res, 403);
})

app.get("/{*any}.ejs", function(req, res, next){
    afisareEroare(res, 400);
})



app.get("/{*any}", function(req, res, next){
    try{
        res.render("pagini"+req.url, function(err, rezultatRandare){
            if(err){
                if(err.message.startsWith("Failed to lookup view")){
                    afisareEroare(res, 404);
                }
                else {
                    afisareEroare(res);
                }
            }
            else{
                res.send(rezultatRandare);
            }
        })
    } catch(errRandare){
        if(errRandare.message.startsWith("Cannot find module")){
            afisareEroare(res, 404);
        }
        else{
            afisareEroare(res);
        }
    }
})

app.listen(8080);
console.log('Serverul a pornit pe portul 8080!');





