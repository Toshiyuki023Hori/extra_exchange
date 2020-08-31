from rest_framework import generics

from app.models import *
from .serializers import BlandSerializer
# from django.shortcuts import render

class BlandAPIView(generics.ListAPIView):
    queryset = Bland.objects.all()
    serializer_class = BlandSerializer
