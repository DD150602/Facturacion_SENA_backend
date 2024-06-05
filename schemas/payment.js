import { z } from 'zod'

const BillById = z.object({
  id: z.string({ message: 'No ha proporcionado un ID valido' }).min(1, { message: 'El ID proporcionado no puede estar vacio' })
})

const CreatePayment = z.object({
  entidadBancaria: z.string({ message: 'El campo entidad bancaria debe ser un campo valido' })
    .min(3, { message: 'El campo entidad bancaria debe tener al menos 3 caracteres' }),

  idTipoTransaccion: z.number({ message: 'El campo transaccion debe ser un campo valido' })
    .int({ message: 'El campo transaccion debe ser un número entero' })
    .positive({ message: 'El campo transaccion debe ser un número positivo' }),

  idFactura: z.string({ message: 'El Id de la factura no puede estar vacio' })
    .min(2, { message: 'El identificador de la factura debe tener al menos 2 caracteres' })
    .regex(/^[A-Za-z0-9-]+$/, { message: 'El identificador de la factura solo puede contener caracteres alfanuméricos y guiones' }),

  idUsuario: z.string({ message: 'El dato enviado no es valido.' }).min(1, { message: 'El valor no puede estar vacio.' }).uuid({ message: 'No se ha proporcionado un ID valido.' }),

  valorPago: z.string({ message: 'El valor del pago tiene que ser un numero.' })
    .min(1, { message: 'El valor de pago no puede estar vacío.' })
    .refine(value => /^\d{1,20}(\.\d{1,3})?$/.test(value), { message: 'El valor de pago debe ser un número positivo sin caracteres especiales que no supere 20 digitos.' }),

  sumaPago: z.string({ message: 'El valor del pago actual tiene que ser un numero.' })
    .min(1, { message: 'El valor de pago actual no puede estar vacío.' })
    .refine(value => /^\d{1,20}(\.\d{1,3})?$/.test(value), { message: 'El valor de pago actual debe ser un número positivo sin caracteres especiales que no supere 20 digitos.' }),

  correoCliente: z.string().email({ message: 'El correo no esta correctamente escrito' }).min(1, { message: 'El correo del cliente no puede estar vacío.' }),

  nombreCliente: z.string()
    .min(1, { message: 'El nombre del cliente no puede estar vacío.' })
    .refine(value => /^[a-zA-Z\s]+$/.test(value), { message: 'El nombre del cliente no puede contener caracteres especiales.' })

})

export const validateBillById = (input) => {
  return BillById.safeParse(input)
}

export const validateCreatePayment = (input) => {
  return CreatePayment.safeParse(input)
}
