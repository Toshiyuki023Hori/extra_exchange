from rest_framework import routers
from .api import *

router = routers.DefaultRouter()

router.register(r"user", UserViewSet)
router.register(r"review", ReviewViewSet)
router.register(r"follow", FollowViewSet)
router.register(r"pickup", PickUp_PlacesViewSet)
router.register(r'giveitem', Give_ItemViewSet)
router.register(r'favorite', FavoriteViewSet)
router.register(r'comment', CommentViewSet)
router.register(r'image', Item_ImageViewSet)
router.register(r'category', CategoryViewSet)
router.register(r'bland', BlandViewSet)
router.register(r'keyword', KeywordViewSet)
router.register(r'wantitem', Want_ItemViewSet)
router.register(r'parent', Parent_ItemViewSet)
router.register(r'request', RequestViewSet)
router.register(r'meeting', Meeting_TimeViewSet)
router.register(r'deal', DealViewSet)
router.register(r'private', Private_MessageViewSet)
router.register(r'history', HistoryViewSet)
router.register(r'requestdeal', Request_DealViewSet)

urlpatterns = router.urls