import React, { useState } from 'react';
import axios from 'axios';

const AudioUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

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

      console.log('Response:', response);

      if (response.status === 201) {
        setUploadStatus('File uploaded successfully!');
      } else {
        setUploadStatus('File upload failed.');
      }
    } catch (error) {
      setUploadStatus('An error occurred while uploading the file.');
    }
  };

  return (
    <div>
      <h2>Upload Audio File</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <p>{uploadStatus}</p>
    </div>
  );
};

export default AudioUpload;
