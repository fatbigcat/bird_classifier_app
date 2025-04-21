from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pymongo import MongoClient
from bson.objectid import ObjectId
from typing import Optional

# Connect to MongoDB (local)
client = MongoClient("mongodb://localhost:27017/")
db = client.birdDB
collection = db.birds

# Pydantic model for bird data
class Bird(BaseModel):
    name: str
    scientificName: str
    soundLabel: str
    description: str
    habitat: str
    
    recognitionCounter: int = 0
    imageUrl: Optional[str] = None

app = FastAPI()

@app.get("/birds/{label}", response_model=Bird)
def get_bird_by_label(label: str):
    bird = collection.find_one({"soundLabel": label})
    if bird:
        return Bird(**bird)
    raise HTTPException(status_code=404, detail="Bird not found")

@app.post("/birds/")
def add_bird(bird: Bird):
    if collection.find_one({"soundLabel": bird.soundLabel}):
        raise HTTPException(status_code=400, detail="Bird already exists")
    result = collection.insert_one(bird.dict())
    return {"message": "Bird added", "id": str(result.inserted_id)}
