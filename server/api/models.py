from django.db import models

# Create your models here.

class Apartment(models.Model):
    class Meta:
        db_table = "apartments"