from django.urls import path
from .apps import UsersConfig
from .views import UserRegister, UserLogin, UserView,LogoutView

app_name = UsersConfig.name

urlpatterns = (
	path("register/", UserRegister.as_view(), name="register"),
	path("login/", UserLogin.as_view(), name="login" ),
	path("me/", UserView.as_view(), name="user"),
	path("logout/", LogoutView.as_view(), name="logout")
)
