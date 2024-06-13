// Function to search for movies using the OMDB API based on user input
async function searchMovies() {
    const query = document.getElementById('search-input').value; // Get the user input from the search box
    const resultsDiv = document.getElementById('results'); // Get the results container element

    try {
        const response = await fetch(`/api/search?q=${query}`); // Fetch movies from the API with the search query
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
                        <div class="poster" onclick="showMovieDetails('${movie.imdbID}', '${movie.Type}')">
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
            resultsDiv.innerHTML = `<p>${movies.message}</p>`;   // Display an error message if the API response is not ok
        }
    } catch (error) {
        resultsDiv.innerHTML = `<p>Error: ${error.message}</p>`; // Display an error message if the fetch request fails
    }
}

// Function to redirect to movie details page
function showMovieDetails(imdbID, type) {
    window.location.href = `/movie-details.html?imdbID=${imdbID}&type=${type}`;
}

// Display the movie details based on IMDb ID and type
async function displayMovieDetails() {
    const imdbID = new URLSearchParams(window.location.search).get('imdbID');
    const posterImg = document.getElementById('poster');
    const movieDetailsDiv = document.getElementById('movie-details');
    const type = new URLSearchParams(window.location.search).get('type');

    try {
        const response = await fetch(`/api/movie-details?imdbID=${imdbID}`);
        const movie = await response.json();

        if (response.ok) {
            posterImg.src = movie.Poster;
            movieDetailsDiv.innerHTML = `
                <h2>${movie.Title} (${movie.Year})</h2>
                <p><strong><a href="/html/stream.html?imdbID=${imdbID}&type=${type}" id="stream-link">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#ffffff" fill="none">
                        <path d="M12 20.5C13.8097 20.5 15.5451 20.3212 17.1534 19.9934C19.1623 19.5839 20.1668 19.3791 21.0834 18.2006C22 17.0221 22 15.6693 22 12.9635V11.0365C22 8.33073 22 6.97787 21.0834 5.79937C20.1668 4.62088 19.1623 4.41613 17.1534 4.00662C15.5451 3.67877 13.8097 3.5 12 3.5C10.1903 3.5 8.45489 3.67877 6.84656 4.00662C4.83766 4.41613 3.83321 4.62088 2.9166 5.79937C2 6.97787 2 8.33073 2 11.0365V12.9635C2 15.6693 2 17.0221 2.9166 18.2006C3.83321 19.3791 4.83766 19.5839 6.84656 19.9934C8.45489 20.3212 10.1903 20.5 12 20.5Z" stroke="currentColor" stroke-width="1.5" />
                        <path d="M15.9621 12.3129C15.8137 12.9187 15.0241 13.3538 13.4449 14.2241C11.7272 15.1705 10.8684 15.6438 10.1728 15.4615C9.9372 15.3997 9.7202 15.2911 9.53799 15.1438C9 14.7089 9 13.8059 9 12C9 10.1941 9 9.29112 9.53799 8.85618C9.7202 8.70886 9.9372 8.60029 10.1728 8.53854C10.8684 8.35621 11.7272 8.82945 13.4449 9.77593C15.0241 10.6462 15.8137 11.0813 15.9621 11.6871C16.0126 11.8933 16.0126 12.1067 15.9621 12.3129Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                    </svg>
                </a></strong></p>

                <p><strong><a href="/html/trailer.html?imdbID=${imdbID}" id="trailer-link">Watch Trailer</a></strong></p>
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

// Fetch vidsrc
function fetchvidsrc() {
    try {
        // Extract IMDb ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const imdbID = urlParams.get('imdbID');
        const type = urlParams.get('type');

        const streamcontainer = document.getElementById('stream-container');
        if (imdbID && (type == 'series')) {
            // Embed the trailer on the page using the IMDb ID
            streamcontainer.innerHTML = `
                <iframe width="100%" height="100%" src="https://vidsrc.to/embed/tv/${imdbID}" frameborder="0" allowfullscreen></iframe>
            `;
        }
        else if (imdbID && (type == 'movie'))
            {

                streamcontainer.innerHTML = `
                <iframe width="100%" height="100%" src="https://vidsrc.to/embed/movie/${imdbID}" frameborder="0" allowfullscreen></iframe>
            `;

        } else {
            streamcontainer.innerHTML = '<p style="color: red; font-weight: bold;">IMDb ID not found !!</p>';
        }
    } catch (error) {
        console.error('Error embedding video:', error);
        const streamcontainer = document.getElementById('stream-container');
        streamcontainer.innerHTML = '<p>Error embedding video</p>';
    }
}

// Fetch and display the vidsrc
fetchvidsrc();
