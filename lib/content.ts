// Static marketing/tourism content. Kept in one place so copy is easy to tweak.

export const SERVICES = [
  {
    icon: "MapPin",
    title: "Local Sightseeing",
    desc: "Cover all of Ooty's must-see spots at your own pace with a knowledgeable local driver.",
    placeholder: "Replace with image of Ooty sightseeing point",
  },
  {
    icon: "Plane",
    title: "Airport Transfers",
    desc: "Comfortable pick-up and drop from Coimbatore Airport and railway stations.",
    placeholder: "Replace with image of cab at airport",
  },
  {
    icon: "Sunrise",
    title: "Sunrise Tours",
    desc: "Early-morning runs to Doddabetta and viewpoints for unforgettable Nilgiri sunrises.",
    placeholder: "Replace with image of Nilgiri sunrise",
  },
  {
    icon: "Leaf",
    title: "Tea Estate Tours",
    desc: "Wind through lush tea gardens and visit working tea factories along the way.",
    placeholder: "Replace with image of tea gardens",
  },
  {
    icon: "Users",
    title: "Family & Group Trips",
    desc: "Spacious vehicles and friendly drivers — perfect for families and larger groups.",
    placeholder: "Replace with image of family on a trip",
  },
  {
    icon: "Mountain",
    title: "Custom Itineraries",
    desc: "Multi-day Nilgiris tours (Coonoor, Kotagiri, Pykara) tailored to your plans.",
    placeholder: "Replace with image of Nilgiri hills road",
  },
] as const;

export const WHY_US = [
  { icon: "ShieldCheck", title: "Safe Rides", desc: "Well-maintained vehicles and verified, experienced drivers." },
  { icon: "BadgeIndianRupee", title: "Transparent Pricing", desc: "Fixed package prices shared upfront — no per-km surprises." },
  { icon: "Sparkles", title: "Clean Cars", desc: "Sanitised, comfortable, air-conditioned vehicles." },
  { icon: "Clock", title: "On-Time Service", desc: "Punctual pickups so you never miss a moment." },
  { icon: "MapPinned", title: "Local Experts", desc: "Drivers who know every hill road and hidden gem." },
  { icon: "Headphones", title: "24/7 Support", desc: "Reach us anytime on call or WhatsApp." },
] as const;

export const VEHICLE_CATEGORY_CARDS = [
  {
    category: "Hatchback",
    seats: "1–4",
    blurb: "Budget-friendly and nimble for city rides and small families.",
    features: ["AC", "2 bags", "Economical"],
    placeholder: "Replace with image of hatchback cab",
  },
  {
    category: "Sedan",
    seats: "1–4",
    blurb: "Comfortable seating with extra boot space for longer journeys.",
    features: ["AC", "3 bags", "Best for couples"],
    placeholder: "Replace with image of sedan cab (e.g. Toyota Etios)",
  },
  {
    category: "SUV",
    seats: "1–7",
    blurb: "Spacious and sturdy — ideal for hill roads and group travel.",
    features: ["AC", "Roomy", "Best for groups"],
    placeholder: "Replace with image of SUV cab (e.g. Mahindra Xylo)",
  },
  {
    category: "Tempo Traveller",
    seats: "8–14",
    blurb: "Travel together comfortably for large families and tour groups.",
    features: ["AC", "Push-back seats", "Large luggage"],
    placeholder: "Replace with image of tempo traveller",
  },
] as const;

export const DESTINATIONS = [
  {
    name: "Ooty Lake",
    desc: "An iconic boating lake fringed by eucalyptus trees — a classic first stop.",
    distance: "~3 km from town",
    placeholder: "Replace with image of Ooty Lake boating",
  },
  {
    name: "Botanical Gardens",
    desc: "Sprawling terraced gardens with rare plants, a fossil tree and seasonal flower shows.",
    distance: "~3 km from town",
    placeholder: "Replace with image of Ooty Botanical Gardens",
  },
  {
    name: "Doddabetta Peak",
    desc: "The highest point in the Nilgiris (2,637 m) with panoramic telescope-house views.",
    distance: "~10 km from town",
    placeholder: "Replace with image of Doddabetta Peak view",
  },
  {
    name: "Tea Factory & Museum",
    desc: "See how Nilgiri tea is made and taste fresh brews straight from the estate.",
    distance: "~7 km from town",
    placeholder: "Replace with image of Ooty tea factory",
  },
  {
    name: "Pykara Lake & Falls",
    desc: "Serene lake with boating and a scenic waterfall surrounded by shola forests.",
    distance: "~19 km from town",
    placeholder: "Replace with image of Pykara Lake and falls",
  },
  {
    name: "Avalanche Lake",
    desc: "An offbeat, pristine eco-tourism spot rich in wildlife and trekking trails.",
    distance: "~28 km from town",
    placeholder: "Replace with image of Avalanche Lake",
  },
  {
    name: "Emerald Lake",
    desc: "Tranquil reservoir with mirror-like waters and stunning tea-garden surrounds.",
    distance: "~25 km from town",
    placeholder: "Replace with image of Emerald Lake",
  },
  {
    name: "Rose Garden",
    desc: "One of India's largest rose gardens with thousands of varieties in terraced beds.",
    distance: "~2 km from town",
    placeholder: "Replace with image of Ooty Rose Garden",
  },
  {
    name: "Nilgiri Mountain Railway",
    desc: "A UNESCO World Heritage toy train winding through tunnels and tea slopes.",
    distance: "Ooty ↔ Mettupalayam",
    placeholder: "Replace with image of Nilgiri Mountain Railway toy train",
  },
] as const;

export const TESTIMONIALS = [
  {
    name: "Priya & family",
    from: "Bengaluru",
    quote:
      "Our driver knew every viewpoint and waited patiently while we took photos. Booking was effortless and the car was spotless.",
    placeholder: "Replace with photo of customer Priya",
  },
  {
    name: "Arun Kumar",
    from: "Chennai",
    quote:
      "Reached Ooty from Coimbatore airport without any hassle. Fair price, on time, and a very friendly local driver.",
    placeholder: "Replace with photo of customer Arun",
  },
  {
    name: "The Mehtas",
    from: "Mumbai",
    quote:
      "Did a full Nilgiris tour over two days. Pykara and Avalanche were magical. Highly recommend Ready Go for families!",
    placeholder: "Replace with photo of customer family the Mehtas",
  },
] as const;

// ── Tourist guide (rich page content) ──────────────────────────
export const GUIDE_ATTRACTIONS = [
  {
    name: "Ooty Lake",
    desc: "Built in 1824, this artificial lake is the heart of Ooty tourism. Pedal boats and rowing boats are available, and the surrounding garden and mini-train make it great for kids.",
    tip: "Go early morning to avoid crowds and get the best light on the water.",
    placeholder: "Replace with image of Ooty Lake boating",
  },
  {
    name: "Government Botanical Gardens",
    desc: "Laid out in 1848 across ~55 acres, the gardens host thousands of plant species, an Italian-style garden and a 20-million-year-old fossilised tree. The annual Flower Show (May) is spectacular.",
    tip: "Wear comfortable shoes — the terraced layout involves a fair bit of walking.",
    placeholder: "Replace with image of Botanical Gardens flower beds",
  },
  {
    name: "Doddabetta Peak",
    desc: "At 2,637 m, the highest peak in the Nilgiris offers sweeping views of the Western Ghats. A telescope house at the top lets you scan the valleys on clear days.",
    tip: "Mornings are clearest; clouds often roll in by afternoon.",
    placeholder: "Replace with image of Doddabetta Peak panorama",
  },
  {
    name: "Tea Factory & Tea Museum",
    desc: "Learn the full journey of Nilgiri tea from leaf to cup, watch the machinery in action, and sample (and buy) fresh estate teas and homemade chocolates.",
    tip: "Combine with Doddabetta — they're on the same route.",
    placeholder: "Replace with image of tea factory machinery",
  },
  {
    name: "Pykara Lake & Falls",
    desc: "About 19 km from town, Pykara is famed for its shola forests, a tiered waterfall and boating on a calm reservoir. A favourite filming location too.",
    tip: "Carry snacks; options near the falls are limited.",
    placeholder: "Replace with image of Pykara Falls",
  },
  {
    name: "Avalanche Lake",
    desc: "A protected eco-tourism zone ~28 km away, rich in rhododendrons, wildflowers and wildlife. Forest-department jeep safaris and trout fishing are the highlights.",
    tip: "Entry may need a forest-department permit — your driver can help arrange it.",
    placeholder: "Replace with image of Avalanche Lake meadows",
  },
  {
    name: "Emerald Lake",
    desc: "A quiet, offbeat reservoir surrounded by tea estates and hills, perfect for a peaceful picnic away from the tourist rush.",
    tip: "Best paired with Avalanche on the same day trip.",
    placeholder: "Replace with image of Emerald Lake reflection",
  },
  {
    name: "Rose Garden",
    desc: "Spread over a terraced hillside, this is one of India's largest rose gardens with over 20,000 varieties, blooming brightest from May to June.",
    tip: "Great sunset views over the town from the upper terraces.",
    placeholder: "Replace with image of Rose Garden terraces",
  },
  {
    name: "Nilgiri Mountain Railway",
    desc: "A UNESCO World Heritage steam/diesel 'toy train' between Mettupalayam and Ooty via Coonoor, climbing through 16 tunnels and lush tea country — a ride to remember.",
    tip: "Book the Ooty–Coonoor leg in advance; seats sell out fast in season.",
    placeholder: "Replace with image of Nilgiri Mountain Railway on a curve",
  },
] as const;

export const ITINERARIES = [
  {
    title: "1 Day — Ooty Highlights",
    stops: ["Ooty Lake", "Rose Garden", "Botanical Gardens", "Doddabetta Peak", "Tea Factory & Museum"],
  },
  {
    title: "2 Days — Ooty + Nature",
    stops: [
      "Day 1: Ooty Lake, Rose & Botanical Gardens, Doddabetta",
      "Day 2: Pykara Lake & Falls, Tea Factory, Emerald & Avalanche Lakes",
    ],
  },
  {
    title: "3 Days — Nilgiris Explorer",
    stops: [
      "Day 1: Ooty town sights + toy train to Coonoor",
      "Day 2: Pykara, Avalanche & Emerald Lakes",
      "Day 3: Coonoor (Sim's Park, Dolphin's Nose) & Kotagiri viewpoints",
    ],
  },
] as const;

export const TRAVEL_TIPS = [
  "Best season: October–June. Carry light woollens — evenings get chilly year-round.",
  "Roads are winding; if you're prone to motion sickness, sit in front and travel light meals.",
  "Mobile network can be patchy near lakes and forests — download offline maps.",
  "Respect eco-zones: avoid plastic and littering, especially around Avalanche and Pykara.",
  "Weekends and holidays are crowded; start sightseeing early to beat the rush.",
] as const;
