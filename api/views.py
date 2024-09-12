##views.py
from rest_framework import viewsets
from .models import AudioFile
from .serializers import AudioFileSerializer
from django.shortcuts import render
from .forms import AudioFileForm

from rest_framework import generics
from .models import Transcription
from .serializers import TranscriptionSerializer

from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

from .tasks import process_audio_file
from .tasks import process_transcription
from django.http import JsonResponse

class TranscriptionListCreateView(generics.ListCreateAPIView):
    # queryset = Transcription.objects.all()
    serializer_class = TranscriptionSerializer
    
    def get_queryset(self):
        original_audio_filename = self.request.query_params.get('audio_file', None)  # Fetching original filename from query params
        if original_audio_filename is not None:
            return Transcription.objects.filter(original_audio_filename=original_audio_filename)
        return Transcription.objects.all()

    def perform_create(self, serializer):
        audio_file = self.request.data.get('audio_file')
        original_audio_filename = self.request.data.get('audio_file')
        serializer.save(audio_file=audio_file, original_audio_filename=original_audio_filename)

# class TranscriptionDetailView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Transcription.objects.all()
#     serializer_class = TranscriptionSerializer

class TranscriptionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Transcription.objects.all()
    serializer_class = TranscriptionSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)

        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        self.perform_update(serializer)

        return Response(serializer.data)
    

class AudioFileViewSet(viewsets.ModelViewSet):
    queryset = AudioFile.objects.all()
    serializer_class = AudioFileSerializer
    

def upload_view(request):
    success_message = None
    if request.method == 'POST':
        form = AudioFileForm(request.POST, request.FILES)
        if form.is_valid():
            audio_file = form.save()
            # process_audio_file.delay(audio_file.id)  # Trigger the task
            success_message = "File uploaded successfully! Processing in the background ."
            # Trigger the Celery task
            result = process_transcription.delay(audio_file.file.path)
            return JsonResponse({"message": success_message, "task_id": result.id})
    else:
        form = AudioFileForm()
    return render(request, 'upload.html', {'form': form, 'success_message': success_message})

# def upload_view(request):
#     success_message = None
#     if request.method == 'POST':
#         form = AudioFileForm(request.POST, request.FILES)
#         if form.is_valid():
#             form.save()
#             success_message = "File uploaded successfully!"
#     else:
#         form = AudioFileForm()
#     return render(request, 'upload.html', {'form': form, 'success_message': success_message})


# from django.http import JsonResponse
from celery.result import AsyncResult

def check_task_status(request, task_id):
    task_result = AsyncResult(task_id)
    
    if task_result.state == 'PENDING':
        response = {
            'state': task_result.state,
            'status': 'Task is pending...'
        }
    elif task_result.state != 'FAILURE':
        response = {
            'state': task_result.state,
            'result': task_result.result,
        }
    else:
        response = {
            'state': task_result.state,
            'status': str(task_result.info),  # Exception info
        }
    
    return JsonResponse(response)
