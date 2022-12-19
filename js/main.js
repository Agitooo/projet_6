const urlMovie = "http://localhost:8000/api/v1/titles/";
// Nombre de film visible sur le carousel (dynamique pour le fonctionnement du prev / next dans le carousel)
const movieVisible = 3;
// Nombre total de film récupéré (dynamique dans la récupération des films pour remplir carousel)
const maxMovie = 7;
// const maxMovie = 29; // les mêmes films reviennent en boucle...

function capitalizeFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
}

async function getMovieDetailsByUrl(movieUrl) {
    var movieDescription = document.getElementById("description_best_movie");
    movieDescription.innerHTML = "";
    var data = await fetch(movieUrl);
    var movieDetail = await data.json();
    movieDescription.innerHTML = movieDetail.description
}

function formatList(list) {
    listFormat = "";
    list.forEach(function (itemList, index) {
        if (listFormat !== "") {
            listFormat += ", " + itemList;
        } else {
            listFormat += itemList;
        }
    });
    if (listFormat == "Unknown") {
        listFormat = "Inconnu";
    }
    return listFormat
}

async function getMovieForModalByUrl(movieUrl) {
    var modalTitre = document.getElementById("titre_modal");
    var modalGenre = document.getElementById("genre_modal");
    var modalDateSortie = document.getElementById("date_modal");
    var modalNote = document.getElementById("note_modal");
    var modalScoreImdb = document.getElementById("score_modal");
    var modalRealisateur = document.getElementById("real_modal");
    var modalActeurs = document.getElementById("acteurs_modal");
    var modalDuree = document.getElementById("duree_modal");
    var modalPays = document.getElementById("pays_modal");
    var modalBoxOffice = document.getElementById("boxoffice_modal");
    var modalResume = document.getElementById("resume_modal");
    var modalPoster = document.getElementById("poster_modal");
    
    modalTitre.innerHTML = "";
    modalGenre.innerHTML = "";
    modalDateSortie.innerHTML = "";
    modalNote.innerHTML = "";
    modalScoreImdb.innerHTML = "";
    modalRealisateur.innerHTML = "";
    modalActeurs.innerHTML = "";
    modalDuree.innerHTML = "";
    modalPays.innerHTML = "";
    modalBoxOffice.innerHTML = "";
    modalResume.innerHTML = "";

    var data = await fetch(movieUrl);
    var movieDetail = await data.json();
    var formatter = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: '0' });

    var listGenre = "";
    var listRealisateur = "";
    var listActeur = "";
    var listPays = "";
    var boxOffice = "Inconnu";
    var nbVote = formatter.format(movieDetail.votes);

    listGenre = formatList(movieDetail.genres);

    // Date au format Français : cocorico yyyy-mm-dd => dd/mm/aaaa
    var dateArray = movieDetail.date_published.split("-");
    dateSortie = dateArray[2] + "/" + dateArray[1] + "/" + dateArray[0]

    listRealisateur = formatList(movieDetail.directors);
    listActeur = formatList(movieDetail.actors);
    listPays = formatList(movieDetail.countries);

    if (movieDetail.worldwide_gross_income !== null) {
        // Formatage du montant a la Française : cocorico again '999 999 999'
        boxOffice = formatter.format(movieDetail.worldwide_gross_income) + " $";
    }

    modalTitre.innerHTML = movieDetail.original_title;
    modalGenre.innerHTML = "Genres: " + listGenre; // tableau
    modalDateSortie.innerHTML = "Date de sortie: " + dateSortie;
    modalNote.innerHTML = "<img class=\"imdb\" src=\"img/imdb.svg\" alt=\"imdb\"> " + movieDetail.imdb_score +
        "/10 - Spectateurs: " + movieDetail.avg_vote + "/10 (" + nbVote + " votes)";
    modalRealisateur.innerHTML = "Réalisateur: " + listRealisateur; // tableau
    modalActeurs.innerHTML = "Acteurs: " + listActeur; // tableau
    modalDuree.innerHTML = "Durée: " + movieDetail.duration + " minutes";
    modalPays.innerHTML = "Pays: " + listPays; // tableau
    modalBoxOffice.innerHTML = "Box Office: " + boxOffice;
    modalResume.innerHTML = movieDetail.long_description;
    modalPoster.src = movieDetail.image_url;
}

async function getBestMovieByScore() {
    // Récupération des éléments à remplir
    var movieId = document.getElementById("id_best_movie");
    var movieImage = document.getElementById("background_best_movie");
    var movieTitle = document.getElementById("titre_best_movie");

    // Nettoyage des infos à remplir
    movieId.innerHTML = "";
    movieImage.innerHTML = "";
    movieTitle.innerHTML = "";

    // Appel ajax pour récupérer les film les mieux notés
    var data = await fetch(urlMovie + "?sort_by=-imdb_score");
    var results = await data.json();
    // On ne garde que le meilleur
    var bestMovie = results.results[0];

    // Parsing des données dans l'HTML
    movieId.setAttribute("data-film-url", bestMovie.url)
    movieImage.src = bestMovie.image_url
    movieTitle.innerHTML = bestMovie.title

    // Récupération des informations complète du film
    getMovieDetailsByUrl(bestMovie.url)
}

async function getTopSevenMovieByCategory(category, ordre) {

    var url = urlMovie + "?sort_by=-imdb_score";
    var categoryText = "Films les mieux notés";
    if (category !== "") {
        url = url + "&genre=" + category;
        categoryText = "Top " + maxMovie + " des meilleurs films de la catégorie " + capitalizeFirstLetter(category);
    }
    // Récupération des éléments à remplir
    var content = document.getElementById("content");

    var data = await fetch(url);
    var results = await data.json();
    if (category === '') {
        results.results.shift();
    }
    var next = results.next
    var allResults = results.results

    while (allResults.length < maxMovie) {
        var dataNext = await fetch(next);
        var resultsNext = await dataNext.json();
        if (!resultsNext.results) {
            break;
        }
        next = resultsNext.next;
        allResults = allResults.concat(resultsNext.results);
    }

    // On garde le nombre de film défini dans maxMovie
    while (allResults.length > maxMovie) {
        allResults.pop();
    }
    var newSection = document.createElement('div');
    newSection.setAttribute("id", "categ_" + ordre);
    newSection.setAttribute("class", "categorie  order-" + ordre + " ml-auto mr-auto");
    // Création du bloc div catégorie
    var contentSection =
        "<div class=\"titre-categ\" >" +
            "<span>" + categoryText + "</span>" +
        "</div>" +
        "<div class=\"bloc-categ flex-row\">" +
            "<div class=\"prev-movie-arrow c-pointer\">" +
                "<span class=\"flex-column prev\">&lt;</span>" +
            "</div>" +
            "<div class=\"container-movie flex-row\">";

    allResults.forEach(function (movie, index) {
        // Pour les meilleurs films on commence a 2 car le 1er est dans le cadre du dessus
        if (category === "") {
            var numFilm = index + 2;
        } else {
            var numFilm = index + 1;
        }
        contentSection +=
                "<div class=\"movie flex-row card order-" + numFilm + "\">" +
                    "<div class=\"big-chiffre\">" + numFilm + "</div>" +
                    "<div class=\"shadow\">" +
                        "<img id=\"background_movie_" + numFilm + "\" class=\"affiche-film modal-data\" src=\"" + movie.image_url + "\" data-film-url=\"" + movie.url + "\">" +
                    "</div>" +
                "</div>";
    });

    contentSection +=
            "</div>" +
            "<div class=\"next-movie-arrow c-pointer flex-column mt-auto mb-auto\">" +
                "<span class=\"flex-column next\">&gt;</span>" +
            "</div>" +
        "</div>";

    newSection.innerHTML = contentSection;
    content.append(newSection);

    // Une fois les films récupéré, on masque le bloc fake
    var fakeCateg = document.getElementById("categ_0");
    fakeCateg.classList.add('d-none');
} !or


// On écoute tous les clicks
document.addEventListener('click', function(event) {
    var target = event.target;
    var modal = document.getElementById("modal");
    var bgModal = document.getElementById("bg_modal");
    var closeModal = document.getElementById("close_modal");

    // Si on clic en dehors de la modal, on masque le background et la modal
    bgModal.addEventListener('click', function () {
        bgModal.classList.remove('d-block');
        bgModal.classList.add('d-none');
        modal.classList.remove('d-flex');
        modal.classList.add('d-none');
    });

    // Si on clic sur la croix de la modal, on masque le background et la modal
    closeModal.addEventListener('click', function () {
        bgModal.classList.remove('d-block');
        bgModal.classList.add('d-none');
        modal.classList.remove('d-flex');
        modal.classList.add('d-none');
    });

    // On ne veut traiter que le click sur les elements qui ont la classe 'modal-data'
    if (target.classList.contains('modal-data')) {
        var filmUrl = target.getAttribute('data-film-url');
        // On récupère les infos du films pour les mettre dans la modal
        getMovieForModalByUrl(filmUrl)
        // Et on affiche la modal
        bgModal.classList.remove('d-none');
        bgModal.classList.add('d-block');
        modal.classList.remove('d-none');
        modal.classList.add('d-flex');
    }

    // Clic sur le bouton < d'un carousel
    if (target.classList.contains('prev')) {
        var movies = target.parentElement.nextElementSibling.children;
        var regex = /order-[0-9]{1,2}/;
        for (index = 0; index < movies.length; index++) {
            var classList = movies[index].className;
            if (regex.test(classList)) {
                var match = classList.match(regex);
                var classOrder = match[0];
                var splitValOrder = classOrder.split('-');
                var valOrder = splitValOrder[1];
                if (valOrder <= (maxMovie - movieVisible)) {
                    var newValClassOrder = (parseInt(valOrder) + (movieVisible));
                } else {
                    var newValClassOrder = (parseInt(valOrder) - (maxMovie - movieVisible));
                }
                var newClassOrder = splitValOrder[0] + '-' + newValClassOrder;
                movies[index].classList.remove(classOrder);
                movies[index].classList.add(newClassOrder);
            }
        }
    }

    // Clic sur le bouton > d'un carousel
    if (target.classList.contains('next')) {
        var movies = target.parentElement.previousElementSibling.children;
        var regex = /order-[0-9]{1,2}/;
        for (index = 0; index < movies.length; index++) {
            var classList = movies[index].className;
            if (regex.test(classList)) {
                var match = classList.match(regex);
                var classOrder = match[0];
                var splitValOrder = classOrder.split('-');
                var valOrder = splitValOrder[1];
                if (valOrder <= movieVisible) {
                    var newValClassOrder = (parseInt(valOrder) + (maxMovie - movieVisible));
                } else {
                    var newValClassOrder = (parseInt(valOrder) - movieVisible);
                }
                var newClassOrder = splitValOrder[0] + '-' + newValClassOrder;
                movies[index].classList.remove(classOrder);
                movies[index].classList.add(newClassOrder);
            }
        }
    }
}, false);

document.addEventListener('DOMContentLoaded', function () {

    getBestMovieByScore()
    getTopSevenMovieByCategory('', 2)
    getTopSevenMovieByCategory('animation', 3)
    getTopSevenMovieByCategory('sci-fi', 4)
    getTopSevenMovieByCategory('romance', 5)
    // getTopSevenMovieByCategory('action', 6)
    // getTopSevenMovieByCategory('fantasy', 7)
});