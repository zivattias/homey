# Generated by Django 4.2 on 2023-04-29 20:15

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0018_userprofile_profile_pic"),
    ]

    operations = [
        migrations.AlterField(
            model_name="userprofile",
            name="profile_pic",
            field=models.URLField(max_length=512, null=True),
        ),
    ]
