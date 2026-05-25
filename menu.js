/**
 * menu.js — Gestión del menú de navegación
 * Controla dropdowns por click (no por hover, para evitar el problema del hueco).
 * Se incluye en todas las páginas autenticadas.
 */

/**
 * Actualiza el menú con los datos del usuario actual:
 * nombre de usuario y contadores de listas.
 */
function updateMenu() {
    //...
}





// recupera el usuario actualmente loggueado
let loggedUser = localStorage.getItem("currentUser");
//DEACTIVATED WHILE I TEST THE ANIME LIST STUFF
//si no hay usuario loggueado, redirige a la página de login
//if (!loggedUser){
//    console.log("Usuario no loggueado.");
//    window.location.href = "index.html";
//}

//////just me checking stuff
const loggedUserObj = JSON.parse(loggedUser);
console.log(loggedUser);
console.log(loggedUserObj);
console.log(localStorage.getItem(loggedUserObj.name));








const itemDropDown = document.querySelectorAll(".dropdown");
const buttonLogout = document.getElementById("logoutButton");

//despliega los dropdowns
function revealDropDown(event) {
    const dropDownContent = event.currentTarget.querySelector(".dropdown-content");
    if (dropDownContent) {
        dropDownContent.classList.toggle("open");
    }
}// créditos a Bale por el uso de currentTarget https://medium.com/@bloodturtle/difference-between-event-target-and-event-currenttarget-0d229cc7f9eb

itemDropDown.forEach(dropDownElem => {
    dropDownElem.addEventListener("click", revealDropDown);
});

/**
 * Cierra la sesión del usuario y redirige al login.
 */
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";

}
buttonLogout.addEventListener("click", logout);