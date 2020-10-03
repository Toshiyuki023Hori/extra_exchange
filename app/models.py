from django.conf import settings
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, AbstractUser, BaseUserManager, PermissionsMixin, UserManager


# Djangoの認証をユーザーネームからメールアドレスへ変えるために記述
class CustomUserManager(UserManager):

    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('メールアドレスは必須項目です。')

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):

        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self._create_user(email, password, **extra_fields)


# Django提供のカスタムユーザーのFieldを決定
class User(AbstractUser):
    # AbstractUserでpasswordは定義済みのため、ここではpasswordを再定義しない(DBにはちゃんと保存される。)
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(max_length=100, unique=True)
    profile = models.TextField(max_length=800, blank=True, null=True)
    icon = models.ImageField(upload_to="images/", blank=True, null=True)
    background = models.ImageField(upload_to="images/", blank=True, null=True)
    # AbstractUserはfirst_name,last_nameを保持しているため無効化
    first_name = None
    last_name = None

    is_staff = models.BooleanField(
        ('staff status'),
        default=True,
        help_text=(
            '管理サイトへのアクセス権を持っているかどうか'),
    )

    is_active = models.BooleanField(
        ('active'),
        default=True,
        help_text=(
            'ユーザーがアクティブかどうか'
        ),
    )

    is_superuser = models.BooleanField(
        ('superuser status'),
        default=True,
        help_text=(
            'Designates that this user has all permissions without '
            'explicitly assigning them.'
        ),
    )
    # createdAt, updatedAt は時系列順等に並べたいモデルに付与
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = CustomUserManager()

    EMAIL_FIELD = 'email'
    USERNAME_FIELD = 'username'
    REQUIRED_FIELD = ["username", "email"]

    class Meta:
        db_table = "users"

# ======      =======      ======      ======     ======     ======      =======      =======


class Review(models.Model):
    score = models.DecimalField(max_digits=2, decimal_places=1)
    comment = models.CharField(max_length=100, blank=True, null=True)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, on_delete=models.CASCADE, related_name="done_review")
    reviewedUser = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, on_delete=models.CASCADE, related_name="get_review")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.owner.username

    class Meta:
        db_table = "reviews"

# ======      =======      ======      ======     ======     ======      =======      =======


class Notification(models.Model):
    message = models.CharField(null=True, blank=True, max_length=150)
    read = models.BooleanField(default=False)
    url = models.CharField(null=True, blank= True, max_length=150)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notification")

    def __str__(self):
        return self.message

    class Meta:
        db_table = "notifications"

# ======      =======      ======      ======     ======     ======      =======      =======


class Follow(models.Model):
    # フォロー、フォロワーはユーザーに対し依存リレーションシップ。また、共に0も有り得る。
    # Note:
    # Userが"following"を呼び出し => Userのフォローを読み込むためのFollow objectsを取得
    # Userが`"followed"を呼び出し => Userのフォロワーを読み込むためのFollow objectsを取得
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, on_delete=models.CASCADE, related_name="following")
    follow = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, on_delete=models.CASCADE, related_name="followed")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.follow.username

    class Meta:
        db_table = "follows"

# ======      =======      ======      ======     ======     ======      =======      =======


class PickUp_Places(models.Model):
    name = models.CharField(max_length=200, unique=True)
    choosing_user = models.ManyToManyField(
        settings.AUTH_USER_MODEL, related_name="pick_up", null=True, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = "pickup_places"

# ======      =======      ======      ======     ======     ======      =======      =======


class Give_Item(models.Model):
    ITEM_STATE = (
        ("新品", "新品、未使用"),
        ("未使用", "未使用に近い"),
        ("傷や汚れなし", "目立った傷や汚れなし"),
        ("やや傷や汚れあり", "やや傷や汚れあり"),
        ("傷や汚れあり", "傷や汚れあり"),
        ("状態が悪い", "全体的に状態が悪い")
    )
    state = models.CharField(max_length=20, choices=ITEM_STATE)
    detail = models.TextField(max_length=800, blank=True, null=True)
    # Give_Itemが削除された時、Categoryも同時に削除されてはいけないためnull = True
    category = models.ForeignKey(
        "Category", on_delete=models.SET_NULL, null=True, related_name="give_item")
    parent_item = models.OneToOneField(
        "Parent_Item", null=True, on_delete=models.CASCADE, related_name="give_item")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.parent_item.name

    class Meta:
        db_table = "give_items"

# ======      =======      ======      ======     ======     ======      =======      =======


class Favorite(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, on_delete=models.CASCADE, related_name="favorite")
    item = models.ForeignKey(Give_Item, null=True,
                             on_delete=models.CASCADE, related_name="favorite")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.item.parent_item.name

    class Meta:
        db_table = "favorites"

# ======      =======      ======      ======     ======     ======      =======      =======


class Comment(models.Model):
    comment = models.CharField(max_length=400)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="comment")
    item = models.ForeignKey(
        Give_Item, on_delete=models.CASCADE, null=True, related_name="comment")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.owner.username

    class Meta:
        db_table = "comments"

# ======      =======      ======      ======     ======     ======      =======      =======


class Item_Image(models.Model):
    image = models.ImageField(upload_to="images/")
    item = models.ForeignKey(
        Give_Item, on_delete=models.CASCADE, related_name="item_image")

    def __str__(self):
        return self.item.parent_item.name

    class Meta:
        db_table = "item_images"

# ======      =======      ======      ======     ======     ======      =======      =======


class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = "categories"


# ======      =======      ======      ======     ======     ======      =======      =======


class Bland(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = "blands"

# ======      =======      ======      ======     ======     ======      =======      =======


class Keyword(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = "keywords"

# ======      =======      ======      ======     ======     ======      =======      =======


class Want_Item(models.Model):
    url = models.URLField(max_length=250, null=True, blank=True)
    parent_item = models.OneToOneField(
        # Give_Itemを表現する時のために、null=True
        "Parent_Item", null=True, on_delete=models.CASCADE, related_name="want_item")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "want_items"

# ======      =======      ======      ======     ======     ======      =======      =======

# Want_Item と Give_Item でポリモーフィック 関連になるので、共通の親テーブル"Parent_Item"を作成


class Parent_Item(models.Model):
    name = models.CharField(max_length=100)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, related_name="item")
# Bland, Keywordは一つしか選べないため、OneToMany関係
    keyword = models.ManyToManyField(
        Keyword, related_name="parent_item")
    # Categoryと同じく、Parent_Itemが削除された時、ブランドも同時に削除されるのを防ぐためにnull = True
    bland = models.ForeignKey(
        Bland, on_delete=models.SET_NULL, null=True, related_name="parent_item")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.owner.username}'s {self.name}"

    class Meta:
        db_table = "parent_items"

# ======      =======      ======      ======     ======     ======      =======      =======


class Request(models.Model):
    note = models.CharField(max_length=400, blank=True, null=True)
    accepted = models.BooleanField(default=False)
    request_deal = models.OneToOneField(
        "Request_Deal", on_delete=models.CASCADE, related_name="request")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.request_deal.host_user.username

    class Meta:
        db_table = "requests"


# ======      =======      ======      ======     ======     ======      =======      =======


class Meeting_Time(models.Model):
    what_time = models.DateTimeField(unique=True)
    request = models.ManyToManyField(
        Request, related_name="meeting_time")

    def __str__(self):
        return self.what_time.strftime("%m/%d/%Y, %H:%M:%S")

    class Meta:
        db_table = "meeting_times"


# ======      =======      ======      ======     ======     ======      =======      =======


class Deal(models.Model):
    # 取引時には、時刻が一つに決定しているため外部キーを使用せずDeal内のattributeに。
    meeting_time = models.DateTimeField()
    completed = models.BooleanField(default=False)
    join_user_accept = models.BooleanField(default=False)
    # history = models.ForeignKey(
    #     "History", on_delete=models.CASCADE, null=True, related_name="done_deal")
    request_deal = models.OneToOneField(
        "Request_Deal", on_delete=models.CASCADE, related_name="deal")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.request_deal.host_user.username

    class Meta:
        db_table = "deals"

# ======      =======      ======      ======     ======     ======      =======      =======


class Private_Message(models.Model):
    message = models.CharField(max_length=400)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="private_message")
    deal = models.ForeignKey(
        Deal, on_delete=models.CASCADE, null=True, related_name="message")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.owner.username

    class Meta:
        db_table = "private_messages"

# ======      =======      ======      ======     ======     ======      =======      =======


class History(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, on_delete=models.CASCADE, related_name="done_deal")
    deal = models.OneToOneField(
        Deal, on_delete=models.CASCADE, related_name="history")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.owner.username

    class Meta:
        db_table = "histories"

# ======      =======      ======      ======     ======     ======      =======      =======

# Request と Deal でポリモーフィック 関連になるから、共通の親テーブル"Request_Deal"を作成


class Request_Deal(models.Model):
    # リクエスト送信時に一つに絞られるため、外部キーを使用しない。
    pickups = models.CharField(max_length=200)
    host_user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="host_request_deal")
    join_user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="join_request_deal")
    host_item = models.ForeignKey(
        Give_Item, on_delete=models.CASCADE, related_name="as_host")
    join_item = models.ForeignKey(
        Give_Item, on_delete=models.CASCADE, related_name="as_join")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.host_user.username

    class Meta:
        db_table = "request_deal"
