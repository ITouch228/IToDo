import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, tasks
from database import engine, Base
from config import settings

app = FastAPI()

app.include_router(auth.router)
app.include_router(tasks.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000)
    # uvicorn.run("main:app", host="10.242.223.243", port=8000, reload=True)
    # uvicorn.run("main:app", host="192.168.0.9", port=8000, reload=True)
    # uvicorn.run("main:app", host="26.233.97.20", port=8000, reload=True)