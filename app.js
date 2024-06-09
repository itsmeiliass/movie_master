// Function to search for movies using the OMDB API based on user input
async function searchMovies() {
    const query = document.getElementById('search-input').value; // Get the user input from the search box
    const resultsDiv = document.getElementById('results'); // Get the results container element

    try {
        // Fetch movies from the API with the search query
        const response = await fetch(`/api/search?q=${query}`);
        const movies = await response.json(); // Parse the response as JSON

        if (response.ok) {
            resultsDiv.innerHTML = ''; // Clear any previous results
            const movieContainer = document.createElement('div'); // Create a container for the movie results
            movieContainer.classList.add('movie-container');

            movies.forEach(movie => {
                if (movie.Poster !== "N/A") { // Check if the movie has a poster image
                    const movieElement = document.createElement('div'); // Create a container for each movie
                    movieElement.classList.add('movie');
                    movieElement.innerHTML = `
                        <div class="poster" onclick="showMovieDetails('${movie.imdbID}')">
                            <img src="${movie.Poster}" alt="${movie.Title}">
                        </div>
                        <div class="movie-details">
                            <h3>${movie.Title} (${movie.Year})</h3>
                        </div>
                    `;
                    movieContainer.appendChild(movieElement); // Append each movie to the movie container
                }
            });

            resultsDiv.appendChild(movieContainer); // Append the movie container to the results div
        } else {
            resultsDiv.innerHTML = `<p>${movies.message}</p>`; // Display an error message if the API response is not ok
        }
    } catch (error) {
        resultsDiv.innerHTML = `<p>Error: ${error.message}</p>`; // Display an error message if the fetch request fails
    }
}

function showMovieDetails(imdbID) {
    window.location.href = `/movie-details.html?imdbID=${imdbID}`;
}

// Display the movies searched for by title 
async function displayMovieDetails() {
    const imdbID = new URLSearchParams(window.location.search).get('imdbID');
    const posterImg = document.getElementById('poster');
    const movieDetailsDiv = document.getElementById('movie-details');

    try {
        const response = await fetch(`/api/movie-details?imdbID=${imdbID}`);
        const movie = await response.json();

        if (response.ok) {
            posterImg.src = movie.Poster;
            movieDetailsDiv.innerHTML = `
                <h2>${movie.Title} (${movie.Year})</h2>
                <strong><a href="/html/trailer.html?imdbID=${imdbID}" id="trailer-link">Watch Trailer</a></strong>
                <p><strong>Type :  </strong> ${movie.Type}</p>
                <p><strong>Rated :  </strong> ${movie.Rated}</p>
                <p><strong>Released :  </strong> ${movie.Released}</p>
                <p><strong>Runtime:  </strong> ${movie.Runtime}</p>
                <p><strong>Genre :  </strong> ${movie.Genre}</p>
                <p><strong>Director :  </strong> ${movie.Director}</p>
                <p><strong>Writer :  </strong> ${movie.Writer}</p>
                <p><strong>Actors :  </strong> ${movie.Actors}</p>
                <p><strong>Plot :  </strong> ${movie.Plot}</p>
                <p><strong>Language :  </strong> ${movie.Language}</p>
                <p><strong>Country :  </strong> ${movie.Country}</p>
                <p><strong>Awards :  </strong> ${movie.Awards}</p>
                <p><strong>Metascore :  </strong> ${movie.Metascore}</p>
                <p><strong>IMDB Rating :  </strong> <span class="rating-value">${movie.imdbRating}</span></p>
                <p><strong>IMDB Votes :  </strong> <span class="rating-value">${movie.imdbVotes}</span></p>
            `;
        } else {
            movieDetailsDiv.innerHTML = `<p>${movie.message}</p>`;
        }
    } catch (error) {
        movieDetailsDiv.innerHTML = `<p>Error: ${error.message}</p>`;
    }
}

// Call the function to display movie details when the page loads
window.onload = displayMovieDetails;

// Fetch trailer
async function fetchTrailer() {
    try {
        // Extract IMDb ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const imdbID = urlParams.get('imdbID');

        // Fetch trailer information from your backend
        const response = await fetch(`/api/youtube/trailer?imdbID=${imdbID}`);
        
        // Check if the response is ok
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Parse the response as JSON
        const data = await response.json();

        const trailerContainer = document.getElementById('trailer-container');
        if (data.videoId) {
            // Embed the trailer on the page
            trailerContainer.innerHTML = `
                <iframe width="560" height="315" src="https://www.youtube.com/embed/${data.videoId}" frameborder="0" allowfullscreen></iframe>
            `;
        } else {
            trailerContainer.innerHTML = '<p style="color: red; font-weight: bold;">Trailer not found !!</p>';
        }
    } catch (error) {
        console.error('Error fetching trailer:', error);
        const trailerContainer = document.getElementById('trailer-container');
        trailerContainer.innerHTML = '<p>Error fetching trailer</p>';
    }
}

// Fetch and display the trailer
fetchTrailer();
