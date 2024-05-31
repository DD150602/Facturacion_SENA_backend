import z from 'zod'

const UserSchemaById = z.object({
  id: z.string({ message: 'El dato enviado no es valido.' })
    .min(1, { message: 'El valor no puede estar vacio.' })
    .uuid({ message: 'No se ha proporcionado un ID valido.' })
})

// Esquema de validación para la creación de una factura
const createInvoiceSchema = z.object({
  valorBrutoFactura: z.number({ message: 'El valor bruto de la factura no es valido.' })
    .positive({ message: 'El valor bruto de la factura debe ser positivo.' }),
  valorNetoFactura: z.number({ message: 'El valor neto de la factura no es valido.' })
    .positive({ message: 'El valor neto de la factura debe ser positivo.' }),
  cantidadCuotasFactura: z.number({ message: 'La cantidad de cuotas no es valida.' })
    .int({ message: 'La cantidad de cuotas debe ser un número entero.' })
    .positive({ message: 'La cantidad de cuotas debe ser positiva.' }),
  fechaProximoPago: z.string({ message: 'La fecha del próximo pago no es valida.' }),
  idUsuario: z.string({ message: 'El ID del usuario no es valido.' })
    .uuid({ message: 'No se ha proporcionado un ID de usuario valido.' }),
  idCliente: z.string({ message: 'El ID del cliente no es valido.' })
    .uuid({ message: 'No se ha proporcionado un ID de cliente valido.' }),
  idTipoCuota: z.number({ message: 'El ID del tipo de cuota no es valido.' })
    .int({ message: 'El ID del tipo de cuota debe ser un número entero.' })
    .positive({ message: 'El ID del tipo de cuota debe ser positivo.' }),
  productosFacturas: z.array(z.object({
    idProducto: z.number({ message: 'No se ha proporcionado un ID de producto valido.' })
      .positive({ message: 'El ID del producto enviado no es valido.' }),
    valorProducto: z.number({ message: 'No se ha proporcionado un valor de producto valido.' })
      .positive({ message: 'El valor del producto enviado no es valido.' }),
    cantidad: z.number({ message: 'No se ha proporcionado una cantidad de producto valida.' })
      .positive({ message: 'La cantidad del producto enviado no es valida.' })
  }))
})

// Esquema de validación para la actualización de una factura
const updateInvoiceSchema = z.object({
  valorBrutoFactura: z.number({ message: 'El valor bruto de la factura no es valido.' })
    .positive({ message: 'El valor bruto de la factura debe ser positivo.' }),
  valorNetoFactura: z.number({ message: 'El valor neto de la factura no es valido.' })
    .positive({ message: 'El valor neto de la factura debe ser positivo.' }),
  cantidadCuotasFactura: z.number({ message: 'La cantidad de cuotas no es valida.' })
    .int({ message: 'La cantidad de cuotas debe ser un número entero.' })
    .positive({ message: 'La cantidad de cuotas debe ser positiva.' }),
  cuotaActualFactura: z.number({ message: 'La cuota actual no es valida.' })
    .int({ message: 'La cuota actual debe ser un número entero.' })
    .positive({ message: 'La cuota actual debe ser positiva.' }),
  fechaProximoPago: z.date({ message: 'La fecha del próximo pago no es valida.' }),
  idUsuario: z.string({ message: 'El ID del usuario no es valido.' })
    .uuid({ message: 'No se ha proporcionado un ID de usuario valido.' }),
  estado: z.number({ message: 'El estado no es valido.' })
    .int({ message: 'El estado debe ser un número entero.' }), // Suponiendo que el estado es un número entero
  idCliente: z.string({ message: 'El ID del cliente no es valido.' })
    .uuid({ message: 'No se ha proporcionado un ID de cliente valido.' }),
  idTipoCuota: z.number({ message: 'El ID del tipo de cuota no es valido.' })
    .int({ message: 'El ID del tipo de cuota debe ser un número entero.' })
    .positive({ message: 'El ID del tipo de cuota debe ser positivo.' })
})

// Esquema de validación para el envío de una factura
export const sendInvoiceSchema = z.object({
  nombreUsuario: z.string({ message: 'El nombre del usuario no puede estar vacío.' })
    .nonempty({ message: 'El nombre del usuario es obligatorio.' }),
  apellidoUsuario: z.string({ message: 'El apellido del usuario no puede estar vacío.' })
    .nonempty({ message: 'El apellido del usuario es obligatorio.' }),
  correoUsuario: z.string({ message: 'El correo electrónico no es valido.' })
    .email({ message: 'El correo electrónico debe ser un email valido.' }),
  link: z.string({ message: 'El link no es valido.' })
    .url({ message: 'El link debe ser una URL valida.' })
})

// Esquema de validación para la eliminación de una factura
const deleteInvoiceSchema = z.object({
  id: z.string({ message: 'El ID de la factura no es valido.' })
    .uuid({ message: 'No se ha proporcionado un ID de factura valido.' }),
  anotacion: z.string({ message: 'La anotación no puede estar vacía.' })
})

// Funciones de validación
export function validacionSend (input) {
  return sendInvoiceSchema.safeParse(input)
}

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
