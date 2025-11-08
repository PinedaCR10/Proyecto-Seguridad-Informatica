"use strict";

// Cargar variables de entorno
require('dotenv').config();

// Imports
const express = require("express");
const Sentry = require("@sentry/node");
const { auth, requiresAuth } = require('express-openid-connect');
const path = require('path');
const statusMonitor = require('express-status-monitor');
const { logger } = require('./config/logger');
const securityMiddleware = require('./config/security');

let app = express();

// Inicializar Sentry
require("./instrument.js");

// Configurar monitoreo
app.use(statusMonitor({
    title: 'Estado del Sistema',
    path: '/status',
    spans: [{
        interval: 1,     // Cada segundo
        retention: 60    // Mantener 60 datos
    }, {
        interval: 5,     // Cada 5 segundos
        retention: 60
    }, {
        interval: 15,    // Cada 15 segundos
        retention: 60
    }]
}));

// Variables de entorno
const PORT = process.env.PORT || "3000";

// Validar variables de entorno requeridas
const requiredEnvVars = ['SECRET', 'BASE_URL', 'CLIENT_ID', 'ISSUER_BASE_URL'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ Error: Faltan las siguientes variables de entorno requeridas:');
  missingEnvVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.error('\nPor favor, verifica que el archivo .env esté configurado correctamente.');
  process.exit(1);
}

// Configuración de Auth0
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL
};

// Aplicar middlewares de seguridad
app.use(securityMiddleware.helmetConfig);
app.use(securityMiddleware.rateLimiter);
app.use(securityMiddleware.attackDetection);

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// MVC View Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// App middleware
app.use("/static", express.static("static"));

// Middleware de logging
app.use((req, res, next) => {
    logger.info({
        message: 'Incoming request',
        method: req.method,
        path: req.path,
        ip: req.ip
    });
    next();
});

// App routes
app.get("/", (req, res) => {
  res.render("index");  
});

app.get("/dashboard", requiresAuth(), (req, res) => {  
  res.render("dashboard", { user: req.oidc.user });
});

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user, null, 2));
});

// Ruta de prueba para Sentry
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

// El error handler de Sentry debe ir antes que otros error handlers
app.use(Sentry.Handlers.errorHandler());

// Opcional: error handler personalizado
app.use((err, req, res, next) => {
  logger.error({
    message: 'Error en la aplicación',
    error: err,
    sentryId: res.sentry
  });
  
  res.status(500).json({
    error: 'Ha ocurrido un error interno',
    sentryId: res.sentry
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}`);
});
