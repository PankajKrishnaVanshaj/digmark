import { config as conf } from "dotenv";
conf();

const _config = {
  port: process.env.PORT,
  databaseUrl: process.env.MONGODB_URI,
  env: process.env.NODE_ENV,
  jwtSecret: process.env.JWT_SECRET,
  clientDomain: process.env.CLIENT_DOMAIN,
  creatorDomain: process.env.CREATOR_DOMAIN,

  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,

  smptService: process.env.SMPT_SERVICE,
  smptHost: process.env.SMPT_HOST,
  smptPort: process.env.SMPT_PORT,
  smptPassword: process.env.SMPT_PASSWORD,
  smptMail: process.env.SMPT_MAIL,
};

export const config = Object.freeze(_config);
