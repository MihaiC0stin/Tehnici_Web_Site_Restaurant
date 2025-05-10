const express = require('express');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const sass = require('sass');

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
    // console.log("cale:",caleCss);
    if(!caleCss){

        let numeFisExt=path.basename(caleScss);
        let numeFis=numeFisExt.split(".")[0]   /// "a.scss"  -> ["a","scss"]
        caleCss=numeFis+".css";
    }
    
    if (!path.isAbsolute(caleScss))
        caleScss=path.join(obGlobal.folderScss,caleScss )
    if (!path.isAbsolute(caleCss))
        caleCss=path.join(obGlobal.folderCss,caleCss )
    

    let caleBackup=path.join(obGlobal.folderBackup, "resurse/css");
    if (!fs.existsSync(caleBackup)) {
        fs.mkdirSync(caleBackup,{recursive:true})
    }
    
    // la acest punct avem cai absolute in caleScss si  caleCss

    let numeFisCss=path.basename(caleCss, ".css")+ "_" + (new Date()).getTime() + ".css";
    if (fs.existsSync(caleCss)){
        fs.copyFileSync(caleCss, path.join(obGlobal.folderBackup, "resurse/css",numeFisCss ));
    }
    rez=sass.compile(caleScss, {
        "sourceMap": true,
        "quietDeps": true});
    fs.writeFileSync(caleCss,rez.css);
    // fs.writeFileSync(caleScss + ".map", JSON.stringify(rez.sourceMap));

    
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
    var continut= fs.readFileSync(path.join(__dirname,"resurse/json/galerie.json")).toString("utf-8");

    obGlobal.obImagini=JSON.parse(continut);
    let vImagini=obGlobal.obImagini.imagini;

    let caleAbs=path.join(__dirname,obGlobal.obImagini.cale_galerie);
    let caleAbsMediu=path.join(__dirname,obGlobal.obImagini.cale_galerie, "mediu");
    if (!fs.existsSync(caleAbsMediu))
        fs.mkdirSync(caleAbsMediu);
    let caleAbsMic=path.join(__dirname,obGlobal.obImagini.cale_galerie, "mic");
    if (!fs.existsSync(caleAbsMic))
        fs.mkdirSync(caleAbsMic);

    //for (let i=0; i< vErori.length; i++ )
    for (let imag of vImagini){
        [numeFis, ext]=imag.fisier_imagine.split(".");
        let caleFisAbs=path.join(caleAbs,imag.fisier_imagine);
        let caleFisMediuAbs=path.join(caleAbsMediu, numeFis+".webp");
        let caleFisMicAbs=path.join(caleAbsMic, numeFis+".webp");
        sharp(caleFisAbs).resize(300).toFile(caleFisMediuAbs);
        sharp(caleFisAbs).resize(200).toFile(caleFisMicAbs);
        imag.fisier_imagine_mediu=pathBrowser(path.join("/", obGlobal.obImagini.cale_galerie, "mediu",numeFis+".webp" ));
        imag.fisier_imagine_mic=pathBrowser(path.join("/", obGlobal.obImagini.cale_galerie, "mic",numeFis+".webp" ));
        imag.fisier_imagine=pathBrowser(path.join("/", obGlobal.obImagini.cale_galerie, imag.fisier_imagine ));     
    }
    // console.log(obGlobal.obImagini)
}
initImagini();

// după initImagini(), înainte de celelalte GET-uri „catch-all”:
app.get("/galerie-animata", (req, res) => {
    // 1. toată lista de imagini
    const all = obGlobal.obImagini.imagini;
  
    // 2. filtrează doar pe cele cu indice par
    const evenImgs = all.filter((_, i) => i % 2 === 0);
  
    // 3. alege aleator o putere a lui 2 ∈ {2,4,8,16}
    const powers = [2, 4, 8, 16];
    const count  = powers[Math.floor(Math.random() * powers.length)];
  
    // 4. ia primele `count` imagini
    const images = evenImgs.slice(0, count);
  
    // 5. transmite la view
    res.render("pagini/galerie-animata", {
      images,      // array de obiecte { fisier_imagine, … }
      count,       // numărul de imagini
      delayPerImg: 5  // secunde
    });
  });

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





