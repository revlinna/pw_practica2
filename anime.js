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
let currentSort = "popularity";
//IDs de géneros seleccionados
//let currentUser;          // Objeto User del usuario logueado --------declarado en js 'menu'

// ----- elementos del DOM recuperados -----
const filterGenres = document.getElementById("genreFilters");
const selectType = document.getElementById("typeFilter");
const selectStatus = document.getElementById("statusFilter");
const inputMinScore = document.getElementById("minScoreFilter");
const buttonClear = document.getElementById("clearFiltersBtn");
const sectionAnime = document.getElementById("animeContainer");
const resultCounter = document.getElementById("resultCount");
const divSort = document.getElementById("sortOrder");

// ----- event listeners ------
if (filterGenres) {filterGenres.addEventListener("click", activateGenreButton);}
if (selectType) {selectType.addEventListener("change", changeTypeSelection);}
if (selectStatus) {selectStatus.addEventListener("change", changeStatusSelection);}
if (divSort) {divSort.addEventListener("click", changeSortOrder);}
if (inputMinScore) {inputMinScore.addEventListener("change", changeMinScoreValue);}
if (buttonClear) {buttonClear.addEventListener("click", clearAllFilters);}

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
        //si el contenedor para ánime no existe, no deja cargar las tarjetas (previene el error 'cannot read properties of null' en listas.html, enlazado con este documento para el intercambio de funciones)
        if (!sectionAnime) {
            console.log("Contenedor no existe.")
            return;
        }
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
        const parsedAnimes = JSON.parse(cachedAnimes);
        return parsedAnimes.map(planeObj => new Anime(planeObj));
        //return JSON.parse(cachedAnimes);

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

//guarda los filtros aplicados en localStorage
function saveFilters() {
    //crea un objeto con los últimos valores de filtros
    const latestFilters = {
        genres: Array.from(selectedGenres), //créditos a Oriol por el modo de hacer un set stringificable https://stackoverflow.com/a/31190928
        type: selectedType,
        status: selectedStatus,
        minScore: inputtedMinScore
    };
    localStorage.setItem("latestAnimeFilters", JSON.stringify(latestFilters));
}

//recupera los últimos filtros aplicados del localStorage
function restoreFilters() {
    const filtersFromStorage = localStorage.getItem("latestAnimeFilters");
    //detiene si no hay filtros guardados
    if (!filtersFromStorage) {
        return;
    }
    const savedFilters = JSON.parse(filtersFromStorage);
    //asigna los valores recuperados a las variables de filtros
    selectedGenres = new Set(savedFilters.genres);
    selectedType = savedFilters.type;
    selectedStatus = savedFilters.status;
    inputtedMinScore = savedFilters.minScore;
    //recupera el aspecto de botones 'género' activos
    if (selectedGenres) {
        const allGenresButtons = filterGenres.querySelectorAll(".genre-btn");
        allGenresButtons.forEach(genreButton => {
            //busca el objeto género por su nombre
            const foundGenre = allGenres.find(gnr => gnr.name === genreButton.textContent);
            //si lo encuentra y su ID estaba en el set de géneros seleccionados, imita click sobre su botón
            if (foundGenre && savedFilters.genres.includes(foundGenre.mal_id)) {
                genreButton.click();
            }
        });
    };
    //recupera el tipo escogido en el selector
    if (selectType) {selectType.value = selectedType};
    //recupera el estado escogido en el selector
    if (selectStatus) {
        if (selectedStatus === "") {
            selectStatus.value = "";
        }
        //traduce el nombre de estado poporcionado por API a valor de input equivalente en anime.html
        if (selectedStatus === "Finished Airing") {
            selectStatus.value = "complete";
        }
        if (selectedStatus === "Currently Airing") {
            selectStatus.value = "airing";
        }
        if (selectedStatus === "Not yet aired") {
            selectStatus.value = "upcoming";
        }
    }
}
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
    //selecciona los géneros activados
    const allClickedGenres = filterGenres.querySelectorAll(".genre-btn.active"); //créditos a James Allardice por el modo de selección de múltiples clases https://stackoverflow.com/a/13672822 
    allClickedGenres.forEach(genreButton => {
        //busca el objeto de género por u nombre
        const foundGenre = allGenres.find(gnr => gnr.name === genreButton.textContent);
        if (foundGenre) {
            //añade el género al set de seleccionados
            selectedGenres.add(foundGenre.mal_id);
        }
    });
    console.log("selected genres:" + selectedGenres.size);//DELETE LATERRRRRRR
    applyFiltersAndRender();
}


//gestiona el tipo de animes seleccionado en cada momento
function changeTypeSelection (event) {
    if (event.target.value === "") {
        selectedType = "";
    } else {
        selectedType = event.target.value;
    }
    applyFiltersAndRender();
}


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


//gestiona la puntuación mínima introducida
function changeMinScoreValue (event) {
    if (event.target.value === "") {
        inputtedMinScore = null;
    } else {
        inputtedMinScore = event.target.value;
    }
    applyFiltersAndRender();
}


//cambia el criterio de ordenación
function changeSortOrder (event) {
    const clickedButton = event.target;
    if (!clickedButton.hasAttribute("data-sort")) {
        return;
    }
    const activeOrder = divSort.querySelector(".btn-sort.active");
    if (activeOrder) {
        activeOrder.classList.remove("active");
    }
    clickedButton.classList.add("active");
    currentSort = clickedButton.dataset.sort; // créditos a Josh Crozier por el modo de leer el valor de atributo 'data' https://stackoverflow.com/a/33760558 
    applyFiltersAndRender();
}


function applyFiltersAndRender() {
    //vacía el contenedor de tarjetas de anime (sustitución del bucle tradicional con .remove() sobre cada elemento)
    sectionAnime.textContent = ""; //créditos a un usuario no identificado de DEV https://dev.to/javascript_jeep/how-to-empty-the-dom-element-in-javascript-nf8 
    //vacía el contador de resultados encontrados
    resultCounter.textContent = "";
    //restablece la lista si no hay ningún filtro aplicado
    if (selectedGenres.size === 0 && selectedType === "" && selectedStatus === "" && inputtedMinScore === null) {
        //ordena la lista según el criterio activo
        allAnime = sortAnimes(allAnime);
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
        //devuelve false si el anime no reúne todos los géneros seleccionados
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
        //devuelve false si no alcanza la puntuación indicada
        if (inputtedMinScore !== "" && currentAnime.score < inputtedMinScore){
            return false;
        }
        return true;
     })
     //ordena la lista según el criterio activo
     filteredAnime = sortAnimes(filteredAnime);
     //crea una tarjeta para cada anime de la lista filtrada
     filteredAnime.forEach(addAnimeCard);
     //crea un contador de resultados encontrados
     const count = document.createElement("p");
     count.textContent = "Resultados encontrados: " + filteredAnime.length;
     resultCounter.appendChild(count);
    }
    saveFilters();
};

function clearAllFilters () {
    const activeGenreButtons = filterGenres.querySelectorAll(".active");
    activeGenreButtons.forEach(button => button.classList.remove("active"));
    selectedGenres.clear();
    selectType.value = "";
    selectedType = "";
    selectStatus.value = "";
    selectedStatus = "";
    inputMinScore.value = "";
    inputtedMinScore = null;
    applyFiltersAndRender();
    localStorage.removeItem("latestAnimeFilters");
}


/* =====================================================
   Tarjetas de Anime
===================================================== */

/** Crea el elemento HTML de una tarjeta de anime */
function addAnimeCard(anime) {
   const animeCard = document.createElement("article");
   animeCard.classList.add("anime-art");
   animeCard.dataset.anid = anime.id;
   //crea la portada
   const animeCover = document.createElement("img");
   animeCover.src = anime.image_url;
   animeCover.alt = anime.title;
   animeCover.addEventListener("click", () => {
    idToSessionStorage(anime.id);
    window.location.href = "detail.html";
   })
   animeCard.appendChild(animeCover);
   //crea el título
   const animeTitle = document.createElement("h4");
   animeTitle.textContent = anime.title;
   animeTitle.addEventListener("click", () => {
    idToSessionStorage(anime.id);
    window.location.href = "detail.html";
   })
   animeCard.appendChild(animeTitle);
   //indica la popularidad
   const animeScore = document.createElement("p");   
   animeScore.textContent = anime.score;
   animeCard.appendChild(animeScore);
   //indica los géneros
   for (let genre of anime.genres) {
    const animeGenre = document.createElement("p");
    animeGenre.classList.add("genre-tag");
    animeGenre.textContent = genre.name;
    animeCard.appendChild(animeGenre);
   }
   //indica el estado
   const animeStatus = document.createElement("p");
   animeStatus.classList.add("status-tag");
   animeStatus.textContent = anime.status;
   animeCard.appendChild(animeStatus);

   //crea el botón 'viendo actualmente'
   const watchingButton = document.createElement("button");
   watchingButton.classList.add("add-to-list-btn", "forNow");
   watchingButton.textContent = "Viendo";
   //si el anime existe en la lista 'watching' del usuario, activa el boton correspondiente
   if (activeUser && activeUser.watching && activeUser.watching.hasAnime(anime.id)) {
    watchingButton.classList.add("active");
   }
   animeCard.appendChild(watchingButton);
   watchingButton.addEventListener("click", (event) => {
    //pasa a la función el evento junto con el objeto anime
    //función definida en documento 'listas'
    add_remove_UserLists(event, anime);
   })

   //crea el botón 'ver más tarde'
   const planButton = document.createElement("button");
   planButton.classList.add("add-to-list-btn", "forLater");
   planButton.textContent = "Plan";
   //si el anime existe en la lista 'plan to watch' del usuario, activa el boton correspondiente
   if (activeUser && activeUser.planToWatch && activeUser.planToWatch.hasAnime(anime.id)){
    planButton.classList.add("active");
   }
   animeCard.appendChild(planButton);
   planButton.addEventListener("click", (event) => {
    add_remove_UserLists(event, anime);
   })
   //comprueba la existencia de contenedor especifico antes de agregar la tarjeta dentro
   //contenedor existente en anime.html
   if (sectionAnime) {sectionAnime.appendChild(animeCard);}
   //contenedor existente en listas.html
   if (divContainer) {divContainer.appendChild(animeCard);}
}
/* =====================================================
   ordenado
===================================================== */
function sortAnimes(arr) {
    if (arr.length === 0){
        return [];
    } else {
        const sortedList = [...arr];
        if (currentSort === "popularity") {
            sortedList.sort((a,b) => a.popularity - b.popularity);
        }  else if (currentSort === "titleAsc") {
            sortedList.sort((a,b) => a.title.localeCompare(b.title));// créditos a Dillion Megida por comparación alfabética de strings https://www.freecodecamp.org/news/javascript-string-comparison-how-to-compare-strings-in-js/
        } else if (currentSort === "titleDesc") {
            sortedList.sort((a,b) => b.title.localeCompare(a.title));
        } else if (currentSort === "scoreDesc") {
            sortedList.sort((a,b) => b.score - a.score);
        } else if (currentSort === "scoreAsc") {
            sortedList.sort((a,b) => a.score - b.score);
        }
        return sortedList;
    }
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


