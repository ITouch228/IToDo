import os

from fastapi.middleware.cors import CORSMiddleware

# Импортируем исходное приложение без изменения исходников
from app.routes import auth, tasks
from fastapi import FastAPI

app = FastAPI()
app.include_router(auth.router)
app.include_router(tasks.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://itodov10.vercel.app"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)



