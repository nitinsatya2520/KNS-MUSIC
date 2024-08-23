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
          Authorization: `Bearer BQDnKMGf3hfCyMzDtysZrd0mIfRaOr7LkxxbF2t78NDKDIMKN14vL9XWFaNbv_vS7Ky_8Mqd_FGNn6lTWHnIvsGzfx6TPItnDANNLCQzSXYn_eysHYOvaAKovSbon-h0IO-tHSIED5Tw_s41BkHr_IkfPpD627lNYY5-4OIp-9v42yFwdaO6SGFb3UYrErt9J6Fb2lOx8BnvyUGWmYYa1TfEbsL-owI8ssairejJ_ZQkYNOKktJhnWHoOhdClKnpw8vOjAH86c7Oh094bAwQ_g`, // Replace with your actual token
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
