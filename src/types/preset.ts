export interface Preset {
    id?: number;
    nombre: string | null;
    rango_min: number | null;
    rango_max: number | null;
    porcentaje_comision: number | null;
    p_etapa_1: number | null;
    p_etapa_2: number | null;
    p_etapa_3: number | null;
    p_etapa_4: number | null;
    monto_pago_unico: number | null;
    monto_desestimacion: number | null;
    descripcion: string | null;
    activo: boolean;
    created_at?: string;
    updated_at?: string;
}
