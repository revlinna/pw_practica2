<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AniTrack — Registro</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <link rel="stylesheet" href="../css/styles.css">
</head>
<body class="auth-page">

    <div class="auth-container auth-container--wide">
        <div class="auth-header">
            <div class="auth-logo">
                <i class="fa-solid fa-user-plus"></i>
            </div>
            <h1>Crear cuenta</h1>
            <p class="auth-subtitle">Únete a AniTrack</p>
        </div>

        <form id="registerForm" class="auth-form" novalidate>

            <!-- Nombre -->
            <div class="form-group">
                <label for="name"><i class="fa-solid fa-id-card"></i> Nombre</label>
                <input type="text" id="name" name="name" placeholder="Tu nombre">
                <span class="field-error" id="nameError"></span>
            </div>

            <!-- Apellidos -->
            <div class="form-group">
                <label for="surname"><i class="fa-solid fa-id-card"></i> Apellidos</label>
                <input type="text" id="surname" name="surname" placeholder="Tus apellidos">
                <span class="field-error" id="surnameError"></span>
            </div>

            <!-- Dirección -->
            <div class="form-group">
                <label for="address"><i class="fa-solid fa-house"></i> Dirección</label>
                <input type="text" id="address" name="address" placeholder="Calle, número, piso...">
                <span class="field-error" id="addressError"></span>
            </div>

            <!-- Población -->
            <div class="form-group">
                <label for="city"><i class="fa-solid fa-city"></i> Población</label>
                <select id="city" name="city"></select>
                <span class="field-error" id="cityError"></span>
            </div>

            <!-- Código postal -->
            <div class="form-group">
                <label for="postalCode"><i class="fa-solid fa-envelope"></i> Código postal</label>
                <input type="text" id="postalCode" name="postalCode" placeholder="Ej: 03001"
                       maxlength="5">
                <span class="field-error" id="postalCodeError"></span>
            </div>

            <!-- Email -->
            <div class="form-group">
                <label for="email"><i class="fa-solid fa-at"></i> Email</label>
                <input type="text" id="email" name="email" placeholder="Escribe @ para autocompletar con @uoc.edu"
                       autocomplete="email">
                <span class="field-error" id="emailError"></span>
            </div>

            <!-- Usuario -->
            <div class="form-group">
                <label for="username"><i class="fa-solid fa-user"></i> Usuario</label>
                <input type="text" id="username" name="username" placeholder="Nombre de usuario único">
                <span class="field-error" id="usernameError"></span>
            </div>

            <!-- Contraseña -->
            <div class="form-group">
                <label for="password"><i class="fa-solid fa-lock"></i> Contraseña</label>
                <input type="password" id="password" name="password"
                       placeholder="Mín. 8 caracteres, letras, números y especiales">
                <span class="field-error" id="passwordError"></span>
            </div>

            <!-- Confirmación de contraseña -->
            <div class="form-group">
                <label for="password2"><i class="fa-solid fa-lock"></i> Repite la contraseña</label>
                <input type="password" id="password2" name="password2" placeholder="Repite la contraseña">
                <span class="field-error" id="password2Error"></span>
            </div>

            <div class="auth-buttons">
                <button type="button" id="saveButton" class="btn-primary">
                    <i class="fa-solid fa-floppy-disk"></i> Guardar
                </button>
                <button type="button" id="backToLoginButton" class="btn-secondary">
                    <i class="fa-solid fa-arrow-left"></i> Volver al login
                </button>
            </div>
        </form>
    </div>

    <script src="../js/config.js"></script>
    <script src="../js/clases.js"></script>
    <script src="../js/registro.js"></script>
</body>
</html>
