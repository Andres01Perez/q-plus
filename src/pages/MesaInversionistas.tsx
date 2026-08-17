import { Youtube } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const YOUTUBE_CHANNEL = 'https://www.youtube.com/@QPlus_Inmobiliaria';

// Plantilla editable: ajusta el tema y los tips de cada mes, y actualiza
// "videoUrl" con el enlace directo al video de YouTube apenas lo publiques.
const MESES = [
  {
    mes: 'Agosto',
    tema: 'Cómo leer un contrato de arras antes de firmar',
    tips: [
      'Verifica el plazo de las arras y qué pasa si te arrepientes.',
      'Pide siempre el certificado de tradición y libertad actualizado.',
      'No entregues dinero sin promesa de compraventa firmada.',
    ],
    videoUrl: null as string | null,
  },
  {
    mes: 'Septiembre',
    tema: 'Renta corta vs. renta tradicional en Antioquia',
    tips: [
      'Compara el Cap Rate de ambos modelos en la misma zona.',
      'Revisa la normativa municipal para alquiler tipo Airbnb.',
      'Calcula la ocupación mínima para igualar un arriendo fijo.',
    ],
    videoUrl: null as string | null,
  },
  {
    mes: 'Octubre',
    tema: 'Qué banco se ajusta a tu perfil de crédito',
    tips: [
      'El nivel de endeudamiento pesa más que el ingreso bruto.',
      'Compara cuota inicial mínima entre entidades, no solo tasa.',
      'Independientes: ten a la mano dos años de declaración de renta.',
    ],
    videoUrl: null as string | null,
  },
  {
    mes: 'Noviembre',
    tema: 'Cierre de año: declarar tus ingresos por Airbnb',
    tips: [
      'Guarda los reportes mensuales de la plataforma todo el año.',
      'Separa comisión de plataforma de tu ingreso operativo real.',
      'Consulta con tu contador antes de la temporada de renta.',
    ],
    videoUrl: null as string | null,
  },
  {
    mes: 'Diciembre',
    tema: 'Temporada alta: cómo fijar tarifas dinámicas',
    tips: [
      'Sube la tarifa gradualmente para no perder reservas.',
      'Bloquea noches sueltas difíciles de llenar entre reservas largas.',
      'Revisa precios de la competencia cercana cada semana.',
    ],
    videoUrl: null as string | null,
  },
  {
    mes: 'Enero',
    tema: 'Metas de inversión inmobiliaria para el año nuevo',
    tips: [
      'Define cuánto efectivo quieres tener listo para una nueva compra.',
      'Revisa el Cash-on-Cash real de tus propiedades del año anterior.',
      'Marca en el calendario cuándo renegociar tu crédito actual.',
    ],
    videoUrl: null as string | null,
  },
];

const MesaInversionistas = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="pt-24 pb-12 bg-secondary">
        <div className="container mx-auto px-4">
          <Badge className="mb-4 bg-primary text-primary-foreground font-body">Comunidad</Badge>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Mesa de las Inversionistas
          </h1>
          <p className="font-body text-muted-foreground max-w-2xl">
            Un tip de inversión inmobiliaria cada mes, con un video corto en
            nuestro canal de YouTube.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MESES.map((item, index) => (
              <Card key={item.mes} className="flex flex-col">
                <CardContent className="pt-6 flex flex-col gap-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      {item.mes}
                    </h3>
                    <span className="font-mono text-xs text-muted-foreground border border-border rounded-full px-2.5 py-1">
                      {String(index + 1).padStart(2, '0')} / {String(MESES.length).padStart(2, '0')}
                    </span>
                  </div>
                  <p className="font-body text-sm font-semibold text-primary">{item.tema}</p>
                  <ul className="space-y-2 flex-1">
                    {item.tips.map((tip) => (
                      <li key={tip} className="font-body text-sm text-muted-foreground flex gap-2">
                        <span className="text-primary">-</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant="outline"
                    className="gap-2 mt-2"
                    asChild
                  >
                    <a href={item.videoUrl ?? YOUTUBE_CHANNEL} target="_blank" rel="noopener noreferrer">
                      <Youtube className="h-4 w-4" />
                      {item.videoUrl ? 'Ver video' : 'Ver canal de YouTube'}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="text-xs text-muted-foreground text-center mt-10">
            Plantilla editable: pídele a tu desarrollador que actualice el
            tema, los tips y el enlace directo de cada video en{' '}
            <code className="font-mono">src/pages/MesaInversionistas.tsx</code>{' '}
            apenas lo publiques.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MesaInversionistas;
