from django.forms import ModelForm
from django.utils.translation import ugettext_lazy as _
from .models import Game_instance


class Game_instance_form(ModelForm):
  class Meta:
    model = Game_instance
    fields = ('room_name', 'max_number_of_players')
    labels = {
      'max_number_of_players': _('Max players in Room'),
    }
    help_texts = {
        'max_number_of_players': _('Min: 2, Max: 4'),
    }
    error_messages = {
      'room_name': {
          'unique': _("Room name already exists."),
      }
    }