from app.models import *
from rest_framework import viewssets, permissions
from .serializers import *

class UserViewSet(viewssets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = UserSerializer

# ======      =======      ======      ======     ======     ======      =======      =======

class ReviewViewSet(viewssets.ModelViewSet):
    queryset = Review.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = RequestSerializer

# ======      =======      ======      ======     ======     ======      =======      =======

class FollowViewSet(viewssets.ModelViewSet):
    queryset = Review.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = FollowSerializer

# ======      =======      ======      ======     ======     ======      =======      =======

class PickUp_PlacesViewSet(viewssets.ModelViewSet):
    queryset = PickUp_Places.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = PickUp_PlacesSerializer

# ======      =======      ======      ======     ======     ======      =======      =======

class Give_ItemViewSet(viewssets.ModelViewSet):
    queryset = Give_Item.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = Give_ItemSerializer

# ======      =======      ======      ======     ======     ======      =======      =======

class FavoriteViewSet(viewssets.ModelViewSet):
    queryset = Favorite.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = FavoriteSerializer

# ======      =======      ======      ======     ======     ======      =======      =======

class CommentViewSet(viewssets.ModelViewSet):
    queryset = Comment.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = CommentSerializer

# ======      =======      ======      ======     ======     ======      =======      =======

class Item_ImageViewSet(viewssets.ModelViewSet):
    queryset = Item_Image.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = Item_ImageSerializer

# ======      =======      ======      ======     ======     ======      =======      =======

class CategoryViewSet(viewssets.ModelViewSet):
    queryset = Category.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = CategorySerializer

# ======      =======      ======      ======     ======     ======      =======      =======

class BlandViewSet(viewssets.ModelViewSet):
    queryset = Bland.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = BlandSerializer

# ======      =======      ======      ======     ======     ======      =======      =======

class KeywordViewSet(viewssets.ModelViewSet):
    queryset = Keyword.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = KeywordSerializer

# ======      =======      ======      ======     ======     ======      =======      =======

class Want_ItemViewSet(viewssets.ModelViewSet):
    queryset = Want_Item.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = Want_ItemSerializer

# ======      =======      ======      ======     ======     ======      =======      =======

class Parent_ItemViewSet(viewssets.ModelViewSet):
    queryset = Parent_Item.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = Parent_ItemSerializer

# ======      =======      ======      ======     ======     ======      =======      =======

class RequestViewSet(viewssets.ModelViewSet):
    queryset = Request.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = RequestSerializer

# ======      =======      ======      ======     ======     ======      =======      =======

class Meeting_TimeViewSet(viewssets.ModelViewSet):
    queryset = Meeting_Time.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = Meeting_TimeSerializer

# ======      =======      ======      ======     ======     ======      =======      =======

class DealViewSet(viewssets.ModelViewSet):
    queryset = Deal.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = DealSerializer

# ======      =======      ======      ======     ======     ======      =======      =======

class Private_MessageViewSet(viewssets.ModelViewSet):
    queryset = Private_Message.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = Private_MessageSerializer

# ======      =======      ======      ======     ======     ======      =======      =======

class HistoryViewSet(viewssets.ModelViewSet):
    queryset = History.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = HistorySerializer

# ======      =======      ======      ======     ======     ======      =======      =======

class Request_DealViewSet(viewssets.ModelViewSet):
    queryset = Request_Deal.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = Request_DealSerializer

