from django.contrib import admin
from .models import Transcription, AudioFile

@admin.register(AudioFile)
class AudioFileAdmin(admin.ModelAdmin):
    list_display = ('file', 'original_filename', 'uploaded_at')

@admin.register(Transcription)
class TranscriptionAdmin(admin.ModelAdmin):
    list_display = ('id', 'original_audio_filename', 'transcription_text', 'audio_file', 'created_at', 'updated_at')
