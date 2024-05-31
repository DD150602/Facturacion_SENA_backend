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

  numeroCuota: z.number({ message: 'El campo numero cuota debe ser un campo valido' })
    .int({ message: 'El numero cuota debe ser un número entero' })
    .positive({ message: 'El campo numero cuota debe ser un número positivo' }),

  valorCuota: z.number({ message: 'El campo valor cuota debe ser un campo valido' })
    .positive({ message: 'El campo valor cuota debe ser un número positivo' })
    .gt(0, { message: 'El campo valor cuota debe ser mayor que 0' }),

  idFactura: z.string({ message: 'El Id de la factura no puede estar vacio' })
    .min(3, { message: 'El identificador de la factura debe tener al menos 3 caracteres' })
    .regex(/^[A-Za-z0-9-]+$/, { message: 'El identificador de la factura solo puede contener caracteres alfanuméricos y guiones' }),

  fechaProximoPago: z.union([z.string().nullable(), z.null()]).refine(value => {
    if (value === null) return true
    if (typeof value === 'string') {
      return /^\d{4}-\d{2}-\d{2}$/.test(value)
    }
    return value instanceof Date
  }, {
    message: 'La fecha de proximo pago debe ser una cadena en formato YYYY-MM-DD'
  })
})

export const validateBillById = (input) => {
  return BillById.safeParse(input)
}

export const validateCreatePayment = (input) => {
  return CreatePayment.safeParse(input)
}
