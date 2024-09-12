from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import AudioFileViewSet
from api.views import upload_view
from api.views import TranscriptionListCreateView, TranscriptionDetailView
from api.views import check_task_status

router = DefaultRouter()
router.register(r'audio', AudioFileViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('upload/', upload_view, name='upload'),
    path('api/transcriptions/', TranscriptionListCreateView.as_view(), name='transcription-list-create'),
    path('api/transcriptions/<int:pk>/', TranscriptionDetailView.as_view(), name='transcription-detail'),
    path('api/task-status/<str:task_id>/', check_task_status, name='task-status'),
]

from django.conf import settings
from django.conf.urls.static import static

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
