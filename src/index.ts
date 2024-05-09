import express, { Express } from 'express';

import { CS571WhatIsMyBidRoute } from './routes/what-is-my-bid';
import { CS571RequestCookieForBidRoute } from './routes/request-cookie-for-bid';
import { CS571VerifyBidRoute } from './routes/verify-bid';
import cookies from "cookie-parser";
import { CS571DbConnector } from './services/db-connector';
import BadgerAuthPublicConfig from './model/configs/badgerauth-public-config';
import { CS571Initializer } from '@cs571/s24-api-framework';
import BadgerAuthSecretConfig from './model/configs/badgerauth-secret-config';
import { CS571Emailer } from './services/emailer';
import { CS571Verifier } from './services/verifier';
import { CS571RequestVerifyEmailRoute } from './routes/request-verify-email';
import { CS571AddBidToEmailRoute } from './routes/add-bid-to-email';
import { CS571ApproveVerifyEmailRoute } from './routes/approve-verify-email';
import { CS571RevokeBidFromEmailRoute } from './routes/revoke-bid-from-email';
import { CS571GetAllBidsRoute } from './routes/get-all-bids';
import { CS571GetMyBidsRoute } from './routes/get-my-bids';
import { CS571RemoveBidCookieRoute } from './routes/remove-cs571-bid-cookie';
import { CS571RemoveBadgerAuthCookieRoute } from './routes/remove-cs571-badgerauth-cookie';
import { CS571GenerateBidsRoute } from './routes/generate-bids';
import { CS571OriginTracker } from './services/origin-tracker';
import { CS571DumpOriginsRoute } from './routes/dump-origins';
import { CS571AllowEmailCreateRoute } from './routes/email-allow-create';
import { CS571AllowEmailDeleteRoute } from './routes/email-allow-delete';
import { CS571AllowEmailIsRoute } from './routes/email-allow-is';
import { CS571DenyEmailCreateRoute } from './routes/email-deny-create';
import { CS571DenyEmailDeleteRoute } from './routes/email-deny-delete';

import cors from 'cors'



console.log("Welcome to the CS571 BadgerAuth Center!");

const app: Express = express();

app.use(cookies());
app.use(cors({
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  origin: (origin, cb) => {
    if(!origin || origin === 'null' || origin === 'undefined' || /^(https?):\/\/(localhost|127\.0\.0\.1|(www\.)?cs571\.org|(www\.)?cs571forall\.org|(www\.)?pages\.cs\.wisc\.edu)(\/|:\d+\/?|$)/.test(origin)) {
      cb(null, true)
    } else {
      cb(new Error('Not allowed by CORS'));
    }
  },
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-CS571-ID',
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 200
}))

const appBundle = CS571Initializer.init<
  BadgerAuthPublicConfig,
  BadgerAuthSecretConfig
>(app, {
  allowNoAuth: [
    '/add-bid-to-email',
    '/approve-verify-email',
    '/dump-origins',
    '/generate-bids',
    '/get-all-bids',
    '/get-my-bids',
    '/remove-cs571-badgerauth-cookie',
    '/remove-cs571-bid-cookie',
    '/request-cookie-for-bid',
    '/request-verify-email',
    '/revoke-bid-from-email',
    '/verify-bid',
    '/what-is-my-bid',
    '/email-allow',
    '/email-deny'
  ],
  skipAuth: true
});

const db = new CS571DbConnector(appBundle.config);
const emailer = new CS571Emailer(appBundle.config)
const verifier = new CS571Verifier(appBundle.config.SECRET_CONFIG.EMAIL_VERIF_SECRET);
const originator = new CS571OriginTracker();

db.init();

appBundle.router.addRoutes([
  new CS571AddBidToEmailRoute(verifier, db),
  new CS571ApproveVerifyEmailRoute(appBundle.config, verifier),
  new CS571DumpOriginsRoute(appBundle.config, originator),
  new CS571GenerateBidsRoute(appBundle.config, db, emailer),
  new CS571GetAllBidsRoute(appBundle.config, db),
  new CS571GetMyBidsRoute(appBundle.config, db),
  new CS571RemoveBadgerAuthCookieRoute(appBundle.config),
  new CS571RemoveBidCookieRoute(appBundle.config),
  new CS571RequestCookieForBidRoute(appBundle.config, db),
  new CS571RequestVerifyEmailRoute(appBundle.config, emailer, verifier, db),
  new CS571RevokeBidFromEmailRoute(verifier, db),
  new CS571VerifyBidRoute(db),
  new CS571WhatIsMyBidRoute(appBundle.config, originator),
  new CS571AllowEmailCreateRoute(db, appBundle.config),
  new CS571AllowEmailDeleteRoute(db, appBundle.config),
  new CS571AllowEmailIsRoute(db, appBundle.config),
  new CS571DenyEmailCreateRoute(db, appBundle.config),
  new CS571DenyEmailDeleteRoute(db, appBundle.config)
])

app.listen(appBundle.config.PORT, () => {
  console.log(`Running at :${appBundle.config.PORT}`);
});
