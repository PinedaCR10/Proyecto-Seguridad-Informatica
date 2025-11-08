const Sentry = require("@sentry/node");

Sentry.init({
    dsn: "https://069cc978249991d281a539075a0d7315@o4507909124325376.ingest.us.sentry.io/4510328194859008",
    environment: process.env.NODE_ENV || 'development',
    integrations: [],
    tracesSampleRate: 1.0,
    sendDefaultPii: true,
});