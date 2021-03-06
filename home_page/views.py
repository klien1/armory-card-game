from django.shortcuts import render
from django.contrib.auth import login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect

from .forms import Game_instance_form
from .models import Game_instance, Game_player, Card


# Create your views here.
def home(request):
  return render(request, 'home_page/home.html', {'title': 'Armory Home Page'})


def how_to_play(request):
  return render(request, 'how-to-play/how-to-play.html', {'title': 'How to Play'})


@login_required(login_url='/login/')
def lobby(request):
  if request.method == 'POST':
    game_form = Game_instance_form(request.POST)
    if (game_form.is_valid()):
      #get room name to search for it in database then redirect
      room_name = game_form.cleaned_data['room_name']
      game_form.save()
      game_room = '/game-' + str(Game_instance.objects.get(room_name=room_name).id) + '/'
      return HttpResponseRedirect(game_room)
  else:
    game_form = Game_instance_form()

  context = {
    'title': 'Lobby',
    'form': game_form,
    'current_user': request.user,
  }

  return render(request, 'lobby/lobby.html', context)


@login_required(login_url='/login/')
def game(request, room_id):
  heroes = Card.objects.filter(card_type='Hero')
  current_room = Game_instance.objects.filter(id=room_id)
  current_user = request.user
  context = {
    'title': room_id,
    'heroes': heroes,
    'room': current_room,
    'current_user': current_user,
  }
  return render(request, 'game/game.html', context)


def log_in(request):
  form = AuthenticationForm()
  if request.method == 'POST':
    form = AuthenticationForm(data=request.POST)
    if form.is_valid():
      login(request, form.get_user())
      return HttpResponseRedirect('/lobby/')

  context = {
    'form': form,
  }
  return render(request, 'login/login.html', context)


def log_out(request):
  logout(request)
  return HttpResponseRedirect('/')