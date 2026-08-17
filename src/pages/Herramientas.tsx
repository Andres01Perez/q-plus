import { useMemo, useState } from 'react';
import { Calculator, TrendingUp } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { evaluarCredito } from '@/lib/bank-data';
import { evaluarRentabilidad, fmtCOP } from '@/lib/rental-calc';

const Herramientas = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="pt-24 pb-12 bg-secondary">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Herramientas para inversionistas
          </h1>
          <p className="font-body text-muted-foreground max-w-2xl">
            Simula tu crédito hipotecario y calcula la rentabilidad de un
            proyecto de renta corta, con cifras de referencia del mercado
            colombiano.
          </p>
        </div>
      </section>

      <CreditSimulatorSection />
      <RentalCalculatorSection />

      <Footer />
    </div>
  );
};

function CreditSimulatorSection() {
  const [valorInmueble, setValorInmueble] = useState(450_000_000);
  const [cuotaInicialPct, setCuotaInicialPct] = useState(30);
  const [ingresosMensuales, setIngresosMensuales] = useState(11_000_000);
  const [deudasMensuales, setDeudasMensuales] = useState(500_000);
  const [edad, setEdad] = useState(35);
  const [plazoAnios, setPlazoAnios] = useState(20);

  const { montoAFinanciar, cuotaInicialCop, resultados } = useMemo(
    () =>
      evaluarCredito({
        valorInmueble,
        cuotaInicialPct,
        ingresosMensuales,
        deudasMensuales,
        edad,
        plazoAnios,
      }),
    [valorInmueble, cuotaInicialPct, ingresosMensuales, deudasMensuales, edad, plazoAnios]
  );

  return (
    <section id="simulador-credito" className="py-16 md:py-20 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
            <Calculator className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Simulador de crédito hipotecario
            </h2>
            <p className="font-body text-sm text-muted-foreground">
              Compara, banco por banco, la cuota estimada y si tu perfil
              cumple los requisitos típicos.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 items-start">
          <Card className="lg:sticky lg:top-24">
            <CardHeader>
              <CardTitle className="text-base">Datos del comprador</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="c-valor">Valor del inmueble (COP)</Label>
                <Input
                  id="c-valor"
                  type="number"
                  value={valorInmueble}
                  onChange={(e) => setValorInmueble(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Cuota inicial disponible</Label>
                  <span className="font-mono text-sm font-semibold text-primary">
                    {cuotaInicialPct}%
                  </span>
                </div>
                <Slider
                  value={[cuotaInicialPct]}
                  onValueChange={([v]) => setCuotaInicialPct(v)}
                  min={10}
                  max={60}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="c-ingresos">Ingresos mensuales netos del hogar (COP)</Label>
                <Input
                  id="c-ingresos"
                  type="number"
                  value={ingresosMensuales}
                  onChange={(e) => setIngresosMensuales(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="c-deudas">Deudas mensuales actuales (COP)</Label>
                <Input
                  id="c-deudas"
                  type="number"
                  value={deudasMensuales}
                  onChange={(e) => setDeudasMensuales(Number(e.target.value))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="c-edad">Edad</Label>
                  <Input
                    id="c-edad"
                    type="number"
                    value={edad}
                    onChange={(e) => setEdad(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="c-plazo">Plazo (años)</Label>
                  <Input
                    id="c-plazo"
                    type="number"
                    value={plazoAnios}
                    onChange={(e) => setPlazoAnios(Number(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-1">
                    Monto a financiar
                  </p>
                  <p className="font-mono text-xl font-bold text-foreground">
                    {fmtCOP(montoAFinanciar)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-1">
                    Cuota inicial en pesos
                  </p>
                  <p className="font-mono text-xl font-bold text-foreground">
                    {fmtCOP(cuotaInicialCop)}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Banco</TableHead>
                    <TableHead className="text-right">Tasa ref. EA</TableHead>
                    <TableHead className="text-right">Cuota mensual est.</TableHead>
                    <TableHead className="text-right">Endeudamiento</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resultados.map((r) => (
                    <TableRow key={r.banco.nombre}>
                      <TableCell className="font-medium">{r.banco.nombre}</TableCell>
                      <TableCell className="text-right font-mono">
                        {r.banco.tasaEA.toFixed(1)}% EA
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {fmtCOP(r.cuotaMensual)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {r.dtiResultante.toFixed(1)}%
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={r.cumple ? 'default' : 'outline'}
                          className={r.cumple ? 'bg-emerald-600 hover:bg-emerald-600' : 'text-amber-700 border-amber-300'}
                        >
                          {r.cumple ? 'Cumple' : 'Revisar'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            <p className="text-xs text-muted-foreground leading-relaxed bg-muted rounded-lg p-4">
              Cifras de referencia con fines educativos, calculadas con tasas
              y topes aproximados de mercado a 2026. Cada banco define sus
              propias tasas, cupos y política de riesgo. Confirma siempre las
              condiciones vigentes directamente con la entidad.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function RentalCalculatorSection() {
  const [precioCompra, setPrecioCompra] = useState(600_000_000);
  const [adecuacion, setAdecuacion] = useState(40_000_000);
  const [porcentajeFinanciado, setPorcentajeFinanciado] = useState(70);
  const [tasaEA, setTasaEA] = useState(12.5);
  const [plazoFinAnios, setPlazoFinAnios] = useState(15);
  const [tarifaNoche, setTarifaNoche] = useState(380_000);
  const [ocupacionPct, setOcupacionPct] = useState(62);
  const [gastosOperativosMes, setGastosOperativosMes] = useState(1_200_000);
  const [comisionPlataformaPct, setComisionPlataformaPct] = useState(15);
  const [seguroPredialMes, setSeguroPredialMes] = useState(250_000);

  const r = useMemo(
    () =>
      evaluarRentabilidad({
        precioCompra,
        adecuacion,
        porcentajeFinanciado,
        tasaEA,
        plazoFinAnios,
        tarifaNoche,
        ocupacionPct,
        gastosOperativosMes,
        comisionPlataformaPct,
        seguroPredialMes,
      }),
    [
      precioCompra,
      adecuacion,
      porcentajeFinanciado,
      tasaEA,
      plazoFinAnios,
      tarifaNoche,
      ocupacionPct,
      gastosOperativosMes,
      comisionPlataformaPct,
      seguroPredialMes,
    ]
  );

  return (
    <section id="rentabilidad" className="py-16 md:py-20 bg-secondary scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Rentabilidad en renta corta
            </h2>
            <p className="font-body text-sm text-muted-foreground">
              Para proyectos nuevos tipo Airbnb: NOI, Cap Rate, Cash-on-Cash y
              ROI total del primer año.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 items-start">
          <Card className="lg:sticky lg:top-24">
            <CardHeader>
              <CardTitle className="text-base">Compra y financiación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="r-precio">Precio de compra (COP)</Label>
                <Input
                  id="r-precio"
                  type="number"
                  value={precioCompra}
                  onChange={(e) => setPrecioCompra(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="r-adecuacion">Adecuación y amoblado (COP)</Label>
                <Input
                  id="r-adecuacion"
                  type="number"
                  value={adecuacion}
                  onChange={(e) => setAdecuacion(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Porcentaje financiado</Label>
                  <span className="font-mono text-sm font-semibold text-primary">
                    {porcentajeFinanciado}%
                  </span>
                </div>
                <Slider
                  value={[porcentajeFinanciado]}
                  onValueChange={([v]) => setPorcentajeFinanciado(v)}
                  min={0}
                  max={80}
                  step={5}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="r-tasa">Tasa EA</Label>
                  <Input
                    id="r-tasa"
                    type="number"
                    step="0.1"
                    value={tasaEA}
                    onChange={(e) => setTasaEA(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="r-plazo">Plazo (años)</Label>
                  <Input
                    id="r-plazo"
                    type="number"
                    value={plazoFinAnios}
                    onChange={(e) => setPlazoFinAnios(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-border" />

              <div className="space-y-2">
                <Label htmlFor="r-tarifa">Tarifa promedio por noche (COP)</Label>
                <Input
                  id="r-tarifa"
                  type="number"
                  value={tarifaNoche}
                  onChange={(e) => setTarifaNoche(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Ocupación mensual estimada</Label>
                  <span className="font-mono text-sm font-semibold text-primary">
                    {ocupacionPct}%
                  </span>
                </div>
                <Slider
                  value={[ocupacionPct]}
                  onValueChange={([v]) => setOcupacionPct(v)}
                  min={10}
                  max={95}
                  step={1}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="r-gastos">Gastos operativos fijos / mes</Label>
                <Input
                  id="r-gastos"
                  type="number"
                  value={gastosOperativosMes}
                  onChange={(e) => setGastosOperativosMes(Number(e.target.value))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="r-comision">Comisión plataforma %</Label>
                  <Input
                    id="r-comision"
                    type="number"
                    step="0.5"
                    value={comisionPlataformaPct}
                    onChange={(e) => setComisionPlataformaPct(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="r-seguro">Seguro + predial /mes</Label>
                  <Input
                    id="r-seguro"
                    type="number"
                    value={seguroPredialMes}
                    onChange={(e) => setSeguroPredialMes(Number(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-1">
                    NOI anual
                  </p>
                  <p className={`font-mono text-lg font-bold ${r.noiAnual >= 0 ? 'text-emerald-700' : 'text-destructive'}`}>
                    {fmtCOP(r.noiAnual)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-1">
                    Cap Rate
                  </p>
                  <p className="font-mono text-lg font-bold text-foreground">
                    {r.capRatePct.toFixed(1)}%
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-1">
                    Cash-on-Cash
                  </p>
                  <p className={`font-mono text-lg font-bold ${r.cashOnCashPct >= 0 ? 'text-emerald-700' : 'text-destructive'}`}>
                    {r.cashOnCashPct.toFixed(1)}%
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-1">
                    ROI total año 1
                  </p>
                  <p className="font-mono text-lg font-bold text-foreground">
                    {r.roiTotalPct.toFixed(1)}%
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="pt-6 space-y-3">
                <div className="flex justify-between text-sm border-b border-dashed border-border pb-3">
                  <span className="text-muted-foreground">Ingreso bruto por hospedaje (anual)</span>
                  <span className="font-mono">{fmtCOP(r.ingresoBrutoAnual)}</span>
                </div>
                <div className="flex justify-between text-sm border-b border-dashed border-border pb-3">
                  <span className="text-muted-foreground">Comisión de plataforma (anual)</span>
                  <span className="font-mono">- {fmtCOP(r.comisionAnual)}</span>
                </div>
                <div className="flex justify-between text-sm border-b border-dashed border-border pb-3">
                  <span className="text-muted-foreground">Gastos operativos (anual)</span>
                  <span className="font-mono">- {fmtCOP(r.gastosAnual)}</span>
                </div>
                <div className="flex justify-between text-sm border-b border-dashed border-border pb-3">
                  <span className="text-muted-foreground">Servicio de deuda (anual)</span>
                  <span className="font-mono">- {fmtCOP(r.servicioDeudaAnual)}</span>
                </div>
                <div className="flex justify-between text-sm border-b border-dashed border-border pb-3">
                  <span className="text-muted-foreground">Efectivo invertido</span>
                  <span className="font-mono">{fmtCOP(r.inversionEfectiva)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold pt-1">
                  <span>Flujo de caja neto anual</span>
                  <span className="font-mono">{fmtCOP(r.flujoCajaAnual)}</span>
                </div>
              </CardContent>
            </Card>

            <p className="text-xs text-muted-foreground leading-relaxed bg-background rounded-lg p-4 border border-border">
              Estimación con fines de planeación, no constituye asesoría
              financiera. Incluye un costo de cierre estimado del 3% del
              precio de compra. Ajusta tarifa y ocupación con datos reales
              del sector para cada proyecto.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Herramientas;
