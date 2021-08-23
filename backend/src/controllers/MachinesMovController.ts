import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { MovMachines } from '../entity/MovMachines'
import { decryptToken } from '../services/jwtAuth'

export default {
    
}