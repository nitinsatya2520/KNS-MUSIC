import React from 'react';

const Playlist = ({ tracks, onTrackSelect }) => {
  return (
    <div className="playlist">
      <ul>
        {tracks.map((track, index) => (
          <li key={index} onClick={() => onTrackSelect(track)}>
            {track.title} - {track.artist}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Playlist;
