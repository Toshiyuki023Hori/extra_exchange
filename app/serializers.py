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

    def validate_username(self, value):
        if len(value) <= 5:
            raise serializers.ValidationError("ユーザーネームは5文字以上で入力してください")
        return value

    def validate_password(self, value):
        if len(value) <= 7:
            raise serializers.ValidationError("パスワードは最低8文字以上で入力してください")
        # make_passwordはパスワードをハッシュ化するために使用
        return make_password(value)

    # def validate(self, data):
    #     if data.get('password') != data.get('confirm_pass'):
    #         raise serializers.ValidationError("パスワードが一致しません")
    #     return data

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


# ======      =======      ======      ======     ======     ======      =======      =======

# ======      =======      ======      以下、Django REST Authのログイン関連     ======      =======      =======

# ======      =======      ======      ======     ======     ======      =======      =======

# usernameを消すために上書き
# class LoginSerializer(serializers.Serializer):
#     email = serializers.EmailField(required=False, allow_blank=True)
#     password = serializers.CharField(style={'input_type': 'password'})

#     def authenticate(self, **kwargs):
#         return authenticate(self.context['request'], **kwargs)

#     def _validate_email(self, email, password):
#         user = None

#         if email and password:
#             user = self.authenticate(email=email, password=password)
#         else:
#             msg = _('Must include "email" and "password".')
#             raise exceptions.ValidationError(msg)

#         return user

#     def _validate_username(self, username, password):
#         pass

#     def _validate_username_email(self, username, email, password):
#         pass

#     def validate(self, attrs):
#         email = attrs.get('email')
#         password = attrs.get('password')

#         user = None

#         if 'allauth' in settings.INSTALLED_APPS:
#             from allauth.account import app_settings

#             # Authentication through email
#             if app_settings.AUTHENTICATION_METHOD == app_settings.AuthenticationMethod.EMAIL:
#                 user = self._validate_email(email, password)

#             # Authentication through username
#             elif app_settings.AUTHENTICATION_METHOD == app_settings.AuthenticationMethod.USERNAME:
#                 user = self._validate_username(username, password)

#             # Authentication through either username or email
#             else:
#                 user = self._validate_username_email(username, email, password)

#         else:
#             # Authentication without using allauth
#             if email:
#                 try:
#                     username = UserModel.objects.get(
#                         email__iexact=email).get_username()
#                 except UserModel.DoesNotExist:
#                     pass

#             if username:
#                 user = self._validate_username_email(username, '', password)

#         # Did we get back an active user?
#         if user:
#             if not user.is_active:
#                 msg = _('User account is disabled.')
#                 raise exceptions.ValidationError(msg)
#         else:
#             msg = _('Unable to log in with provided credentials.')
#             raise exceptions.ValidationError(msg)

#         # If required, is the email verified?
#         if 'rest_auth.registration' in settings.INSTALLED_APPS:
#             from allauth.account import app_settings
#             if app_settings.EMAIL_VERIFICATION == app_settings.EmailVerificationMethod.MANDATORY:
#                 email_address = user.emailaddress_set.get(email=user.email)
#                 if not email_address.verified:
#                     raise serializers.ValidationError(
#                         _('E-mail is not verified.'))

#         attrs['user'] = user
#         return attrs


# ======      =======      ======      ======     ======     ======      =======      =======

# class RegisterSerializer(serializers.Serializer):
#     username = serializers.CharField(
#         max_length=get_username_max_length(),
#         min_length=allauth_settings.USERNAME_MIN_LENGTH,
#         required=allauth_settings.USERNAME_REQUIRED
#     )
#     email = serializers.EmailField(required=allauth_settings.EMAIL_REQUIRED)
#     password = serializers.CharField(write_only=True)

#     def validate_username(self, username):
#         username = get_adapter().clean_username(username)
#         return username

#     def validate_email(self, email):
#         email = get_adapter().clean_email(email)
#         if allauth_settings.UNIQUE_EMAIL:
#             if email and email_address_exists(email):
#                 raise serializers.ValidationError(
#                     _("A user is already registered with this e-mail address."))
#         return email

#     def validate_password(self, password):
#         return get_adapter().clean_password(password)

#     def custom_signup(self, request, user):
#         pass

#     def get_cleaned_data(self):
#         return {
#             'username': self.validated_data.get('username', ''),
#             'password': self.validated_data.get('password', ''),
#             'email': self.validated_data.get('email', '')
#         }

#     def save(self, request):
#         adapter = get_adapter()
#         user = adapter.new_user(request)
#         self.cleaned_data = self.get_cleaned_data()
#         adapter.save_user(request, user, self)
#         self.custom_signup(request, user)
#         setup_user_email(request, user, [])
#         return user
