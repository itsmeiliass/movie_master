# Movie Search and Trailer App

This project is a movie search application that allows users to search for movies, view detailed information about them, and watch trailers. It uses the OMDb API for movie data and the YouTube API for fetching trailers.

## Table of Contents
- [Project Structure](#project-structure)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Data Flow](#data-flow)

## Project Structure
[Structure](./structure.txt)


## Features
- Search for movies by title.
- View detailed information about selected movies.
- Watch trailers for the selected movies.

## Installation

1. Clone the repository:
    ```sh
    git clone <repository-url>
    cd <repository-directory>
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add your OMDb and YouTube API keys:
    ```env
    OMDB_API_KEY=your_omdb_api_key
    YOUTUBE_API_KEY=your_youtube_api_key
    ```

## Usage

1. Start the server:
    ```sh
    node server.js
    ```

2. Open your browser and navigate to `http://localhost:3000`.

## API Endpoints

### `/api/search`
- **Method**: GET
- **Query Parameters**: `q` (movie title)
- **Description**: Searches for movies by title using the OMDb API.

### `/api/movie-details`
- **Method**: GET
- **Query Parameters**: `imdbID` (IMDb ID of the movie)
- **Description**: Fetches detailed information about a movie using the OMDb API.

### `/api/youtube/trailer`
- **Method**: GET
- **Query Parameters**: `imdbID` (IMDb ID of the movie)
- **Description**: Fetches trailer information from the YouTube API.

## Environment Variables

Create a `.env` file in the root directory with the following content:

OMDB_API_KEY=your_omdb_api_key
YOUTUBE_API_KEY=your_youtube_api_key


Replace `your_omdb_api_key` and `your_youtube_api_key` with your actual API keys.

## Data Flow

1. **User Interaction**:
    - User searches for a movie on `index.html`.
    - `searchMovies()` fetches search results from `/api/search` and displays them.
    - User clicks on a movie to view details, triggering `showMovieDetails()` which redirects to `movie-details.html`.

2. **Movie Details**:
    - `displayMovieDetails()` on `movie-details.html` fetches detailed information about the movie from `/api/movie-details` and displays it.
    - User clicks "Watch Trailer" link, which redirects to `trailer.html`.

3. **Trailer Display**:
    - `fetchTrailer()` on `trailer.html` fetches trailer information from `/api/youtube/trailer`.
    - Trailer is embedded and displayed, or a "Trailer not found !!" message is shown if no trailer is available.



