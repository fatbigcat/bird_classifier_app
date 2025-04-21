from pymongo import MongoClient

# Connect to local MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client.birdDB
collection = db.birds

# Clear the collection before inserting new data
collection.delete_many({})

# Define bird entries
birds = [
    {
        "name": "Little Grebe",
        "scientificName": "Tachybaptus ruficollis",
        "soundLabel": "maliponirek",
        "description": "A small water bird with a short neck, often seen diving underwater for insects and small fish.",
        "habitat": "Freshwater ponds, lakes, marshes, and slow-flowing rivers with vegetation.",
        "recognitionCounter": 0,
        "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/2/2f/Tachybaptus_ruficollis_ruficollis.jpg",
        "audioUrl": "/static/audio/maliponirek.mp3"

    },
    
    {
        "name": "Common Gull",
        "scientificName": "Larus canus",
        "soundLabel": "sivigaleb",
        "description": "A medium-sized gull with a pale grey back, white head and underparts, and yellow legs and bill.",
        "habitat": "Coastal regions, estuaries, inland lakes, and fields, often near human settlements.",
        "recognitionCounter": 0,
        "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/0/09/212_Common_Gull.jpg",
        "audioUrl": "/static/audio/sivigaleb.mp3"

    },
    {
        "name": "Black-headed Gull",
        "scientificName": "Chroicocephalus ridibundus",
        "soundLabel": "recnigaleb",
        "description": "A small gull with a dark brown head (in summer), red bill and legs, and a distinctive loud call.",
        "habitat": "Wetlands, rivers, lakes, marshes, and also urban areas with accessible water sources.",
        "recognitionCounter": 0,
        "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/b/b4/Black-headed_Gull_%28Chroicocephalus_ridibundus%29.jpg",
        "audioUrl": "/static/audio/recnigaleb.wav"

    },{
      "name": "sum",
      "scientificName": "sum",
      "soundLabel": "sum",
      "description": "sum",
      "habitat": "sum",
      "recognitionCounter": 0,
      "imageUrl": "sum",
    }
]

# Insert birds into the collection
result = collection.insert_many(birds)
print(f"Inserted bird IDs: {result.inserted_ids}")
