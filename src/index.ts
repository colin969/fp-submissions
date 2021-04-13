require('dotenv').config()
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import { specificAuthFactory } from './auth';
import { EXPRESS_REDIRECT_OAUTH_URI, FUSIONAUTH_CLIENT_ID, FUSIONAUTH_CLIENT_SECRET, FUSIONAUTH_LOGIN_URL, FUSIONAUTH_LOGOUT_URL } from './constants';
import { fusionAuth } from './fusionauth';
import { openMongooseConn } from './mongoose';
import { CurationModel } from './schemas/Curation';
import { registerUserServices } from './services/user';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

const port = process.env.PORT || 8080;

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Success' });
});

// Login funcs

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
    fusionAuth.exchangeOAuthCodeForAccessToken(code, FUSIONAUTH_CLIENT_ID, FUSIONAUTH_CLIENT_SECRET, EXPRESS_REDIRECT_OAUTH_URI)
    .then((authRes) => {
      if (authRes.wasSuccessful()) {
        res.cookie('accessToken', authRes.response.access_token);
        res.redirect('/');
      }
    })
    .catch((err) => {
      console.log(`Error Exchanging Code: ${JSON.stringify(err)}`);
      res.redirect(FUSIONAUTH_LOGIN_URL);
    });
    return;
  }
});

router.get('/test', specificAuthFactory(['member'], async (req, res) => {
  const testCuration = await CurationModel.create({
    game: {
      title: 'D TITLE'
    },
    addApps: []
  });
  testCuration.save()
  .then((doc) => {
    res.send(doc.toJSON());
  })
  .catch((err: any) => {
    console.error(`Cannot save: ${err}`);
    res.json({ error: err });
  });
}));

registerUserServices(router);

app.use('/api', router);

openMongooseConn()
.then(() => {
  app.listen(port);
  console.log(`Express started on port ${port}`);
})
.catch((err) => {
  console.error(`Error connecting to MongoDB, exiting... ${err}`);
})
