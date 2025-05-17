window.onload = function() {
    btn = document.getElementById("filtrare");
    btn.onclick = function() {
        let inpNume = document.getElementById("inp-nume").value.trim().toLowerCase();

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

        let inpPret = document.getElementById("inp-pret").value;

        let inpCategorie = document.getElementById("inp-categorie").value.trim().toLowerCase();

        let produse = document.getElementsByClassName("produs");

        for (let prod of produse) {

            prod.style.display = "none";

            let nume = prod.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase();

            let cond1 = (nume.startsWith(inpNume));

            let calorii = parseInt(prod.getElementsByClassName("val-calorii")[0].innerHTML.trim().toLowerCase());

            let cond2 = ((inpCalorii == "toate") || (calorii >= minCalorii && calorii < maxCalorii));

            let pret = parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML.trim().toLowerCase());

            let cond3 = (inpPret <= pret);

            let categorie = prod.getElementsByClassName("val-categorie")[0].innerHTML.trim().toLowerCase();

            let cond4 = (inpCategorie == "oricand" || inpCategorie == categorie);


            if (cond1 && cond2 && cond3 && cond4) {
                prod.style.display = "block";
            }    
        }
    }


    document.getElementById("inp-pret").onchange = function() {
        document.getElementById("infoRange").innerHTML = `(${this.value})`; //string literals
    }

    document.getElementById("resetare").onclick = function() {
        
        if(confirm("Sigur doriti sa resetati filtrele?") == false)
            return;
        document.getElementById("inp-nume").value = "";
        document.getElementById("inp-pret").value = 0;
        document.getElementById("infoRange").innerHTML = "(0)";
        document.getElementById("inp-categorie").value = "oricand";

        let vectRadio = document.getElementsByName("gr_rad");
        for (let rad of vectRadio) {
            if (rad.value == "toate") {
                rad.checked = true;
                break;
            }
        }

        let produse = document.getElementsByClassName("produs");
        for (let prod of produse) {
            prod.style.display = "block";
        }
    }

    document.getElementById("sortCrescNume").onclick = function() {
        sorteaza(1);
    }
    document.getElementById("sortDescrescNume").onclick = function() {
        sorteaza(-1);
    }

    function sorteaza(semn) {
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
}