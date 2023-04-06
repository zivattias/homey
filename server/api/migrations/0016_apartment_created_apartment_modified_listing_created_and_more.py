# Generated by Django 4.1.7 on 2023-04-02 16:38

from django.db import migrations
import django.utils.timezone
import django_extensions.db.fields


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0015_proposal_created_proposal_modified_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="apartment",
            name="created",
            field=django_extensions.db.fields.CreationDateTimeField(
                auto_now_add=True,
                default=django.utils.timezone.now,
                verbose_name="created",
            ),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="apartment",
            name="modified",
            field=django_extensions.db.fields.ModificationDateTimeField(
                auto_now=True, verbose_name="modified"
            ),
        ),
        migrations.AddField(
            model_name="listing",
            name="created",
            field=django_extensions.db.fields.CreationDateTimeField(
                auto_now_add=True,
                default=django.utils.timezone.now,
                verbose_name="created",
            ),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="listing",
            name="modified",
            field=django_extensions.db.fields.ModificationDateTimeField(
                auto_now=True, verbose_name="modified"
            ),
        ),
    ]