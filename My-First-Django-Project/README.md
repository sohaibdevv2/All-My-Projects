# My First Django Project

A Django-based web application built with Django 5.2.8.

## Overview

This is a Django project named `firstproject` with a primary application called `firstapp`. The project is containerized with Docker for easy deployment and development.

## Project Structure

```
firstproject/
├── db.sqlite3                 # SQLite database
├── manage.py                  # Django management script
├── requirements.txt           # Python dependencies
├── Dockerfile                 # Docker configuration
├── firstapp/                  # Main application directory
│   ├── migrations/           # Database migrations
│   ├── models.py             # Database models
│   ├── views.py              # View logic
│   ├── urls.py               # URL routing
│   ├── admin.py              # Admin interface configuration
│   ├── apps.py               # App configuration
│   └── tests.py              # Unit tests
└── firstproject/             # Project configuration directory
    ├── settings.py           # Project settings
    ├── urls.py               # Project-level URL routing
    ├── asgi.py               # ASGI configuration
    └── wsgi.py               # WSGI configuration
```

## Requirements

- Python 3.x
- Django 5.2.8
- Docker (optional, for containerized deployment)

## Installation

### Local Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd firstproject
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Apply migrations:**
   ```bash
   python manage.py migrate
   ```

5. **Create a superuser (admin):**
   ```bash
   python manage.py createsuperuser
   ```

6. **Run the development server:**
   ```bash
   python manage.py runserver
   ```

   The application will be available at `http://127.0.0.1:8000/`

### Docker Setup

1. **Build the Docker image:**
   ```bash
   docker build -t firstproject .
   ```

2. **Run the container:**
   ```bash
   docker run -p 8000:8000 firstproject
   ```

   The application will be available at `http://localhost:8000/`

## Usage

### Access the Application

- **Main Application:** `http://localhost:8000/`
- **Admin Panel:** `http://localhost:8000/admin/`

### Making Changes

1. Create or modify models in `firstapp/models.py`
2. Create migrations: `python manage.py makemigrations`
3. Apply migrations: `python manage.py migrate`
4. Add your views in `firstapp/views.py`
5. Configure URL routes in `firstapp/urls.py` and `firstproject/urls.py`

## Configuration

### Settings

The project settings are configured in `firstproject/settings.py`. Key configurations include:

- **DEBUG:** Currently set to `True` (development mode)
- **ALLOWED_HOSTS:** Configured for IBM Cloud Code Engine deployment
- **INSTALLED_APPS:** Includes Django default apps and `firstapp`

### Database

The project uses SQLite by default (`db.sqlite3`). To switch to a different database, update the `DATABASES` setting in `settings.py`.

## Development

### Running Tests

```bash
python manage.py test
```

### Creating Superuser

```bash
python manage.py createsuperuser
```

### Creating New App

```bash
python manage.py startapp appname
```

### Shell Access

```bash
python manage.py shell
```

## Deployment

This project is configured for deployment to IBM Cloud Code Engine. Ensure:

1. Update `SECRET_KEY` in `settings.py` for production
2. Set `DEBUG = False` in production
3. Configure appropriate `ALLOWED_HOSTS`
4. Set up environment variables for sensitive data