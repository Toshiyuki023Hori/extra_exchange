from rest_framework import serializers
from app.models import *

class BlandSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        field = ("name")