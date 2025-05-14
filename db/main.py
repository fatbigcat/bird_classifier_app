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

@app.get("/birds/", response_model=list[Bird])
def get_all_birds():
    birds = []
    for bird_doc in collection.find():
        # Ensure ObjectId is converted to string if needed, though Pydantic might handle it
        # Construct URLs if necessary
        if "soundLabel" in bird_doc:
             bird_doc["audioUrl"] = f"http://localhost:8000/static/audio/{bird_doc['soundLabel']}.mp3"
        # Add image URL construction if applicable and stored in DB
        # bird_doc["imageUrl"] = f"http://localhost:8000/static/images/{bird_doc['image_filename']}"
        birds.append(Bird(**bird_doc))
    return birds

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
