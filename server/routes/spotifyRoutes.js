const express = require('express')
const router = express.Router()
const SpotifyControllers = require('../controllers/spotifyControllers')

// Route for getting recently played playlist data
router.get('/recently-played', SpotifyControllers.getUserRecentlyPlayedTracks)

// Route for getting user's top artists
router.get('/top-artists', SpotifyControllers.getUserTopArtists)

// Route for getting user's top tracks
router.get('/top-tracks', SpotifyControllers.getUserTopTracks)

// Route for getting user's Spotify profile info
router.get('/user-profile', SpotifyControllers.getUserProfile)

module.exports = router;