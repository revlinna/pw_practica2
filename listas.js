/**
 * listas.js — Gestión de las listas del usuario (Viendo actualmente / Plan to Watch)
 */

//let currentUser;
let activeListKey = 'watching'; // Lista activa por defecto

// ----- elementos recuperados ------
const buttonWatching = document.getElementById("btnWatching");
const buttonPlan = document.getElementById("btnPlan");
const counterW2 = document.getElementById("watchingCount2");
const counterP2 = document.getElementById("planCount2");
const divContainer = document.getElementById("listContainer");
const h2ListTitle = document.getElementById("listTitle");

// ----- event listeners -----
buttonWatching.addEventListener("click", cardsForUserList);
buttonPlan.addEventListener("click", cardsForUserList);
document.addEventListener("DOMContentLoaded", () => {
    const rute = document.location.href;
    if (rute.includes("watching")){
        if (buttonWatching) {
            buttonWatching.click();
        }
    }
    
    if (rute.includes("planToWatch")){
        if (buttonPlan) {
            buttonPlan.click();
        }
    }
});

// ----- funciones -----
//gestiona las listas del usuario
function add_remove_UserLists(event, anime) {
    const clickedButton = event.target;
    clickedButton.classList.toggle("active");
    //si el botón fue activado, intenta añadir el ánime a una de las listas, según la clase única de cada botón
    if (clickedButton.classList.contains("active")) {
        try {
            if (clickedButton.classList.contains("forNow")){
                activeUser.watching.addAnime(anime);
                console.log(`Anime ${anime.title} añadido a Viendo actualmente`);
                //comunica al usuario sobre anime añadido
                // función definida en menu.js
                createDialogBox(`Anime ${anime.title} añadido a Viendo actualmente`);
            }
            if (clickedButton.classList.contains("forLater")){
                activeUser.planToWatch.addAnime(anime);
                console.log(`Anime ${anime.title} añadido a Ver más tarde`);
                createDialogBox(`Anime ${anime.title} añadido a Ver más tarde`);
            }
        console.log(activeUser.watching.list);///RREMOVE
        } catch (error) {
            //si no se ha podido añadir a la lista, desactiva el botón
            clickedButton.classList.remove("active");
            console.log(error.message);
            return;
        }
    //si el botón fue desactivado, elimina el ánime de la lista indicada
    } else {
        if (clickedButton.classList.contains("forNow")){
                activeUser.watching.removeAnime(anime.id);
                console.log(`Anime ${anime.title} fue eliminado de Viendo actualmente`);
            }
        if (clickedButton.classList.contains("forLater")){
            activeUser.planToWatch.removeAnime(anime.id);
            console.log(`Anime ${anime.title} eliminado de Ver más tarde`);
        }
        // Elimina la tarjeta del contenedor en listas.js si existe
        const animeCard = divContainer.querySelector(`[data-anid='${anime.id}']`); //créditos a Frédéric Hamidi por el modo de insertar un valor de propiedad de objeto en cuestión como selector https://stackoverflow.com/a/4191718 
        if (animeCard) {
            animeCard.remove();
        }
    }
   //actualiza info del usuario actual
    activeUser.update();
    //actualiza el menú
    updateMenu();
    //actualiza los contadores locales
    updateLocalCounter();
}

/**
 * Crear la tarjeta de un anime dentro de la lista.
 */
function cardsForUserList(event) {
    updateLocalCounter();
    const clickedButton = event.currentTarget;
    if (!clickedButton) {
        return;
    }
    //vacía el contenedor antes de proceder
    if (divContainer) {
        divContainer.textContent = "";
    }
    //actúa según el ID de botón que provocó el evento
    if (clickedButton.id === "btnWatching") {
        //cambia el título h2 de la lista
        changeListTitle("Viendo actualmente");
        //quita el estado 'activo' del otro botón
        buttonPlan.classList.remove("active");
        //asigna el estado 'activo' al botón clicado
        buttonWatching.classList.add("active");
        //si existe user, su AnimeList 'watching' y el listado interno de ese objeto, crea tarjetas para cada anime que hay dentro
        if (activeUser && activeUser.watching && activeUser.watching.list) {
            activeUser.watching.list.forEach(addAnimeCard)
        }
    } else if (clickedButton.id === "btnPlan") {
        changeListTitle("Plan to watch");
        buttonWatching.classList.remove("active");
        buttonPlan.classList.add("active");
        if (activeUser && activeUser.planToWatch && activeUser.planToWatch.list) {
            activeUser.planToWatch.list.forEach(addAnimeCard)
        }
    }
};

//cambia el título h2 al proporcionado como parámetro
function changeListTitle(listName) {
    if (h2ListTitle) {
        h2ListTitle.textContent = listName;
    }
};
//actualiza contadores locales
function updateLocalCounter() {
    if (counterW2) {
        //asigna al valor de contador la longitud de listados del usuario
        counterW2.textContent = activeUser.watching.list.length;
    }
    if (counterP2) {
        counterP2.textContent = activeUser.planToWatch.list.length;
    }
}

/**
 * Eliminar un anime de la lista activa y actualiza la vista.
 */

