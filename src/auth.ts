import { NextFunction, Request, Response } from 'express';
import { FUSIONAUTH_LOGIN_URL } from './constants';
import { faServer } from './fusionauth';

const excludedEndpoints = ['/api/login', '/api/logout', '/api/oauth2callback'];

export enum Role {
  MEMBER,
  STAFF,
  ADMIN
}

type RequestHandlerCallback = (req: Request, res: Response) => void | Promise<void>;

export function minAuthFactory(minRole: Role, callback: RequestHandlerCallback): RequestHandlerCallback {
  // Validate user
  return (req: Request, res: Response) => {
    const accessToken = req.cookies['accessToken'];
    getLoggedInUser(accessToken, (status) => res.sendStatus(status))
    .then((user) => {
      console.log(user);
      callback(req, res)
    });
  }
};

async function getLoggedInUser(accessToken: string, onBadStatus: (status: number) => void): Promise<any> {
  return faServer.validateJWT(accessToken)
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
