from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional

# 1. Create the FastAPI app instance
app = FastAPI(title="TaskMaster API")

# 2. Define how a "Task" should look (Data Validation)
class Task(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    completed: bool = False

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None

# 3. Create a temporary list to store our tasks (In-memory Database)
tasks_db = []
next_id = 1

# --- API ENDPOINTS ---

@app.get("/")
def home():
    return {"message": "API is running! Visit /docs for documentation."}

# Create a new Task
@app.post("/tasks", response_model=Task)
def create_task(task: TaskCreate):
    global next_id
    new_task = Task(id=next_id, **task.dict())
    tasks_db.append(new_task)
    next_id += 1
    return new_task

# Get all Tasks
@app.get("/tasks", response_model=List[Task])
def get_all_tasks():
    return tasks_db

# Get a specific Task by ID
@app.get("/tasks/{task_id}", response_model=Task)
def get_task(task_id: int):
    for task in tasks_db:
        if task.id == task_id:
            return task
    raise HTTPException(status_code=404, detail="Task not found")

# Update a Task
@app.put("/tasks/{task_id}", response_model=Task)
def update_task(task_id: int, task_update: TaskUpdate):
    for i, task in enumerate(tasks_db):
        if task.id == task_id:
            update_data = task_update.dict(exclude_unset=True)
            updated_task = task.copy(update={**update_data})
            tasks_db[i] = updated_task
            return updated_task
    raise HTTPException(status_code=404, detail="Task not found")

# Delete a Task
@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    for i, task in enumerate(tasks_db):
        if task.id == task_id:
            tasks_db.pop(i)
            return {"message": "Task deleted successfully"}
    raise HTTPException(status_code=404, detail="Task not found")