import { z } from 'zod'

const clientUpdateSchema = z.object({
    correo_cliente: z.string()
        .email({ message: 'El correo electrónico proporcionado no es válido.' })
        .optional(),
    link_foto_cliente: z.string().nullable().optional(),
    numero_documento_cliente: z.string()
        .min(1, { message: 'El número de documento del cliente es requerido.' })
        .max(15, { message: 'El número de documento del cliente no puede tener más de 15 caracteres.' })
        .optional(),
    primer_nombre_cliente: z.string()
        .refine(value => /^[a-zA-Z]+$/.test(value), { message: 'El primer nombre del cliente no puede contener caracteres especiales.' })
        .optional(),
    segundo_nombre_cliente: z.string({ message: 'El segundo nombre del cliente tiene que ser texto.' })
        .refine(value => /^[a-zA-Z]+$/.test(value), { message: 'El segundo nombre del cliente no puede contener caracteres especiales.' })
        .optional(),
    primer_apellido_cliente: z.string()
        .refine(value => /^[a-zA-Z]+$/.test(value), { message: 'El primer apellido del cliente no puede contener caracteres especiales.' })
        .optional(),
    segundo_apellido_cliente: z.string().nullable().optional(),
    telefono_cliente: z.string()
        .min(1, { message: 'El número de teléfono del cliente es requerido.' })
        .max(11, { message: 'El número de teléfono del cliente no puede tener más de 11 caracteres.' })
        .optional(),
    direccion_cliente: z.string()
        .min(1, { message: 'La dirección del cliente es requerida.' })
        .optional()
});



export function validateClientDataUpdate(input) {
    return clientUpdateSchema.safeParse(input)
}