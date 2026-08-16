import { Link } from "@tanstack/react-router";
import { BedDouble, Bath, Maximize, MapPin } from "lucide-react";
import { formatPrice, type Property } from "@/lib/data";
import { Button } from "@/components/ui/button";

export function PropertyCard({ property, match }: { property: Property; match?: number }) {
  return (
    <article className="group overflow-hidden rounded-xl border border-border bg-card shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift">
      <Link
        to="/properties/$id"
        params={{ id: property.id }}
        className="relative block aspect-[4/3] overflow-hidden"
      >
        <img
          src={property.image}
          alt={property.name}
          loading="lazy"
          width={1200}
          height={800}
          className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          {property.available && (
            <span className="rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-semibold text-foreground backdrop-blur">
              Disponible
            </span>
          )}
          <span className="rounded-full bg-foreground/80 px-2.5 py-1 text-[11px] font-semibold text-background backdrop-blur">
            {property.transaction}
          </span>
        </div>
        {match !== undefined && (
          <span className="absolute right-3 top-3 rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold text-accent-foreground">
            {match}% MATCH
          </span>
        )}
      </Link>

      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base leading-snug">{property.name}</h3>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="size-3.5" />
              {property.location} · {property.type}
            </p>
          </div>
        </div>

        <p className="font-display text-xl">{formatPrice(property)}</p>

        <div className="flex flex-wrap gap-4 border-t border-border pt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Maximize className="size-3.5" /> {property.surface} m²
          </span>
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1.5">
              <BedDouble className="size-3.5" /> {property.bedrooms} ch.
            </span>
          )}
          {property.bathrooms > 0 && (
            <span className="flex items-center gap-1.5">
              <Bath className="size-3.5" /> {property.bathrooms} sdb
            </span>
          )}
        </div>

        <Button asChild variant="outline" className="w-full">
          <Link to="/properties/$id" params={{ id: property.id }}>
            Voir le bien
          </Link>
        </Button>
      </div>
    </article>
  );
}
