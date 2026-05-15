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
  _title;
  _titleJapanese;
  _synopsis;
  _image_url;
  _type;
  _episodes;
  _status;
  _score;
  _genres;
  _studios;
  _aired;
  _popularity;
  _rank;
  
  constructor({mal_id, title, titleJapanese, synopsis, image_url, type, episodes, status, score, genres, studios, aired, popularity, rank}) {
        this.#mal_id = mal_id; 
        this.title = title;
        this.titleJapanese = titleJapanese;
        this.synopsis = synopsis; 
        this.image_url = image_url; 
        this.episodes = episodes; 
        this.type = type; 
        this.status = status;
        this.score = score;
        this.genres = genres; 
        this.studios = studios;
        this.aired = aired;
        this.popularity = popularity;
        this.rank = rank;
    }
    
  get id() {return this.#mal_id;}

    get title() {return this._title;}
    set title(newTitle) {
        if (typeof newTitle !== 'string' || newTitle.trim() === '') {
            throw new Error("El título no puede estar vacío y debe ser una cadena de texto.")
        }
        this._title = newTitle.trim();
    } //setter hecho a partir de la propuesta de solución para PR1

    get titleJapanese() {return this._titleJapanese;}
    set titleJapanese(newTitleJapanese) {
        if (typeof newTitleJapanese !== 'string' || newTitleJapanese.trim() === '') {
            console.warn("El título en japonés no debe estar vacío y debe ser una cadena de texto.")
        } else {
        this._titleJapanese = newTitleJapanese.trim();
    }
   }

    get synopsis() {return this._synopsis}
    set synopsis(newSynopsis) {
        if (typeof newSynopsis !== 'string' || newSynopsis.trim() === '') {
            console.warn("El sínopsis no debe estar vacío y debe ser una cadena de texto.")
        } else {
        this._synopsis = newSynopsis.trim();
        }
    }
  
    get image_url() {return this._image_url;}
    set image_url(newUrl) {
        try {
            new URL(newUrl);
            this._image_url = newUrl;
        } catch {
            throw new Error("El URL de portada debe ser un enlace válido.")
        }
    } //créditos a Udemezue John por la validación de URL https://dev.to/theudemezue/how-to-validate-url-in-javascript-2ipi 

    get episodes() {return this._episodes;}
    set episodes(newTotalEpisodes) {
        if (typeof newTotalEpisodes !== "number" || newTotalEpisodes < 0) {
            throw new Error("El número de episodios debe ser un número y no puede ser menor que 0.");
        }
        this._episodes = newTotalEpisodes;
    }
  
    get type() {return this._type;}
    set type(newType) {
        if (typeof newType !== 'string' || newType.trim() === '') {
            throw new Error("El tipo no puede estar vacío y debe ser una cadena de texto.")
        }
        this._type = newType;
    }

    get status() {return this._status;}
    set status(newStatus) {
        if (typeof newStatus !== "string" || newStatus.trim() === ''){
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

    get genres() {return this._genres;}
    set genres(newGenres) {this._genres = Array.isArray(newGenres) ? newGenres : [];} //setter de la propuesta de solución PR1

    get studios() {return this._studios;}
    set studios(newStudios) {this._studios = Array.isArray(newStudios) ? newStudios : [];} //setter propuesta PR1

    get aired() {return this._aired;}
    set aired(newAirDate) {this._aired = newAirDate;}

    get popularity() {return this._popularity;}
    set popularity(newPop) {
        if (typeof newPop !== "number" || newPop < 0){
            console.warn("La popularidad debe ser un número mayor que 0.")
        } else {
        this._popularity = newPop;
        }
    }

    get rank() {return this._rank;}
    set rank(newRank) {this._rank = newRank;}


    /** Serializa el anime a un objeto plano para localStorage */
   toJSON() {
        return {
          mal_id: this.id,
          //con el operador OR se asigna un valor de sustitución en caso de ausencia de valor de la propiedad.
          //con este valor de sustitución la propiedad sin valor no será borrada del texto por JSON.stringify(). 
          title: this.title || "Sin título.", 
          titleJapanese: this.titleJapanese || "Sin título en japonés.",
          synopsis: this.synopsis || "Sin sinópsis.",
          image_url: this.image_url || "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/960px-Placeholder_view_vector.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail",
          episodes: this.episodes || 0,
          type: this.type || "Sin tipo.",
          status: this.status || "Sin estado.",
          score: this.score || 0,
          genres: this.genres || [],
          studios: this.studios || [],
          aired: this.aired || 0,
          popularity: this.popularity || 0,
          rank: this.rank || 0
        } //créditos a Adam Coster por la estructura de toJSON https://adamcoster.com/blog/how-to-stringify-class-instances-in-javascript-and-express-js .
        //créditos a Christian C. Salvadó por el modo de uso de operador OR https://stackoverflow.com/a/3088161 .
    }

    /** Crea un Anime desde datos guardados en localStorage */
    fromJSON(data) {
       const dataFromJSON = JSON.parse(data);
       return new Anime(dataFromJSON);  
    }

    /* Añadir las funciones que consideréis necesarias*/
}


/* ===========================
   CLASE ANIMELIST
   Gestiona una lista de animes (con límite opcional).
   =========================== */
class AnimeList {
  #list;
  #name;
  #maxItems;
    constructor(name, maxItems){
      this.#list = [];
      this.#name = name;
      this.#maxItems = maxItems;
    }
//permite la lectura de datos por funciones fuera de la clase
  get list() {return this.#list;}
  
  get name() {return this.#name;}
  set name(newName) {
        if (typeof newName !== 'string' || newName.trim() === '') {
            throw new Error("El nombre no puede estar vacío y debe ser una cadena de texto.")
        }
        this.#name = newName.trim();
    }
  
  get maxItems() {return this.#maxItems;}
  set maxItems(newMaximum) {
    if (typeof newMaximum !== "number" || newMaximum < 0){
      throw new Error("La capacidad máxima debe ser un número mayor que 0.")
    }
    this.#maxItems = newMaximum;
  }
  
//añade un objeto Anime a la lista
    addAnime(anime) {
      if (anime instanceof Anime){
        if (!this.#list.includes(anime)){
        this.#list = [...this.#list, anime];
        console.log(`El anime ${anime.title} fue correctamente añadido a la lista de animes.`);
      } else {
        console.log(`El anime ${anime.title} ya existe en la lista.`);
      }
    } else {
      throw new Error("El parámetro no pertenece a la clase Anime");
    }
    }
//elimina un objeto Anime de la lista
    removeAnime(animeId) {
      if (typeof animeId === "number" ) {
        //variable usada luego para detectar si hubo cambio en la lista
        let originalLength = this.#list.length;
        //sustituye la lista original por una sin el anime indicado
        this.#list = this.#list.filter((currentAnime) => currentAnime.id !== animeId);
        if (this.#list.length < originalLength) {
          console.log("El anime indicado fue correctamente eliminado de la lista.")
        } else {
          console.log("El anime indicado no existe en la lista.")
        }
      } else {
        throw  new Error("El ID debe ser un número.")
      }
    }
//muestra info básica sobre cada Anime guardado en la lista
    showList() {
      console.log("La biblioteca contiene siguientes animes:")
      this.#list.forEach((currentAnime) => {
        console.log(`Título: ${currentAnime.title}. Tipo: ${currentAnime.type}. Puntuación: ${currentAnime.score}. Portada: ${currentAnime.image_url}`)
      })
    }
//añade multiples objetos Anime a la lista
    addMultipleAnimes = (...animes) => {animes.forEach((currentAnime) => {
      if (currentAnime instanceof Anime) { //comprueba la clase de cada parámetro pasado
        this.addAnime(currentAnime) //uso de 'this' en vez de 'this.#list' para no modificar la lista directamente
      } else {
        throw new Error("El parámetro no pertenece a la clase Anime.");
      }
    })
    };
//busca Animes según un rango de puntuación
    getAnimesByScoreRange = (minScore, maxScore) => {
      if (typeof minScore === 'number' && typeof maxScore === 'number') {
        // cambia el orden de valores del rango en caso de estar introducidos al revés. 
        if (minScore > maxScore) {
          [minScore, maxScore] = [maxScore, minScore]; //el modo de hacer swap se ha encontrado en este hilo https://stackoverflow.com/questions/16201656/how-to-swap-two-variables-in-javascript
        }
        const filteredList = this.#list.filter((currentAnime) => currentAnime.score >= minScore && currentAnime.score <= maxScore);
        return filteredList;
      } else {
        throw new Error("Puntuaciones minScore y maxScore deben ser unos números.")
      }
    };
//ordena los animes según su popularidad descendente
   sortAnimesByPopularity = () => {
     if (this.#list.length > 0) {
       const sortedList = [...this.#list].sort((a,b) => b.popularity - a.popularity); //spread para no modificar el orden original de la lista
       console.log(sortedList)
     } else {
       throw new Error("La lista está vacía.")
     }
   };  
    /** Serializa la lista para localStorage */
    toJSON() {
        return {
          list: this.#list,
          name: this.#name,
          maxItems: this.#maxItems
        }
    }

    fromJSON(data) {
      const dataFromJSON = JSON.parse(data);
       return new AnimeList(dataFromJSON);
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
    #watching = [];     // AnimeList — máx. 10
    #planToWatch = [];  // AnimeList — sin límite

    /*Constructor de la clase User */
  constructor({name, surname, address, city, postalCode, email, username, password}) {
    this.#name = name;
    this.#surname = surname;
    this.#address = address;
    this.#city = city;
    this.#postalCode = postalCode;
    this.#email = email;
    this.#username = username;
    this.#password = password;
  }

  get name() {return this.#name;}
  set name(newName) {
    if (typeof newName !== 'string' || newName.trim() === '') {
      throw new Error("El nombre no puede estar vacío y debe ser una cadena de texto.")
    }
    this.#name = newName.trim();
  }

  get surname() {return this.#surname;}
  set surname(newSurname) {
    if (typeof newSurname !== 'string' || newSurname.trim() === '') {
      throw new Error("El apellido no puede estar vacío y debe ser una cadena de texto.")
      }
    this.#surname = newSurname.trim();
  }

  get address() {return this.#address;}
  set address(newAddress) {
    if (typeof newAddress !== 'string' || newAddress.trim() === '') {
      throw new Error("La dirección de domicilio no puede estar vacía y debe ser una cadena de texto.")
      }
    this.#address = newAddress.trim();
  }

  get city() {return this.#city;}

  get postalCode() {return this.#postalCode;}

  get email() {return this.#email;}
   ///try https://mailtrap.io/blog/javascript-email-validation/

  get username() {return this.#username;}

  get password() {return this.#password;}

    
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
