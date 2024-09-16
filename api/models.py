##models.py
from django.db import models
from django.core.exceptions import ValidationError

def validate_audio_file(file):
    valid_mime_types = ['audio/mpeg', 'audio/wav', 'audio/x-wav']
    if file.content_type not in valid_mime_types:
        raise ValidationError('Unsupported file type.')

class AudioFile(models.Model):
    file = models.FileField(upload_to='audio/')
    original_filename = models.CharField(max_length=255, blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.original_filename:
            self.original_filename = self.file.name
        super().save(*args, **kwargs)

    def __str__(self):
        return self.original_filename or "Unnamed Audio File"


class Transcription(models.Model):
    original_audio_filename = models.CharField(max_length=255, db_index=True)  # Store original filename
    audio_file = models.CharField(max_length=255, db_index=True)  # Reference to the audio file
    transcription_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Transcription for {self.audio_file}"