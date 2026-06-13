/**
 * Central image config.
 *
 * These are free, high-quality Unsplash stock photos used as attractive
 * temporary visuals. To replace any of them with the client's real photos,
 * just swap the URL here (or, for vehicles, set an image in the admin portal).
 *
 * `img(id)` builds an optimized Unsplash CDN URL at a sensible width/quality.
 */
export function img(id: string, w = 1200, q = 70): string {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=${q}`;
}

export const IMAGES = {
  // Hero
  heroBackground: img("photo-1603097148068-564d0158227e", 1920), // tea-estate hills
  heroCab: "/landing_page.png", // local file in public/ — white Innova on a hill road

  // About
  aboutFamily: "/img.jpg", // family travel

  // Vehicle category cards (by category name)
  category: {
    Hatchback: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfLX_oSq1Hytp_D7nWa2T3i9NOwgJGczn8NrotPhkmGA&s=10",
    Sedan: "https://stimg.cardekho.com/images/carexteriorimages/930x620/Maruti/Dzire-Tour-S/12461/1762857975456/front-left-side-47.jpg",
    SUV: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrIttR2FYUNm2-XL85NVs-VbxOMNotH4DqUsbSANVwkEkGc7MdjFNublc&s=10",
    "Tempo Traveller": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4ervkoOur7JiHFych_uf4Z0ahLQOeCLWq123DnzFdSaV7UZBuzWWwWdo&s=10",
  } as Record<string, string>,

  // Destinations / guide attractions (by name)
  place: {
    "Ooty Lake": "https://i0.wp.com/weekendyaari.in/wp-content/uploads/2024/10/ooty-1653923879_ee32f7707d19c1d542af-e1728238231728.webp?fit=1102%2C720&ssl=1",
    "Botanical Gardens": "https://holidayszone.in/images/sightseeing-places/ooty/ooty-rose-garden-ooty-tour-header-small.jpg",
    "Government Botanical Gardens": "https://ootytourism.co.in/images/tourist-places/ooty-botanical-gardens/ooty-botanical-gardens-india-tourism-history.jpg",
    "Doddabetta Peak": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/3d/3d/ce/doddabetta-peak.jpg?w=1200&h=-1&s=1",
    "Tea Factory & Museum": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsae0ajAxMkj6HdOgnvcEXBp_O6AhRtr4LAIalb-cjYyh5vfSnS7_ZpCY&s=10",
    "Tea Factory & Tea Museum": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsae0ajAxMkj6HdOgnvcEXBp_O6AhRtr4LAIalb-cjYyh5vfSnS7_ZpCY&s=10",
    "Pykara Lake & Falls": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/14/9b/41/39/fb-img-1536802621189.jpg?w=1200&h=-1&s=1",
    "Avalanche Lake": "https://ootytourism.co.in/images/tourist-places/avalanche-lake-ooty/avalanche-lake-ooty-tourism-entry-ticket-price.jpg",
    "Emerald Lake": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5oiEch2BVZoObxv9O7ys1gJ0YUTpDK3-5osGNfQoTrg&s=10",
    "Rose Garden": "https://s7ap1.scene7.com/is/image/incredibleindia/rose-garden-ooty-tamil-nadu-attr-about?qlt=82&ts=1751459177567",
    "Nilgiri Mountain Railway": "https://th-i.thgim.com/public/incoming/86wqrh/article66410984.ece/alternates/FREE_1200/10214_20_12_2022_16_17_1_5_DSC_0669.JPG",
  } as Record<string, string>,
};
