const express = require('express');
const axios = require('axios');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname)));

// Search endpoint for omdb api
app.get('/api/search', async (req, res) => {
    const query = req.query.q;
    const apiKey = process.env.OMDB_API_KEY;

    try {
        const searchResponse = await axios.get(`http://www.omdbapi.com/?apikey=${apiKey}&s=${query}`);
        if (searchResponse.data.Response === 'True') {
            res.json(searchResponse.data.Search);
        } else {
            res.status(404).json({ message: searchResponse.data.Error });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching data from OMDb API', error: error.message });
    }
});

// Movie details endpoint for omdb api
app.get('/api/movie-details', async (req, res) => {
    const imdbID = req.query.imdbID;
    const apiKey = process.env.OMDB_API_KEY;

    try {
        const response = await axios.get(`http://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching movie details from OMDb API', error: error.message });
    }
});

// YouTube trailer endpoint
app.get('/api/youtube/trailer', async (req, res) => {
    try {
        const { imdbID } = req.query;
        const apiKey = process.env.YOUTUBE_API_KEY;

        const response = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${imdbID}%20trailer&type=video&key=${apiKey}`);
        
        // Log the response data to check its structure
        console.log('YouTube API response:', response.data);

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching trailer:', error);
        res.status(500).json({ error: 'An error occurred while fetching the trailer' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/movie-details.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'movie-details.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
