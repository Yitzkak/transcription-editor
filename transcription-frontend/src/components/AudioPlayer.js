// AudioPlayer.js
import React, { useEffect, useRef, useCallback , useState} from 'react';
import WaveSurfer from 'wavesurfer.js';

const AudioPlayer = ({ audioUrl, increaseFontSize, decreaseFontSize, onAddTimestamp }) => {
    const waveformRef = useRef(null);
    const wavesurferRef = useRef(null);
    const [volume, setVolume] = useState(1); // Volume state, default is 1 (max)
    const [playbackSpeed, setPlaybackSpeed] = useState(1); // Playback speed state
    const [isLooping, setIsLooping] = useState(false);
    const [transcription, setTranscription] = useState('');
    const [transcriptionId, setTranscriptionId] = useState(null);
    

    const initializeWavesurfer = useCallback(() => {
        if (!wavesurferRef.current) {
            wavesurferRef.current = WaveSurfer.create({
                container: waveformRef.current,
                waveColor: '#ddd',
                progressColor: '#4A90E2',
                cursorColor: '#333',
                barWidth: 2,
                height: 40,
                responsive: true,
                backend: 'MediaElement', // Stream audio instead of loading it all at once
            });

            wavesurferRef.current.on('error', (error) => {
                console.error('WaveSurfer Error:', error);
                alert('An error occurred while loading the audio file.');
            });
        }

        if (audioUrl) {
            wavesurferRef.current.load(audioUrl);
        }
    }, [audioUrl]);

    useEffect(() => {
        initializeWavesurfer();

        return () => {
            if (wavesurferRef.current) {
                wavesurferRef.current.destroy();
                wavesurferRef.current = null;
            }
        };
    }, [initializeWavesurfer]);

    const toggleLoop = () => {
        setIsLooping(!isLooping);
        wavesurferRef.current.setLoop(!isLooping);
    };

    // SkipForward/SkipBackwardks
    const skipForward = (seconds) => {
        if (wavesurferRef.current) {
            console.log('wavesurfer: Current time', wavesurferRef.current.getCurrentTime());
            const currentPosition = wavesurferRef.current.getCurrentTime(); // Current time in seconds
            const duration = wavesurferRef.current.getDuration(); // Total audio duration in seconds
            const newPosition = Math.min(currentPosition + seconds, duration); // Ensure not to skip beyond the track
    
            wavesurferRef.current.seekTo(newPosition / duration); // seekTo expects a value between 0 and 1
        }
    };
    
    const skipBackward = (seconds) => {
        if (wavesurferRef.current) {
            console.log('wavesurfer: Back Current time', wavesurferRef.current.getCurrentTime());
            console.log('wavesurfer: skipping forward', wavesurferRef.current);
            const currentPosition = wavesurferRef.current.getCurrentTime();
            const newPosition = Math.max(currentPosition - seconds, 0); // Ensure not to skip before the track starts
    
            wavesurferRef.current.seekTo(newPosition / wavesurferRef.current.getDuration());
        }
    };


    const handleSkipForward = () => {
        skipForward(10); // Skip forward by 10 seconds
    };

    const handleSkipBackward = () => {
        skipBackward(10); // Skip backward by 10 seconds
    };

    const resetToStart = () => {
        wavesurferRef.current.seekTo(0); // Resets to the start
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (wavesurferRef.current) {
            wavesurferRef.current.setVolume(newVolume);
        }
    };

    // Handle playback speed change
    const handleSpeedChange = (e) => {
        const newSpeed = parseFloat(e.target.value);
        setPlaybackSpeed(newSpeed);
        if (wavesurferRef.current) {
            wavesurferRef.current.setPlaybackRate(newSpeed);
        }
    };

    const getCurrentTimestamp = () => {
        console.log('getCurrentTimestamp:2');
        const currentTime = wavesurferRef.current.getCurrentTime();
        const hours = Math.floor(currentTime / 3600);
        const minutes = Math.floor((currentTime % 3600) / 60);
        const seconds = (currentTime % 60).toFixed(1);
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleAddTimestampClick = () => {
        console.log('handleAddTimestampClick:1');
        const timestamp = getCurrentTimestamp();
        onAddTimestamp(timestamp);  // Call the function from App.js
    };
    
    return (
        <div>
            <div ref={waveformRef} />
            <div className="controls-row">
                <button onClick={() => wavesurferRef.current.playPause()}>
                    Play/Pause
                </button>
                <button onClick={ handleSkipBackward}>⏪ Jump -5s</button>
                <button onClick={handleSkipForward}>⏩ Jump +5s</button>
                <button onClick={handleAddTimestampClick}>Add Timestamp</button>
                <button onClick={toggleLoop}>{isLooping ? '🔁 Looping' : '🔁 Loop'}</button>
                <button onClick={resetToStart}>🔄 Reset</button>
                <button onClick={decreaseFontSize}>A-</button>
                <button onClick={increaseFontSize}>A+</button>
            </div>

            <div className="audio-controls">
                {/* Volume Control */}
                <label htmlFor="volume">Volume: {Math.round(volume * 100)}%</label>
                <input
                    type="range"
                    id="volume"
                    min="0"
                    max="1"
                    step="0.001"
                    value={volume}
                    onChange={handleVolumeChange}
                />

                {/* Playback Speed Control */}
                <label htmlFor="speed">Speed: {playbackSpeed}x</label>
                <select id="speed" value={playbackSpeed} onChange={handleSpeedChange}>
                    <option value="0.5">0.5x</option>
                    <option value="1">1x</option>
                    <option value="1.5">1.5x</option>
                    <option value="2">2x</option>
                </select>
            </div>
        </div>
    );
};

export default AudioPlayer;
