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
            return movieDetail
        });
}

function getBestMovieByScore() {
    // Récupération des éléments à remplir
    var movieId = document.getElementById("best_movie_id");
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
            movieId.value = bestMovie.id
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
            var {results1} = data;
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
                        "<div class=\"bloc-categ\">" +
                            "<div class=\"prev-movie-arrow\">" +
                                "<span>&lt;</span>" +
                                // "<img class=\"prev-movie-arrow\" src=\"img/arrow_back.svg\" alt=\"arrowBack\">" +
                            "</div>" +
                            "<div class=\"container-movie\">";

                    allResults.forEach(function (movie, index) {
                        var numFilm = index + 1;
                        contentSection +=
                            "<div class=\"movie card\">" +
                                "<div class=\"big-chiffre\">" + numFilm + "</div>" +
                                "<div class=\"shadow\">" +
                                    "<img id=\"background_movie_" + numFilm + "\" class=\"affiche-film\" src=\"" + movie.image_url + "\">" +
                                "</div>" +
                            "</div>";
                    });

                    contentSection +=
                            "</div>" +
                            "<div class=\"next-movie-arrow mt-auto mb-auto\">" +
                                "<span>&gt;</span>" +
                                // "<img class=\"next-movie-arrow\" src=\"img/arrow_forward.png\" alt=\"arrowForward\">" +
                            "</div>" +
                        "</div>";

                    newSection.innerHTML = contentSection;
                    content.append(newSection);
                });
        });
}

getBestMovieByScore()
getTopSevenMovieByCategory('', 2)
getTopSevenMovieByCategory('animation', 3)
getTopSevenMovieByCategory('sci-fi', 4)
getTopSevenMovieByCategory('romance', 5)
// getTopSevenMovieByCategory('action', 6)
// getTopSevenMovieByCategory('fantasy', 7)

