window.onload = function() {
    let produseNesortate = document.getElementsByClassName("produs");  // HTMLCollection
    let vectorProduseNesortate = Array.from(produseNesortate);         // Array.from() - transforma un HTMLCollection intr-un array
    btn = document.getElementById("filtrare");

    function filtreazaProduse() {

        let validareInpNume = document.getElementById("inp-nume").value.trim().toLowerCase();
        let validareInpDescriere = document.getElementById("inp-descriere").value.trim().toLowerCase();
        let validareInpNumeCuAutocomplete = document.getElementById("inp-nume-cu-autocomplete").value.trim().toLowerCase();

        let regexCaractereInterziseText = /[<>\"'\/\\&=;]/;

        if(regexCaractereInterziseText.test(validareInpNume)){
            document.getElementById("mesaj-eroare-inp-nume").textContent = "Numele contine caractere interzise.";
            return;
        }

        if(regexCaractereInterziseText.test(validareInpDescriere)){
            document.getElementById("mesaj-eroare-inp-descriere").textContent = "Descrierea contine caractere interzise.";
            return;
        }

        if(regexCaractereInterziseText.test(validareInpNumeCuAutocomplete)){
            document.getElementById("mesaj-eroare-inp-nume-cu-autocomplete").textContent = "Numele cu autocomplete contine caractere interzise.";
            return;
        }

        document.getElementById("mesaj-eroare-inp-nume").textContent = "";
        document.getElementById("mesaj-eroare-inp-descriere").textContent = "";
        document.getElementById("mesaj-eroare-inp-nume-cu-autocomplete").textContent = "";

            

        let inpNume = document.getElementById("inp-nume").value.trim().toLowerCase();
        let startInpNume ="";
        let endInpNume = "";
        if(inpNume.includes("*")) 
            {
                [startInpNume, endInpNume] = inpNume.split("*");
            }
        else {
            startInpNume = inpNume;
            endInpNume = "";
        }


        let inpDescriere = Array.from(document.getElementById("inp-descriere").value.trim().toLowerCase().split(/[\s,\.]+/)); // split(/[\s,\.]+/) - desparte stringul in functie de spatii, virgule si puncte
        let inpNumeCuAutocomplete = document.getElementById("inp-nume-cu-autocomplete").value.trim().toLowerCase();
        let inpIngredienteExcluse = Array.from(document.getElementById("inp-ingrediente-excluse").selectedOptions).map(opt => opt.value.trim().toLowerCase());


        let vectRadio = document.getElementsByName("gr_rad");
        let inpCalorii = null;
        let minCalorii = null;
        let maxCalorii = null;
   
        for (let rad of vectRadio) {
            if (rad.checked) {
                inpCalorii= rad.value;
                

                if (inpCalorii != "toate") {
                    [minCalorii, maxCalorii] = inpCalorii.split(":")
                    minCalorii = parseInt(minCalorii);
                    maxCalorii = parseInt(maxCalorii);
                }
                break;
            }
        }

        let inpPretMinim = document.getElementById("inp-pret-minim").value;

        let inpPretMaxim = document.getElementById("inp-pret-maxim").value;

        let inpCategorie = document.getElementById("inp-categorie").value.trim().toLowerCase();

        let inpAlcool = document.getElementById("inp-alcool").checked;

        let produse = document.getElementsByClassName("produs");

        for (let prod of produse) {

            prod.style.display = "none";

            let nume = prod.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase();

            let cond1 = (nume.startsWith(startInpNume) && nume.endsWith(endInpNume));

            let descriere = prod.getElementsByClassName("val-descriere")[0].innerHTML.trim().toLowerCase();

            let cond2 = inpDescriere.every(ing => descriere.includes(ing));

            let cond3 = (!inpNumeCuAutocomplete) || (nume == inpNumeCuAutocomplete);

            let ingrediente = prod.getElementsByClassName("val-ingrediente")[0].innerHTML.trim().toLowerCase();

            let cond4 = !(inpIngredienteExcluse.some(ing => ingrediente.includes(ing)));

            let calorii = parseInt(prod.getElementsByClassName("val-calorii")[0].innerHTML.trim().toLowerCase());

            let cond5 = ((inpCalorii == "toate") || (calorii >= minCalorii && calorii < maxCalorii));

            let pret = parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML.trim().toLowerCase());

            let cond6 = (inpPretMinim <= pret);

            let cond7 = (inpPretMaxim >= pret);

            let categorie = prod.getElementsByClassName("val-categorie")[0].innerHTML.trim().toLowerCase();

            let cond8 = (inpCategorie == "oricand" || inpCategorie == categorie);

            let alcool = prod.getElementsByClassName("val-contine-alcool")[0].innerHTML.trim().toLowerCase();

            let cond9 = (inpAlcool == true || (!inpAlcool && alcool == "nu"));


            if (cond1 && cond2 && cond3 && cond4 && cond5 && cond6 && cond7 && cond8 && cond9) {
                prod.style.display = "block";
            }    
        }
    }

    document.getElementById("inp-nume").addEventListener("input", filtreazaProduse); 
    document.getElementById("inp-descriere").addEventListener("input", filtreazaProduse);
    document.getElementById("inp-nume-cu-autocomplete").addEventListener("input", filtreazaProduse);
    document.getElementById("inp-pret-minim").addEventListener("input", filtreazaProduse);
    document.getElementById("inp-pret-maxim").addEventListener("input", filtreazaProduse);
    document.getElementById("inp-categorie").addEventListener("change", filtreazaProduse);
    document.getElementById("inp-alcool").addEventListener("change", filtreazaProduse);
    document.getElementById("inp-ingrediente-excluse").addEventListener("change", filtreazaProduse);

    Array.from(document.getElementsByName("gr_rad")).forEach(rad => {
        rad.addEventListener("change", filtreazaProduse);
    });


    document.getElementById("filtrare").onclick = filtreazaProduse


    document.getElementById("inp-pret-minim").oninput = function() {
        document.getElementById("infoRangeMinim").innerHTML = `(${this.value})`; //string literals
    }

    document.getElementById("inp-pret-maxim").oninput = function() {
        document.getElementById("infoRangeMaxim").innerHTML = `(${this.value})`; //string literals
    }

    document.getElementById("resetare").onclick = function() {
        if(confirm("Sigur doriti sa resetati filtrele?") == false)
            return;
        document.getElementById("inp-nume").value = "";
        document.getElementById("inp-descriere").value = "";
        document.getElementById("inp-nume-cu-autocomplete").value = "";
        document.getElementById("inp-pret-minim").value = 0;
        document.getElementById("infoRangeMinim").innerHTML = "(0)";
        document.getElementById("inp-pret-maxim").value = 70;
        document.getElementById("infoRangeMaxim").innerHTML = "(70)";
        document.getElementById("inp-categorie").value = "oricand";
        document.getElementById("inp-alcool").checked = true;

        document.getElementById("mesaj-eroare-inp-nume").textContent = "";
        document.getElementById("mesaj-eroare-inp-descriere").textContent = "";
        document.getElementById("mesaj-eroare-inp-nume-cu-autocomplete").textContent = "";

        let vectRadio = document.getElementsByName("gr_rad");
        for (let rad of vectRadio) {
            if (rad.value == "toate") {
                rad.checked = true;
                break;
            }
        }

        let inpIngredienteExcluse = document.getElementById("inp-ingrediente-excluse");
        for(let opt of inpIngredienteExcluse.options) {
            opt.selected = false;
        }



        for (let prod of vectorProduseNesortate) {
            prod.parentNode.appendChild(prod);
            prod.style.display = "block";
        }
    }

    document.getElementById("sortCrescNume").onclick = function() {
        sorteazaPretNume(1);
    }
    document.getElementById("sortDescrescNume").onclick = function() {
        sorteazaPretNume(-1);
    }

    document.getElementById("sortCrescNumeDescriere").onclick = function() {
        sorteazaNumeDescriere(1);
    }
    document.getElementById("sortDescrescNumeDescriere").onclick = function() {
        sorteazaNumeDescriere(-1);
    }


    function sorteazaPretNume(semn) {
        let produse = document.getElementsByClassName("produs");  // HTMLCollection
        let vectorProduse = Array.from(produse);                  // Array.from() - transforma un HTMLCollection intr-un array
        vectorProduse.sort(function(a, b) { // a si b elemente tip article

            let pretA = parseFloat(a.getElementsByClassName("val-pret")[0].innerHTML.trim().toLowerCase());
            let pretB = parseFloat(b.getElementsByClassName("val-pret")[0].innerHTML.trim().toLowerCase());
            if (pretA != pretB) {
                return semn*(pretA - pretB); // -1 a < b 1 a > b
            }

            let numeA = a.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase();
            let numeB = b.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase();
            return semn*numeA.localeCompare(numeB); // -1 a < b 1 a > b
        });

        for (let prod of vectorProduse) {
            prod.parentNode.appendChild(prod);
        }
        
    }



    function sorteazaNumeDescriere(semn) {
        let produse = document.getElementsByClassName("produs");  // HTMLCollection
        let vectorProduse = Array.from(produse);                  // Array.from() - transforma un HTMLCollection intr-un array
        vectorProduse.sort(function(a, b) { // a si b elemente tip article
            let numeA = a.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase();
            let numeB = b.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase();
            if (numeA != numeB) {
                return semn*numeA.localeCompare(numeB); // -1 a < b 1 a > b
            }
            let descriereA = a.getElementsByClassName("val-descriere")[0].innerHTML.trim().toLowerCase();
            let descriereB = b.getElementsByClassName("val-descriere")[0].innerHTML.trim().toLowerCase();
            return semn*(descriereA.length - descriereB.length); // -1 a < b 1 a > b
        });

        for (let prod of vectorProduse) {
            prod.parentNode.appendChild(prod);
        }
    }

    window.onkeydown = function(e) {
        if(e.key == "c" && e.altKey) {
            let produse = document.getElementsByClassName("produs");
            let sumaPreturi = 0;
            for (let prod of produse) {
                if(prod.style.display != "none"){
                    sumaPreturi += parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML.trim().toLowerCase());
                }
            }
            if(!document.getElementById("suma_preturi")){
                let pRezultat = document.createElement("p");
                pRezultat.innerHTML = `Suma preturilor produselor afisate este: ${sumaPreturi}`;
                pRezultat.id = "suma_preturi";
                let p = document.getElementById("p-suma");
                p.parentElement.insertBefore(pRezultat, p.nextElementSibling);
                setTimeout(function() {
                    let p1=document.getElementById("suma_preturi");
                    if(p1)
                        p1.remove();
                }, 2000);
            }
        }
    }

    document.getElementById("p-suma-selectat").onclick = function() {
        let produseSelectate = Array.from(document.getElementsByClassName("select-cos")) // facem din HTMLCollection un array, cu elemente HTMLInputElement
        .filter(cb => cb.checked) // filtram dupa propietatea checked, cb ia fiecare element din array
        .map(cb => cb.parentElement.parentElement); // mapam fiecare element din array la parintele parintelui -> selecteaza-cos -> produs,
        //  map transforma fiecare element din array in altul
        console.log(produseSelectate);
        let sumaPreturi = 0;
        for (let prod of produseSelectate) {
            if(prod){
                sumaPreturi += parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML.trim().toLowerCase());
            }
        }
        if(!document.getElementById("suma_pret_produse_selectate")){
            let pRezultat = document.createElement("p");
            pRezultat.innerHTML = `Suma preturilor produselor afisate este: ${sumaPreturi}`; // ${} este un string literal
            pRezultat.id = "suma_pret_produse_selectate";
            let p = document.getElementById("p-suma-selectat");
            p.parentElement.insertBefore(pRezultat, p.nextElementSibling);
            setTimeout(function() {
                let p1=document.getElementById("suma_pret_produse_selectate");
                if(p1)
                    p1.remove();
            }, 2000);
        }
    }
}