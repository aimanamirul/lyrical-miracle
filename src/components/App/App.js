import React from 'react';
import config from '../../config';
import {getLyrics} from 'genius-lyrics-api';
import './App.css';

import Spotify from '../../util/Spotify';

const Player = (props) => {
    return ( 
        <div>
            {props.isPlaying === false ? (<p>Nothing's Playing Right Now</p>) : (<div><p>{props.data.name}</p><p>{props.data.artists[0].name}</p></div>)}
            <button className="btn" onClick={props.obtainPlaying}>Obtain What's Playing</button>
            <button className="btn" onClick={() => props.lyricSearch()}>Search Lyrics</button>
            <div className="lyrics">{props.lyrics}</div>
        </div>
    );
}

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isPlaying: false,
            data: '',
            lyrics: '',
        }

        this.obtainPlaying = this.obtainPlaying.bind(this);
        this.lyricSearch = this.lyricSearch.bind(this);
    }

    obtainPlaying() {
        Spotify.fetchPlaying().then(response => {
            if (response === 'No Response') {
                console.log('No Song is Playing');
                return;
            } else {
                this.setState({
                    isPlaying: true,
                    data: response
                })
            }

        });
    }

    lyricSearch() {
        const options = {
            apiKey: config.apiKey, // genius developer access token
            title: this.state.data.name,
            artist: this.state.data.artists[0].name,
            optimizeQuery: true
        };

        console.log('Fetching Lyrics');

        getLyrics(options).then(lyrics => {
            //const regex = /([[A-Z]\w*.?\w])/g;
            //const lyricsArray = lyrics.split(regex);
            //console.log(lyricsArray); 
            this.setState({ lyrics: lyrics })
        });
    }


    render() {
        console.log(this.state.data);
        return (
            <div className="App" >
                <p>This App is in BETA at the moment, errors may occur intermittently.</p>
                <Player isPlaying={this.state.isPlaying} data={this.state.data} obtainPlaying={this.obtainPlaying} lyricSearch={this.lyricSearch} lyrics={this.state.lyrics} />
            </div>
        );
    }
}

export default App;
