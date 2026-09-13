import prop1 from "@/assets/prop-1.jpg";
import prop2 from "@/assets/prop-2.jpg";
import prop3 from "@/assets/prop-3.jpg";
import prop4 from "@/assets/prop-4.jpg";
import prop5 from "@/assets/prop-5.jpg";
import prop6 from "@/assets/prop-6.jpg";
import prop7 from "@/assets/prop-7.jpg";
import prop8 from "@/assets/prop-8.jpg";

const FALLBACK_GALLERIES: Record<string, string[]> = {
  "villa-contemporaine-riviera-3": [prop1, prop6, prop2, prop5],
  "appartement-premium-riviera-2": [prop2, prop7, prop5, prop1],
  "immeuble-bureaux-plateau": [prop3, prop8, prop2],
  "terrain-vue-lagune-bingerville": [prop4, prop1],
  "penthouse-cocody-ambassades": [prop5, prop2, prop7],
  "villa-duplex-cocody-angre": [prop6, prop1, prop2],
  "appartement-standing-marcory-zone4": [prop7, prop2, prop8],
  "bureau-open-space-marcory": [prop8, prop3],
};

const DEFAULT_GALLERY = [prop1, prop2, prop3];

export function galleryFor(id: string, dbGallery?: string[] | null) {
  if (dbGallery && dbGallery.length > 0) return dbGallery;
  return FALLBACK_GALLERIES[id] ?? DEFAULT_GALLERY;
}

export function imageFor(id: string, dbImage?: string | null, dbGallery?: string[] | null) {
  if (dbImage) return dbImage;
  return galleryFor(id, dbGallery)[0] ?? DEFAULT_GALLERY[0]!;
}
