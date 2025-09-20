#!/usr/bin/env python3
"""
Test MongoDB Atlas connection script
"""
import os
from dotenv import load_dotenv
from pymongo import MongoClient
import logging

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_mongodb_connection():
    """Test MongoDB Atlas connection"""
    try:
        # Get connection details from environment
        mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017/")
        database_name = os.getenv("DATABASE_NAME", "mental_wellness")
        
        logger.info(f"Attempting to connect to: {mongodb_url}")
        logger.info(f"Database name: {database_name}")
        
        # Create MongoDB client
        client = MongoClient(mongodb_url)
        
        # Test the connection
        client.admin.command('ping')
        logger.info("✅ Successfully connected to MongoDB!")
        
        # Get database and collection
        db = client[database_name]
        users_collection = db["users"]
        
        # Test basic operations
        logger.info("Testing basic database operations...")
        
        # Count documents
        user_count = users_collection.count_documents({})
        logger.info(f"Current users in database: {user_count}")
        
        # Test insert (optional - uncomment if you want to test)
        # test_user = {"username": "test_user", "password": "test_password"}
        # result = users_collection.insert_one(test_user)
        # logger.info(f"Test user inserted with ID: {result.inserted_id}")
        
        # List collections
        collections = db.list_collection_names()
        logger.info(f"Available collections: {collections}")
        
        client.close()
        logger.info("✅ MongoDB connection test completed successfully!")
        return True
        
    except Exception as e:
        logger.error(f"❌ Error connecting to MongoDB: {e}")
        return False

if __name__ == "__main__":
    success = test_mongodb_connection()
    if success:
        print("\n🎉 Your MongoDB setup is ready for deployment!")
    else:
        print("\n⚠️ Please check your MongoDB configuration.")
