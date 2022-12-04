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

	fetch("http://localhost:8000/api/v1/titles/?sort_by=-imdb_score")
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

getBestMovieByScore()
