import React from 'react';

const NowPlaying = ({ track }) => {
  return (
    <div className="now-playing">
      <h2>{track.title}</h2>
      <h3>{track.artist}</h3>
    </div>
  );
};

export default NowPlaying;
