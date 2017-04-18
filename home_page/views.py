from django.shortcuts import render
from django.contrib.auth import login, logout, get_user_model
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect


# Create your views here.
def home(request):
  return render(request, 'home_page/home.html', {'title': 'Armory Home Page'})


def how_to_play(request):
  return render(request, 'how-to-play/how-to-play.html', {'title': 'How to Play'})


@login_required(login_url='/login/')
def lobby(request):
  count = 0
  # grabs online users only
  users_online = get_user_model().objects.select_related('user_online')
  # users_online = get_user_model().objects.prefetch_related('user_online')
  # users_online = get_user_model().objects.all()
  # users_online = Users_online.objects.all()
  users_online_list = []
  for user in users_online:
    if hasattr(user, 'user_online'):
      count += 1
      users_online_list.append(user)

  context = {
    'users_online': users_online_list,
    'num_users_online': count,
  }

  return render(request, 'lobby/lobby.html', context)


@login_required(login_url='/login/')
def game(request):
  return render(request, 'game/game.html')


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