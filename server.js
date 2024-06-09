const express = require('express');
const axios = require('axios');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 3000;

// Serve static files from the 'html', 'css', 'images', and root directory
app.use('/html', express.static(path.join(__dirname, 'html')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.static(__dirname)); // Serve JavaScript files from the root directory

// Search endpoint for OMDB API
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

// Movie details endpoint for OMDB API
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

        const searchQuery = `${imdbID} trailer`;
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&key=${apiKey}`;

        const response = await axios.get(searchUrl);

        if (response.status === 200 && response.data.items) {
            const items = response.data.items;
            for (let item of items) {
                if (item.id && item.id.videoId) {
                    return res.json({ videoId: item.id.videoId });
                }
            }
        }
        res.status(404).json({ message: 'Trailer not found' });
    } catch (error) {
        console.error('Error fetching trailer:', error);
        res.status(500).json({ error: 'An error occurred while fetching the trailer' });
    }
});

// Serve index.html when root URL is accessed
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'index.html'));
});

// Serve movie-details.html when requested
app.get('/movie-details.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'html','movie-details.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
