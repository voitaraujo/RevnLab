import jwt from 'jsonwebtoken'
import chalk from 'chalk';
import { Request, Response } from 'express'
export interface IToken {
    user_code: string,
    user_name: string,
    supervisor_code: string,
    role: string,
}

export const genToken = (user: string, name: string, supervisor: string, role: "lider" | "adm") => {
    try {
        return jwt.sign({
            user_code: String(user).trim(),
            user_name: String(name).trim(),
            supervisor_code: String(supervisor).trim(),
            role: role.trim()
        }, process.env.SALT_KEY!)
    } catch (err) {
        console.log(chalk.red(err))
    }

}

export const decryptToken = (token: string) => {
    try {
        return jwt.verify(token, process.env.SALT_KEY!)
    } catch (err) {
        console.log(chalk.red(err))
    }
}

export const hasToken = (req: Request, res: Response, next: Function) => {
    const token = req.get('Authorization')

    //testo se foi passado um token na requisição
    if (typeof token == 'undefined') {

        //retorno se não houver um token
        res.status(400).send({
            message: 'token not provided'
        })
        return res
    } else {
        try {

            //verifico se o token é válido(formação, data de expiração/criação, assinatura inválida/faltando, etc)
            jwt.verify(token, process.env.SALT_KEY!)
            // jwt.decode(token)


            //se chegar aqui o token *provavelmente* é válido, ai passamos pro próximo handler
            next()
        } catch (err: any) {

            //retorno se o token for inválido por algum motivo
            res.status(400).send({
                message: err.message
            })
            return res
        }
    }

}