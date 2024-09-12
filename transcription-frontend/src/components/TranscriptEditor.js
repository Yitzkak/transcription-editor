// TranscriptEditor.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../styles/styles.css'; // Import the stylesheet

const TranscriptEditor = ({ originalFilename, fontSize, transcription, setTranscription }) => {
    
    const [transcriptionId, setTranscriptionId] = useState(null);
    const textareaRef = useRef(null); // Create a reference for the textarea

    useEffect(() => {
        loadTranscription();
    }, [originalFilename]);

    const handleTranscriptionChange = (event) => {
        setTranscription(event.target.value);
    };

    const saveTranscription = async () => {
        try {
            console.log("originalFilename", originalFilename);
            console.log("transcription", transcription)
            const response = transcriptionId
                ? await axios.put(`http://127.0.0.1:8000/api/transcriptions/${transcriptionId}/`, { transcription_text: transcription })
                : await axios.post('http://127.0.0.1:8000/api/transcriptions/', { audio_file: originalFilename, transcription_text: transcription });
            console.log("Response Idea:", response);
            setTranscriptionId(response.data.id);
            
        } catch (error) {
            console.error('Error saving transcription:', error.response.data);
        }
    };

    const loadTranscription = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/transcriptions/?audio_file=${originalFilename}`);

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
            <textarea
                value={transcription}
                onChange={handleTranscriptionChange}
                placeholder="Start transcribing here..."
                rows="50"
                style={{  padding:'3%', width: '93.3%', marginTop: '20px', fontSize: `${fontSize}px` }}
                
            />
            <button onClick={saveTranscription}>Save Transcription</button>
        </div>
    );
};

export default TranscriptEditor;
