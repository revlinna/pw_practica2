/**
 * index.js — Lógica de la página de login
 */

/*Este script debe de gestionar el login de los usuarios.*/

/* Añadir las funciones que consideréis necesarias*/

    // Si hay un usuario logeado, redirigimos a la página indice de Pokemons
    //...

    // Si no hay un usuario logeado, comprobamos datos de login
    //...

    // Al pulsar el boton redirigimos a la página de registro
    //...

    /* Añadir las funciones que consideréis necesarias*/

///

// ----- elementos recuperados del documento -----
const inputUsername = document.getElementById("username");
const inputPassword = document.getElementById("password");
const buttonLogin = document.getElementById("loginButton");
const buttonNewUser = document.getElementById("newUserButton");

//guarda el usuario que tiene la sessión iniciada actualmente
let loggedUser = null;

// ----- log in del usuario ----- 
function userLogIn() {
    //comprueba si existe un usuario con el apodo indicado
    const registeredUserJSON = localStorage.getItem(inputUsername.value);
    //avisa y detiene si el usuario no existe
    if (!registeredUserJSON) {
        window.alert("Usuario con este nombre no existe.")
        return;
    };
    //si existe, recupera este objeto usuario para acceder a sus propiedades
    const registeredUser = JSON.parse(registeredUserJSON);
    //si la contraseña introducida no coincide con la guardada en el objeto, avisa y detiene
    if (registeredUser.password !== inputPassword.value) {
        window.alert("Contraseña incorrecta.");
        return;
    //si coincide, actualiza el usuario actualmente loggueado
    } else {
        loggedUser = registeredUser;
        //guarda el usuario actualmente logueado en localStorage para mantener constancia de la sessión iniciada
        localStorage.setItem("currentUser", JSON.stringify(loggedUser));
        console.log("Usuario loggueado con éxito.")
        //redirecciona el usuario a la página home tras el inicio de sessión
        window.location.href = "anime.html";
    };//créditos por el modo de redirección a  Sean Collins https://es.semrush.com/blog/javascript-redirect/ 
};
buttonLogin.addEventListener("click", userLogIn);

// ----- comprueba si hay usuario ya loggueado -----
function checkLoggedUser() {
    //si existe, recupera el último usuario logueado
    const currentUserStored = localStorage.getItem("currentUser");
    if (currentUserStored) {
        //vuelve a asignar el usuario de sessión iniciada actualmente
        loggedUser = JSON.parse(currentUserStored);
        console.log("Sessión ya iniciada. Redirección del usuario.");
        //redirige al usuario a la página home diretamente
        window.location.href = "anime.html";
        return;
    } else {
        console.log("No hay sesión iniciada.");
    }
}
//llama a la función de comprobar login ya activo tras cargar el DOM
document.addEventListener("DOMContentLoaded", checkLoggedUser);

// ----- redirige a la página de registro -----
function redirectToRegister() {
    window.location.href = "registro.html";
}
buttonNewUser.addEventListener("click", redirectToRegister);


