import React, { useState } from 'react';
import axios from 'axios';
import './MusicSearch.css'; // Import the CSS file

const MusicSearch = () => {
  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState([]);
  const [error, setError] = useState('');

  const searchMusic = async () => {
    try {
      const response = await axios.get('https://api.spotify.com/v1/search', {
        params: {
          q: query,
          type: 'track',
          limit: 30,
        },
        headers: {
          Authorization: `Bearer BQCTAUS7zh0haSJP5Zxb_ogem67cxL6HCIKpit2SwQk1Bd7qLP0FYdpT0L9q4LWFiJz_zrKLwagn_f2-ATgO3K89bKhsdF7sY3QQDET_lOXeGH7Bf8ZaT88SE_BO69I7LlzBKdhFFRr5I-sX7Aj2q90IbJOiMGuX5BrFHuMdLhwhPhM0L9PuvYhvDh0pPFDTdBkIAfoimKVO-N8fHm75y6PFZJIzsCv2sJgUk27VOAaJdJd2tC1SImAo-a3JkWRODXU0ji66ZkKa5M47ef9Eag`, // Replace with your actual token
        },
      });
      setTracks(response.data.tracks.items);
      setError('');
    } catch (error) {
      console.error('Error searching music:', error.response ? error.response.data : error.message);
      setError('Error searching music. Please check your request and try again.');
    }
  };

  return (
    <div className="music-search-container">
      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for music..."
        />
        <button onClick={searchMusic}>Search</button>
      </div>
      {error && <p className="error-message">{error}</p>}
      <ul className="track-list">
        {tracks.map((track) => (
          <li key={track.id} className="track-item">
            <img
              src={track.album.images[0]?.url}
              alt={track.name}
              width={50}
              height={50}
              className="track-thumbnail"
            />
            <div>{track.name} by {track.artists[0]?.name}</div>
            {track.preview_url ? (
              <audio controls>
                <source src={track.preview_url} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            ) : (
              <p>No preview available</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MusicSearch;
