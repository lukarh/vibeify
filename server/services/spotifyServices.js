const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') }) // load .env file from one directory above

const axios = require('axios')

const fetchAccessToken = async (code) => {
    const spotify_client_id = process.env.SPOTIFY_CLIENT_ID
    const spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET

    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        data: new URLSearchParams({
          code: code,
          redirect_uri: "http://localhost:3000/redirect", 
        //   redirect_uri: "https://vibeify-1cdb0dbbe555.herokuapp.com/redirect",
          grant_type: 'authorization_code'
        }),
        headers: {
          'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
          'Content-Type': 'application/x-www-form-urlencoded'
        }
    }

    // make request to Spotify API for access token
    const response = await axios.post(authOptions.url, authOptions.data, {
        headers: authOptions.headers
    })

    // deconstruct the response and get the tokens
    const { access_token, refresh_token } = response.data

    // return the access token and refresh token
    return { access_token: access_token, refresh_token: refresh_token }
}

const fetchTracksFeatures = async (trackIds, accessToken) => {

    // make request to Spotify API for Tracks' Features
    const response = await axios.get(
        `https://api.spotify.com/v1/audio-features?ids=${trackIds}`,
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }
    )
    
    const tracksFeatures = response.data.audio_features

    // return array of objects that contains musicID and their features: [{obj}, {obj}, etc...]
    return tracksFeatures
}

const fetchRecentlyPlayed = async (accessToken) => {

    // make request to Spotify API for User's Recently Played Songs
    const response = await axios.get(
        `https://api.spotify.com/v1/me/player/recently-played?limit=50`,
        {
            headers: {
            'Authorization': `Bearer ${accessToken}`
            }
        }
    )

    // extract tracks data from response and create a query from trackIds to get features 
    const recentTracks = response.data.items
    const trackIds = recentTracks.map(trackItem => trackItem.track.id).join(',')
        
    // make request to Spotify API for features of all of the User's Recently Played Songs
    const recentFeatures = await fetchTracksFeatures(trackIds, accessToken)

    // merge the data together by ID
    const recentTracksWithFeatures = recentTracks.map((item) => {
        const { id } = item.track
        const trackFeatures = recentFeatures.find((item) => item.id === id)

        return {
            track: item.track,
            played_at: item.played_at,
            context: item.context,
            features: trackFeatures,
        }
    })

    // return array of user's recently played tracks and features: [{obj}, {obj}, etc...]
    return recentTracksWithFeatures
}

const fetchUserTopArtists = async (timeRange, accessToken) => {

    // make request to Spotify API for User's Top Tracks during a given time range
    const response = await axios.get(
        `https://api.spotify.com/v1/me/top/artists?limit=50&time_range=${timeRange}`,
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }
    )

    // return array of user's top artists: : [{obj}, {obj}, etc...]
    const topArtists = response.data.items
    return topArtists
}

const fetchUserTopTracks = async (timeRange, accessToken) => {

    // make request to Spotify API for User's Top Tracks during a given time range
    const response = await axios.get(
        `https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=${timeRange}`,
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }
    )

    // get the tracks and loop through the tracks and made ID query
    const topTracks = response.data.items
    const trackIds = topTracks.map(trackItem => trackItem.id).join(',')

    // make request to Spotify API for features of all of the User's Recently Played Songs
    const topTracksFeatures = await fetchTracksFeatures(trackIds, accessToken)

    // merge the data together by ID
    const topTracksWithFeatures = topTracks.map((item) => {
        const id = item.id
        const trackFeatures = topTracksFeatures.find((item) => item.id === id)

        return {
            ...item,
            features: trackFeatures,
        }
    })

    // return array of user's top tracks with features: [{obj}, {obj}, etc...]
    return topTracksWithFeatures
}

const fetchUserProfile = async (accessToken) => {

    // make request to Spotify's API for user profile data
    const response = await axios.get(
        `https://api.spotify.com/v1/me`,
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }
    )

    // return the data
    const userProfile = response.data
    return userProfile
}

const fetchSongRecommendations = async ( 
        accessToken, limit,
        seed_artists, seed_genres, seed_tracks, 
        min_acousticness, max_acousticness,
        min_danceability, max_danceability,
        min_energy, max_energy,
        min_popularity, max_popularity, 
        min_valence, max_valence
    ) => {

    console.log(`https://api.spotify.com/v1/recommendations?limit=${limit}&seed_genres=${seed_genres}&min_acousticness=${min_acousticness}&max_acousticness=${max_acousticness}&min_danceability=${min_danceability}&max_danceability=${max_danceability}&min_energy=${min_energy}&max_energy=${max_energy}&min_popularity=${min_popularity}&max_popularity=${max_popularity}&min_valence=${min_valence}&max_valence=${max_valence}`)
    // make request to Spotify's API for song recommendations
    const response = await axios.get(
        // `https://api.spotify.com/v1/recommendations?limit=${limit}&seed_artists=${seed_artists}&seed_genres=${seed_genres}&seed_tracks=${seed_tracks}&min_acousticness=${min_acousticness}&max_acousticness=${max_acousticness}&min_danceability=${min_danceability}&max_danceability=${max_danceability}&min_energy=${min_energy}&max_energy=${max_energy}&min_popularity=${min_popularity}&max_popularity=${max_popularity}&min_valence=${min_valence}&max_valence=${max_valence}`,
        `https://api.spotify.com/v1/recommendations?limit=${limit}&seed_genres=${seed_genres}&min_acousticness=${min_acousticness}&max_acousticness=${max_acousticness}&min_danceability=${min_danceability}&max_danceability=${max_danceability}&min_energy=${min_energy}&max_energy=${max_energy}&min_popularity=${min_popularity}&max_popularity=${max_popularity}&min_valence=${min_valence}&max_valence=${max_valence}`,
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }
    )

    console.log(response.data)

    // return the data
    const songRecommendations = response.data.tracks
    return songRecommendations
}

const fetchSpotifySearchResults = async (accessToken, searchQuery, searchType) => {

    // make request to Spotify's API for search results
    const response = await axios.get(
        `https://api.spotify.com/v1/search?q=${searchQuery}&type=${searchType}`,
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }
    )

    // return the data
    const searchResults = response.data[searchType + 's'].items
    return searchResults
}

module.exports = {
    fetchAccessToken,
    fetchTracksFeatures,
    fetchRecentlyPlayed,
    fetchUserTopArtists,
    fetchUserTopTracks,
    fetchUserProfile,
    fetchSongRecommendations,
    fetchSpotifySearchResults
}