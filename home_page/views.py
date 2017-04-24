from django.shortcuts import render
from django.contrib.auth import login, logout #, get_user_model
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect

from .forms import Game_instance_form
from .models import Game_instance

# from .models import Decks


# Create your views here.
def home(request):
  return render(request, 'home_page/home.html', {'title': 'Armory Home Page'})


def how_to_play(request):
  return render(request, 'how-to-play/how-to-play.html', {'title': 'How to Play'})


# @login_required(login_url='/login/')
# def create_game(request):
#   if request.method == 'POST':
#     game_form = Game_instance_form(request.POST)
#     if (game_form.is_valid()):
#       room_name = game_form.cleaned_data['room_name']
#       Game_instance.objects.create(room_name=room_name)
#       game_room = '/game-' + str(Game_instance.objects.get(room_name=room_name).id) + '/'
#       return HttpResponseRedirect(game_room)
#   else:
#     game_form = Game_instance_form()
#   context = {
#     'title': 'Creat Game Room',
#     'form': game_form,
#   }
#   return render(request, 'create_game/create_game.html', context)


@login_required(login_url='/login/')
def lobby(request):
  # count = 0
  # grabs online users only
  # users_online = get_user_model().objects.select_related('user_online')
  # users_online = get_user_model().objects.prefetch_related('user_online')
  # users_online = get_user_model().objects.all()
  # users_online = Users_online.objects.all()
  # users_online_list = []
  # for user in users_online:
  #   if hasattr(user, 'user_online'):
  #     count += 1
  #     users_online_list.append(user)
  # room_id = 34243
  # current_user = get_user_model()
  # context = {
    # 'users_online': users_online_list,
    # 'num_users_online': count,
  #   'current_user': request.user,
  #   'room_id': room_id,
  # }
  if request.method == 'POST':
    game_form = Game_instance_form(request.POST)
    if (game_form.is_valid()):
      room_name = game_form.cleaned_data['room_name']
      # Game_instance.objects.create(room_name=room_name)
      game_form.save()
      game_room = '/game-' + str(Game_instance.objects.get(room_name=room_name).id) + '/'
      return HttpResponseRedirect(game_room)
    else:
      game_form = Game_instance_form()
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
# def game(request):
  # room_id = 2
  context = {
    # 'room_id': room_id,
    # 'numbers': ['3'],
  }
  # return HttpResponseRedirect(reverse('game-', room_id))
  return render(request, 'game/game.html', context)
  # return render(request, 'game/game.html', context)


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