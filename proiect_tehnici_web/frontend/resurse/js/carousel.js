const toateProdusele = JSON.parse(document.getElementById("config").dataset.produse);

function alegeProduseAleatoare() {
    return toateProdusele
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);
}

function incarcaCarousel() {
    const produse = alegeProduseAleatoare();
    const container = document.querySelector("#carouselProduse .carousel-inner");
    const indicators = document.querySelector("#carouselProduse .carousel-indicators");
    container.innerHTML = "";
    indicators.innerHTML = "";

    produse.forEach((produs, i) => {
        const item = document.createElement("div");
        item.className = "carousel-item" + (i === 0 ? " active" : "");
        item.innerHTML = `
            <img src="/resurse/imagini/produse/${produs.imagine}" class="d-block w-100" alt="${produs.nume}">
            <div class="carousel-caption d-none d-md-block">
                <h5>${produs.nume}</h5>
                <p>${produs.descriere || ""} – ${produs.pret} lei</p>
            </div>`;
        container.appendChild(item);

        const indicator = document.createElement("button");
        indicator.type = "button";
        indicator.setAttribute("data-bs-target", "#carouselProduse");
        indicator.setAttribute("data-bs-slide-to", i);
        if (i === 0) indicator.classList.add("active");
        indicators.appendChild(indicator);
    });
}

incarcaCarousel();
setInterval(incarcaCarousel, 15000);

            