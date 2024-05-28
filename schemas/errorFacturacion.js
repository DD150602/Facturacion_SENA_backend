import z from 'zod'

const UserSchemaById = z.object({
  id: z.string({ message: 'El dato enviado no es valido.' }).min(1, { message: 'El valor no puede estar vacio.' }).uuid({ message: 'No se ha proporcionado un ID valido.' })
})

// Esquema de validación para la creación de una factura
const createInvoiceSchema = z.object({
  valorBrutoFactura: z.number().positive(),
  valorNetoFactura: z.number().positive(),
  cantidadCuotasFactura: z.number().int().positive(),
  cuotaActualFactura: z.number().int().positive(),
  fechaProximoPago: z.string(),
  idUsuario: z.string().uuid(),
  idCliente: z.string().uuid(),
  idTipoCuota: z.number().int().positive(),
  productosFacturas: z.array(z.object({
    idProduct: z.number({ message: 'No se ha proporcionado un ID de proyecto valido.' }).positive({ message: 'El ID del producto enviado no es valido.' }),
    valorProducto: z.number({ message: 'No se ha proporcionado un valor de producto valido.' }).positive({ message: 'El valor del producto enviado no es valido.' }),
    cantidad: z.number({ message: 'No se ha proporcionado una cantidad de producto valida.' }).positive({ message: 'La cantidad del producto enviado no es valida.' })
  }))
})

// Esquema de validación para la actualización de una factura
const updateInvoiceSchema = z.object({
  valorBrutoFactura: z.number().positive(),
  valorNetoFactura: z.number().positive(),
  cantidadCuotasFactura: z.number().int().positive(),
  cuotaActualFactura: z.number().int().positive(),
  fechaProximoPago: z.date(),
  idUsuario: z.string().uuid(),
  estado: z.number().int(), // Suponiendo que el estado es un número entero
  idCliente: z.string().uuid(),
  idTipoCuota: z.number().int().positive()
})

// Esquema de validación para la eliminación de una factura
const deleteInvoiceSchema = z.object({
  id: z.string().uuid(),
  anotacion: z.string()
})
export function validateInvoiceById (input) {
  return UserSchemaById.safeParse(input)
}
// Funciones de verificación de facturas utilizando los esquemas de validación definidos
export function validateInvoiceDataCreate (input) {
  return createInvoiceSchema.safeParse(input)
}

export function validateInvoiceDataUpdate (input) {
  return updateInvoiceSchema.safeParse(input)
}

export function validateInvoiceDelete (input) {
  return deleteInvoiceSchema.safeParse(input)
}
