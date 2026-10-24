# chat_api/urls.py
from django.urls import path
from .views import AIChatView

urlpatterns = [
    # This defines the 'ask/' part of the URL
    path('ask/', AIChatView.as_view(), name='ai-chat-ask'),
]