/**
 * clases.js — Clases principales de la aplicación
 * Incluye: Anime, AnimeList, User
 */

/* ===========================
   CLASE ANIME
   Representa un anime individual con toda su información.
   =========================== */
class Anime {
#mal_id;
    constructor({mal_id, title, synopsis, episodes, status, score, type, genres, studios, image_url, popularity}) {
        this.#mal_id = mal_id; 
        this.title = title;
        this.synopsis = synopsis; 
        this.episodes = episodes; 
        this.status = status;
        this.score = score;
        this.type = type; 
        this.genres = genres; 
        this.studios = studios; 
        this.image_url = image_url; 
        this.popularity = popularity;
    }

    get id() {return this.#mal_id;}

    get title() {return this._title;}
    set title(newTitle) {
        if (typeof newTitle !== 'string' || newTitle.trim() === '') {
            throw new Error("El título no puede ser vacío y debe ser una cadena de texto.")
        }
        this._title = newTitle.trim();
    } //setter hecho a partir de la propuesta de solución para PR1

    get synopsis() {return this._synopsis}
    set synopsis(newSynopsis) {
        if (typeof newSynopsis !== 'string' || newSynopsis.trim() === '') {
            throw new Error("El sínopsis no puede estar vacío y debe ser una cadena de texto.")
        }
        this._synopsis = newSynopsis.trim();
    } 

    get episodes() {return this._episodes;}
    set episodes(newTotalEpisodes) {
        if (typeof newTotalEpisodes !== "number" || newTotalEpisodes < 0) {
            throw new Error("El número de episodios debe ser un número y no puede ser menor que 0.");
        }
        this._episodes = newTotalEpisodes;
    }

    get status() {return this._status;}
    set status(newStatus) {
        if (typeof newStatus !== "string" || newType.trim() === ''){
          throw new Error("El status debe ser de tipo string.");
        }
        this._status = newStatus;
    }

    get score() {return this._score;}
    set score(newScore) {
      if (typeof newScore !== "number"){
        throw new Error("La puntuación debe ser un número.")
      }
      if (newScore >= 0 && newScore <= 10) {
        this._score = newScore;
      } else {
        throw new Error("La puntuación debe ser un número entre 0 y 10.");
      }
    }

    get type() {return this._type;}
    set type(newType) {
        if (typeof newType !== 'string' || newType.trim() === '') {
            throw new Error("El tipo no puede estar vacío y debe ser una cadena de texto.")
        }
        this._type = newType;
    }

    get genres() {return this._genres;}
    set genres(newGenres) {this._genres = Array.isArray(newGenres) ? newGenres : [];} //setter de la propuesta de solución PR1

    get studios() {return this._studios;}
    set studios(newStudios) {this._studios = Array.isArray(newStudios) ? newStudios : [];} //setter propuesta PR1

    get image_url() {return this._image_url;}
    set image_url(newUrl) {this._image_url = newUrl;} //setter propuesta PR1
    //try const isValidImgUrl = new URL(newUrl);
    //if (!isValidImgUrl) {
    //throw new Error("El URL de portada debe ser un enlace válido.")}

    get popularity() {return this._popularity;}
    set popularity(newPop) {
        if (typeof newPop !== "number"){
            throw new Error("La popularidad debe ser un número.")
        }
        this._popularity = newPop;
    }


    /** Serializa el anime a un objeto plano para localStorage */
    toJSON() {
        //...
    }

    /** Crea un Anime desde datos guardados en localStorage */
    fromJSON(data) {
        //...
    }

    /* Añadir las funciones que consideréis necesarias*/
}


/* ===========================
   CLASE ANIMELIST
   Gestiona una lista de animes (con límite opcional).
   =========================== */
class AnimeList {
    #items;
    #name;
    #maxItems;

    /* Constructor de la clase AnimeList */

    /* --- Getters --- */

    /* --- Métodos de gestión --- */

    /** Añade un anime a la lista */
    addAnime(anime) {
        //...
    }

    /** Elimina un anime por su ID */
    removeAnime(malId) {
        //...
    }

    //...

    /** Serializa la lista para localStorage */
    toJSON() {
        //...
    }

    fromJSON(data) {
        //...
    }

    /* Añadir las funciones que consideréis necesarias*/
}


/* ===========================
   CLASE USER
   Gestiona un usuario con sus listas y datos personales.
   =========================== */
class User {
    #name;
    #surname;
    #address;
    #city;
    #postalCode;
    #email;
    #username;
    #password;
    #watching;     // AnimeList — máx. 10
    #planToWatch;  // AnimeList — sin límite

    /*Constructor de la clase User */

    /* --- Getters --- */
    
    /* --- Setters --- */


    //...

    /** Guarda el usuario en localStorage (nuevo usuario) */
    save() {
        //...
    }

    /** Actualiza los datos del usuario en localStorage */
    update() {
        //...
    }

    /** Objeto plano serializable para localStorage */
    #toStorageObject() {
        //...
    }

    /** Carga un usuario desde localStorage dado su nombre de usuario */
    loadFromStorage(username) {
        //...
    }

    /* Añadir las funciones que consideréis necesarias*/
}
