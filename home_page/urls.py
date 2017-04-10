from django.conf.urls import url
from . import views


app_name = 'home_page'
urlpatterns = [
    url(r'^$', views.home, name='home'),
    url(r'^login/', views.login, name='login'),
    url(r'^lobby/', views.lobby, name='lobby'),
]