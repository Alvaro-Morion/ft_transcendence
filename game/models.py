from django.db import models

# Create your models here.

class game(models.Model):
    user1 = models.CharField(max_length = 100)
    user2 = models.CharField(max_length = 100)
    score1 = models.SmallIntegerField()
    score2 = models.SmallIntegerField()
