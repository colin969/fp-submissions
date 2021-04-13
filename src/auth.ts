import { Request, Response } from 'express';
import { fusionAuth } from './fusionauth';

export type Role = 'admin' | 'staff' | 'trial curator' | 'member';
const superRoles: Role[] = ['admin'];

export function convertRoleToNum(role: Role): number {
  switch(role) {
    case 'admin':
      return 100;
    case 'staff':
      return 50;
    case 'trial curator':
      return 10;
    case 'member':
      return 1;
    default:
      return 0;
  }
}

type RequestHandlerCallback = (req: Request, res: Response) => void | Promise<void>;

export function minAuthFactory(minRole: Role, callback: RequestHandlerCallback): RequestHandlerCallback {
  const minScore = convertRoleToNum(minRole);
  return (req: Request, res: Response) => {
    const accessToken = req.cookies['accessToken'];
    getLoggedInUser(accessToken, (status) => res.sendStatus(status))
    .then((user) => {
      const maxScore = user['roles'] ? (user['roles'] as string[]).reduce<number>((prev, next) => superRoles.includes(next as Role) ? 100000 : Math.max(prev, convertRoleToNum(next as Role)), 0) : 0;
      if (maxScore >= minScore) {
        callback(req, res);
      } else {
        res.sendStatus(403);
      }
    });
  }
};

export function specificAuthFactory(roles: Role[], callback: RequestHandlerCallback): RequestHandlerCallback {
  return (req: Request, res: Response) => {
    const accessToken = req.cookies['accessToken'];
    getLoggedInUser(accessToken, (status) => res.sendStatus(status))
    .then((user) => {
      const authorized = user['roles'] ? (user['roles'] as string[]).reduce<boolean>((prev, next) => prev || roles.includes(next as Role) || superRoles.includes(next as Role), false) : false;
      if (authorized) {
        callback(req, res);
      } else {
        res.sendStatus(403);
      }
    });
  }
}

async function getLoggedInUser(accessToken: string, onBadStatus: (status: number) => void): Promise<any> {
  return fusionAuth.validateJWT(accessToken)
  .then((authRes) => {
    // User validated
    const decodedJwt = authRes.response.jwt;
    if (!decodedJwt) {
      throw 'JWT not included in response.';
    }
    return decodedJwt;
  })
  .catch((err) => {
    // Token invalid, must log in again
    console.log(err);
    onBadStatus(403);
  });
}
