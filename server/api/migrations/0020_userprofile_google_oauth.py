# Generated by Django 4.2 on 2023-05-11 10:55

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0019_alter_userprofile_profile_pic"),
    ]

    operations = [
        migrations.AddField(
            model_name="userprofile",
            name="google_oauth",
            field=models.BooleanField(default=False),
        ),
    ]
