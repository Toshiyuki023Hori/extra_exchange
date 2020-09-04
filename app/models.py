from django.db import models


class User(models.Model):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(max_length=100, unique=True)
    password = models.CharField(max_length=20)
    confirm_pass = models.CharField(max_length=20)
    profile = models.TextField(max_length=800, blank=True, null=True)
    icon = models.ImageField(blank=True, null=True)
    background = models.ImageField(blank=True, null=True)
    login = models.BooleanField(default=False)
    # createdAt, updatedAt は時系列順等に並べたいモデルに付与
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.username

    class Meta:
        db_table = "users"

# ======      =======      ======      ======     ======     ======      =======      =======


class Review(models.Model):
    score = models.DecimalField(max_digits=2, decimal_places=1)
    comment = models.CharField(max_length=100, blank=True, null=True)
    reviewer = models.ForeignKey(
        User, null=True, on_delete=models.CASCADE, related_name="done_review")
    reviewedUser = models.ForeignKey(
        User, null=True, on_delete=models.CASCADE, related_name="get_review")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.owner.username

    class Meta:
        db_table = "reviews"

# ======      =======      ======      ======     ======     ======      =======      =======

class Notification(models.Model):
    message = models.CharField(null=True, blank=True, max_length=150)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notification")

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
        User, null=True, on_delete=models.CASCADE, related_name="following")
    follow = models.ForeignKey(
        User, null=True, on_delete=models.CASCADE, related_name="followed")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.follow.username

    class Meta:
        db_table = "follows"

# ======      =======      ======      ======     ======     ======      =======      =======


class PickUp_Places(models.Model):
    name = models.CharField(max_length=200)
    choosingUser = models.ManyToManyField(User, related_name="pick_up")

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
        "Category", related_name="give_item", on_delete=models.SET_NULL, null=True)
    parent_item = models.ForeignKey(
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
        User, null=True, on_delete=models.CASCADE, related_name="favorite")
    item = models.ForeignKey(Give_Item, null=True, on_delete=models.CASCADE, related_name="favorite")
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
        User, on_delete=models.CASCADE, related_name="comment")
    item = models.ForeignKey(Give_Item, on_delete=models.CASCADE, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.owner.username

    class Meta:
        db_table = "comments"

# ======      =======      ======      ======     ======     ======      =======      =======


class Item_Image(models.Model):
    image = models.ImageField()
    item = models.ForeignKey(Give_Item, on_delete=models.CASCADE)

    def __str__(self):
        return self.item.parent_item.name

    class Meta:
        db_table = "item_images"

# ======      =======      ======      ======     ======     ======      =======      =======


class Category(models.Model):
    name = models.CharField(max_length=50)
    # 階層構造を表現するために隣接リストを採用
    parent = models.ForeignKey("Category", null=True, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    class Meta:
        db_table = "categories"

# ======      =======      ======      ======     ======     ======      =======      =======


class Bland(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

    class Meta:
        db_table = "blands"

# ======      =======      ======      ======     ======     ======      =======      =======


class Keyword(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

    class Meta:
        db_table = "keywords"

# ======      =======      ======      ======     ======     ======      =======      =======


class Want_Item(models.Model):
    url = models.URLField(max_length=250, null=True, blank=True)
    parent_item = models.ForeignKey(
        "Parent_Item", null=True, on_delete=models.CASCADE, related_name="want_item")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.parent_item.name

    class Meta:
        db_table = "want_items"

# ======      =======      ======      ======     ======     ======      =======      =======

# Want_Item と Give_Item でポリモーフィック 関連になるから、共通の親テーブル"Parent_Item"を作成


class Parent_Item(models.Model):
    name = models.CharField(max_length=100)
    owner = models.ForeignKey(
        User, on_delete=models.CASCADE, null=True, related_name="item")
    keyword = models.ManyToManyField(Keyword, related_name="parent_item")
    # Blandは一つしか選べないため、OneToMany関係
    # Categoryと同じく、Parent_Itemが削除された時、ブランドも同時に削除されるのを防ぐためにnull = True
    bland = models.ForeignKey(
        Bland, related_name="parent_item", on_delete=models.SET_NULL, null=True)
    request_deal = models.ForeignKey(
        "Request_Deal", null=True, on_delete=models.CASCADE, related_name="parent_item")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = "parent_items"

# ======      =======      ======      ======     ======     ======      =======      =======


class Request(models.Model):
    note = models.CharField(max_length=400, blank=True, null=True)
    request_deal = models.ForeignKey(
        "Request_Deal", null=True, on_delete=models.CASCADE, related_name="request")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.request_deal.host_user.username

    class Meta:
        db_table = "requests"

# ======      =======      ======      ======     ======     ======      =======      =======


class Meeting_Time(models.Model):
    what_time = models.DateTimeField()
    request = models.ForeignKey(
        Request, on_delete=models.CASCADE, related_name="meeting_time")

    def __str__(self):
            return self.what_time.strftime("%m/%d/%Y, %H:%M:%S")

    class Meta:
        db_table = "meeting_times"

# ======      =======      ======      ======     ======     ======      =======      =======


class Deal(models.Model):
    # 取引時には、時刻が一つに決定しているため外部キーを使用せずDeal内のattributeに。
    meeting_time = models.DateTimeField()
    completed = models.BooleanField(default=False)
    history = models.ForeignKey(
        "History", on_delete=models.CASCADE, null=True, related_name="done_deal")
    request_deal = models.ForeignKey(
        "Request_Deal", null=True, on_delete=models.CASCADE, related_name="deal")
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
        User, on_delete=models.CASCADE, related_name="private_message")
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
        User, null=True, on_delete=models.CASCADE, related_name="done_deal")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.owner.username

    class Meta:
        db_table = "histories"

# ======      =======      ======      ======     ======     ======      =======      =======

# Request と Deal でポリモーフィック 関連になるから、共通の親テーブル"Request_Deal"を作成


class Request_Deal(models.Model):
    host_user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="host_request_deal")
    join_user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="join_request_deal")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.host_user.username

    class Meta:
        db_table = "request_deal"
