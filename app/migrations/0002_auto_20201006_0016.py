# Generated by Django 3.1.1 on 2020-10-05 15:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='meeting_time',
            name='request',
            field=models.ManyToManyField(blank=True, null=True, related_name='meeting_time', to='app.Request'),
        ),
    ]