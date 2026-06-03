/**
 * menu.js — Gestión del menú de navegación
 * Controla dropdowns por click (no por hover, para evitar el problema del hueco).
 * Se incluye en todas las páginas autenticadas.
 */

//objeto User activo. resaturado desde localStorage
let activeUser = null;
// recupera el usuario actualmente loggueado
let loggedUser = localStorage.getItem("currentUser");

// ----- elementos del DOM restaurados -----
const buttonProfile = document.getElementById("menuButton");
const counterWatching = document.querySelector(".watching-count");
const counterPlan = document.querySelector(".plan-count");
const itemDropDown = document.querySelectorAll(".dropdown");
const buttonLogout = document.getElementById("logoutButton");

// ----- event listeners -----
buttonLogout.addEventListener("click", logout);
document.addEventListener("DOMContentLoaded", updateMenu);
itemDropDown.forEach(dropDownElem => {
    dropDownElem.addEventListener("click", revealDropDown);
});

// ----- inicialización -----
//si no hay usuario loggueado, redirige a la página de login
if (!loggedUser){
    console.log("Usuario no loggueado.");
    window.location.href = "index.html";
} else {
    const userData = JSON.parse(loggedUser);
    activeUser = new User(userData);
    updateMenu();
}

// ----- funciones -----
//----- actualiza el menu con dadas del usuario -----
function updateMenu() {
    buttonProfile.textContent = activeUser.username;
    counterWatching.textContent = activeUser.watching.list.length;
    counterPlan.textContent = activeUser.planToWatch.list.length;
}

// ----- despliega los dropdowns ----- 
function revealDropDown(event) {
    const dropDownContent = event.currentTarget.querySelector(".dropdown-content");
    if (dropDownContent) {
        dropDownContent.classList.toggle("open");
    }
}// créditos a Bale por el uso de currentTarget https://medium.com/@bloodturtle/difference-between-event-target-and-event-currenttarget-0d229cc7f9eb

// ----- crea un diálogo de comunicación al usuario sobre el estado del sistema ----- 
function createDialogBox(string) {
    const dialogBox = document.createElement("dialog");
    dialogBox.classList.add("user-msg");
    dialogBox.textContent = string;
    document.body.appendChild(dialogBox);
    dialogBox.show();
    setTimeout(() => {
        dialogBox.close();
        dialogBox.remove();
    }, 4000);
}

// ----- Cierra la sesión del usuario y redirige al login.
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}
