export interface Bank {
  nombre: string;
  cuotaInicialMinPct: number;
  dtiMaxPct: number;
  tasaEA: number;
  plazoMaxAnios: number;
  edadMax: number;
}

export const BANKS: Bank[] = [
  { nombre: "Bancolombia", cuotaInicialMinPct: 30, dtiMaxPct: 40, tasaEA: 12.5, plazoMaxAnios: 20, edadMax: 70 },
  { nombre: "Davivienda", cuotaInicialMinPct: 30, dtiMaxPct: 40, tasaEA: 12.8, plazoMaxAnios: 20, edadMax: 75 },
  { nombre: "BBVA Colombia", cuotaInicialMinPct: 30, dtiMaxPct: 35, tasaEA: 12.2, plazoMaxAnios: 20, edadMax: 70 },
  { nombre: "Banco de Bogotá", cuotaInicialMinPct: 20, dtiMaxPct: 40, tasaEA: 13.0, plazoMaxAnios: 20, edadMax: 70 },
  { nombre: "Banco Caja Social", cuotaInicialMinPct: 20, dtiMaxPct: 40, tasaEA: 12.9, plazoMaxAnios: 30, edadMax: 74 },
  { nombre: "Scotiabank Colpatria", cuotaInicialMinPct: 30, dtiMaxPct: 35, tasaEA: 13.2, plazoMaxAnios: 20, edadMax: 70 },
];

export function cuotaFrancesa(monto: number, tasaEA: number, anios: number): number {
  if (monto <= 0 || anios <= 0) return 0;
  const rMensual = Math.pow(1 + tasaEA / 100, 1 / 12) - 1;
  const n = anios * 12;
  if (rMensual === 0) return monto / n;
  return (monto * rMensual * Math.pow(1 + rMensual, n)) / (Math.pow(1 + rMensual, n) - 1);
}

export interface CreditoInput {
  valorInmueble: number;
  cuotaInicialPct: number;
  ingresosMensuales: number;
  deudasMensuales: number;
  edad: number;
  plazoAnios: number;
}

export interface CreditoResultadoBanco {
  banco: Bank;
  cuotaMensual: number;
  dtiResultante: number;
  cumple: boolean;
}

export function evaluarCredito(input: CreditoInput): {
  montoAFinanciar: number;
  cuotaInicialCop: number;
  resultados: CreditoResultadoBanco[];
} {
  const cuotaInicialCop = input.valorInmueble * (input.cuotaInicialPct / 100);
  const montoAFinanciar = input.valorInmueble - cuotaInicialCop;

  const resultados = BANKS.map((banco) => {
    const cuotaMensual = cuotaFrancesa(montoAFinanciar, banco.tasaEA, input.plazoAnios);
    const dtiResultante =
      input.ingresosMensuales > 0
        ? ((cuotaMensual + input.deudasMensuales) / input.ingresosMensuales) * 100
        : 0;
    const cumple =
      input.cuotaInicialPct >= banco.cuotaInicialMinPct &&
      dtiResultante <= banco.dtiMaxPct &&
      (input.edad === 0 || input.edad <= banco.edadMax) &&
      input.plazoAnios <= banco.plazoMaxAnios;

    return { banco, cuotaMensual, dtiResultante, cumple };
  });

  return { montoAFinanciar, cuotaInicialCop, resultados };
}
