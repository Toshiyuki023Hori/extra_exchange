from django.contrib.auth import (
    login as django_login,
    logout as django_logout
)
from django.conf import settings
from django.utils.decorators import method_decorator
from django.utils.translation import ugettext_lazy as _
from django.views.decorators.debug import sensitive_post_parameters

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import (AllowAny,
                                        IsAuthenticated)
from rest_framework.generics import CreateAPIView, ListAPIView, GenericAPIView
from rest_framework.exceptions import NotFound
from rest_framework import status

from allauth.account.adapter import get_adapter
from allauth.account.views import ConfirmEmailView
from allauth.account.utils import complete_signup
from allauth.account import app_settings as allauth_settings
from allauth.socialaccount import signals
from allauth.socialaccount.adapter import get_adapter as get_social_adapter
from allauth.socialaccount.models import SocialAccount

from rest_auth.app_settings import (TokenSerializer,
                                    JWTSerializer,
                                    create_token)
from rest_auth.models import TokenModel
from rest_auth.registration.serializers import (VerifyEmailSerializer,
                                                SocialLoginSerializer,
                                                SocialAccountSerializer,
                                                SocialConnectSerializer)
from rest_auth.utils import jwt_encode
from rest_auth.views import LoginView
from rest_auth.registration.app_settings import register_permission_classes
from django.views.decorators.debug import sensitive_post_parameters

from app.models import *
from rest_framework import viewsets, permissions
from .serializers import *


# ======      =======      ======      以下、Modelsに関わるViewSet     ======     ======      =======      =======

# ======      =======      ======      ======     ======     ======      =======      =======
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = UserSerializer

# ======      =======      ======      ======     ======     ======      =======      =======

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = RequestSerializer

# ======      =======      ======      ======     ======     ======      =======      =======

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = NotificationSerializer

# ======      =======      ======      ======     ======     ======      =======      =======

class FollowViewSet(viewsets.ModelViewSet):
    queryset = Follow.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = FollowSerializer

# ======      =======      ======      ======     ======     ======      =======      =======

class PickUp_PlacesViewSet(viewsets.ModelViewSet):
    queryset = PickUp_Places.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = PickUp_PlacesSerializer

# ======      =======      ======      ======     ======     ======      =======      =======

class Give_ItemViewSet(viewsets.ModelViewSet):
    queryset = Give_Item.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = Give_ItemSerializer

# ======      =======      ======      ======     ======     ======      =======      =======

class FavoriteViewSet(viewsets.ModelViewSet):
    queryset = Favorite.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = FavoriteSerializer

# ======      =======      ======      ======     ======     ======      =======      =======

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = CommentSerializer

# ======      =======      ======      ======     ======     ======      =======      =======

class Item_ImageViewSet(viewsets.ModelViewSet):
    queryset = Item_Image.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = Item_ImageSerializer

# ======      =======      ======      ======     ======     ======      =======      =======

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = CategorySerializer

# ======      =======      ======      ======     ======     ======      =======      =======

class BlandViewSet(viewsets.ModelViewSet):
    queryset = Bland.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = BlandSerializer

# ======      =======      ======      ======     ======     ======      =======      =======

class KeywordViewSet(viewsets.ModelViewSet):
    queryset = Keyword.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = KeywordSerializer

# ======      =======      ======      ======     ======     ======      =======      =======

class Want_ItemViewSet(viewsets.ModelViewSet):
    queryset = Want_Item.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = Want_ItemSerializer

# ======      =======      ======      ======     ======     ======      =======      =======

class Parent_ItemViewSet(viewsets.ModelViewSet):
    queryset = Parent_Item.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = Parent_ItemSerializer

# ======      =======      ======      ======     ======     ======      =======      =======

class RequestViewSet(viewsets.ModelViewSet):
    queryset = Request.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = RequestSerializer

# ======      =======      ======      ======     ======     ======      =======      =======

class Meeting_TimeViewSet(viewsets.ModelViewSet):
    queryset = Meeting_Time.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = Meeting_TimeSerializer

# ======      =======      ======      ======     ======     ======      =======      =======

class DealViewSet(viewsets.ModelViewSet):
    queryset = Deal.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = DealSerializer

# ======      =======      ======      ======     ======     ======      =======      =======

class Private_MessageViewSet(viewsets.ModelViewSet):
    queryset = Private_Message.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = Private_MessageSerializer

# ======      =======      ======      ======     ======     ======      =======      =======

class HistoryViewSet(viewsets.ModelViewSet):
    queryset = History.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = HistorySerializer

# ======      =======      ======      ======     ======     ======      =======      =======

class Request_DealViewSet(viewsets.ModelViewSet):
    queryset = Request_Deal.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = Request_DealSerializer


# ======      =======      ======      ======     ======     ======      =======      =======

# ======      =======      ======      以下、Django Rest AuthのViewSet     ======     ======      =======      =======

# ======      =======      ======      ======     ======     ======      =======      =======


sensitive_post_parameters_m = method_decorator(
    sensitive_post_parameters(
        'password', 'old_password', 'new_password1', 'new_password2'
    )
)

# class RegisterView(CreateAPIView):
#     serializer_class = RegisterSerializer
#     permission_classes = register_permission_classes()
#     token_model = TokenModel

#     @sensitive_post_parameters_m
#     def dispatch(self, *args, **kwargs):
#         return super(RegisterView, self).dispatch(*args, **kwargs)

#     def get_response_data(self, user):
#         if allauth_settings.EMAIL_VERIFICATION == \
#                 allauth_settings.EmailVerificationMethod.MANDATORY:
#             return {"detail": _("Verification e-mail sent.")}

#         if getattr(settings, 'REST_USE_JWT', False):
#             data = {
#                 'user': user,
#                 'token': self.token
#             }
#             return JWTSerializer(data).data
#         else:
#             return TokenSerializer(user.auth_token).data

#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         user = self.perform_create(serializer)
#         headers = self.get_success_headers(serializer.data)

#         return Response(self.get_response_data(user),
#                         status=status.HTTP_201_CREATED,
#                         headers=headers)

#     def perform_create(self, serializer):
#         user = serializer.save(self.request)
#         if getattr(settings, 'REST_USE_JWT', False):
#             self.token = jwt_encode(user)
#         else:
#             create_token(self.token_model, user, serializer)

#         complete_signup(self.request._request, user,
#                         allauth_settings.EMAIL_VERIFICATION,
#                         None)
#         return user

# ======      =======      ======      ======     ======     ======      =======      =======

# class LoginView(GenericAPIView):
#     """
#     Check the credentials and return the REST Token
#     if the credentials are valid and authenticated.
#     Calls Django Auth login method to register User ID
#     in Django session framework

#     Accept the following POST parameters: username, password
#     Return the REST Framework Token Object's key.
#     """
#     permission_classes = (AllowAny,)
#     serializer_class = LoginSerializer
#     token_model = TokenModel

#     @sensitive_post_parameters_m
#     def dispatch(self, *args, **kwargs):
#         return super(LoginView, self).dispatch(*args, **kwargs)

#     def process_login(self):
#         django_login(self.request, self.user)

#     def get_response_serializer(self):
#         if getattr(settings, 'REST_USE_JWT', False):
#             response_serializer = JWTSerializer
#         else:
#             response_serializer = TokenSerializer
#         return response_serializer

#     def login(self):
#         self.user = self.serializer.validated_data['user']

#         if getattr(settings, 'REST_USE_JWT', False):
#             self.token = jwt_encode(self.user)
#         else:
#             self.token = create_token(self.token_model, self.user,
#                                       self.serializer)

#         if getattr(settings, 'REST_SESSION_LOGIN', True):
#             self.process_login()

#     def get_response(self):
#         serializer_class = self.get_response_serializer()

#         if getattr(settings, 'REST_USE_JWT', False):
#             data = {
#                 'user': self.user,
#                 'token': self.token
#             }
#             serializer = serializer_class(instance=data,
#                                           context={'request': self.request})
#         else:
#             serializer = serializer_class(instance=self.token,
#                                           context={'request': self.request})

#         response = Response(serializer.data, status=status.HTTP_200_OK)
#         if getattr(settings, 'REST_USE_JWT', False):
#             from rest_framework_jwt.settings import api_settings as jwt_settings
#             if jwt_settings.JWT_AUTH_COOKIE:
#                 from datetime import datetime
#                 expiration = (datetime.utcnow() + jwt_settings.JWT_EXPIRATION_DELTA)
#                 response.set_cookie(jwt_settings.JWT_AUTH_COOKIE,
#                                     self.token,
#                                     expires=expiration,
#                                     httponly=True)
#         return response

#     def post(self, request, *args, **kwargs):
#         self.request = request
#         self.serializer = self.get_serializer(data=self.request.data,
#                                               context={'request': request})
#         self.serializer.is_valid(raise_exception=True)

#         self.login()
#         return self.get_response()
