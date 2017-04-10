from django.shortcuts import render

# Create your views here.
def home(request):
  return render(request, 'home_page/home.html', {'title': 'Armory Home Page'})

def lobby(request):
  return render(request, 'lobby/lobby.html')

def login(request):
  return render(request, 'login/login.html')