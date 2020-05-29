const clientId = '64350a0d1fed472ab721bbcffeb78316'; // Insert client ID here.
const redirectUri = 'https://lyrical-miracle.netlify.app/'; // Have to add this to your accepted Spotify redirect URIs on the Spotify API.
let accessToken;

const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }

        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            window.setTimeout(() => accessToken = '', expiresIn * 3000);
            window.history.pushState('Access Token', null, '/'); // This clears the parameters, allowing us to grab a new access token when it expires.
            return accessToken;
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=user-read-currently-playing%20user-read-playback-state&redirect_uri=${redirectUri}`;
            window.location = accessUrl;
        }
    },

    search(term) {
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            if (!jsonResponse.tracks) {
                return [];
            }
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }));
        });
    },

    fetchPlaying() {
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/me/player/currently-playing`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => {
            if (response.status === 204) {
                return '';
            }
            console.log(response);
            return response.json();
        }).then(jsonResponse => {
            if (!jsonResponse) {
                return 'No Response';
            }
            return jsonResponse.item;
        });
    },

};

export default Spotify;
