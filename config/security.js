const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { logger, detectPossibleAttack } = require('./logger');
const Sentry = require('@sentry/node');

const securityMiddleware = {
    // Middleware de Sentry
    initSentry: (app) => {
        app.use(Sentry.Handlers.requestHandler());
    },

    // Configuración de Helmet
    helmetConfig: helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", "data:", "https:"],
                connectSrc: ["'self'"],
                fontSrc: ["'self'"],
                objectSrc: ["'none'"],
                mediaSrc: ["'self'"],
                frameSrc: ["'none'"],
            },
        },
        xssFilter: true,
        noSniff: true,
        referrerPolicy: { policy: 'same-origin' }
    }),

    // Rate Limiting
    rateLimiter: rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutos
        max: 100, // límite de 100 solicitudes por ventana
        message: 'Demasiadas solicitudes desde esta IP, por favor intente nuevamente después de 15 minutos',
        handler: (req, res) => {
            logger.warn({
                message: 'Rate limit exceeded',
                ip: req.ip,
                path: req.path
            });
            res.status(429).send('Too Many Requests');
        }
    }),

    // Middleware de detección de ataques
    attackDetection: (req, res, next) => {
        if (detectPossibleAttack(req)) {
            logger.error({
                message: 'Possible attack detected',
                ip: req.ip,
                path: req.path,
                headers: req.headers,
                query: req.query
            });

            // Alertar a Sentry sobre el posible ataque
            Sentry.captureMessage('Possible attack detected', {
                level: 'warning',
                extra: {
                    ip: req.ip,
                    path: req.path,
                    headers: req.headers,
                    query: req.query
                }
            });
        }
        next();
    }
};

module.exports = securityMiddleware;