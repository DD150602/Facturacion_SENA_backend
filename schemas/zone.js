import z from 'zod'

const zoneCreate = z.object({
  nombreZona: z.string({ message: 'El nombre debe ser una cadena de texto' })
    .min(1, { message: 'El campo no puede estar vacio' }),
  descripcionZona: z.string({ message: 'Esta descripción debe ser una cadena de texto' })
    .min(1, { message: 'El campo no puede estar vacio' })
})

export function validateZona (zone) {
  return zoneCreate.safeParse(zone)
}

const zoneUpdate = z.object({
  nombreZona: z.string({ message: 'El nombre debe ser una cadena de texto' })
    .min(1, { message: 'El campo no puede estar vacio' }),
  descripcionZona: z.string({ message: 'Esta descripción debe ser una cadena de texto' })
    .min(1, { message: 'El campo no puede estar vacio' })
})

export function validateZonaUpdate (zone) {
  return zoneUpdate.safeParse(zone)
}
