# AI Chat App

A full-stack AI chat application built with Django (backend) and React (frontend). The backend provides a REST API for AI chat functionality, while the frontend offers a modern, responsive user interface.

## Features

- **AI Chat Interface**: Interactive chat with AI responses
- **RESTful API**: Django REST Framework powered backend
- **Modern Frontend**: React application with Vite for fast development
- **CORS Support**: Configured for cross-origin requests
- **Production Ready**: Includes deployment configurations for Heroku/Render

## Tech Stack

### Backend
- **Django 5.2**: Web framework
- **Django REST Framework**: API development
- **Google Generative AI**: AI integration (currently mocked for demo)
- **WhiteNoise**: Static file serving
- **Gunicorn**: WSGI server for production

### Frontend
- **React 19**: UI library
- **Vite**: Build tool and dev server
- **Axios**: HTTP client for API calls
- **ESLint**: Code linting

## Local Development Setup

### Prerequisites

- **Python 3.8+**: For backend development
- **Node.js 16+**: For frontend development
- **Git**: Version control

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment**:
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

5. **Run database migrations**:
   ```bash
   python manage.py migrate
   ```

6. **Start Django development server**:
   ```bash
   python manage.py runserver
   ```

   The backend will be available at `http://127.0.0.1:8000`

### Frontend Setup

1. **Open a new terminal and navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start Vite development server**:
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

### Running the Application

1. Ensure both backend and frontend servers are running
2. Open your browser and navigate to `http://localhost:5173`
3. The React app will communicate with the Django API at `http://127.0.0.1:8000`

## API Endpoints

### Chat API
- **POST** `/api/chat/`: Send a chat message and receive AI response
  - Request body: `{"prompt": "Your message here"}`
  - Response: `{"response": "AI response here"}`

## Project Structure

```
AI-Chat-App/
├── backend/
│   ├── ai_chat_project/          # Django project settings
│   ├── chat_api/                 # Main API app
│   ├── db.sqlite3                 # SQLite database
│   ├── manage.py                  # Django management script
│   ├── requirements.txt           # Python dependencies
│   └── Procfile                   # Heroku deployment config
├── frontend/
│   ├── public/                    # Static assets
│   ├── src/                       # React source code
│   ├── package.json               # Node dependencies
│   ├── vite.config.js             # Vite configuration
│   └── eslint.config.js           # ESLint configuration
└── README.md                      # This file
```

## Development Commands

### Backend
- `python manage.py runserver`: Start development server
- `python manage.py makemigrations`: Create database migrations
- `python manage.py migrate`: Apply database migrations
- `python manage.py collectstatic`: Collect static files for production

### Frontend
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

## Deployment

The application is configured for deployment on platforms like Heroku or Render:

1. **Build the frontend**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Collect static files**:
   ```bash
   cd backend
   python manage.py collectstatic --noinput
   ```

3. **Deploy using the provided Procfile** for Heroku or similar platforms.

## Configuration

### Environment Variables
For production deployment, set the following environment variables:
- `DEBUG=False`
- `SECRET_KEY`: A secure secret key
- `ALLOWED_HOSTS`: Comma-separated list of allowed hosts

### Google AI Integration
To enable real AI responses instead of mock responses:
1. Obtain a Google AI API key
2. Set the API key in your environment
3. Uncomment and configure the Google AI code in `chat_api/views.py`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
