from typing import Optional, Any, List

from sqlalchemy import select, func, desc, or_, update, delete
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from .base import BaseDAO
from ..models.task import Task
from ..models.user import User


class UserDAO(BaseDAO):
    model = User

    @classmethod
    async def seach_users_by_query(cls, session: AsyncSession, query: str) -> Optional[Any]:
        try:
            query = select(cls.model).filter(cls.model.username.ilike('%' + query + '%'))
            result = await session.execute(query)
            return result.scalars().all()
        except SQLAlchemyError as e:
            await session.rollback()
            raise e

class TaskDAO(BaseDAO):
    model = Task

    @classmethod
    async def change_complete_task(cls, session: AsyncSession, is_completed: bool, **filterby) -> Optional[bool]:
        try:
            query = update(cls.model).filter_by(**filterby).values(is_completed=is_completed)
            result = await session.execute(query)
            await session.commit()

            return True
        except SQLAlchemyError as e:
            await session.rollback()
            raise e

    @classmethod
    async def delete_task_by_query(cls, session: AsyncSession, **filterby) -> bool:
        try:
            query = select(cls.model).filter_by(**filterby)
            result = await session.execute(query)
            task = result.scalar_one_or_none()
            result = await session.delete(task)
            await session.commit()
            return True
        except SQLAlchemyError as e:
            await session.rollback()
            raise e
