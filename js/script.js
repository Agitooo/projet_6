const urlMovie = "http://localhost:8000/api/v1/titles/";

function capitalizeFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
}

function getMovieDetailsByUrl(movieUrl) {
    var movieDescription = document.getElementById("description_best_movie");
    movieDescription.innerHTML = "";
    fetch(movieUrl)
        .then((res) => res.json())
        .then((data) => {
            var movieDetail = data
            movieDescription.innerHTML = movieDetail.description
        });
}

function getMovieForModalByUrl(movieUrl) {
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
    fetch(movieUrl)
        .then((res) => res.json())
        .then((data) => {

            var movieDetail = data;
            var listGenre = "";
            var listRealisateur = "";
            var listActeur = "";
            var listPays = "";


            movieDetail.genres.forEach(function (genre, index) {
                if (listGenre !== "") {
                    listGenre += ", " + genre;
                } else {
                    listGenre += genre;
                }
            });

            // Date au format Français : cocorico yyyy-mm-dd => dd/mm/aaaa
            var dateArray = movieDetail.date_published.split("-");
            dateSortie = dateArray[2] + "/" + dateArray[1] + "/" + dateArray[0]

            movieDetail.directors.forEach(function (realisateur, index) {
                if (listRealisateur !== "") {
                    listRealisateur += ", " + realisateur;
                } else {
                    listRealisateur += realisateur;
                }
            });
            movieDetail.actors.forEach(function (acteur, index) {
                if (acteur !== "Unknown") {
                    if (listActeur !== "") {
                        listActeur += ", " + acteur;
                    } else {
                        listActeur += acteur;
                    }
                } else {
                    listActeur = "Inconnu"
                }
            });
            movieDetail.countries.forEach(function (pays, index) {
                if (listPays !== "") {
                    listPays += ", " + pays;
                } else {
                    listPays += pays;
                }
            });

            if (movieDetail.worldwide_gross_income === null) {
                // Si on a pas le box office
                boxOffice = "Inconnu"
            } else {
                // Formatage du montant a la Française : cocorico again '999 999 999'
                const formatter = new Intl.NumberFormat('fr-FR', {maximumFractionDigits: '0'});
                boxOffice = formatter.format(movieDetail.worldwide_gross_income) + " $";
            }

            modalTitre.innerHTML = movieDetail.title;
            modalGenre.innerHTML = "Genres: " + listGenre; // tableau
            modalDateSortie.innerHTML = "Date de sortie: " + dateSortie;
            modalNote.innerHTML = "<img class=\"imdb\" src=\"img/imdb.svg\" alt=\"imdb\"> " + movieDetail.imdb_score + "/10 - Spectateurs: " + movieDetail.avg_vote + "/10";
            modalRealisateur.innerHTML = "Réalisateur: " + listRealisateur; // tableau
            modalActeurs.innerHTML = "Acteurs: " + listActeur; // tableau
            modalDuree.innerHTML = "Durée: " + movieDetail.duration + " minutes";
            modalPays.innerHTML = "Pays: " + listPays; // tableau
            modalBoxOffice.innerHTML = "Box Office: " + boxOffice;
            modalResume.innerHTML = movieDetail.long_description;
            modalPoster.src = movieDetail.image_url;
        })
}

function getBestMovieByScore() {
    // Récupération des éléments à remplir
    var movieId = document.getElementById("id_best_movie");
    var movieImage = document.getElementById("background_best_movie");
    var movieTitle = document.getElementById("titre_best_movie");

    // Nettoyage des infos à remplir
    movieId.innerHTML = "";
    movieImage.innerHTML = "";
    movieTitle.innerHTML = "";

    fetch(urlMovie + "?sort_by=-imdb_score")
        .then((res) => res.json())
        .then((data) => {
            const { results } = data;
            const bestMovie = results[0]

            // Parsing des données dans l'HTML
            // movieId.value = bestMovie.id
            movieId.setAttribute("data-film-url", bestMovie.url)
            movieImage.src = bestMovie.image_url
            movieTitle.innerHTML = bestMovie.title

            // Récupération des informations complète du film
            getMovieDetailsByUrl(bestMovie.url)
        });
}

function getTopSevenMovieByCategory(category, ordre) {

    var url = urlMovie + "?sort_by=-imdb_score";
    var categoryText = "Films les mieux notés";
    if (category !== "") {
        url = url + "&genre=" + category;
        categoryText = "Top 7 des meilleurs films de la catégorie " + capitalizeFirstLetter(category);
    }
    // Il n'y a que 5 résultats par page, il en faut 7 il faut donc aller aussi sur la page
    var url2 = url + "&page=2";
    // Récupération des éléments à remplir
    var content = document.getElementById("content");

    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            var { results1 } = data;
            var results1 = data['results'];
            fetch(url2)
                .then((res) => res.json())
                .then((data) => {
                    var { results2 } = data;
                    var results2 = data['results'];
                    // On supprime les 3 derniers films car seul les 2 premiers de la seconde page nous intéressent
                    while (results2.length > 2) {
                        results2.pop()
                    }
                    var allResults = results1.concat(results2);
                    var newSection = document.createElement('section');
                    newSection.setAttribute("id", "categ_" + ordre);
                    newSection.setAttribute("class", "categorie  order-" + ordre + " ml-auto mr-auto");
                    // Création de la section la catégorie
                    var contentSection =
                        "<div class=\"titre-categ\" >" +
                            "<span>" + categoryText + "</span>" +
                        "</div>" +
                        "<div class=\"bloc-categ flex-row\">" +
                            "<div class=\"prev-movie-arrow c-pointer\">" +
                                "<span class=\"flex-column\">&lt;</span>" +
                                // "<img class=\"prev-movie-arrow\" src=\"img/arrow_back.svg\" alt=\"arrowBack\">" +
                            "</div>" +
                            "<div class=\"container-movie flex-row\">";

                    allResults.forEach(function (movie, index) {
                        var numFilm = index + 1;
                        contentSection +=
                                "<div class=\"movie flex-row card\">" +
                                    "<div class=\"big-chiffre\">" + numFilm + "</div>" +
                                    "<div class=\"shadow\">" +
                                        "<img id=\"background_movie_" + numFilm + "\" class=\"affiche-film modal-data\" src=\"" + movie.image_url + "\" data-film-url=\"" + movie.url + "\">" +
                                    "</div>" +
                                "</div>";
                    });

                    contentSection +=
                            "</div>" +
                            "<div class=\"next-movie-arrow c-pointer flex-column mt-auto mb-auto\">" +
                                "<span class=\"flex-column\">&gt;</span>" +
                                // "<img class=\"next-movie-arrow\" src=\"img/arrow_forward.png\" alt=\"arrowForward\">" +
                            "</div>" +
                        "</div>";

                    newSection.innerHTML = contentSection;
                    content.append(newSection);
                });
        });
}

// var openModal = element.classList.contains('modal-data');

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
    })

    // Si on clic sur la croix de la modal, on masque le background et la modal
    closeModal.addEventListener('click', function () {
        bgModal.classList.remove('d-block');
        bgModal.classList.add('d-none');
        modal.classList.remove('d-flex');
        modal.classList.add('d-none');
    })

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
}, false);

document.addEventListener('DOMContentLoaded', function () {

    getBestMovieByScore()
    getTopSevenMovieByCategory('', 2)
    getTopSevenMovieByCategory('animation', 3)
    getTopSevenMovieByCategory('sci-fi', 4)
    getTopSevenMovieByCategory('romance', 5)
    getTopSevenMovieByCategory('action', 6)
    // getTopSevenMovieByCategory('fantasy', 7)

});