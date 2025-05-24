//setCookie("a",10, 1000)
function setCookie(nume, val, timpExpirare){//timpExpirare in milisecunde
    d=new Date();   // data curenta
    d.setTime(d.getTime()+timpExpirare) // adunam timpul de expirare la timestampul curent
    document.cookie=`${nume}=${val};
    expires=${d.toUTCString()}`;   // ia nume si val pe care le trimitem si seteaza data de expirare cu expires
}

function getCookie(nume){
    vectorParametri=document.cookie.split(";") // ["a=10","b=ceva"] separam cookie-urile dupa ";"
    for(let param of vectorParametri){
        if (param.trim().startsWith(nume+"="))  // ne asiguram ca luam numele complet
            return param.split("=")[1]  //parametrul este de forma "nume=valoare", deci luam valoarea
    }
    return null;
}

function deleteCookie(nume){
    console.log(`${nume}; expires=${(new Date()).toUTCString()}`)
    document.cookie=`${nume}=0; expires=${(new Date()).toUTCString()}`; // setam valoarea cookie-ului la 0 si data de expirare la data curenta,
    //  toUTCString() returneaza data in formatul UTC
}

function deleteAllCookies(){
    vectorParametri=document.cookie.split(";") // ["a=10","b=ceva"]
    for(let param of vectorParametri){
        let nume=param.split("=")[0].trim();
        deleteCookie(nume);
    }
}


window.addEventListener("load", function(){ // la evenimentul de incarcare a paginii (o singura data)
    if (getCookie("acceptat_banner")){
        document.getElementById("banner").style.display="none";
    } 
    else {
        banner.style.display = "block";
        // forțăm reflow pentru a permite declanșarea animației, mai precis forteaza browserul sa "observe" prima schimbare inainte sa inceapa animatia
        void banner.offsetWidth; // nu face nimic, doar fortam browserul sa observe prima schimbare, cream o pauza inainte de a adauga clasa de animatie
        banner.classList.add("animat");
    }

    this.document.getElementById("ok_cookies").onclick=function(){
        setCookie("acceptat_banner",true,6000); // seteaza cookie-ul acceptat_banner cu valoarea true si timp de expirare 60 secunde
        document.getElementById("banner").style.display="none" // ascunde bannerul
    }
})
