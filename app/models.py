from django.db import models
from django.utils import timezone


class User(models.Model):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(max_length=100, unique=True)
    password = models.CharField(max_length=20)
    confirm_pass = models.CharField(max_length=20)
    profile = models.TextField(max_length=800, blank=True, null=True)
    icon = models.ImageField(blank = True, null = True)
    login = models.BooleanField(default=False)
    createdAt = models.DateField(editable=False)
    updatedAt = models.DateField()

    def save(self, *args, **kwargs):
        if not self.id:
            self.createdAt = timezone.now()
        self.updatedAt = timezone.now()
        return super(User, self).save(*args, **kwargs)

    def __str__(self):
        return self.username

    class Meta:
        db_table = "users"

# ======      =======      ======      ======     ======     ======      =======      =======

class Review(models.Model):
    score = models.DecimalField()
    comment = models.CharField(blank=True, null=True)
    user = models.ForeignKey(User, null=True, on_delete=models.CASCADE)
    createdAt = models.DateField(editable=False)
    updatedAt = models.DateField()

    def save(self, *args, **kwargs):
        if not self.id:
            self.createdAt = timezone.now()
        self.updatedAt = timezone.now()
        return super(Review, self).save(*args, **kwargs)

    class Meta:
        db_table = "reviews"

# ======      =======      ======      ======     ======     ======      =======      =======

class Follow(models.Model):
    # フォロー、フォロワーはユーザーに対し依存リレーションシップ。また、共に0も有り得る。
    user = models.ForeignKey(User, null = True, on_delete=models.CASCADE, related_name="fromUser")
    follow = models.ForeignKey(User, null=True, on_delete=models.CASCADE, related_name="following")
    createdAt = models.DateField(editable=False)
    updatedAt = models.DateField()

    def save(self, *args, **kwargs):
        if not self.id:
            self.createdAt = timezone.now()
        self.updatedAt = timezone.now()
        return super(Follow, self).save(*args, **kwargs)

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
    name = models.CharField(max_length=100)
    ITEM_STATE = (
        ("新品", "新品、未使用"),
        ("未使用", "未使用に近い"),
        ("傷や汚れなし", "目立った傷や汚れなし"),
        ("やや傷や汚れあり", "やや傷や汚れあり"),
        ("傷や汚れあり", "傷や汚れあり"),
        ("状態が悪い", "全体的に状態が悪い")
    )
    state = models.CharField(max_length=20, choices=ITEM_STATE, default="新品")
    detail = models.TextField(max_length=800, blank=True, null=True)
    owner = models.ForeignKey(User, null=True, on_delete=models.CASCADE, related_name="give_item")
    category = models.ForeignKey("Category", related_name="give_item")
    createdAt = models.DateField(editable=False)
    updatedAt = models.DateField()

    def save(self, *args, **kwargs):
        if not self.id:
            self.createdAt = timezone.now()
        self.updatedAt = timezone.now()
        return super(Give_Item, self).save(*args, **kwargs)

    def __str__(self):
        return self.name

    class Meta:
        db_table = "give_items"

# ======      =======      ======      ======     ======     ======      =======      =======

class Comment(models.Model):
    comment = models.CharField(max_length=400)
    item = models.ForeignKey(Give_Item, on_delete=models.CASCADE, null=True)
    createdAt = models.DateField(editable=False)
    updatedAt = models.DateField()

    def save(self, *args, **kwargs):
        if not self.id:
            self.createdAt = timezone.now()
        self.updatedAt = timezone.now()
        return super(Comment, self).save(*args, **kwargs)

    class Meta:
        db_table = "comments"

# ======      =======      ======      ======     ======     ======      =======      =======

class Item_Image(models.Model):
    image = models.ImageField()
    item = models.ForeignKey(Give_Item, on_delete=models.CASCADE)

    class Meta:
        db_table = "item_images"

# ======      =======      ======      ======     ======     ======      =======      =======

class Category(models.Model):
    name = models.CharField(max_length=50)
    parent = models.ManyToManyField("Category")

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
    name = models.CharField(max_length=100)
    url = models.URLField(max_length=250)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name="want_item")
    createdAt = models.DateField(editable=False)
    updatedAt = models.DateField()

    def save(self, *args, **kwargs):
        if not self.id:
            self.createdAt = timezone.now()
        self.updatedAt = timezone.now()
        return super(Want_Item, self).save(*args, **kwargs)

    def __str__(self):
        return self.name
        
# ======      =======      ======      ======     ======     ======      =======      =======

class Parent_Item(models.Model):
    give_item = models.OneToOneField(Give_Item, on_delete=models.CASCADE, null=True,　related_name="parent_item")
    want_item = models.OneToOneField(Want_Item, on_delete=models.CASCADE, null=True, related_name="parent_item")
    keyword = models.ManyToManyField(Keyword, related_name = "parent_item")
    bland = models.ForeignKey(Bland, related_name="parent_item")
    createdAt = models.DateField(editable=False)
    updatedAt = models.DateField()

    def save(self, *args, **kwargs):
        if not self.id:
            self.createdAt = timezone.now()
        self.updatedAt = timezone.now()
        return super(class_name, self).save(*args, **kwargs)

    class Meta:
        db_table = "parent_items"

# ======      =======      ======      ======     ======     ======      =======      =======


