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
  "bela storklja": {
    name: "White Stork",
    scientificName: "Ciconia ciconia",
    soundLabel: "bela storklja",
    description:
      "A large bird with mainly white plumage and black wings, known for its long red legs and beak, and its migratory behavior.",
    habitat:
      "Open grasslands and marshy wetlands for breeding, with grassy meadows, farmland, and shallow wetlands serving as feeding grounds.",
    recognitionCounter: 0,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/White_stork_%28Ciconia_ciconia%29_Bia%C5%82owieza.jpg/500px-White_stork_%28Ciconia_ciconia%29_Bia%C5%82owieza.jpg",
    audioUrl: "/static/audio/belastorklja.mp3",
    range: "Across Europe, the Iberian Peninsula, North Africa, parts of western Asia, and central Asia, with winter migrations to Sub-Saharan Africa.",
    diet: "Insects, fish, amphibians, reptiles, small mammals, and small birds.",
  },
  smrdokavra: {
    name: "Eurasian Hoopoe",
    scientificName: "Upupa epops",
    soundLabel: "smrdokavra",
    description:
      "A distinctive cinnamon colored bird with black and white wings, a tall erectile crest, a broad white band across a black tail, and a long narrow downcurved bill.",
    habitat:
      "Heathland, wooded steppes, savannas, grasslands, and forest glades.",
    recognitionCounter: 0,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Eurasian_hoopoe_by_Gunjan_Pandey.jpg/500px-Eurasian_hoopoe_by_Gunjan_Pandey.jpg",
    audioUrl: "/static/audio/smrdokavra.mp3",
    range:
      "Widespread in Europe, Asia, and North Africa, and northern Sub-Saharan Africa, with most European and north Asian birds migrating to the tropics in winter.",
    diet: "Insects such as crickets, locusts, beetles, earwigs, and ants, although it sometimes takes small reptiles, frogs, and plant matter like seeds and berries.",
  },
  "veliki skovik": {
    name: "Eurasian Scops Owl",
    scientificName: "Otus scops",
    soundLabel: "veliki skovik",
    description:
      "A small, migratory owl species known for its grey-brown plumage, upright perching with small ear-tufts, and its deep whistle call.",
    habitat:
      "Open woodland, parks, and gardens.",
    recognitionCounter: 0,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Scops_Owl_%28Otus_scops%29%2C_Kalloni%2C_Lesvos%2C_Greece%2C_19.04.2015_%2816773748434%29.jpg/500px-Scops_Owl_%28Otus_scops%29%2C_Kalloni%2C_Lesvos%2C_Greece%2C_19.04.2015_%2816773748434%29.jpg",
    audioUrl: "/static/audio/velikiskovik.mp3",
    range: "From southern Europe eastwards to southern Siberia and the western Himalayas, wintering in Africa south of the Sahara.",
    diet: "Small prey such as insects and other invertebrates.",
  },
  skorec: {
    name: "Common Starling",
    scientificName: "Sturnus vulgaris",
    soundLabel: "skorec",
    description:
      "A medium-sized passerine bird known for its glossy black plumage with a metallic sheen, speckled with white at certain times of the year, and its ability to mimic sounds.",
    habitat:
      "Urban or suburban areas with artificial structures and trees for nesting and roosting, and grassy areas like farmland and golf courses for feeding.",
    recognitionCounter: 0,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Toulouse_-_Sturnus_vulgaris_-_2012-02-26_-_3.jpg/500px-Toulouse_-_Sturnus_vulgaris_-_2012-02-26_-_3.jpg",
    audioUrl: "/static/audio/skorec.mp3",
    range: "Areas throughout the Northern Hemisphere such as Eurasia, Europe, northern Africa, northern China, and parts of India and the Middle East.",
    diet: "Largely insectivorous, feeding on a variety of arthropods and invertebrates, but is also omnivorous, consuming grains, seeds, fruits, nectar, and food waste when available.",
  },
  "rjavi srakoper": {
    name: "Red-backed Shrike",
    scientificName: "Lanius collurio",
    soundLabel: "rjavi srakoper",
    description:
      "A small carnivorous bird known for its reddish-brown back and distinctive black facial mask in males, earning it the nickname \"butcher bird\" due to its habit of impaling prey on thorns.",
    habitat:
      "Open landscapes such as grasslands, heathlands, and forest edges with scattered bushes or low trees.",
    recognitionCounter: 0,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Red-backed_shrike.jpg/500px-Red-backed_shrike.jpg",
    audioUrl: "/static/audio/rjavisrakoper.mp3",
    range: "Most of Europe and western Asia; migrates to and winters in eastern and southern Africa.",
    diet: "Feeds primarily on large insects, but also consumes small birds, mammals, amphibians, and reptiles.",
  },
  pivka: {
    name: "Grey-headed Woodpecker",
    scientificName: "Picus canus",
    soundLabel: "pivka",
    description:
      "A medium-sized Eurasian woodpecker with a distinctive grey head and greenish upperparts, known for its preference for mature forests.",
    habitat:
      "Deciduous and mixed forests with a high proportion of dead or decaying trees.",
    recognitionCounter: 0,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/%D0%A1%D0%B5%D0%B4%D0%BE%D0%B9_%D0%B4%D1%8F%D1%82%D0%B5%D0%BB_%D1%83_%D0%B1%D0%BE%D0%BB%D0%BE%D1%82%D0%B0_%D1%80%D0%B5%D1%87%D0%BA%D0%B8_%D0%97%D0%B8%D0%BC%D1%91%D0%BD%D0%BA%D0%B8.jpg/500px-%D0%A1%D0%B5%D0%B4%D0%BE%D0%B9_%D0%B4%D1%8F%D1%82%D0%B5%D0%BB_%D1%83_%D0%B1%D0%BE%D0%BB%D0%BE%D1%82%D0%B0_%D1%80%D0%B5%D1%87%D0%BA%D0%B8_%D0%97%D0%B8%D0%BC%D1%91%D0%BD%D0%BA%D0%B8.jpg",
    audioUrl: "/static/audio/pivka.mp3",
    range: "Central, northern, and eastern Europe, extending through Russia and into parts of Asia, reaching as far as the Pacific coast",
    diet: "Ants and their larvae, especially wood ants, but also consumes termites, beetle larvae, caterpillars, spiders, and, in autumn and winter, supplements its diet with berries and other fruits.",
  },
  "hribski skrjanec": {
    name: "Woodlark",
    scientificName: "Lullula arborea",
    soundLabel: "hribski skrjanec",
    description:
      "A small, streaky brown songbird with a distinctive white supercilium that meets at the back of the head, known for its melodious, warbling song delivered during undulating flight.",
    habitat:
      "Open landscapes such as heathlands, grasslands, and clearings in pine forests.",
    recognitionCounter: 0,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Lullula_arborea_%28J%C3%A1n_Svetl%C3%ADk%29.jpg/500px-Lullula_arborea_%28J%C3%A1n_Svetl%C3%ADk%29.jpg",
    audioUrl: "/static/audio/hribskiskrjanec.mp3",
    range: "Found across much of Europe, the Middle East, western Asia, and parts of North Africa.",
    diet: "Feeds mainly on seeds during autumn and winter, and consumes a higher proportion of insects such as beetles, flies, and spiders during the breeding season.",
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
