/**
 * menu.js — Gestión del menú de navegación
 * Controla dropdowns por click (no por hover, para evitar el problema del hueco).
 * Se incluye en todas las páginas autenticadas.
 */

/**
 * Actualiza el menú con los datos del usuario actual:
 * nombre de usuario y contadores de listas.
 */

const buttonProfile = document.getElementById("menuButton");
const counterWatching = document.querySelector(".watching-count");
const counterPlan = document.querySelector(".plan-count");


//objeto User activo. resaturado desde localStorage
let activeUser = null;
// recupera el usuario actualmente loggueado
let loggedUser = localStorage.getItem("currentUser");

document.addEventListener("DOMContentLoaded", updateMenu);

//si no hay usuario loggueado, redirige a la página de login
if (!loggedUser){
    console.log("Usuario no loggueado.");
    window.location.href = "index.html";
} else {
    const userData = JSON.parse(loggedUser);
    activeUser = new User(userData);
    updateMenu();
}

function updateMenu() {
    buttonProfile.textContent = activeUser.username;
    counterWatching.textContent = activeUser.watching.list.length;
    counterPlan.textContent = activeUser.planToWatch.list.length;
}

//////just me checking stuff
const loggedUserObj = JSON.parse(loggedUser);
console.log(loggedUser);
console.log(loggedUserObj);
console.log(localStorage.getItem(loggedUserObj.name));
console.log(activeUser);








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
/**
 * Cierra la sesión del usuario y redirige al login.
 */
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";

}
buttonLogout.addEventListener("click", logout);
