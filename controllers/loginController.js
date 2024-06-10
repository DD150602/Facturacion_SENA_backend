import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import UserModel from '../models/loginModel.js'
import { loginSchema } from '../schemas/login.js'

class AuthController {
  static async Authlogin (req, res) {
    try {
      const validacion = loginSchema.safeParse(req.body)

      if (!validacion.success) {
        return res.status(400).json({ objectError: validacion.error.errors })
      }

      // eslint-disable-next-line camelcase
      const { correo_usuario, password_usuario } = validacion.data
      const user = await UserModel.getUserByUsername(correo_usuario)

      if (!user || user.length === 0) {
        return res.status(404).json({ error: 'No existe el usuario' })
      }

      const passwordMatch = await bcrypt.compare(password_usuario, user[0].password_usuario)
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Credenciales incorrectas' })
      }

      if (user[0].estado_usuario === 0) return res.status(401).json({ error: 'Su cuenta esta actualmente desactivada' })

      if (user[0].id_zona === null && user[0].id_tipo_usuario === 2) return res.status(401).json({ error: 'No cuenta con una zona de trabajo asignada por favor contactese con un administrador' })

      const token = jwt.sign({ userId: user.id }, 'token_secret', { expiresIn: '1h' })

      res.json({ token, user: user[0] })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error en el servidor' })
    }
  }
}

export default AuthController
