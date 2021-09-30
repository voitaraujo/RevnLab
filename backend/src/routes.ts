import { Router, Response, Request } from 'express';

import { hasToken } from './services/jwtAuth'
import UserController from './controllers/UserController';
import StoragesController from './controllers/StoragesController';
import MachinesController from './controllers/MachinesController';
import StoragesMovController from './controllers/StoragesMovController';
import MachinesMovController from './controllers/MachinesMovController';
import InvMovController from './controllers/InvMovController';

const routes = Router();

routes.get('/', (req: Request, res: Response) => res.status(200).send({ message: 'API rodando' }));

routes.post('/authentication', UserController.Login);

//Depósitos
routes.get('/storages', hasToken, StoragesController.Show);
routes.get('/storages/:Filial/:DL', hasToken, StoragesController.See);

//Máquinas
routes.get('/machines/:DL', hasToken, MachinesController.Show);
routes.get('/machines/details/:DL/:CHAPA', hasToken, MachinesController.See);

//Movimentação dos depósitos
routes.get('/inventory/storages/:DL/:FILIAL/:PD/:UD', hasToken, StoragesMovController.See);
routes.put('/inventory/storages/', hasToken, StoragesMovController.Update);

//Movimentação das máquinas
routes.get('/inventory/machines/:DL/:Chapa/:PD/:UD', hasToken, MachinesMovController.See);
routes.put('/inventory/machines/', hasToken, MachinesMovController.Update);

//Referencias/Controle
routes.get('/references/storages/:DL', hasToken, InvMovController.Show);


export default routes;