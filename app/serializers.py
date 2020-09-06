from rest_framework import serializers
from .models import *

from django.utils import timezone


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"

    def validate_username(self, value):
        if len(value) <= 5:
            raise serializers.ValidationError("ユーザーネームは5文字以上で入力してください")
        return value

    def validate_password(self, value):
        if len(value) <= 7:
            raise serializers.ValidationError("パスワードは最低8文字以上で入力してください")
        return value

    def validate(self, data):
        if data.get('password') != data.get('confirm_pass'):
            raise serializers.ValidationError("パスワードが一致しません")
        return data

# ======      =======      ======      ======     ======     ======      =======      =======


class ReviewSerializer(serializers.ModelSerializer):
    # JSON内で、Stringとして外部キーをIDではなくStringで表示させるために、
    # ForeignKeyを持つ全てのfieldに以下のように記述
    reviewer = serializers.StringRelatedField()
    reviewedUser = serializers.StringRelatedField()

    class Meta:
        model = Review
        fields = "__all__"

    def validate_score(self, value):
        if value < 0.5:
            raise serializers.ValidationError("最低0.5以上の評価をつけてください")

        if value > 5.0:
            raise serializers.ValidationError("スコアの最大は5までです。")

        return value

# ======      =======      ======      ======     ======     ======      =======      =======


class NotificationSerializer(serializers.ModelSerializer):
    owner = serializers.StringRelatedField()

    class Meta:
        model = Notification
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
    choosingUser = serializers.StringRelatedField(many=True)

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

    def validate_name(self, value):
        if len(value) <= 1:
            raise serializers.ValidationError("キーワードは必ず2文字以上で設定してください")

# ======      =======      ======      ======     ======     ======      =======      =======


class Want_ItemSerializer(serializers.ModelSerializer):
    parent_item = serializers.StringRelatedField()

    class Meta:
        model = Want_Item
        fields = "__all__"

# ======      =======      ======      ======     ======     ======      =======      =======


class Parent_ItemSerializer(serializers.ModelSerializer):
    owner = serializers.StringRelatedField()
    keyword = serializers.StringRelatedField(many=True)
    bland = serializers.StringRelatedField()
    request_deal = serializers.StringRelatedField()

    class Meta:
        model = Parent_Item
        fields = "__all__"

    def validate_name(self, value):
        if len(value) <= 4:
            raise serializers.ValidationError("商品名は必ず5文字以上入力してください")

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

    def validate_what_time(self, value):
        if value < timezone.now():
            raise serializers.ValidationError("過去の日付を選択することはできません。")

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
