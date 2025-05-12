const express = require('express');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const sass = require('sass');
const pg = require('pg');

const Client=pg.Client;

client=new Client({
    database:"tehniciweb",
    user:"mihai",
    password:"mihai",
    host:"localhost",
    port:5432
})

client.connect()

app = express();

app.set("view engine","ejs");



console.log("__dirname:", __dirname);
console.log("__filename:", __filename);
console.log("process.cwd():", process.cwd());



app.use("/resurse", express.static(path.join(__dirname, "resurse")));
app.use("/node_modules", express.static(path.join(__dirname, "node_modules")));


app.get("/favicon.ico", function(req, res, next){
    res.sendFile(path.join(__dirname, "resurse/ico/favicon.ico"));
})

app.get(["/", "/index", "/home"], function(req, res, next){
    res.render("pagini/index", {ip: req.ip, imagini: obGlobal.obImagini.imagini});
});

app.get("/meniu", function(req, res, next){
    res.render("pagini/meniu")
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
    folderBackup: path.join(__dirname, "resurse/backup")
}

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

    let numeFisCss=path.basename(caleCss, ".css")+ "_" + (new Date()).getTime() + ".css"; // cu basename luam numele fisierului fara extensie, adaugam _ si apoi timestamp si extensia
    if (fs.existsSync(caleCss)){ // verifica daca exista fisierul css
        fs.copyFileSync(caleCss, path.join(caleBackup, numeFisCss )); // copiaza fisierul css in folderul backup unind cele doua cai
    }

    rez=sass.compile(caleScss, { // compileaza fisierul scss
        "sourceMap": true,
        "quietDeps": true});
    fs.writeFileSync(caleCss,rez.css);
    // fs.writeFileSync(caleScss + ".map", JSON.stringify(rez.sourceMap)); //stringify transforma un obiect JavaScript in string JSON
}

vFisiere=fs.readdirSync(obGlobal.folderScss);
for( let numeFis of vFisiere ){
    if (path.extname(numeFis)==".scss"){
        compileazaScss(numeFis);
    }
}


fs.watch(obGlobal.folderScss, function(eveniment, numeFis){
    console.log(eveniment, numeFis);
    if (eveniment=="change" || eveniment=="rename"){
        let caleCompleta=path.join(obGlobal.folderScss, numeFis);
        if (fs.existsSync(caleCompleta)){
            compileazaScss(caleCompleta);
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

app.get("/produse", function(req, res){
    // console.log(req.query)
    var conditieQuery=""; // TO DO where din parametri


    queryOptiuni=""
    client.query(queryOptiuni, function(err, rezOptiuni){
        console.log(rezOptiuni)


        queryProduse=""
        client.query(queryProduse, function(err, rez){
            if (err){
                console.log(err);
                afisareEroare(res, 2);
            }
            else{
                res.render("pagini/produse", {produse: rez.rows, optiuni:rezOptiuni.rows})
            }
        })
    });
})

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





