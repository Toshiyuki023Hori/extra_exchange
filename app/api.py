from app.models import *
from rest_framework import viewsets, permissions
from .serializers import *
from django_filters import rest_framework as filters
from rest_framework.parsers import MultiPartParser, FormParser


# ======      =======      ======      以下、Modelsに関わるViewSet     ======     ======      =======      =======

# ======      =======      ======      ======     ======     ======      =======      =======
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = UserSerializer
    # parser_classes = (MultiPartParser,FormParser)

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

    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = "__all__"

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

    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = "__all__"

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

    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = "__all__"

# ======      =======      ======      ======     ======     ======      =======      =======


class BlandViewSet(viewsets.ModelViewSet):
    queryset = Bland.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = BlandSerializer

    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = "__all__"

# ======      =======      ======      ======     ======     ======      =======      =======


class KeywordViewSet(viewsets.ModelViewSet):
    queryset = Keyword.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = KeywordSerializer

    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = "__all__"

# ======      =======      ======      ======     ======     ======      =======      =======


class Want_ItemViewSet(viewsets.ModelViewSet):
    queryset = Want_Item.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = Want_ItemSerializer

    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = "__all__"

# ======      =======      ======      ======     ======     ======      =======      =======


class Parent_ItemViewSet(viewsets.ModelViewSet):
    queryset = Parent_Item.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = Parent_ItemSerializer

    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = "__all__"

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

    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = "__all__"

# ======      =======      ======      ======     ======     ======      =======      =======


class Request_DealViewSet(viewsets.ModelViewSet):
    queryset = Request_Deal.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = Request_DealSerializer
