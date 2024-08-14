from rest_framework import viewsets
from .models import AudioFile
from .serializers import AudioFileSerializer

from django.shortcuts import render
from .forms import AudioFileForm

class AudioFileViewSet(viewsets.ModelViewSet):
    queryset = AudioFile.objects.all()
    serializer_class = AudioFileSerializer


def upload_view(request):
    success_message = None
    if request.method == 'POST':
        form = AudioFileForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            success_message = "File uploaded successfully!"
    else:
        form = AudioFileForm()
    return render(request, 'upload.html', {'form': form, 'success_message': success_message})