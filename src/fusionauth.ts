import { FusionAuthClient } from '@fusionauth/typescript-client';
import { FUSIONAUTH_APIKEY, FUSIONAUTH_HOST } from './constants';

export const fusionAuth = new FusionAuthClient(FUSIONAUTH_APIKEY, FUSIONAUTH_HOST);