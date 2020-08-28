from django.db import models
form django.utils import timezone


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

    def __str__(self):
        return self.username

    def save(self, *args, **kwargs):
        if not self.id:
            self.createdAt = timezone.now()
        self.updatedAt = timezone.now()
        return super(User, self).save(*args, **kwargs)

    class Meta:
        db_table = "users"



class Review(models.Model):
    score = models.DecimalField()
    comment = models.CharField(blank=True, null=True)
    createdAt = models.DateField(editable=False)
    updatedAt = models.DateField()

    def save(self, *args, **kwargs):
        if not self.id:
            self.createdAt = timezone.now()
        self.updatedAt = timezone.now()
        return super(Review, self).save(*args, **kwargs)

    class Meta:
        db_table = "reviews"



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
        return super(class_name, self).save(*args, **kwargs)

    class Meta:
        db_table = "follows"



class PickUp_Places(models.Model):
    name = models.CharField(max_length=200)
    choosingUser = models.ManyToManyField(User, related_name="pick_up")

    def __str__(self):
        return self.name

    class Meta:
        db_table = "pickup_places"


