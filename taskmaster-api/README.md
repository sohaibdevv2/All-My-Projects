# TaskMaster API

A simple and efficient RESTful API for managing tasks. Built with FastAPI for high performance and automatic API documentation.

## Overview

TaskMaster API provides full CRUD operations for task management with automatic ID generation and in-memory storage.

## Quick Start

### Prerequisites
- Python 3.8+
- pip

### Installation

```bash
# Clone the repository
git clone https://github.com/sohaibdevv/taskmaster-api.git
cd taskmaster-api

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# On Windows:
.\.venv\Scripts\Activate.ps1
# On macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install fastapi uvicorn pydantic
```

### Run the Server

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Server will start at: **http://127.0.0.1:8000**

## API Documentation

- **Interactive Docs (Swagger UI):** http://127.0.0.1:8000/docs
- **Alternative Docs (ReDoc):** http://127.0.0.1:8000/redoc

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| POST | `/tasks` | Create a new task |
| GET | `/tasks` | List all tasks |
| GET | `/tasks/{task_id}` | Get task by ID |
| PUT | `/tasks/{task_id}` | Update a task |
| DELETE | `/tasks/{task_id}` | Delete a task |

## Example Usage

### Create a Task
```bash
curl -X POST "http://127.0.0.1:8000/tasks" \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries", "description": "Milk, eggs, bread"}'
```

### Get All Tasks
```bash
curl -X GET "http://127.0.0.1:8000/tasks"
```

### Update a Task
```bash
curl -X PUT "http://127.0.0.1:8000/tasks/1" \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

### Delete a Task
```bash
curl -X DELETE "http://127.0.0.1:8000/tasks/1"
```

## Tech Stack

- **Framework:** FastAPI
- **Server:** Uvicorn (ASGI)
- **Data Validation:** Pydantic
- **Language:** Python 3.8+

## Features

Auto-incrementing task IDs  
Full CRUD operations  
Data validation with Pydantic  
Error handling with HTTP exceptions  
Automatic API documentation  
Hot reload during development  

## Project Structure

```
taskmaster-api/
├── app/
│   └── main.py          # Main API application
├── .venv/               # Virtual environment
├── README.md            # This file
└── requirements.txt     # Dependencies (optional)
```

[sohaibdevv](https://github.com/sohaibdevv)
