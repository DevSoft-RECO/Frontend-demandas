import type { Agencia } from './agencia';

export interface Demanda {
    id?: number;
    id_agencia: number | null;
    agencia?: Agencia;
    no_credito: string | null;
    cif: string | null;
    codigo_cliente: string | null;
    no_credito_t24: string | null;
    deudor: string | null;
    fiadores: string | null;
    salario_embargado_a: string | null;
    no_juicio: string | null;
    fecha_ingreso_demanda: string | null;
    abogado_nombre_excel: string | null;
    monto_demanda: number | null;
    situacion: string | null;
    forma_resolucion: string | null;
    costas_judiciales: number | null;
    costas_recuperadas: string | null;
    observacion_1: string | null;
    estado_legal: string | null;
    seguimiento_legacy: string | null;
    observacion_2: string | null;
    created_at?: string;
    updated_at?: string;
}
