import z from 'zod'

const UserSchemaById = z.object({
  id: z.string({ message: 'El dato enviado no es valido.' }).min(1, { message: 'El valor no puede estar vacio.' }).uuid({ message: 'No se ha proporcionado un UUID valido.' })
})

export function validateUserById (input) {
  return UserSchemaById.safeParse(input)
}
