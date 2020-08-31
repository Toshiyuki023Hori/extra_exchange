from  rest_framework  import serializers
from .models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = "__all__"

class FollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follow
        fields = "__all__"

class PickUp_PlacesSerializer(serializers.ModelSerializer):
    class Meta:
        model = PickUp_Places
        fields = "__all__"

class Give_ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Give_Item
        fields = "__all__"

class FavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = "__all__"

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = "__all__"

class Item_ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item_Image
        fields = "__all__"

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"

class BlandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bland
        fields = "__all__"

class KeywordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Keyword
        fields = "__all__"

class Want_ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Want_Item
        fields = "__all__"

class Parent_ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parent_Item
        fields = "__all__"

class RequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Request
        fields = "__all__"

class Meeting_TimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meeting_Time
        fields = "__all__"

class DealSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deal
        fields = "__all__"

class Private_MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Private_Message
        fields = "__all__"

class HistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = History
        fields = "__all__"

class Request_DealSerializer(serializers.ModelSerializer):
    class Meta:
        model = Request_Deal
        fields = "__all__"