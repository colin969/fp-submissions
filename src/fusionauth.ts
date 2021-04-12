import { FusionAuthClient } from '@fusionauth/typescript-client';
import { FUSIONAUTH_API_KEY, FUSIONAUTH_HOST } from './constants';

export const faServer = new FusionAuthClient(FUSIONAUTH_API_KEY, FUSIONAUTH_HOST);