from rest_framework import serializers
from .models import AudioFile, Transcription

class AudioFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AudioFile
        fields = ['id', 'file','original_filename', 'uploaded_at']  # Include the original filename

class TranscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transcription
        fields = ['id', 'original_audio_filename', 'audio_file', 'transcription_text', 'created_at', 'updated_at']
