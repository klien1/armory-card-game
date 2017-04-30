from django.contrib import admin
from .models import Game_instance, Users_in_lobby, Hero, Card


# Register your models here.
admin.site.register(Game_instance)
admin.site.register(Users_in_lobby)
admin.site.register(Hero)
admin.site.register(Card)