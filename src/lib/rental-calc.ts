import { cuotaFrancesa } from "./bank-data";

export interface RentabilidadInput {
  precioCompra: number;
  adecuacion: number;
  porcentajeFinanciado: number;
  tasaEA: number;
  plazoFinAnios: number;
  tarifaNoche: number;
  ocupacionPct: number;
  gastosOperativosMes: number;
  comisionPlataformaPct: number;
  seguroPredialMes: number;
}

export interface RentabilidadResultado {
  ingresoBrutoAnual: number;
  comisionAnual: number;
  gastosAnual: number;
  noiAnual: number;
  capRatePct: number;
  inversionEfectiva: number;
  servicioDeudaAnual: number;
  flujoCajaAnual: number;
  cashOnCashPct: number;
  roiTotalPct: number;
}

export function evaluarRentabilidad(input: RentabilidadInput): RentabilidadResultado {
  const nochesOcupadasMes = 30 * (input.ocupacionPct / 100);
  const ingresoBrutoAnual = input.tarifaNoche * nochesOcupadasMes * 12;
  const comisionAnual = ingresoBrutoAnual * (input.comisionPlataformaPct / 100);
  const gastosAnual = (input.gastosOperativosMes + input.seguroPredialMes) * 12;
  const noiAnual = ingresoBrutoAnual - comisionAnual - gastosAnual;
  const capRatePct = input.precioCompra > 0 ? (noiAnual / input.precioCompra) * 100 : 0;

  const montoFinanciado = input.precioCompra * (input.porcentajeFinanciado / 100);
  const cuotaInicial = input.precioCompra - montoFinanciado;
  const costosCierre = input.precioCompra * 0.03;
  const inversionEfectiva = cuotaInicial + costosCierre + input.adecuacion;

  const cuotaMensual = cuotaFrancesa(montoFinanciado, input.tasaEA, input.plazoFinAnios);
  const servicioDeudaAnual = cuotaMensual * 12;
  const interesAnualAprox = montoFinanciado * (input.tasaEA / 100);
  const abonoCapitalAnual = Math.max(servicioDeudaAnual - interesAnualAprox, 0);

  const flujoCajaAnual = noiAnual - servicioDeudaAnual;
  const cashOnCashPct = inversionEfectiva > 0 ? (flujoCajaAnual / inversionEfectiva) * 100 : 0;
  const roiTotalPct =
    inversionEfectiva > 0 ? ((flujoCajaAnual + abonoCapitalAnual) / inversionEfectiva) * 100 : 0;

  return {
    ingresoBrutoAnual,
    comisionAnual,
    gastosAnual,
    noiAnual,
    capRatePct,
    inversionEfectiva,
    servicioDeudaAnual,
    flujoCajaAnual,
    cashOnCashPct,
    roiTotalPct,
  };
}

export function fmtCOP(n: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Math.round(n || 0));
}
