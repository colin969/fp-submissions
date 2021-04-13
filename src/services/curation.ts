import { Router } from 'express';
import { minAuthFactory } from '../auth';

export function registerCurationServices(router: Router) {
  router.get('/curations', minAuthFactory('member', (req, res) => {
    
  }));
}