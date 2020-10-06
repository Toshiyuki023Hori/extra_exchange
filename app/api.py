from app.models import *
from rest_framework import viewsets, permissions
from .serializers import *
from django_filters import rest_framework as filters
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status


# ======      =======      ======      以下、Modelsに関わるViewSet     ======     ======      =======      =======

# ======      =======      ======      ======     ======     ======      =======      =======
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]
    serializer_class = UserSerializer
    # parser_classes = (MultiPartParser,FormParser)

    # 一度ImageFieldを設定すれば、フロント側からImageFieldをnullでできないためアクションを追加。
    @action(detail=True, methods=["delete"], url_path="delete-background")
    def delete_background(self, request, *args, **kwargs):
        user = self.get_object()
        user.background = ""
        user.save()
        return Response("背景画像の削除が完了しました。", status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=["delete"], url_path="delete-icon")
    def delete_icon(self, request, *args, **kwargs):
        user = self.get_object()
        user.icon = ""
        user.save()
        return Response("アイコンの削除が完了しました。", status=status.HTTP_204_NO_CONTENT)

# ======      =======      ======      ======     ======     ======      =======      =======


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]
    serializer_class = RequestSerializer

    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = "__all__"

# ======      =======      ======      ======     ======     ======      =======      =======


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]
    serializer_class = NotificationSerializer

    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = "__all__"

# ======      =======      ======      ======     ======     ======      =======      =======


class FollowViewSet(viewsets.ModelViewSet):
    queryset = Follow.objects.all()
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]
    serializer_class = FollowSerializer

    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = "__all__"

# ======      =======      ======      ======     ======     ======      =======      =======


class PickUp_PlacesViewSet(viewsets.ModelViewSet):
    queryset = PickUp_Places.objects.all()
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]
    serializer_class = PickUp_PlacesSerializer

    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = "__all__"

    def get_queryset(self):
        if self.request.query_params.get("choosingUser"):
            choosingUser = self.request.query_params.get('choosingUser')
            queryset = PickUp_Places.objects.filter(
                choosing_user__id=choosingUser)
        else:
            queryset = PickUp_Places.objects.all()
        return queryset

# ======      =======      ======      ======     ======     ======      =======      =======


class Give_ItemViewSet(viewsets.ModelViewSet):
    queryset = Give_Item.objects.all()
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]
    serializer_class = Give_ItemSerializer

    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = "__all__"

# ======      =======      ======      ======     ======     ======      =======      =======


class FavoriteViewSet(viewsets.ModelViewSet):
    queryset = Favorite.objects.all()
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]
    serializer_class = FavoriteSerializer

    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = "__all__"

# ======      =======      ======      ======     ======     ======      =======      =======


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]
    serializer_class = CommentSerializer

    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = "__all__"

# ======      =======      ======      ======     ======     ======      =======      =======


class Item_ImageViewSet(viewsets.ModelViewSet):
    queryset = Item_Image.objects.all()
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]
    serializer_class = Item_ImageSerializer

    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = ["item"]


# ======      =======      ======      ======     ======     ======      =======      =======


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]
    serializer_class = CategorySerializer

    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = "__all__"

# ======      =======      ======      ======     ======     ======      =======      =======


class BlandViewSet(viewsets.ModelViewSet):
    queryset = Bland.objects.all()
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]
    serializer_class = BlandSerializer

    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = "__all__"

# ======      =======      ======      ======     ======     ======      =======      =======


class KeywordViewSet(viewsets.ModelViewSet):
    queryset = Keyword.objects.all()
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]
    serializer_class = KeywordSerializer

    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = "__all__"

# ======      =======      ======      ======     ======     ======      =======      =======


class Want_ItemViewSet(viewsets.ModelViewSet):
    queryset = Want_Item.objects.all()
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]
    serializer_class = Want_ItemSerializer

    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = "__all__"

# ======      =======      ======      ======     ======     ======      =======      =======


class Parent_ItemViewSet(viewsets.ModelViewSet):
    queryset = Parent_Item.objects.all()
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]
    serializer_class = Parent_ItemSerializer

    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = "__all__"

# ======      =======      ======      ======     ======     ======      =======      =======


class RequestViewSet(viewsets.ModelViewSet):
    queryset = Request.objects.all()
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]
    serializer_class = RequestSerializer

    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = "__all__"

# ======      =======      ======      ======     ======     ======      =======      =======


class Meeting_TimeViewSet(viewsets.ModelViewSet):
    queryset = Meeting_Time.objects.all()
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]
    serializer_class = Meeting_TimeSerializer

    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = "__all__"

# ======      =======      ======      ======     ======     ======      =======      =======


class DealViewSet(viewsets.ModelViewSet):
    queryset = Deal.objects.all()
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]
    serializer_class = DealSerializer

    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = "__all__"

# ======      =======      ======      ======     ======     ======      =======      =======


class Private_MessageViewSet(viewsets.ModelViewSet):
    queryset = Private_Message.objects.all()
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]
    serializer_class = Private_MessageSerializer

# ======      =======      ======      ======     ======     ======      =======      =======


class HistoryViewSet(viewsets.ModelViewSet):
    queryset = History.objects.all()
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]
    serializer_class = HistorySerializer

    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = "__all__"

# ======      =======      ======      ======     ======     ======      =======      =======


class Request_DealViewSet(viewsets.ModelViewSet):
    queryset = Request_Deal.objects.all()
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]
    serializer_class = Request_DealSerializer

    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = "__all__"
