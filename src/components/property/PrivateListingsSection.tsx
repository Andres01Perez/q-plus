import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { PrivateListingLeadForm } from "./PrivateListingLeadForm";

interface PrivateTeaser {
  id: string;
  title: string;
  city: string | null;
  neighborhood: string | null;
}

export function PrivateListingsSection() {
  const [listings, setListings] = useState<PrivateTeaser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("properties")
      .select("id, title, city, neighborhood")
      .eq("is_private", true)
      .neq("status", "draft")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setListings(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <section id="privadas" className="py-20 md:py-28 bg-luxury-bg text-white scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mb-12">
          <Badge className="mb-4 bg-gold/15 text-gold border border-gold/30 font-body">
            <Lock className="h-3 w-3 mr-1.5" />
            Acceso reservado
          </Badge>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Propiedades privadas
          </h2>
          <p className="font-body text-white/70">
            Un grupo reducido de inmuebles que no publicamos abiertamente.
            Regístrate una vez y un asesor te contacta con precio, ubicación
            exacta y fotos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-20 rounded-lg bg-white/5 animate-pulse" />
              ))
            ) : listings.length === 0 ? (
              <p className="font-body text-white/50 text-sm">
                Próximamente nuevas propiedades exclusivas.
              </p>
            ) : (
              listings.map((listing) => (
                <div
                  key={listing.id}
                  className="flex items-center justify-between gap-4 rounded-lg border border-gold/20 bg-white/5 px-5 py-4"
                >
                  <div>
                    <p className="font-body text-xs text-white/50 mb-1">
                      {[listing.neighborhood, listing.city].filter(Boolean).join(", ") ||
                        "Ubicación reservada"}
                    </p>
                    <p className="font-display text-lg font-semibold blur-sm select-none">
                      $$$.$$$.$$$
                    </p>
                  </div>
                  <Badge variant="outline" className="border-gold/40 text-gold font-body">
                    Privada
                  </Badge>
                </div>
              ))
            )}
          </div>

          <PrivateListingLeadForm />
        </div>
      </div>
    </section>
  );
}
