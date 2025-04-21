from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
from bson.objectid import ObjectId
from typing import Optional
from fastapi.staticfiles import StaticFiles

#serve static files
app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
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
    audioUrl: Optional[str] = None


# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your React app's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/birds/{label}", response_model=Bird)
def get_bird_by_label(label: str):
    bird = collection.find_one({"soundLabel": label})
    if bird:
        bird["audioUrl"] = f"http://localhost:8000/static/audio/{label}.mp3"
        return Bird(**bird)
    raise HTTPException(status_code=404, detail="Bird not found")

@app.post("/birds/")
def add_bird(bird: Bird):
    if collection.find_one({"soundLabel": bird.soundLabel}):
        raise HTTPException(status_code=400, detail="Bird already exists")
    result = collection.insert_one(bird.dict())
    return {"message": "Bird added", "id": str(result.inserted_id)}

@app.post("/birds/{label}/recognised")
def increment_recognition(label: str):
    result = collection.update_one(
        {"soundLabel": label},
        {"$inc": {"recognitionCounter": 1}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Bird not found")
    return {"message": f"Recognition count incremented for '{label}'"}
