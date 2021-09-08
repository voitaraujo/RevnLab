import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Users } from '../entity/Users'
import { genToken } from '../services/jwtAuth'

interface ILoginDTO {
  user: string,
  password: string
}

export default {
  async Login(req: Request, res: Response) {
    const { user, password }: ILoginDTO = req.body
    const users = await getRepository(Users).find({
      where: {
        GestorCod: user.trim(),
        GestorSenha: password.trim()
      }
    })

    const token = users[0] && genToken(users[0].GestorCod, users[0].GestorNome, 'lider')

    typeof token == 'undefined' ?
      res.status(401).json({
        message: 'authentication failed'
      })
      :
      res.status(200).json({
        user_token: token,
        user: users[0].GestorNome
      })

    return res

  }
};