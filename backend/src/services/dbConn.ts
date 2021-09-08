import chalk from "chalk";
import "reflect-metadata";

import { createConnection } from "typeorm";
import { Users } from "../entity/Users";
import { Storages } from "../entity/Storages";
import { MovStorages } from "../entity/MovStorages";
import { Machines } from "../entity/Machines";
import { MovMachines } from "../entity/MovMachines";
import { RefDates } from "../entity/RefDates";

export const Conn = async () => await createConnection({
    type: "mssql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DEFAULT,
    entityPrefix: 'dbo.',
    entities: [
        Users,
        Storages,
        Machines,
        MovStorages,
        MovMachines,
        RefDates
    ],
    extra: {
        trustedConnection: true
    },
    synchronize: false,
    logging: false,
}).then(connection => {

    console.log(chalk.green('Conectado ao banco!'))
    return connection
}).catch(error => {

    console.log(chalk.yellow('Falha na conexão com banco!'))
    console.log(chalk.red(error))
}
);
