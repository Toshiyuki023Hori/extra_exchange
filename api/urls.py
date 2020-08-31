from django.urls import path
from .views import BlandAPIView

urlpatterns = [
    path("", BlandAPIView.as_view())
]