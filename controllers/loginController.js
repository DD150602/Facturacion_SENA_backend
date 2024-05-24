import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import UserModel from '../models/loginModel.js';
import { loginSchema } from '../schemas/login.js';

class AuthController {
    static async Authlogin(req, res) {
        try {
            const validacion = loginSchema.safeParse(req.body);

            if (!validacion.success) {
                return res.status(400).json({ message: JSON.parse(validacion.error.message)[0].message })
            }

            const { correo_usuario, password_usuario } = validacion.data;
            const user = await UserModel.getUserByUsername(correo_usuario);

            if (!user || user.length === 0) {
                return res.status(404).json({ error: 'No existe el usuario' });
            }

            const passwordMatch = await bcrypt.compare(password_usuario, user[0].password_usuario);
            if (!passwordMatch) {
                return res.status(401).json({ error: 'Credenciales incorrectas' });
            }

            const token = jwt.sign({ userId: user.id }, 'token_secret', { expiresIn: '1h' });

            res.json({ token, user: user[0] });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error en el servidor' });
        }
    }
}

export default AuthController;
