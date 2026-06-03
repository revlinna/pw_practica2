/**
 * detail.js — Página de detalle de un anime
 * Muestra toda la información del anime seleccionado.
 * Carga el detalle completo desde la API si no está en caché.
 */

/* Añadir las funciones que consideréis necesarias*/

// ----- elementos del DOM -----
let divDetail = null;
let divSpinner = null;
const buttonBack = document.getElementById("backButton");
//botón siempre vuelve a la página 'indice' de animes
buttonBack.addEventListener("click", () => {
    window.location.href = "anime.html";
})

document.addEventListener("DOMContentLoaded", () => {
    
    divDetail = document.getElementById("detailContainer");
    divSpinner = document.querySelector("#loader");
    //extrae el ID de anime cuyos detalles se intenta acceder
    const animeRef = JSON.parse(sessionStorage.getItem("storedID"));
    //si no se ha encontrado referencia, redirige atrás
    if (!animeRef) {
        window.history.back();
        return;
    }
    //busca el objeto de ese anime
    const animeObj = allAnime.find(anm => anm.id === animeRef);
    //si encontrado, elimina el spinner de carga
    if (animeObj) {
        if (divSpinner) {
        divSpinner.remove();
        }
        showAnimeDetails(animeObj, divDetail);
    } else {
        window.alert("No se han podido cargar los detalles.");
        window.location.href = "anime.html";
    }
});
// ----- funciones -----

function showAnimeDetails (anime, container) {
    if (container) {
        //contenedor para estilizar la cebecera
        const headingDiv = document.createElement("div");
        headingDiv.classList.add("ani-heading-flex");

        const aniCover = document.createElement("img");
        aniCover.src = anime.image_url;
        aniCover.alt = anime.title;
        aniCover.classList.add("ani-cover");
        headingDiv.appendChild(aniCover);
        //contenedor para ambos títulos
        const aniTitlesBox = document.createElement("div");
        aniTitlesBox.classList.add("ani-titles-div");

        const aniH1 = document.createElement("h1");
        aniH1.textContent = anime.title;
        aniTitlesBox.appendChild(aniH1);

        const aniH2 = document.createElement("h2");
        aniH2.textContent = anime.titleJapanese;
        aniTitlesBox.appendChild(aniH2);

        const synopsisH3 = document.createElement("h3");
        synopsisH3.classList.add("ani-details");
        synopsisH3.textContent = "SINOPSIS";
        aniTitlesBox.appendChild(synopsisH3);

        const aniSynopsis = document.createElement("p");
        aniSynopsis.textContent = anime.synopsis;
        aniTitlesBox.appendChild(aniSynopsis);

        headingDiv.appendChild(aniTitlesBox);
        container.appendChild(headingDiv);
        
        const episodesH3 = document.createElement("h3");
        episodesH3.classList.add("ani-details");
        episodesH3.textContent = "EPISODIOS";
        container.appendChild(episodesH3);

        const aniEpisodes = document.createElement("p");
        aniEpisodes.textContent = anime.episodes;
        container.appendChild(aniEpisodes);

        const typeH3 = document.createElement("h3");
        typeH3.classList.add("ani-details");
        typeH3.textContent = "TIPO";
        container.appendChild(typeH3);

        const aniType = document.createElement("p");
        aniType.textContent = anime.type;
        container.appendChild(aniType);
        
        const statusH3 = document.createElement("h3");
        statusH3.classList.add("ani-details");
        statusH3.textContent = "STATUS";
        container.appendChild(statusH3);

        const aniStatus = document.createElement("p");
        aniStatus.textContent = anime.status;
        container.appendChild(aniStatus);

        const scoreH3 = document.createElement("h3");
        scoreH3.classList.add("ani-details");
        scoreH3.textContent = "PUNTUACIÓN";
        container.appendChild(scoreH3);

        const aniScore = document.createElement("p");
        aniScore.textContent = anime.score;
        container.appendChild(aniScore);

        const genresH3 = document.createElement("h3");
        genresH3.classList.add("ani-details");
        genresH3.textContent = "GÉNEROS";
        container.appendChild(genresH3);

        const aniGenres = document.createElement("div");
        aniGenres.classList.add("ani-details-div");
        for (let genre of anime.genres) {
            const animeGenre = document.createElement("p");
            animeGenre.classList.add("genre-tag");
            animeGenre.textContent = genre.name;
            aniGenres.appendChild(animeGenre);
        }
        container.appendChild(aniGenres);

        const studiosH3 = document.createElement("h3");
        studiosH3.classList.add("ani-details");
        studiosH3.textContent = "STUDIOS";
        container.appendChild(studiosH3);

        const aniStudios = document.createElement("div");
        aniStudios.classList.add("ani-details-div");
        for (let studio of anime.studios) {
            const animeStudio = document.createElement("p");
            animeStudio.classList.add("studio-tag");
            animeStudio.textContent = studio.name;
            aniStudios.appendChild(animeStudio);
        }
        container.appendChild(aniStudios);

        const airedH3 = document.createElement("h3");
        airedH3.classList.add("ani-details");
        airedH3.textContent = "AIRED";
        container.appendChild(airedH3);

        const aniAired = document.createElement("p");
        aniAired.textContent = anime.aired.string;
        container.appendChild(aniAired);

        const popularityH3 = document.createElement("h3");
        popularityH3.classList.add("ani-details");
        popularityH3.textContent = "POPULARIDAD";
        container.appendChild(popularityH3);

        const aniPopularity = document.createElement("p");
        aniPopularity.textContent = anime.popularity;
        container.appendChild(aniPopularity);

        const rankH3 = document.createElement("h3");
        rankH3.classList.add("ani-details");
        rankH3.textContent = "RANKING";
        container.appendChild(rankH3);

        const aniRank = document.createElement("p");
        aniRank.textContent = anime.rank;
        container.appendChild(aniRank);
    }
}; 
