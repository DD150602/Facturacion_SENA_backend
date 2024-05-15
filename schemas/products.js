import z from 'zod'

const productSchema = z.object({
  nombreProducto: z.string({ message: 'El nombre tiene que ser una cadena de texto.' }).min(1, { message: 'El nombre no puede estar vacío.' }),
  descripcionProducto: z.string({ message: 'La descripción tiene que ser una cadena de texto.' }).min(1, { message: 'La descripcion no puede estar vacía.' }),
  valorProducto: z.number({ message: 'El precio tiene que ser un número.' }).min(1, { message: 'El precio no puede estar vacío.' }),
  linkFotoProducto: z.string({ message: 'El link de la imagen tiene que ser una cadena de texto.' })
})

export function validateProduct (product) {
  return productSchema.safeParse(product)
}
