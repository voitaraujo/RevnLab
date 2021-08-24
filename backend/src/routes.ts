import { Router } from 'express';

import { hasToken } from './services/jwtAuth'
import UserController from './controllers/UserController';
import StoragesController from './controllers/StoragesController';
import MachinesController from './controllers/MachinesController';
import StoragesMovController from './controllers/StoragesMovController';
import MachinesMovController from './controllers/MachinesMovController';

const routes = Router();

routes.post('/authentication', UserController.Login);

//Depósitos
routes.get('/storages', hasToken, StoragesController.Show);
routes.get('/storages/:Filial/:DL', hasToken, StoragesController.See);

//Máquinas
routes.get('/machines/:DL', hasToken, MachinesController.Show);
routes.get('/machines/details/:DL/:CHAPA', hasToken, MachinesController.See);

//Movimentação dos depósitos
routes.get('/inventory/storages/:DL/:FILIAL', hasToken, StoragesMovController.See);

//Movimentação das máquinas
routes.get('/inventory/machines/:DL/:Chapa', hasToken, MachinesMovController.See);


export default routes;