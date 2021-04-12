import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import { minAuthFactory, Role } from './auth';
import { EXPRESS_REDIRECT_OAUTH_URI, FUSIONAUTH_CLIENT, FUSIONAUTH_CLIENT_SECRET, FUSIONAUTH_LOGIN_URL, FUSIONAUTH_LOGOUT_URL } from './constants';
import { faServer } from './fusionauth';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

const port = process.env.PORT || 8080;

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Success' });
});

router.get('/login', (req, res) => {
  res.redirect(FUSIONAUTH_LOGIN_URL);
});

router.get('/logout', (req, res) => {
  res.cookie('accessToken', '');
  res.redirect(FUSIONAUTH_LOGOUT_URL);
});

router.get('/oauth2callback', (req, res) => {
  const code = req.query.code;
  if (typeof code === 'string' && code != '') {
    faServer.exchangeOAuthCodeForAccessToken(code, FUSIONAUTH_CLIENT, FUSIONAUTH_CLIENT_SECRET, EXPRESS_REDIRECT_OAUTH_URI)
    .then((authRes) => {
      if (authRes.wasSuccessful()) {
        res.cookie('accessToken', authRes.response.access_token);
        res.redirect('test');
      }
    })
    .catch((err) => {
      console.log(`Error Exchanging Code: ${JSON.stringify(err)}`);
      res.redirect(FUSIONAUTH_LOGIN_URL);
    });
    return;
  }
});

router.get('/test', minAuthFactory(Role.MEMBER, (req, res) => {
  res.json({ message: 'TEST' });
}));

app.use('/api', router);

app.listen(port);
console.log(`Express started on port ${port}`);