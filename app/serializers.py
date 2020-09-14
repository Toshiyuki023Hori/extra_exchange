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
        if len(value) <= 5:
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
    # JSON内で、Stringとして外部キーをIDではなくStringで表示させるために、
    # ForeignKeyを持つ全てのfieldに以下のように記述
    owner = serializers.StringRelatedField()
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
        if len(value) <= 1:
            raise serializers.ValidationError("キーワードは必ず2文字以上で設定してください")
        return value

# ======      =======      ======      ======     ======     ======      =======      =======


class Want_ItemSerializer(serializers.ModelSerializer):
    parent_item = serializers.StringRelatedField()

    class Meta:
        model = Want_Item
        fields = "__all__"

    def create(self, validated_data):
        parent_item = validated_data.pop("parent_item")

        want_item = Want_Item(**validated_data)
        want_item.save()

        want_item(parent_item=parent_item)
        want_item.save()

        return want_item

    def update(self, instance, validated_data):
        instance.url = validated_data.get("url", instance.url)
        instance.save()

        return instance

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
        return value

    def create(self, validated_data):
        # 多関係のクエリセット作成のために値を保持
        keywords = validated_data.pop("keyword")
        owner = validated_data.pop("owner")
        bland = validated_data.pop("bland")
        request_deals = validated_data.pop("request_deal")

        parent_item = Parent_Item(**validated_data)
        parent_item.save()

        # ManyToOne relation
        parent_item(owner=owner)
        parent_item(bland=bland)
        parent_item.save()

        # OneToMany or ManyToMany relation
        for request_deal in request_deals:
            parent_item(request_deal=request_deal)

        for keyword in keywords:
            parent_item(
                keyword=keyword)

        parent_item.save()
        return parent_item

    def update(self, instance, validated_data):
        instance.name = validated_data.get("name", instance.name)
        instance.save()

        keywords = validated_data.get("keyword")

        for keyword in keywords:
            keyword_id = keyword.get("id", None)
            if keyword_id:
                keyword_object = Keyword.objects.get(
                    id=keyword_id, parent_item=instance)
                keyword_object.name = keyword.get("name", keyword_object.name)
                keyword_object.save()
            else:
                Keyword.objects.create(account=instance, **keyword)

        bland = validated_data.get("bland")
        bland_id = bland.get("id", None)
        bland_object = Bland.objects.get(
            id=bland_id, parent_item=instance
        )
        bland_object.name = keyword.get("name", bland_object.name)
        bland_object.save()

        return instance

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
        return value

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
