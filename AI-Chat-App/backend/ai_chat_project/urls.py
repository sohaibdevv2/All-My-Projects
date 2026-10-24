"""
URL configuration for ai_chat_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# backend/ai_chat_project/urls.py

from django.contrib import admin
from django.urls import path, include
from chat_api.views import IndexView # Import the new IndexView

urlpatterns = [
    path('admin/', admin.site.urls),
    # 1. Your API endpoints go first
    path('api/', include('chat_api.urls')), 
    
    # 2. The catch-all view MUST be last. It routes all other traffic to React's index.html
    path('', IndexView.as_view(), name='index'),
]