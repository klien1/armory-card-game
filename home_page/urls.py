from django.conf.urls import url
from . import views


app_name = 'home_page'
urlpatterns = [
    url(r'^$', views.home, name='home'),
    url(r'^login/', views.log_in, name='login'),
    url(r'^logout/', views.log_out, name='logout'),
    url(r'^lobby/', views.lobby, name='lobby'),
    url(r'^game/', views.game, name='game'),
]