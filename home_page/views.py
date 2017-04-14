from django.shortcuts import render
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect


# Create your views here.
def home(request):
  return render(request, 'home_page/home.html', {'title': 'Armory Home Page'})


@login_required(login_url='/login/')
def lobby(request):
  return render(request, 'lobby/lobby.html')


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
    else:
      print(form.errors)
  return render(request, 'login/login.html', {'form': form})


def log_out(request):
  logout(request)
  return HttpResponseRedirect('/')