import React, { useState } from 'react';
import axios from 'axios';
import AudioPlayer from './components/AudioPlayer';

const App = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');
    const [audioUrl, setAudioUrl] = useState('');
    const [originalFilename, setOriginalFilename] = useState('');

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

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/audio/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201) {
                setUploadStatus('File uploaded successfully!');
                setAudioUrl(response.data.file);  
                setOriginalFilename(response.data.original_filename)
                console.log("App JS Herer herer", response.data.original_filename);
            } else {
                setUploadStatus('File upload failed.');
            }
        } catch (error) {
            setUploadStatus('An error occurred while uploading the file.');
        }
    };

    return (
        <div>
            <h1>Audio Upload and Playback</h1>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            <p>{uploadStatus}</p>
            
            {audioUrl && <AudioPlayer audioUrl={audioUrl} originalFilename={originalFilename}/>}
        </div>
    );
};

export default App;
