from django.urls import path
from .views import TranscriptionListCreateView

urlpatterns = [
    path('transcriptions/', TranscriptionListCreateView.as_view(), name='transcription-list-create'),
]
