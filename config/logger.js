const winston = require('winston');
require('winston-daily-rotate-file');
const path = require('path');

const logDir = 'logs';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
    ),
    defaultMeta: { service: 'security-app' },
    transports: [
        // Rotación diaria de logs
        new winston.transports.DailyRotateFile({
            filename: path.join(logDir, 'security-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d'
        }),
        // Log de errores separado
        new winston.transports.DailyRotateFile({
            filename: path.join(logDir, 'error-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            level: 'error'
        })
    ]
});

// Log a consola en desarrollo
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }));
}

// Función para detectar posibles ataques
const detectPossibleAttack = (req, threshold = 10) => {
    const suspicious = [
        req.headers['user-agent']?.includes('sqlmap'),
        req.query?.toString().includes('--'),
        req.query?.toString().includes('union select'),
        req.path?.includes('../'),
        req.headers['content-length'] > 1000000 // Payload grande
    ];

    return suspicious.filter(Boolean).length >= threshold;
};

module.exports = {
    logger,
    detectPossibleAttack
};