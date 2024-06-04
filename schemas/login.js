import { z } from 'zod';

export const loginSchema = z.object({
    correo_usuario: z.string().email({ message: 'Debe ser un email valido' }).nonempty({ message: 'El correo electronico es obligatorio' }),
    password_usuario: z.string().min(6, { message: 'La contraseña debe tener al menos 8 caracteres' }).nonempty({ message: 'La contraseña es obligatoria' }),
});
