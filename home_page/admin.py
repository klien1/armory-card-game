from django.contrib import admin
from .models import Game_instance, Users_in_lobby


# Register your models here.
admin.site.register(Game_instance)
admin.site.register(Users_in_lobby)