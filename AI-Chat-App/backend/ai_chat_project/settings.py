"""
Django settings for ai_chat_project project.

For information on this file and its values, see:
https://docs.djangoproject.com/en/5.2/ref/settings/
"""
import os
from pathlib import Path

# --- Path Configuration ---
# 1. BASE_DIR now points to the project root (e.g., AI-Chat-App/)
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# 2. Derived paths for the React build folder (frontend/dist)
REACT_BUILD_DIR = os.path.join(BASE_DIR, 'frontend/dist')
REACT_ASSETS_DIR = os.path.join(REACT_BUILD_DIR, 'assets')

# Quick-start development settings - unsuitable for production
SECRET_KEY = 'django-insecure-u9xh3cljs+gle$gyihmk)4*^!rkp8&%#go-u2mqc4x&2$v2^am'
DEBUG = True

# Allowed hosts for deployment (adjust to your specific URL later)
ALLOWED_HOSTS = ['127.0.0.1', 'localhost', '.herokuapp.com', '.onrender.com']


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third-party apps
    'rest_framework',   
    'corsheaders',     
    
    # Your custom application (We will update this for the CRUD app later)
    'chat_api', 
]

# --- Middleware Configuration (Order is CRUCIAL) ---
MIDDLEWARE = [
    # Security must be first
    'django.middleware.security.SecurityMiddleware', 
    
    # WhiteNoise must come right after SecurityMiddleware for serving static files
    'whitenoise.middleware.WhiteNoiseMiddleware', 
    
    # CORS headers must be early to allow frontend access
    'corsheaders.middleware.CorsMiddleware', 
    
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'ai_chat_project.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        # Set DIRS to include the React build directory for the IndexView
        'DIRS': [REACT_BUILD_DIR], 
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'ai_chat_project.wsgi.application'

# Database (Use default SQLite locally)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Internationalization and Time Zone (standard)
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True


# --- Static Files Configuration for Deployment ---
STATIC_URL = '/static/'

# 1. Directory where 'collectstatic' will place all files for WhiteNoise/Gunicorn
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# 2. Tell Django where to find the static assets from the React build
STATICFILES_DIRS = [REACT_ASSETS_DIR]

# 3. WhiteNoise storage backend for optimized serving (compression, caching)
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'


DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# --- CORS Configuration ---
# Allow your React frontend development server to talk to Django
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
]