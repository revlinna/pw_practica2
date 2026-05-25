/**
 * registro.js — Lógica del formulario de registro con validaciones en JavaScript
 * (sin validaciones HTML5 nativas)
 */

/* Añadir las funciones que consideréis necesarias*/

// --- elementos recuperados del documento ---
const inputName = document.getElementById("name");
const inputSurname = document.getElementById("surname");
const inputAddress = document.getElementById("address");
const selectCity = document.getElementById("city");
const inputCP = document.getElementById("postalCode");
const inputEmail = document.getElementById("email");
const inputUsername = document.getElementById("username");
const inputPassword = document.getElementById("password");
const inputPassword2 = document.getElementById("password2");
const buttonSave = document.getElementById("saveButton");
const buttonBack = document.getElementById("backToLoginButton");



// ----- relleno de las opciones del desplegable -población- -----
for (obj of cities) {
    const cityOption = document.createElement("option")
    cityOption.text = obj.name;
    cityOption.value = obj.name;
    selectCity.appendChild(cityOption)
}

// ----- autocompleta el CP tras la selección de población -----
function autoSelectCP(event) {
    const targetCity = event.target.value
    const cpByCity = cities.find(currentCity => currentCity.name === targetCity);
    if (cpByCity) {
        inputCP.value = cpByCity.postalCode; 
    }
}
selectCity.addEventListener("change", autoSelectCP);

// ----- autocompleta la población tras la selección de CP -----
function autoCompleteCity(event) {
    const targetCP = event.target.value;
    if (targetCP.length === 5){
        const cityByCP = cities.find(currentCity => currentCity.postalCode === targetCP);
        if(cityByCP) {
            selectCity.value = cityByCP.name;
        }
    }
}
inputCP.addEventListener("input", autoCompleteCity);


// ---- autocompleta el email -----
function autoCompleteEmail(event) {
    const targetInput = event.target.value;
    if (targetInput.includes("@")) {
        document.getElementById("email").value = `${targetInput}uoc.edu`;        
    }
}
inputEmail.addEventListener("input", autoCompleteEmail);

// ----- comprueba la existencia de nombre de usuario -----
function existentUsername(event) {
    const usernameExists = localStorage.getItem(event.target.value.trim());
    if (usernameExists) {
       inputUsername.value = '';
       inputUsername.placeholder = "Nombre ya existente. Pon nombre de usuario único."
    }
}
inputUsername.addEventListener("blur", existentUsername);

// ----- comprueba la contraseña repetida -----
function matchingPasswords(event) {
    const targetPassword2 = event.target.value
    if (targetPassword2 !== inputPassword.value) {
        inputPassword2.value = '';
        inputPassword2.placeholder = "Contraseñas no coinciden. Introdúce de nuevo.";
    }
}
inputPassword2.addEventListener("blur", matchingPasswords);

// ----- validación de campos rellenados y conservación -----
function checkInputs() {
    const fillableInputs = document.querySelectorAll("input");
    let filled = true;
    fillableInputs.forEach(currentInput => {
        if (currentInput.value.trim() === '') {
            filled = false;
        }
    });

    if (!filled) {
        window.alert("Por favor, rellene todos los campos.");
        return;
    }
    
    try {
        const user = new User({
            name: inputName.value.trim(),
            surname: inputSurname.value.trim(),
            address: inputAddress.value.trim(),
            city: selectCity.value,
            postalCode: inputCP.value.trim(),
            email: inputEmail.value.trim(),
            username: inputUsername.value.trim(),
            password: inputPassword.value 
        })
        user.save();
        window.alert("Usuario guardado con éxito.");
        console.log("Usuario guardado: " + localStorage.getItem(inputUsername.value.trim()));
        window.location.href = "index.html";

    } catch (error) {
        if (error.message.includes("correo")){
            window.alert("El correo electrónico debe seguir el formato 'correo@dominio.com'")
        }
        if (error.message.includes("contraseña")){
            window.alert("La contraseña debe contener como mínimo 8 carácteres: letras, numeros y al menos un carácter especial #?!@$%^&*-.")
        }
        console.log(error.message);
    }
}
buttonSave.addEventListener("click", checkInputs);

// ----- volver a la página login -----
function redirrectToIndex() {
    window.location.href = "index.html";
}
buttonBack.addEventListener("click", redirrectToIndex);
