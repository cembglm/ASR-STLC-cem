import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def test_connection():
    client = AsyncIOMotorClient("mongodb://localhost:27017", serverSelectionTimeoutMS=5000)
    try:
        print(await client.list_database_names())
        print("✅ Bağlantı başarılı")
    except Exception as e:
        print("❌ Hata:", e)

asyncio.run(test_connection())
