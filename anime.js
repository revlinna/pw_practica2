/**
 * anime.js — Página principal de índice de anime
 * Gestiona la carga desde la API/caché, filtros, paginación y listas.
 */

/* =====================================================
   Estado de la aplicación
===================================================== */
let allAnime      = [];   // Todos los anime cargados (objetos Anime)
let filteredAnime = [];   // Anime tras aplicar los filtros activos
let displayedCount = 0;   // Cuántos se muestran actualmente
let allGenres     = [];   // Lista completa de géneros [{id, name}]
let relevantGenres = new Set(); // IDs de géneros relevantes
let selectedGenres = new Set(); // IDs de géneros seleccionados

let selectedType = "";  // tipo seleccionado
let selectedStatus = ""; // estado seleccionado
let inputtedMinScore = null; // puntuación mínima introducida
//IDs de géneros seleccionados
//let currentUser;          // Objeto User del usuario logueado --------declarado en js 'menu'

// ----- elementos del DOM recuperados -----
const filterGenres = document.getElementById("genreFilters");
const selectType = document.getElementById("typeFilter");
//selectType.addEventListener("change", )
const selectStatus = document.getElementById("statusFilter");
const inputMinScore = document.getElementById("minScoreFilter");
const buttonClear = document.getElementById("clearFiltersBtn");
const sectionAnime = document.getElementById("animeContainer");

/* Añadir las funciones que consideréis necesarias*/

/* =====================================================
   Inicialización
===================================================== */
document.addEventListener('DOMContentLoaded', async function () {

    // Verificar autenticación
    ///--verificación se realiza a través del js de 'menu'

    // Cargar usuario actual
    

    showLoader(true);

    try {
        // Cargar géneros y anime (desde caché o API)
        allGenres = await loadGenres();
        console.log(allGenres);
        allAnime = await loadAnimeList();
        console.log(allAnime);
        console.log(allAnime[0]);
        allAnime.forEach(addAnimeCard);

    } catch (err) {
        console.error('Error al cargar datos:', err);
        document.getElementById('animeContainer').innerHTML =
            '<p class="no-results">Error al cargar los datos. Recarga la página.</p>';
    }

    showLoader(false);

    // Construir filtros de género
    buildGenreFilters();

    // Restaurar filtros si se viene del detalle
    restoreFilters();//maybe add IF or OR for when the user comes from detail page so its either this funcion or the defalt that creates cards for every anime in allAnime
    

    // Aplicar filtros y renderizar
    applyFiltersAndRender();

    // Eventos de los controles de filtro


    // Eventos de los botones de ordenamiento


    // Botón "Cargar más"
    
});

/* =====================================================
   Carga de datos (API + caché localStorage)
===================================================== */

/**
 * Pausa la ejecución N milisegundos (para respetar rate limits).
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Petición a la API con manejo de error 429 (rate limit).
 * Reintenta automáticamente si recibe 429.
 */
async function fetchWithRateLimit(url, retries = 3) {
    for (let attempt = 0; attempt < retries; attempt++) {
        const response = await fetch(url);
        if (response.ok) return response.json();
        if (response.status === 429) {
            console.warn(`Rate limit (429). Esperando 2s... (intento ${attempt + 1}/${retries})`);
            await delay(2000);
        } else {
            throw new Error(`Error HTTP ${response.status} al consultar ${url}`);
        }
    }
    throw new Error('Se superó el número de reintentos por rate limit.');
}

/**
 * Carga géneros desde caché o API.
 * @returns {Array} Lista de géneros [{id, name}]
 */
async function loadGenres() {
    //recupera los géneros del cache
    const cachedGenres = localStorage.getItem("storedGenres");
    //comprueba si existen generos recuperados y los devuelve desde el localStorage
    if (cachedGenres) {
        return JSON.parse(cachedGenres);
    }
    //si no hay generos almacenados, hace petición a la API
    await delay(API_DELAY_MS);
    const response = await fetchWithRateLimit(`${API_BASE}/genres/anime`);
    //guarda las dadas recibidas en cache
    localStorage.setItem("storedGenres", JSON.stringify(response.data));
    return response.data;
}


/**
 * Carga la lista de anime desde caché o API (4 páginas × 25 = 100 anime).
 * @returns {Array<Anime>} Lista de objetos Anime
 */
async function loadAnimeList() {
    // Usar caché si es válida
    //recupera los anime del cache
    const cachedAnimes = localStorage.getItem("storedAnimes");
    //comprueba si exiten animes recuperados y los devuelve desde localStorage
    if (cachedAnimes) {
        return JSON.parse(cachedAnimes);
    }

    let fetchedAnimes = [];

    for (let page = 1; page <= PAGES_TO_FETCH; page++) {
        const url  = `${API_BASE}/anime?order_by=popularity&sort=asc&limit=${ANIME_PER_PAGE}&page=${page}`;

        await delay(API_DELAY_MS);
        let response = await fetchWithRateLimit(url);
        //desestructuración para adaptar los datos estructurados con estructura própia de la API a la clase Anime local
        const mappedObjects = response.data.map(apiObject => {
            return new Anime({
                mal_id: apiObject.mal_id,
                //la API guarda en la propiedad 'título' de sus objetos el título japonés romanizado,
                //por eso aquí se ha hecho ese ~intercambio~
                title: apiObject.title_english || apiObject.title, //OR para los anime que no tienen título inglés definido
                titleJapanese: apiObject.title || "Sin título.", 
                synopsis: apiObject.synopsis,
                image_url: apiObject.images.jpg.image_url,
                type: apiObject.type,
                episodes: apiObject.episodes || 0,
                status:apiObject.status,
                score: apiObject.score,
                genres: apiObject.genres,
                aired: apiObject.aired,
                popularity: apiObject.popularity,
                rank: apiObject.rank
            })
        });
        fetchedAnimes.push(...mappedObjects);
    }
    localStorage.setItem("storedAnimes", JSON.stringify(fetchedAnimes));
    return fetchedAnimes;
}


/* =====================================================
   Funciones para control de la Caché (localStorage)
===================================================== */

//...
//...
/* Añadir las funciones que consideréis necesarias*/

/* =====================================================
   Filtros
===================================================== */

/* Añadir las funciones que consideréis necesarias*/

//define los géneros relevantes para la colección de anime
function buildGenreFilters() {
    //guarda IDs únicos de lo géneros. sirve para evitar duplicado de géneros
    let genresIDs = [];
    //itera por cada ánime en la lista
    allAnime.forEach(currentAnime => {
        //si el ánime tiene géneros definidos, añade sus IDs al array de IDs
        if (currentAnime.genres) {
            for (let currentGenre of currentAnime.genres) {
                if (!genresIDs.includes(currentGenre.mal_id)) {
                    genresIDs.push(currentGenre.mal_id);
                }
            }
        }     
    });
    //itera por el array de IDs
    //busca IDs coincidentes entre todos los géneros posibles y los realmente asociados a mínimo un ánime de la lista local
    genresIDs.forEach(currentGenreID => {
        let genreFromAllGenres = allGenres.find(genreObj => genreObj.mal_id === currentGenreID);
        //si encuentra coincidencia, crea un botón para habilitar el filtrado por este género
        if (genreFromAllGenres) {
            const buttonGenre = document.createElement("button");
            buttonGenre.className = "genre-btn";
            buttonGenre.textContent = genreFromAllGenres.name;
            //añade el ID del género al set de géneros relevantes 
            relevantGenres.add(genreFromAllGenres.mal_id);  //remove .mal_id to save objetos en el Set
            filterGenres.appendChild(buttonGenre);
        };
    });
}

console.log(relevantGenres); //just for me (remove later)

//activa/desactiva los filtros. gestiona los generos seleccionados en cada momento
function activateGenreButton(event) {
    //validación por si el usuario clica el contenedor, pero no un botón exacto
    if (!event.target.classList.contains("genre-btn")) {
        return
    };

    const clickedGenre = event.target;
    //cambia el estado activado/desactivado del botón de género
    clickedGenre.classList.toggle("active");
    //vacía el set de géneros seleccionados para una lectura limpia
    selectedGenres.clear();
    const allClickedGenres = filterGenres.querySelectorAll(".genre-btn.active"); //créditos a James Allardice por el modo de selección de múltiples clases https://stackoverflow.com/a/13672822 
    allClickedGenres.forEach(genreButton => {
        //busca el objeto de género por u nombre
        const foundGenre = allGenres.find(g => g.name === genreButton.textContent);
        if (foundGenre) {
            //añade el género al set de seleccionados
            selectedGenres.add(foundGenre.mal_id);
        }
    });
    console.log("selected genres:" + selectedGenres.size);//DELETE LATERRRRRRR
    applyFiltersAndRender();
}
filterGenres.addEventListener("click", activateGenreButton);

//gestiona el tipo de animes seleccionado en cada momento
function changeTypeSelection (event) {
    if (event.target.value === "") {
        selectedType = "";
    } else {
        selectedType = event.target.value;
    }
    applyFiltersAndRender();
}
selectType.addEventListener("change", changeTypeSelection);

//gestiona el estado de animes seleccionado
function changeStatusSelection (event) {
    if (event.target.value === "") {
        selectedStatus = "";
    }
    //traduce el valor del input al nombre de estado proporcionado por API (originalmente en inglés)
    if (event.target.value === "complete") {
        selectedStatus = "Finished Airing";
    }
    if (event.target.value === "airing") {
        selectedStatus = "Currently Airing";
    }
    if (event.target.value === "upcoming") {
        selectedStatus = "Not yet aired";
    }
    applyFiltersAndRender();
}
selectStatus.addEventListener("change", changeStatusSelection);


function applyFiltersAndRender() {
    //vacía el contenedor de tarjetas de anime (sustitución del bucle tradicional con .remove() sobre cada elemento)
    sectionAnime.textContent = ""; //créditos a un usuario no identificado de DEV https://dev.to/javascript_jeep/how-to-empty-the-dom-element-in-javascript-nf8 
    //restablece la lista si no hay ningún filtro aplicado
    if (selectedGenres.size === 0 && selectType === "") {
        allAnime.forEach(addAnimeCard);
    } else {
      //filtra el listado de allAnime por géneros, tipo, estado y puntuación
      filteredAnime = allAnime.filter(currentAnime => {
        //inicia el contador de coincidencias encontradas
        let matchesCounter = 0;
        if (currentAnime.genres) {
            //itera por cada genero del anime
            for (let genre of currentAnime.genres) {
                //si el ID del genero está en la lista de generos seleccionados, suma 1 al contador
                if (selectedGenres.has(genre.mal_id)){
                    matchesCounter++;
                }
            }
        }
        //devuelve false si el anime no reúne todos los géneros escogidos
        if (selectedGenres.size > 0 && matchesCounter !== selectedGenres.size) {
            return false;
        }
        //devuelve false si no tiene el tipo seleccionado
        if (selectedType !== "" && currentAnime.type !== selectedType) {
            return false;
        }
        //devuelve false si no tiene el estado seleccionado
        if (selectedStatus !== "" && currentAnime.status !== selectedStatus) {
            return false;
        }

        return true;
     })
     //crea una tarjeta para cada anime de la lista filtrada
     filteredAnime.forEach(addAnimeCard);
    }
};

function clearAllFilters () {
    
}
buttonClear.addEventListener("click", clearAllFilters);

/* =====================================================
   Tarjetas de Anime
===================================================== */

/** Crea el elemento HTML de una tarjeta de anime */
function addAnimeCard(anime) {
   const animeCard = document.createElement("article");
   animeCard.classList.add("anime-art");
   const animeCover = document.createElement("img");
   const animeTitle = document.createElement("h4");
   animeCover.src = anime.image_url;
   animeCover.alt = anime.title;
   animeTitle.textContent = anime.title;
   animeCard.appendChild(animeCover);
   animeCard.appendChild(animeTitle);
   sectionAnime.appendChild(animeCard);
}

//...
//...
/* Añadir las funciones que consideréis necesarias*/

/* =====================================================
   Gestión de listas
===================================================== */

/* Añadir las funciones que consideréis necesarias*/

/* =====================================================
   Loader / spinner
===================================================== */

function showLoader(visible) {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = visible ? 'flex' : 'none';
}


/* Añadir las funciones que consideréis necesarias*/


