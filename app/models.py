from django.db import models
form django.utils import timezone

class User(models.Model):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(max_length=100, unique=True)
    password = models.CharField(max_length=20)
    confirm_pass = models.CharField(max_length=20)
    profile = models.TextField(max_length=800, blank=True)
    icon = models.ImageField(blank = True)
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
    comment = models.CharField(blank=True)