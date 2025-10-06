import logging

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.models.task import Task
from app.models.user import User
from app.schemas.task import TaskCreate, TaskEdit, TaskUpdate, TaskInDB
from app.dao.dao import TaskDAO
from app.database import get_session
from app.services.auth import get_current_user

router = APIRouter(
    prefix="/tasks",
    tags=["tasks"],
    dependencies=[Depends(get_current_user)]
)


@router.post("/", response_model=TaskInDB)
async def create_task(
        task: TaskCreate,
        session: AsyncSession = Depends(get_session),
        current_user: User = Depends(get_current_user)
):
    try:
        db_task = task.model_dump()
        db_task["owner_id"] = current_user.id
        task_in_db = await TaskDAO.add(session=session, **db_task)
        task_in_db = TaskInDB.model_validate(task_in_db)
        logging.info(f"Added new task: {task_in_db}")
        return task_in_db
    except Exception as e:
        logging.error(f"Error creating task: {str(e)}")
        raise HTTPException(
            status_code=422,
            detail={
                "error": "Validation error",
                "received_data": task.model_dump(),
                "message": str(e)
            }
        )


@router.post("/edit", response_model=TaskInDB)
async def edit_task(
        task: TaskEdit,
        session: AsyncSession = Depends(get_session),
        current_user: User = Depends(get_current_user)
):
    try:
        db_task = task.model_dump()
        db_task["owner_id"] = current_user.id
        res = await TaskDAO.delete(session=session, id=task.id)
        if res:
            task = await TaskDAO.add(session=session, **db_task)
            logging.info(f"Task removed")
            return TaskInDB.model_validate(task)
    except Exception as e:
        logging.error(f"Error editing task: {str(e)}")
        raise HTTPException(
            status_code=422,
            detail={
                "error": "Validation error",
                "received_data": task.model_dump(),
                "message": str(e)
            }
        )


@router.get("/", response_model=List[TaskInDB])
async def read_tasks(
        session: AsyncSession = Depends(get_session),
        current_user: User = Depends(get_current_user)
):
    tasks = await TaskDAO.find_all_or_none(session=session, owner_id=current_user.id)
    logging.info(f"Tasks of user with id {current_user.id}: {tasks}")
    return tasks


@router.post("/complete/{task_id}/{new_state}")
async def create_task(
        task_id: int,
        new_state: bool,
        session: AsyncSession = Depends(get_session),
        current_user: User = Depends(get_current_user)
):
    try:
        result = await TaskDAO.change_complete_task(session=session, is_completed=new_state, id=task_id)
        logging.info(f"Completed task: {task_id}")
        return True
    except Exception as e:
        logging.error(f"Error completing task: {str(e)}")
        raise HTTPException(
            status_code=422,
            detail={
                "error": "Validation error",
                "message": str(e)
            }
        )


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
        task_id: int,
        session: AsyncSession = Depends(get_session),
        current_user: User = Depends(get_current_user)
):
    print(f"Deleting task with id: {task_id}")
    result = await TaskDAO.delete_task_by_query(session=session, id=task_id)

    if not result:
        raise HTTPException(status_code=404, detail="Task not found")

    return None