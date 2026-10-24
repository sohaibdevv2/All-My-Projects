# chat_api/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from django.views.generic import View
from django.http import HttpResponse
from django.conf import settings
import os
# We no longer need: from google import genai, import os 

class IndexView(View):
    """
    Serves the main React index.html file for any non-API request.
    This is necessary for the React Router to handle routing on the client side.
    """
    def get(self, request, *args, **kwargs):
        try:
            # Look for index.html in the directory defined in TEMPLATES -> DIRS
            with open(os.path.join(settings.REACT_BUILD_DIR, 'index.html')) as f:
                return HttpResponse(f.read())
        except FileNotFoundError:
            # Fallback for when the React build hasn't happened yet (e.g., local testing)
            return HttpResponse(
                """
                This is the backend. Frontend assets not found.
                Did you forget to run 'npm run build' in the frontend folder?
                """,
                status=501,
            )

class AIChatView(APIView):
    """
    Mocks the AI response for demonstration and deployment testing.
    """
    def post(self, request):
        prompt = request.data.get('prompt')
        
        # You can make the mock response dynamic based on the prompt if you like:
        if "hello" in prompt.lower():
            mock_response = "Hello! I am your simulated AI assistant. I see you're ready for deployment!"
        elif "deploy" in prompt.lower():
            mock_response = "Simulated Response: Deployment successful! Your full-stack app structure is solid."
        else:
            mock_response = "Thank you for your prompt. Since no API key is provided, this is a mock response from the Django server."

        # Simulate a small delay (optional, but good for realism)
        # import time
        # time.sleep(1) 
        
        return Response({"response": mock_response})