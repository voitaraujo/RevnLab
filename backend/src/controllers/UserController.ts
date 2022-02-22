import { Request, Response } from 'express';
import { getRepository, getManager } from 'typeorm';

import { Users } from '../entity/Users'
import { genToken } from '../services/jwtAuth'

interface ILoginDTO {
  user: string,
  password: string
}

interface IUserJoin {
  UsuarioCod: string,
  UsuarioNome: string,
  SupervisorCod: string,
  SupervisorNome: string,
}

export default {
  async Login(req: Request, res: Response) {
    const { user, password }: ILoginDTO = req.body
    const entityManager = getManager();

    const users = await <Promise<IUserJoin[]>>entityManager.query(`select A.GestorCod as UsuarioCod, A.GestorNome as UsuarioNome,  B.GestorCod as SupervisorCod, B.GestorSup as SupervisorNome from dbo.InvGestor as A left join dbo.InvGestor as B on A.GestorSup = B.GestorNome where A.GestorCod = ${user} and A.GestorSenha = ${password}`);

    const token = users[0] && genToken(users[0].UsuarioCod, users[0].UsuarioNome, users[0].SupervisorCod, 'lider')

    typeof token == 'undefined' ?
      res.status(401).json({
        message: 'authentication failed'
      })
      :
      res.status(200).json({
        user_token: token,
        user: users[0].UsuarioNome
      })

    return res

  }
};