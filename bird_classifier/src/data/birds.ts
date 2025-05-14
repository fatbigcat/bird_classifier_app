// Static bird data
export interface BirdData {
  name: string;
  scientificName: string;
  soundLabel: string;
  description: string;
  habitat: string;
  range?: string;
  diet?: string;
  recognitionCounter: number;
  imageUrl: string;
  audioUrl: string;
}

// Map bird sound labels to bird data for easy lookup
export const BIRDS_DATA: Record<string, BirdData> = {
  maliponirek: {
    name: "Little Grebe",
    scientificName: "Tachybaptus ruficollis",
    soundLabel: "maliponirek",
    description:
      "A small water bird with a short neck, often seen diving underwater for insects and small fish.",
    habitat:
      "Freshwater ponds, lakes, marshes, and slow-flowing rivers with vegetation.",
    recognitionCounter: 0,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/2/2f/Tachybaptus_ruficollis_ruficollis.jpg",
    audioUrl: "/static/audio/maliponirek.mp3",
    range: "Widespread across Europe, Asia, and Africa",
    diet: "Small fish, aquatic insects, and crustaceans",
  },
  sivigaleb: {
    name: "Common Gull",
    scientificName: "Larus canus",
    soundLabel: "sivigaleb",
    description:
      "A medium-sized gull with a pale grey back, white head and underparts, and yellow legs and bill.",
    habitat:
      "Coastal regions, estuaries, inland lakes, and fields, often near human settlements.",
    recognitionCounter: 0,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/0/09/212_Common_Gull.jpg",
    audioUrl: "/static/audio/sivigaleb.mp3",
    range:
      "Northern Europe and Asia, with winter migrations to warmer coastal areas",
    diet: "Fish, invertebrates, insects, and sometimes human food waste",
  },
  recnigaleb: {
    name: "Black-headed Gull",
    scientificName: "Chroicocephalus ridibundus",
    soundLabel: "recnigaleb",
    description:
      "A small gull with a dark brown head (in summer), red bill and legs, and a distinctive loud call.",
    habitat:
      "Wetlands, rivers, lakes, marshes, and also urban areas with accessible water sources.",
    recognitionCounter: 0,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/b/b4/Black-headed_Gull_%28Chroicocephalus_ridibundus%29.jpg",
    audioUrl: "/static/audio/recnigaleb.wav",
    range: "Europe and Asia, with some populations in coastal North America",
    diet: "Worms, insects, small fish, and scraps",
  },
  sum: {
    name: "sum",
    scientificName: "sum",
    soundLabel: "sum",
    description: "sum",
    habitat: "sum",
    recognitionCounter: 0,
    imageUrl: "sum",
    audioUrl: "",
  },
};
