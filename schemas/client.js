import z from 'zod'

const ClientById = z.object({
  numeroDocumentoClient: z.string()
    .min(7, { message: 'El número de documento del cliente debe tener entre 7 y 10 caracteres.' })
    .max(10, { message: 'El número de documento del cliente debe tener entre 7 y 10 caracteres.' })
    .refine(value => /^[a-zA-Z0-9]+$/.test(value), { message: 'El número de documento del cliente no puede contener caracteres especiales.' })
})

const clientCreateSchema = z.object({
  primerNombreClient: z.string()
    .min(1, { message: 'El primer nombre del cliente no puede estar vacío.' })
    .refine(value => /^[a-zA-Z]+$/.test(value), { message: 'El primer nombre del cliente no puede contener caracteres especiales.' }),
  segundoNombreClient: z.string({
    message: 'El segundo nombre del cliente tiene que ser texto.'
  })
    .optional()
    .refine(value => value === undefined || value === '' || /^[a-zA-Z]+$/.test(value), {
      message: 'El segundo nombre del cliente no puede contener caracteres especiales.'
    }),
  primerApellidoClient: z.string()
    .min(1, { message: 'El primer apellido del cliente no puede estar vacío.' })
    .refine(value => /^[a-zA-Z]+$/.test(value), { message: 'El primer apellido del cliente no puede contener caracteres especiales.' }),
  segundoApellidoClient: z.string()
    .min(1, { message: 'El segundo apellido del cliente no puede estar vacío.' })
    .refine(value => /^[a-zA-Z]+$/.test(value), { message: 'El segundo apellido del cliente no puede contener caracteres especiales.' }),
  numeroDocumentoClient: z.string()
    .min(7, { message: 'El número de documento del cliente debe tener entre 7 y 10 caracteres.' })
    .max(10, { message: 'El número de documento del cliente debe tener entre 7 y 10 caracteres.' })
    .refine(value => /^[a-zA-Z0-9]+$/.test(value), { message: 'El número de documento del cliente no puede contener caracteres especiales.' }),
  correoClient: z.string().email({ message: 'El correo no esta correctamente escrito' }).min(1, { message: 'El correo del cliente no puede estar vacío.' }),
  idGenero: z.string().min(1, { message: 'El ID del género no puede estar vacío.' }),
  telefonoClient: z.string()
    .min(10, { message: 'El número de telefono del cliente debe tener 10 caracteres.' })
    .max(10, { message: 'El número de telefono del cliente debe tener 10 caracteres.' })
    .refine(value => /^[a-zA-Z0-9]+$/.test(value), { message: 'El número de telefono del cliente no puede contener caracteres especiales.' }),
  direccionClient: z.string()
    .refine((value) => {
      const colombianAddressRegex = /^.*\b(calle|carrera|avenida|diagonal|transversal|manzana|mz|avenida carrera|vía)\b.*/gi
      return colombianAddressRegex.test(value)
    }, 'La direccion debe tener un formato como: calle 123, carrera 123, avenida 123, diagonal 123, etc.'),
  linkFoto: z.string().optional(),
  idZona: z.string({ message: 'El ID de zona enviado no es valido.' }).min(1, { message: 'El valor ID de zona no puede estar vacio.' }).uuid({ message: 'No se ha proporcionado un ID de zona valido.' })
})

export function validateClientById (input) {
  return ClientById.safeParse(input)
}

export function validateClientDataCreate (input) {
  return clientCreateSchema.safeParse(input)
}
