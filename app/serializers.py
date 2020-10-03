from rest_framework import serializers
from .models import *
from django.contrib.auth.hashers import make_password

from django.utils import timezone
from allauth.account import app_settings as allauth_settings
from allauth.utils import (email_address_exists,
                           get_username_max_length)
from allauth.account.adapter import get_adapter


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"
        write_only_fields = ('password')
        read_only_fields = ['id']

    def validate_username(self, value):
        if len(value) <= 4:
            raise serializers.ValidationError("ユーザーネームは5文字以上で入力してください")
        return value

    def validate_password(self, value):
        if len(value) <= 7:
            raise serializers.ValidationError("パスワードは最低8文字以上で入力してください")
        return value

    def create(self, validated_data):
        password = validated_data.get('password')
        validated_data['password'] = make_password(password)
        return User.objects.create(**validated_data)

    # def validate(self, data):
    #     if data.get('password') != data.get('confirm_pass'):
    #         raise serializers.ValidationError("パスワードが一致しません")
    #     return data

# ======      =======      ======      ======     ======     ======      =======      =======


class ReviewSerializer(serializers.ModelSerializer):

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

    class Meta:
        model = Notification
        fields = "__all__"

# ======      =======      ======      ======     ======     ======      =======      =======


class FollowSerializer(serializers.ModelSerializer):

    class Meta:
        model = Follow
        fields = "__all__"

# ======      =======      ======      ======     ======     ======      =======      =======


class PickUp_PlacesSerializer(serializers.ModelSerializer):

    class Meta:
        model = PickUp_Places
        fields = "__all__"

# ======      =======      ======      ======     ======     ======      =======      =======


class Give_ItemSerializer(serializers.ModelSerializer):
    # API動作確認時用(idだと見辛いので、閲覧時のみコメントアウト)
    # parent_item = serializers.StringRelatedField()

    class Meta:
        model = Give_Item
        fields = "__all__"


# ======      =======      ======      ======     ======     ======      =======      =======

class FavoriteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Favorite
        fields = "__all__"

# ======      =======      ======      ======     ======     ======      =======      =======


class CommentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Comment
        fields = "__all__"

# ======      =======      ======      ======     ======     ======      =======      =======


class Item_ImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Item_Image
        fields = "__all__"

# ======      =======      ======      ======     ======     ======      =======      =======


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = "__all__"

# ======      =======      ======      ======     ======     ======      =======      =======


class BlandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bland
        fields = "__all__"

    def validate_name(self, value):
        if len(value) == 0:
            raise serializers.ValidationError("ブランド名は必ず1文字入力してください")
        return value


# ======      =======      ======      ======     ======     ======      =======      =======


class KeywordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Keyword
        fields = ["id", "name"]

    def validate_name(self, value):
        if len(value) < 1:
            raise serializers.ValidationError("キーワードは必ず1文字以上で設定してください")
        return value

# ======      =======      ======      ======     ======     ======      =======      =======


class Want_ItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = Want_Item
        fields = "__all__"

# ======      =======      ======      ======     ======     ======      =======      =======


class Parent_ItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = Parent_Item
        fields = "__all__"

    def validate_name(self, value):
        if len(value) <= 4:
            raise serializers.ValidationError("商品名は必ず5文字以上入力してください")
        return value

# ======      =======      ======      ======     ======     ======      =======      =======


class RequestSerializer(serializers.ModelSerializer):

    class Meta:
        model = Request
        fields = "__all__"

# ======      =======      ======      ======     ======     ======      =======      =======


class Meeting_TimeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Meeting_Time
        fields = "__all__"

    def validate_what_time(self, value):
        if value < timezone.now():
            raise serializers.ValidationError("過去の日付を選択することはできません。")
        return value

# ======      =======      ======      ======     ======     ======      =======      =======


class DealSerializer(serializers.ModelSerializer):

    class Meta:
        model = Deal
        fields = "__all__"

# ======      =======      ======      ======     ======     ======      =======      =======


class Private_MessageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Private_Message
        fields = "__all__"

# ======      =======      ======      ======     ======     ======      =======      =======


class HistorySerializer(serializers.ModelSerializer):

    class Meta:
        model = History
        fields = "__all__"

# ======      =======      ======      ======     ======     ======      =======      =======


class Request_DealSerializer(serializers.ModelSerializer):

    class Meta:
        model = Request_Deal
        fields = "__all__"
