import React, { useState, useRef, useEffect } from 'react';
import './App.css';

// NowPlaying Component
const NowPlaying = ({ track }) => (
  <div className="now-playing">
    <h2>Now Playing</h2>
    <h3>{track.title} - {track.artist}</h3>
  </div>
);

// Player Component
const Player = ({ track, onNext, onPrevious, onShuffleToggle, isShuffle }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(new Audio(track.url));
  const progressRef = useRef(null);

  // Update audio source when track changes
  useEffect(() => {
    const audio = audioRef.current;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const updateDuration = () => {
      setDuration(audio.duration);
    };

    audio.src = track.url;
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);

    if (isPlaying) {
      audio.play();
    }

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [track, isPlaying]);

  // Automatically play the next track when the current one ends
  useEffect(() => {
    const handleEnded = () => {
      onNext();
    };
    audioRef.current.addEventListener('ended', handleEnded);

    return () => {
      audioRef.current.removeEventListener('ended', handleEnded);
    };
  }, [onNext]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const handleProgressClick = (event) => {
    const progressBar = progressRef.current;
    const clickPositionX = event.clientX - progressBar.getBoundingClientRect().left;
    const progressBarWidth = progressBar.offsetWidth;
    const clickRatio = clickPositionX / progressBarWidth;
    const newTime = clickRatio * duration;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="player">
      <div className="thumbnail-container">
        {track.thumbnail && (
          <img
            src={track.thumbnail}
            alt="Thumbnail"
            className="thumbnail"
          />
        )}
      </div>
      <div className="player-controls">
        <button onClick={onPrevious}>Previous</button>
        <button onClick={togglePlayPause}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button onClick={onNext}>Next</button>
        <button onClick={onShuffleToggle}>
          {isShuffle ? 'Shuffle On' : 'Shuffle Off'}
        </button>
      </div>
      <div className="progress-container" onClick={handleProgressClick} ref={progressRef}>
        <div
          className="progress"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />
      </div>
      <div className="time">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

// Playlist Component
const Playlist = ({ tracks, onTrackSelect }) => (
  <div className="playlist">
    <h2>Playlist</h2>
    <ul>
      {tracks.map((track, index) => (
        <li key={index} onClick={() => onTrackSelect(track)}>
          {track.title} - {track.artist}
        </li>
      ))}
    </ul>
  </div>
);

function App() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [tracks, setTracks] = useState([]);
  const [isShuffle, setIsShuffle] = useState(false);

  // Current track is determined by the currentTrackIndex
  const currentTrack = tracks[currentTrackIndex];

  const handleFileUpload = (event) => {
    const files = event.target.files;
    const newTracks = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);

      const newTrack = {
        title: file.name,
        artist: 'Unknown Artist',
        url: url,
        thumbnail: 'path_to_default_thumbnail_image' // Placeholder thumbnail URL
      };

      newTracks.push(newTrack);
    }

    setTracks([...tracks, ...newTracks]);
    if (tracks.length === 0 && newTracks.length > 0) {
      setCurrentTrackIndex(0);
    }
  };

  const handleNextTrack = () => {
    if (isShuffle) {
      // Pick a random track
      const randomIndex = Math.floor(Math.random() * tracks.length);
      setCurrentTrackIndex(randomIndex);
    } else {
      // Go to the next track in order
      setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length);
    }
  };

  const handlePreviousTrack = () => {
    if (isShuffle) {
      // Pick a random track
      const randomIndex = Math.floor(Math.random() * tracks.length);
      setCurrentTrackIndex(randomIndex);
    } else {
      // Go to the previous track in order
      setCurrentTrackIndex((prevIndex) =>
        prevIndex === 0 ? tracks.length - 1 : prevIndex - 1
      );
    }
  };

  const handleShuffleToggle = () => {
    setIsShuffle(!isShuffle);
  };

  const handleTrackSelect = (track) => {
    const selectedTrackIndex = tracks.findIndex(t => t.url === track.url);
    setCurrentTrackIndex(selectedTrackIndex);
  };

  return (
    <div className="app">
      <input
        type="file"
        id="file-upload"
        accept="audio/*"
        onChange={handleFileUpload}
        multiple
      />
      <label htmlFor="file-upload" className="custom-file-upload">
        Upload Your Music
      </label>
      {currentTrack && <NowPlaying track={currentTrack} />}
      {currentTrack && (
        <Player
          track={currentTrack}
          onNext={handleNextTrack}
          onPrevious={handlePreviousTrack}
          onShuffleToggle={handleShuffleToggle}
          isShuffle={isShuffle}
        />
      )}
      <Playlist tracks={tracks} onTrackSelect={handleTrackSelect} />
    </div>
  );
}

export default App;
