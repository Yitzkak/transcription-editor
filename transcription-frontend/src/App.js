import React, { useState, useRef } from 'react';
import axios from 'axios';
import AudioPlayer from './components/AudioPlayer';
import TranscriptEditor from './components/TranscriptEditor';
import './styles/styles.css';
import './App.css';

const App = () => {
    const [transcription, setTranscription] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');
    const [audioUrl, setAudioUrl] = useState('');
    const [originalFilename, setOriginalFilename] = useState('');
    const [loading, setLoading] = useState(false);  // Loading state
    const [fontSize, setFontSize] = useState(14);
    const transcriptRef = useRef(null); // Create a ref for the TranscriptEditor component


    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setUploadStatus('Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        setLoading(true);  // Set loading to true when upload starts

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/audio/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201) {
                setUploadStatus('File uploaded successfully!');
                setAudioUrl(response.data.file);  
                setOriginalFilename(response.data.original_filename);
            } else {
                setUploadStatus('File upload failed.');
            }
        } catch (error) {
            setUploadStatus('An error occurred while uploading the file.');
        }

        setLoading(false);  // Set loading to false when upload completes
    };

    //Font-size functions
    const increaseFontSize = () => {
        setFontSize((size) => size + 2);
    };

    const decreaseFontSize = () => {
        setFontSize((size) => (size > 10 ? size - 2 : size)); // Prevents font getting too small
    };

    // Function to insert a timestamp at the cursor position
    const handleAddTimestamp = (timestamp) => {
        console.log('handleAddTimestamp:3');
        if (transcriptRef.current) { // Check if the textarea reference is available
            const textarea = transcriptRef.current.querySelector('textarea');
            const currentText = transcription;
            const cursorPos = textarea.selectionStart;
            const beforeCursor = currentText.slice(0, cursorPos);
            const afterCursor = currentText.slice(cursorPos);

            const timestampToInsert = cursorPos === 0 || beforeCursor.endsWith('\n') 
                                      ? `${timestamp} S1: `
                                      : `[${timestamp}] ____ `;

            const updatedText = beforeCursor + timestampToInsert + afterCursor;
            setTranscription(updatedText);
        }
    };

    return (
        <div className="app-container"> 
            {/* Header */}
            <header className="app-header">
                <div className="logo">I</div>
                <button className="upload-btn">Upload SVG</button>
            </header>

            {/* Content Area */}
            <main className="app-content">
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleUpload}>Upload</button>

                {/* Show Loading Spinner */}
                {loading && <div className="loading-spinner"></div>}

                <p>{uploadStatus}</p>
                <div>
                    {audioUrl && (
                        <>
                            <AudioPlayer audioUrl={audioUrl} increaseFontSize={increaseFontSize} decreaseFontSize={decreaseFontSize} onAddTimestamp={handleAddTimestamp} />
                            <div ref={transcriptRef}><TranscriptEditor originalFilename={originalFilename} audioUrl={audioUrl} fontSize={fontSize} transcription={transcription} setTranscription={setTranscription}/></div>
                        </>
                    )}
                </div>
                
            </main>
            
            {/* Footer */}
            <footer className="app-footer">
                {/* Footer content */}
                <p>© 2024 Your Company Name</p>
            </footer>
        </div>
    );
};

export default App;
