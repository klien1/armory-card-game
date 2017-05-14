from django.forms import ModelForm
from .models import Game_instance


class Game_instance_form(ModelForm):
  class Meta:
    model = Game_instance
    fields = ['room_name']