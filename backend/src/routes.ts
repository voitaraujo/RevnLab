import { Router, Response, Request } from 'express';

//Inventário
import { hasToken } from './services/jwtAuth'
import UserController from './inventory/controllers/UserController';
import StoragesController from './inventory/controllers/StoragesController';
import MachinesController from './inventory/controllers/MachinesController';
import StoragesMovController from './inventory/controllers/StoragesMovController';
import MachinesMovController from './inventory/controllers/MachinesMovController';
import InvMovController from './inventory/controllers/InvMovController';

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
routes.get('/inventory/storages/:DL/:FILIAL/:Category/:Refdt', hasToken, StoragesMovController.See);
routes.put('/inventory/storages/', hasToken, StoragesMovController.Update);
routes.put('/inventory/storages/product', hasToken, StoragesMovController.UpdateOne);

//Movimentação das máquinas
routes.get('/inventory/machines/:DL/:Chapa/:Category/:Refdt', hasToken, MachinesMovController.See);
routes.put('/inventory/machines/', hasToken, MachinesMovController.Update);
routes.put('/inventory/machines/product', hasToken, MachinesMovController.UpdateOne);

//Referencias/Controle
routes.get('/references/storages/:DL', hasToken, InvMovController.See);


export default routes;