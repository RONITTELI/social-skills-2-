
import os
import datetime
from pymongo import MongoClient

MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/social-skills')
client = MongoClient(MONGODB_URI)
db = client.get_default_database()

user_id = "69760c17f8229f9744b8039e"
now = datetime.datetime.utcnow()

analysis_data = [
    {
        "userId": user_id,
        "type": "speech",
        "data": {
            "wpm": 120,
            "fillerWords": 3,
            "tone": "confident"
        },
        "createdAt": now
    },
    {
        "userId": user_id,
        "type": "emotion",
        "data": {
            "dominantEmotion": "happy",
            "eyeContact": "excellent"
        },
        "createdAt": now
    },
    {
        "userId": user_id,
        "type": "posture",
        "data": {
            "postureScore": 85,
            "postureIssues": ["slouching"]
        },
        "createdAt": now
    }
]

result = db.analyses.insert_many(analysis_data)
print("Inserted demo data IDs:", result.inserted_ids)
