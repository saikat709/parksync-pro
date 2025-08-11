#!/usr/bin/env python3
"""
Script to create database tables for the ParkSync Pro backend.
"""
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from app.core.config import DATABASE_URL
from app.models.base import Base
from app.models.item import Item
from app.models.log import Log
from app.models.zone import Zone

async def create_tables():
    """Create all database tables."""
    print(f"Creating tables using database: {DATABASE_URL}")
    
    engine = create_async_engine(DATABASE_URL, echo=True)
    
    async with engine.begin() as conn:
        # Drop all tables first (optional - remove if you want to keep existing data)
        await conn.run_sync(Base.metadata.drop_all)
        # Create all tables
        await conn.run_sync(Base.metadata.create_all)
    
    await engine.dispose()
    print("Tables created successfully!")

if __name__ == "__main__":
    asyncio.run(create_tables())