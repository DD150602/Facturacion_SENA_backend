import z from 'zod';

const noNumbersRegex = /^[^0-9]*$/;

const zoneCreate = z.object({
    nombreZona: z.string({ message: 'El nombre debe ser una cadena de texto' })
        .min(1, { message: 'El campo no puede estar vacio' })
        .refine(val => noNumbersRegex.test(val), { message: 'El nombre no debe contener números' }),
    descripcionZona: z.string({ message: 'Esta descripción debe ser una cadena de texto' })
        .min(1, { message: 'El campo no puede estar vacio' })
        .refine(val => noNumbersRegex.test(val), { message: 'La descripción no debe contener números' })
});

export function validateZona(zone) {
    return zoneCreate.safeParse(zone);
}

const zoneUpdate = z.object({
    nombreZona: z.string({ message: 'El nombre debe ser una cadena de texto' })
        .optional()
        .refine(val => val === undefined || (val.length > 0 && noNumbersRegex.test(val)), { message: 'El nombre no debe estar vacío y no debe contener números' }),
    descripcionZona: z.string({ message: 'Esta descripción debe ser una cadena de texto' })
        .optional()
        .refine(val => val === undefined || (val.length > 0 && noNumbersRegex.test(val)), { message: 'La descripción no debe estar vacía' })
});

export function validateZonaUpdate(zone) {
    return zoneUpdate.safeParse(zone);
}
