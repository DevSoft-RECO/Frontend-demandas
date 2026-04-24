import type { Demanda } from './demanda';
import type { Bufete } from './bufete';

export interface Seguimiento {
    id?: number;
    id_demanda: number;
    demanda?: Demanda;
    id_abogado: number;
    abogado?: Bufete;
    
    estado_seguimiento: number;
    estado_legal_demanda: string;
    
    porcentaje_demanda: number;
    pago_unico: number;
    monto_desestimacion: number;

    // Etapa 1
    etapa_1_json: any[];
    pago_sugerido_1: number;
    pago_pactado_1: number;
    is_pagado_1: boolean;

    // Etapa 2
    etapa_2_json: any[];
    pago_sugerido_2: number;
    pago_pactado_2: number;
    is_pagado_2: boolean;

    // Etapa 3
    etapa_3_json: any[];
    pago_sugerido_3: number;
    pago_pactado_3: number;
    is_pagado_3: boolean;

    // Etapa 4
    etapa_4_json: any[];
    pago_sugerido_4: number;
    pago_pactado_4: number;
    is_pagado_4: boolean;

    fecha_estado_seguimiento: string;
    fecha_estado_legal: string;
    created_at?: string;
    updated_at?: string;
}

export interface CreateTrackingRequest {
    id_demanda: number;
    id_abogado: number;
    id_preset: number;
    pago_unico: number;
    monto_desestimacion: number;
    pago_pactado_1: number;
    pago_pactado_2: number;
    pago_pactado_3: number;
    pago_pactado_4: number;
}
