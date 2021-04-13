export const FUSIONAUTH_APIKEY = process.env.FUSIONAUTH_APIKEY || '';
export const FUSIONAUTH_HOST = process.env.FUSIONAUTH_HOST || '';
export const FUSIONAUTH_CLIENT_ID = process.env.FUSIONAUTH_CLIENT_ID || '';
export const FUSIONAUTH_CLIENT_SECRET = process.env.FUSIONAUTH_CLIENT_SECRET || '';

export const EXPRESS_REDIRECT_OAUTH_URI = 'http://localhost:8080/api/oauth2callback';
export const FUSIONAUTH_LOGOUT_URL = `${FUSIONAUTH_HOST}/oauth2/logout?client_id=${FUSIONAUTH_CLIENT_ID}`;
export const FUSIONAUTH_LOGIN_URL = `${FUSIONAUTH_HOST}/oauth2/authorize?client_id=${FUSIONAUTH_CLIENT_ID}&response_type=code&redirect_uri=${EXPRESS_REDIRECT_OAUTH_URI}`;

export const MONGODB_HOSTNAME = process.env.MONGODB_HOSTNAME || 'localhost';
export const MONGODB_USER = process.env.MONGODB_USER || '';
export const MONGODB_PASS = process.env.MONGODB_PASS || '';
