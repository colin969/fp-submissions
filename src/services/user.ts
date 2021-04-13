import { Router } from 'express';
import { minAuthFactory } from '../auth';
import { FUSIONAUTH_CLIENT_ID } from '../constants';
import { fusionAuth } from '../fusionauth';

export function registerUserServices(router: Router) {
  router.get('/user/:userId', minAuthFactory('admin', (req, res) => {
    fusionAuth.retrieveRegistration(req.params.userId, FUSIONAUTH_CLIENT_ID)
    .then((authRes) => {
      if (authRes.wasSuccessful() && authRes.response.registration) {
        const reg = authRes.response.registration;
        res.json({
          id: reg.id,
          username: reg.username,
          avatar: authRes.response.user?.imageUrl,
          lastLogin: reg.lastLoginInstant,
          roles: reg.roles
        });
      } else {
        throw 'Reg Not Found?';
      }
    })
    .catch((err) => {
      res.json({ message: 'Error finding user registration', error: err });
    });
  }));
}