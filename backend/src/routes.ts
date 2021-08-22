import { Router } from 'express';

import { hasToken } from './services/jwtAuth'
import UserController from './controllers/UserController';
import StoragesController from './controllers/StoragesController';
import MachinesController from './controllers/MachinesController';

const routes = Router();

routes.post('/authentication', UserController.Login);

//Depósitos
routes.get('/storages', hasToken, StoragesController.Show);
routes.get('/storages/:DL', hasToken, StoragesController.See);

//Máquinas
routes.get('/machines/:DL', hasToken, MachinesController.Show);
routes.get('/machines/:DL/:CHAPA', hasToken, MachinesController.See);

export default routes;