from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import AudioFileViewSet
from api.views import upload_view

router = DefaultRouter()
router.register(r'audio', AudioFileViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
     path('upload/', upload_view, name='upload'),
]

from django.conf import settings
from django.conf.urls.static import static

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
