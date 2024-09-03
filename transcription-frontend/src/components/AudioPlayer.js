//AudioPlayer.js
import React, { useEffect, useRef, useCallback, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import axios from 'axios';


const AudioPlayer = ({ audioUrl, originalFilename }) => { 
    const waveformRef = useRef(null);
    const wavesurferRef = useRef(null);
    const [transcription, setTranscription] = useState('');
    const [transcriptionId, setTranscriptionId] = useState(null);
    // const [originalFilename, setOriginalFilename] = useState('');

    // const initializeWavesurfer = useCallback(() => {
    //     if (!wavesurferRef.current) {
    //         wavesurferRef.current = WaveSurfer.create({
    //             container: waveformRef.current,
    //             waveColor: '#ddd',
    //             progressColor: '#4A90E2',
    //             cursorColor: '#333',
    //             barWidth: 2,
    //             height: 80,
    //             responsive: true,
    //         });
    //     }

    //     if (audioUrl) {
    //         wavesurferRef.current.load(audioUrl);
    //     }
    // }, [audioUrl]);


    const initializeWavesurfer = useCallback(() => {
        if (!wavesurferRef.current) {
            wavesurferRef.current = WaveSurfer.create({
                container: waveformRef.current,
                waveColor: '#ddd',
                progressColor: '#4A90E2',
                cursorColor: '#333',
                barWidth: 2,
                height: 80,
                responsive: true,
                backend: 'MediaElement', // Stream audio instead of loading it all at once
                xhr: {
                    cache: 'default',
                    mode: 'cors',
                    method: 'GET',
                    credentials: 'same-origin',
                    redirect: 'follow',
                    referrer: 'client',
                    integrity: '',
                    referrerPolicy: 'no-referrer-when-downgrade',
                },
                audioContext: null,
                audioScriptProcessor: null,
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

    useEffect(() => {
        loadTranscription();
    }, [originalFilename]);

    const handleTranscriptionChange = (event) => {
        setTranscription(event.target.value);
    };

    const saveTranscription = async () => {
        try {
            console.log("Transcription text:", transcription)
            const response = transcriptionId 
            ? await axios.put(`http://127.0.0.1:8000/api/transcriptions/${transcriptionId}/`, { transcription_text: transcription })
            : await axios.post('http://127.0.0.1:8000/api/transcriptions/', { audio_file: originalFilename, transcription_text: transcription });
            
            
            console.log('Transcription saved successfully:', response.data);
            setTranscriptionId(response.data.id);
            console.log('SAVETRANS URL:', response.config.url)
        } catch (error) {
            console.error('Error saving transcription:', error.response.data);
        }
    };

    const loadTranscription = async () => {
        try {
            const fileUrlParts = audioUrl.split('/');
            const filename = fileUrlParts[fileUrlParts.length - 1];
            // setOriginalFilename(filename);
            console.log('filename:', filename);
            
            const response = await axios.get(`http://127.0.0.1:8000/api/transcriptions/?audio_file=${originalFilename}`);
            console.log('URL:', response.config.url);
            console.log('response:', response.data);

            if (response.data.length > 0) {
                const existingTranscription = response.data[0];
                setTranscription(existingTranscription.transcription_text);
                setTranscriptionId(existingTranscription.id);
            }
        } catch (error) {
            console.error('Error loading transcription:', error);
        }
    };

    return (
        <div>
            <div ref={waveformRef} />
            <button onClick={() => wavesurferRef.current.playPause()}>
                Play/Pause
            </button>
            <div>
                <textarea
                    value={transcription}
                    onChange={handleTranscriptionChange}
                    placeholder="Start transcribing here..."
                    rows="10"
                    style={{ width: '100%', marginTop: '20px' }}
                />
            </div>
            <button onClick={saveTranscription}>Save Transcription</button>
        </div>
    );
};

export default AudioPlayer;
