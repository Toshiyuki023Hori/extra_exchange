from  rest_framework  import serializers
from .models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"

# ======      =======      ======      ======     ======     ======      =======      =======

class ReviewSerializer(serializers.ModelSerializer):
    # JSON内で、Stringとして外部キーをIDではなくStringで表示させるために、
    # ForeignKeyを持つ全てのfieldに以下のように記述
    reviewer = serializers.StringRelatedField()
    reviewedUser = serializers.StringRelatedField()

    class Meta:
        model = Review
        fields = "__all__"

# ======      =======      ======      ======     ======     ======      =======      =======

class FollowSerializer(serializers.ModelSerializer):
    owner = serializers.StringRelatedField()
    follow = serializers.StringRelatedField()

    class Meta:
        model = Follow
        fields = "__all__"

# ======      =======      ======      ======     ======     ======      =======      =======

class PickUp_PlacesSerializer(serializers.ModelSerializer):
    choosingUser = serializers.StringRelatedField(many = True)

    class Meta:
        model = PickUp_Places
        fields = "__all__"

# ======      =======      ======      ======     ======     ======      =======      =======

class Give_ItemSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField()
    parent_item = serializers.StringRelatedField()

    class Meta:
        model = Give_Item
        fields = "__all__"

# ======      =======      ======      ======     ======     ======      =======      =======

class FavoriteSerializer(serializers.ModelSerializer):
    owner = serializers.StringRelatedField()
    item = serializers.StringRelatedField()

    class Meta:
        model = Favorite
        fields = "__all__"

# ======      =======      ======      ======     ======     ======      =======      =======

class CommentSerializer(serializers.ModelSerializer):
    owner = serializers.StringRelatedField()
    item = serializers.StringRelatedField()

    class Meta:
        model = Comment
        fields = "__all__"

# ======      =======      ======      ======     ======     ======      =======      =======

class Item_ImageSerializer(serializers.ModelSerializer):
    item = serializers.StringRelatedField()

    class Meta:
        model = Item_Image
        fields = "__all__"

# ======      =======      ======      ======     ======     ======      =======      =======

class CategorySerializer(serializers.ModelSerializer):
    parent = serializers.StringRelatedField()

    class Meta:
        model = Category
        fields = "__all__"

# ======      =======      ======      ======     ======     ======      =======      =======

class BlandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bland
        fields = "__all__"

# ======      =======      ======      ======     ======     ======      =======      =======

class KeywordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Keyword
        fields = "__all__"

# ======      =======      ======      ======     ======     ======      =======      =======

class Want_ItemSerializer(serializers.ModelSerializer):
    parent_item = serializers.StringRelatedField()

    class Meta:
        model = Want_Item
        fields = "__all__"

# ======      =======      ======      ======     ======     ======      =======      =======

class Parent_ItemSerializer(serializers.ModelSerializer):
    owner = serializers.StringRelatedField()
    keyword = serializers.StringRelatedField(many = True)
    bland = serializers.StringRelatedField()
    request_deal = serializers.StringRelatedField()

    class Meta:
        model = Parent_Item
        fields = "__all__"

# ======      =======      ======      ======     ======     ======      =======      =======

class RequestSerializer(serializers.ModelSerializer):
    request_deal = serializers.StringRelatedField()

    class Meta:
        model = Request
        fields = "__all__"

# ======      =======      ======      ======     ======     ======      =======      =======

class Meeting_TimeSerializer(serializers.ModelSerializer):
    request = serializers.StringRelatedField()

    class Meta:
        model = Meeting_Time
        fields = "__all__"

# ======      =======      ======      ======     ======     ======      =======      =======

class DealSerializer(serializers.ModelSerializer):
    history = serializers.StringRelatedField()
    request_deal = serializers.StringRelatedField()

    class Meta:
        model = Deal
        fields = "__all__"

# ======      =======      ======      ======     ======     ======      =======      =======

class Private_MessageSerializer(serializers.ModelSerializer):
    owner = serializers.StringRelatedField()
    deal = serializers.StringRelatedField()

    class Meta:
        model = Private_Message
        fields = "__all__"

# ======      =======      ======      ======     ======     ======      =======      =======

class HistorySerializer(serializers.ModelSerializer):
    owner = serializers.StringRelatedField()

    class Meta:
        model = History
        fields = "__all__"

# ======      =======      ======      ======     ======     ======      =======      =======

class Request_DealSerializer(serializers.ModelSerializer):
    host_user = serializers.StringRelatedField()
    join_user = serializers.StringRelatedField()

    class Meta:
        model = Request_Deal
        fields = "__all__"